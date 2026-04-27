import { tool } from '@openai/agents';
import { z } from 'zod';

// In-memory store for the current document context (set per request)
let _documentText = '';
let _documentChunks: string[] = [];

export function setDocumentContext(text: string) {
  _documentText = text;
  // Split into ~200-word chunks for retrieval (keeps token usage low)
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += 200) {
    chunks.push(words.slice(i, i + 200).join(' '));
  }
  _documentChunks = chunks;
}

/**
 * Tool 1: Extract full text from the loaded document
 */
export const extractTextTool = tool({
  name: 'extract_document_text',
  description: 'Returns the full extracted text of the uploaded PDF document.',
  parameters: z.object({}),
  execute: async () => {
    if (!_documentText) return 'No document loaded.';
    return _documentText.slice(0, 4000); // cap to ~1k tokens
  },
});

/**
 * Tool 2: Semantic chunk retrieval — finds the most relevant chunks for a query
 */
export const chunkRetrieverTool = tool({
  name: 'retrieve_relevant_chunks',
  description:
    'Searches the document for chunks most relevant to the given query. Use this to find specific information before answering.',
  parameters: z.object({
    query: z.string().describe('The question or topic to search for in the document'),
  }),
  execute: async ({ query }) => {
    if (_documentChunks.length === 0) return 'No document loaded.';
    const q = query.toLowerCase();
    const words = q.split(/\s+/).filter((w) => w.length > 2); // skip tiny words like "me", "is", "a"
    const scored = _documentChunks.map((chunk, i) => {
      const lower = chunk.toLowerCase();
      const score = words.reduce((acc, w) => acc + (lower.includes(w) ? 1 : 0), 0);
      return { chunk, score, index: i };
    });
    scored.sort((a, b) => b.score - a.score);

    // If top score is 0, return first 3 chunks as general context
    if (scored[0].score === 0) {
      const fallback = _documentChunks.slice(0, 3);
      return fallback.join('\n\n---\n\n');
    }

    const top = scored.slice(0, 3).map((s) => s.chunk);
    return top.join('\n\n---\n\n');
  },
});

/**
 * Tool 3: Section locator — finds sections/headings in the document
 */
export const sectionLocatorTool = tool({
  name: 'locate_sections',
  description: 'Identifies and returns the main sections or headings found in the document.',
  parameters: z.object({}),
  execute: async () => {
    if (!_documentText) return 'No document loaded.';
    const lines = _documentText.split('\n');
    // Heuristic: short lines that are likely headings (all caps, or title case, < 80 chars)
    const headings = lines.filter((line) => {
      const trimmed = line.trim();
      return (
        trimmed.length > 3 &&
        trimmed.length < 80 &&
        (trimmed === trimmed.toUpperCase() || /^[A-Z][a-z]/.test(trimmed)) &&
        !/[.!?]$/.test(trimmed)
      );
    });
    return headings.slice(0, 30).join('\n') || 'No clear sections detected.';
  },
});

/**
 * Tool 4: Word/token counter
 */
export const wordCounterTool = tool({
  name: 'count_words',
  description: 'Returns the word count and estimated token count of the document.',
  parameters: z.object({}),
  execute: async () => {
    if (!_documentText) return 'No document loaded.';
    const words = _documentText.split(/\s+/).filter(Boolean).length;
    const estimatedTokens = Math.round(words * 1.3);
    return `Word count: ${words}, Estimated tokens: ${estimatedTokens}`;
  },
});
