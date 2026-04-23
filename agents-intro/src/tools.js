import 'dotenv/config';
import { tool } from '@openai/agents';
import { z } from 'zod';

export const calculatorTool = tool({
  name: 'calculator',
  description: 'Performs basic math: add, subtract, multiply, divide',
  parameters: z.object({
    expression: z.string().describe('Math expression like "12 * 4 + 2"'),
  }),
  execute: async ({ expression }) => {
    try {
      const result = Function('"use strict"; return (' + expression + ')')();
      return `Result: ${result}`;
    } catch {
      return 'Error: Invalid math expression';
    }
  },
});

export const wordCounterTool = tool({
  name: 'word_counter',
  description: 'Counts words and characters in a text',
  parameters: z.object({
    text: z.string().describe('The text to analyze'),
  }),
  execute: async ({ text }) => {
    const words = text.trim().split(/\s+/).length;
    const chars = text.length;
    return `Words: ${words}, Characters: ${chars}`;
  },
});