import 'dotenv/config';
import * as readline from 'readline';
import { run } from '@openai/agents';
import { setDefaultOpenAIClient } from '@openai/agents-openai';
import OpenAI from 'openai';
import { routerAgent } from './agents.js';
import { checkGuardrail } from './guardrail.js';

const groqClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

setDefaultOpenAIClient(groqClient);

let tracingEnabled = false;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log(' Multi-Agent CLI Assistant');
console.log('================================');
console.log('Router → Math | Programming | General Q&A');
console.log('Commands: "trace on", "trace off", "exit"\n');
console.log(`Tracing: OFF (by default)\n`);

function askQuestion() {
  rl.question('You: ', async (input) => {
    const trimmed = input.trim();

    if (!trimmed) return askQuestion();

    if (trimmed.toLowerCase() === 'exit') {
      console.log('Goodbye! ');
      rl.close();
      return;
    }

    if (trimmed.toLowerCase() === 'trace on') {
      tracingEnabled = true;
      process.env.OPENAI_AGENTS_DISABLE_TRACING = '0';
      console.log(' Tracing ENABLED — agent steps visible honge\n');
      return askQuestion();
    }

    if (trimmed.toLowerCase() === 'trace off') {
      tracingEnabled = false;
      process.env.OPENAI_AGENTS_DISABLE_TRACING = '1';
      console.log(' Tracing DISABLED\n');
      return askQuestion();
    }

    const guard = checkGuardrail(trimmed);
    if (guard.blocked) {
      console.log(` ${guard.reason}\n`);
      return askQuestion();
    }

    try {
      console.log(` Processing... [Tracing: ${tracingEnabled ? 'ON ' : 'OFF '}]\n`);

      const result = await run(routerAgent, trimmed);

      const lastAgent = result.lastAgent?.name ?? 'Unknown';
      console.log(` [Handled by: ${lastAgent}]`);
      console.log(`Assistant: ${result.finalOutput}\n`);

    } catch (err) {
      console.error(' Error:', err.message, '\n');
    }

    askQuestion();
  });
}

askQuestion();