import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { run, InputGuardrailTripwireTriggered } from '@openai/agents';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PDFParse } = require('pdf-parse');
async function pdfParse(buffer: Buffer): Promise<{ text: string }> {
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  await parser.load();
  const result = await parser.getText();
  const text = typeof result === 'string' ? result : (result?.text ?? '');
  return { text };
}
import { PdfDocument, DocumentDocument } from './schemas/document.schema';
import { setDocumentContext } from '../agents/tools';
import { createDocumentAnalysisAgent, createSummaryAgent, routerAgent } from '../agents/agents';

function handleLlmError(err: any): never {
  // The @openai/agents SDK may wrap the underlying API error
  const underlying = err?.cause ?? err;
  const status = underlying?.status ?? err?.status;
  const code = underlying?.code ?? err?.code ?? underlying?.error?.code;

  if (status === 429 || code === 'rate_limit_exceeded') {
    const retryAfter = underlying?.headers?.get?.('retry-after');
    const msg = retryAfter
      ? `AI rate limit reached. Please try again in ${retryAfter} seconds.`
      : 'AI rate limit reached. Please try again later.';
    throw new HttpException({ message: msg, code: 'rate_limit_exceeded' }, HttpStatus.TOO_MANY_REQUESTS);
  }
  throw new HttpException(
    { message: 'AI service error. Please try again.', detail: underlying?.message ?? err?.message },
    HttpStatus.BAD_GATEWAY,
  );
}

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(PdfDocument.name) private docModel: Model<DocumentDocument>,
  ) {}

  async uploadAndAnalyze(file: Express.Multer.File): Promise<DocumentDocument> {
    // 1. Extract text from PDF
    const pdfData = await pdfParse(file.buffer);
    const fullText = pdfData.text;

    if (!fullText || fullText.trim().length < 50) {
      throw new BadRequestException('Could not extract meaningful text from PDF.');
    }

    // 2. Save initial record
    const doc = await this.docModel.create({
      filename: file.originalname,
      originalName: file.originalname,
      fullText,
      status: 'pending',
    });

    // 3. Set document context for tools
    setDocumentContext(fullText);

    // 4. Run Document Analysis Agent directly (no router, no tools — inject text in prompt)
    try {
      const analysisAgent = createDocumentAnalysisAgent(fullText);
      const result = await run(
        analysisAgent,
        `Analyze this document and return JSON.`,
        { maxTurns: 5 },
      );

      const output = result.finalOutput;
      let parsed: any = {};

      if (typeof output === 'string') {
        try {
          // Extract JSON from the response
          const jsonMatch = output.match(/\{[\s\S]*\}/);
          if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
        } catch {
          parsed = {};
        }
      } else if (output && typeof output === 'object') {
        parsed = output;
      }

      await this.docModel.findByIdAndUpdate(doc._id, {
        documentType: parsed.documentType || 'Unknown',
        sections: parsed.sections || [],
        themes: parsed.themes || [],
        entities: parsed.entities || [],
        status: 'analyzed',
      });
    } catch (err) {
      if (err instanceof InputGuardrailTripwireTriggered) {
        await this.docModel.findByIdAndUpdate(doc._id, { status: 'blocked' });
        throw new BadRequestException('Document analysis blocked by safety guardrail.');
      }
      console.error('Analysis error:', err);
      await this.docModel.findByIdAndUpdate(doc._id, { status: 'analyzed' });
    }

    return this.docModel.findById(doc._id).lean() as Promise<DocumentDocument>;
  }

  async summarize(docId: string): Promise<{ summary: string; highlights: string[] }> {
    const doc = await this.docModel.findById(docId);
    if (!doc) throw new BadRequestException('Document not found.');

    setDocumentContext(doc.fullText);

    try {
      const summaryAgent = createSummaryAgent(doc.fullText);
      const result = await run(
        summaryAgent,
        `Generate a summary and highlights for this document.`,
        { maxTurns: 5 },
      );

      const output = result.finalOutput;
      let parsed: any = {};

      if (typeof output === 'string') {
        try {
          const jsonMatch = output.match(/\{[\s\S]*\}/);
          if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
          else parsed = { summary: output, highlights: [] };
        } catch {
          parsed = { summary: output, highlights: [] };
        }
      } else if (output && typeof output === 'object') {
        parsed = output;
      }

      const summary = parsed.summary || String(output);
      const highlights: string[] = parsed.highlights || [];

      await this.docModel.findByIdAndUpdate(docId, { summary, highlights });
      return { summary, highlights };
    } catch (err) {
      if (err instanceof InputGuardrailTripwireTriggered) {
        throw new BadRequestException('Request blocked by safety guardrail.');
      }
      console.error('Summarize error:', JSON.stringify(err, null, 2));
      handleLlmError(err);
    }
  }

  async askQuestion(
    docId: string,
    question: string,
  ): Promise<{ answer: string; agentUsed: string }> {
    const doc = await this.docModel.findById(docId);
    if (!doc) throw new BadRequestException('Document not found.');

    setDocumentContext(doc.fullText);

    // Provide document context to the guardrail so it can judge relevance correctly
    const docSnippet = doc.fullText.slice(0, 1500);
    const questionWithContext = `[Document excerpt: ${docSnippet}]\n\nUser question: ${question}`;

    try {
      const result = await run(routerAgent, questionWithContext, { maxTurns: 10 });

      // Determine which agent handled it
      const lastAgent = result.lastAgent?.name || 'QA Agent';

      return {
        answer: String(result.finalOutput),
        agentUsed: lastAgent,
      };
    } catch (err) {
      if (err instanceof InputGuardrailTripwireTriggered) {
        return {
          answer: 'Your question was blocked because it appears unrelated to the document.',
          agentUsed: 'Router Agent (blocked)',
        };
      }
      handleLlmError(err);
    }
  }

  async getDocument(docId: string): Promise<DocumentDocument> {
    const doc = await this.docModel.findById(docId).lean() as DocumentDocument | null;
    if (!doc) throw new BadRequestException('Document not found.');
    return doc;
  }

  async listDocuments(): Promise<DocumentDocument[]> {
    return this.docModel.find({}, { fullText: 0 }).sort({ createdAt: -1 }).lean();
  }
}
