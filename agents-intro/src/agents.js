import { Agent } from '@openai/agents';
import { calculatorTool, wordCounterTool } from './tools.js';

const MODEL = 'llama-3.3-70b-versatile';

export const mathAgent = new Agent({
  name: 'MathAgent',
  instructions: `You are a math expert. Always use the calculator tool to solve math problems. Never calculate manually.`,
  tools: [calculatorTool],
  model: MODEL,
});

export const programmingAgent = new Agent({
  name: 'ProgrammingAgent',
  instructions: `You are a programming expert in JavaScript and Python. Help with code and debugging. Use word_counter tool when analyzing text.`,
  tools: [wordCounterTool],
  model: MODEL,
});

export const qaAgent = new Agent({
  name: 'GeneralQAAgent',
  instructions: `You are a knowledgeable general assistant. Answer factual questions clearly and concisely.`,
  model: MODEL,
});

export const routerAgent = new Agent({
  name: 'RouterAgent',
  instructions: `You are a routing agent. NEVER answer directly. Always hand off to the correct agent.

Rules:
- Math or calculation → hand off to MathAgent
- Programming or coding → hand off to ProgrammingAgent
- Everything else → hand off to GeneralQAAgent
- Inappropriate or offensive queries → reply ONLY: "BLOCKED: This query is not allowed."`,
  handoffs: [mathAgent, programmingAgent, qaAgent],
  model: MODEL,
});