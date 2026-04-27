import { Agent, InputGuardrail, OutputGuardrail, run } from '@openai/agents';

// Lazy agent creation — ensures setDefaultOpenAIClient has been called first
let _relevanceCheckAgent: Agent | null = null;
function getRelevanceAgent(): Agent {
  if (!_relevanceCheckAgent) {
    _relevanceCheckAgent = new Agent({
      name: 'Relevance Check Agent',
      model: process.env.OPENAI_MODEL || 'llama-3.1-8b-instant',
      instructions:
        'You check if a user question is related to a document. ' +
        'The input starts with "[Document excerpt: ...]" followed by "User question: ...". ' +
        'Read the excerpt to understand the document topic, then judge if the question relates to it. ' +
        'Be VERY lenient. Mark as relevant if the question is about ANY person, project, skill, company, date, or topic mentioned or likely mentioned in the document. ' +
        'Only mark as NOT relevant for completely off-topic questions like weather, cooking, sports scores, jokes, or personal life advice. ' +
        'You MUST respond with ONLY this exact JSON format, nothing else: {"isRelevant": true, "reason": "short reason"}',
    });
  }
  return _relevanceCheckAgent;
}

let _groundingCheckAgent: Agent | null = null;
function getGroundingAgent(): Agent {
  if (!_groundingCheckAgent) {
    _groundingCheckAgent = new Agent({
      name: 'Grounding Check Agent',
      model: process.env.OPENAI_MODEL || 'llama-3.3-70b-versatile',
      instructions:
        'You check if an AI answer contains fabricated information not supported by document context. ' +
        'If the answer says "I don\'t know" or "not in the document", that is fine. ' +
        'Respond with ONLY a JSON object like: {"isHallucination": false, "reason": "..."} ' +
        'Set isHallucination to true only if the answer makes specific factual claims that seem invented.',
    });
  }
  return _groundingCheckAgent;
}

function parseRelevance(output: unknown): { isRelevant: boolean; reason: string } {
  try {
    const text = typeof output === 'string' ? output : JSON.stringify(output);
    const match = text.match(/\{[\s\S]*?\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      // Only block if explicitly false — any ambiguity defaults to relevant
      if (parsed.isRelevant === false) {
        return { isRelevant: false, reason: parsed.reason || 'Unrelated to document' };
      }
    }
  } catch {
    // fall through — default to relevant on any error
  }
  return { isRelevant: true, reason: 'Allowed' };
}

function parseGrounding(output: unknown): { isHallucination: boolean; reason: string } {
  try {
    const text = typeof output === 'string' ? output : JSON.stringify(output);
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      return { isHallucination: parsed.isHallucination === true, reason: parsed.reason || '' };
    }
  } catch {
    // fall through
  }
  return { isHallucination: false, reason: 'Could not parse guardrail response' };
}

// ── Input Guardrail: blocks off-topic or unsafe queries ───────────────────────
export const documentRelevanceGuardrail: InputGuardrail = {
  name: 'Document Relevance Guardrail',
  execute: async ({ input, context }) => {
    const inputStr = typeof input === 'string' ? input : JSON.stringify(input);
    const result = await run(getRelevanceAgent(), inputStr, { context });
    const parsed = parseRelevance(result.finalOutput);
    return {
      outputInfo: parsed,
      tripwireTriggered: parsed.isRelevant === false,
    };
  },
};

// ── Output Guardrail: checks if answer is grounded ────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hallucinationGuardrail: OutputGuardrail<any> = {
  name: 'Hallucination Guardrail',
  execute: async ({ agentOutput, context }) => {
    const text = typeof agentOutput === 'string' ? agentOutput : JSON.stringify(agentOutput);
    const result = await run(getGroundingAgent(), text, { context });
    const parsed = parseGrounding(result.finalOutput);
    return {
      outputInfo: parsed,
      tripwireTriggered: parsed.isHallucination === true,
    };
  },
};
