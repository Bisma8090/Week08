import 'dotenv/config';
import { Agent, handoff, setDefaultOpenAIClient, setTracingDisabled } from '@openai/agents';
import { RECOMMENDED_PROMPT_PREFIX } from '@openai/agents-core/extensions';
import OpenAI from 'openai';

// Disable tracing — required when using non-OpenAI providers
setTracingDisabled(true);

// Point the SDK at Groq's OpenAI-compatible endpoint
setDefaultOpenAIClient(
  new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL || 'https://api.x.ai/v1',
  }),
);

const MODEL = process.env.OPENAI_MODEL || 'grok-3-mini';
import {
  chunkRetrieverTool,
} from './tools';
import { documentRelevanceGuardrail } from './guardrails';

// ── 2. Document Analysis Agent ────────────────────────────────────────────────
export function createDocumentAnalysisAgent(documentText: string) {
  return new Agent({
    name: 'Document Analysis Agent',
    model: MODEL,
    instructions: `You are a document analysis expert. The document text is provided below.

DOCUMENT TEXT:
${documentText.slice(0, 6000)}

Your task:
1. Identify the document type: Research Paper, Business Report, Legal/Policy, Manual/Guide, or Other.
2. Extract main sections (list of section names found in the document).
3. Extract key themes (3-5 short phrases).
4. Extract important entities (people, organizations, dates, numbers).
5. Respond with ONLY a valid JSON object, no extra text, no markdown, no code blocks:
{"documentType":"...","sections":["..."],"themes":["..."],"entities":["..."]}

Only use information from the document. Do not invent content.`,
    tools: [],
  });
}

// ── 3. Summary Agent ──────────────────────────────────────────────────────────
export function createSummaryAgent(documentText: string) {
  return new Agent({
    name: 'Summary Agent',
    model: MODEL,
    instructions: `You are a professional document summarizer. The document text is provided below.

DOCUMENT TEXT:
${documentText.slice(0, 6000)}

Your task:
1. Generate an executive summary (2-3 paragraphs).
2. Generate 5-7 bullet point highlights as short strings.
3. Respond with ONLY a valid JSON object, no extra text, no markdown, no code blocks:
{"summary":"...","highlights":["...","..."],"documentType":"..."}

Only use document content. Never fabricate.`,
    tools: [],
  });
}

// ── 4. Q&A Agent ──────────────────────────────────────────────────────────────
export const qaAgent = new Agent({
  name: 'QA Agent',
  model: MODEL,
  handoffDescription:
    'Use this agent when the user asks a specific question about the document content.',
  instructions: `${RECOMMENDED_PROMPT_PREFIX}
You are a document Q&A assistant. When called:
1. ALWAYS call retrieve_relevant_chunks with the user's question first.
2. Answer based on the retrieved chunks. The document is a CV/resume — it contains personal and professional information about a person.
3. If the chunks contain relevant information, use it to answer confidently.
4. Only say "This information is not present in the document." if the chunks are truly empty or completely unrelated to the question.
5. Never use external knowledge. Never guess facts not in the chunks.`,
  tools: [chunkRetrieverTool],
});

const ROUTER_INSTRUCTIONS = `You are a routing agent. Your ONLY job is to decide which specialist agent should handle the request.
Rules:
- NEVER answer the user directly.
- NEVER call any tools yourself.
- Always hand off to exactly one specialist agent.
- The input may start with a "[Document excerpt: ...]" prefix providing context — use it only to understand relevance, then hand off the original user question.

Routing logic:
- If the user uploaded a PDF and wants it analyzed/processed → hand off to Document Analysis Agent
- If the user wants a summary, overview, TL;DR, or highlights → hand off to Summary Agent  
- If the user asks a specific question about document content → hand off to QA Agent
- Default for ambiguous requests → hand off to QA Agent`;

// ── 1. Router Agent (with guardrail — for user Q&A) ───────────────────────────
export const routerAgent = Agent.create({
  name: 'Router Agent',
  model: MODEL,
  instructions: ROUTER_INSTRUCTIONS,
  handoffs: [
    handoff(qaAgent),
  ],
  inputGuardrails: [documentRelevanceGuardrail],
});

// ── Router Agent (no guardrail — for server-initiated calls) ──────────────────
export const routerAgentNoGuardrail = Agent.create({
  name: 'Router Agent',
  model: MODEL,
  instructions: ROUTER_INSTRUCTIONS,
  handoffs: [
    handoff(qaAgent),
  ],
});
