import 'dotenv/config';
import { Agent, run } from '@openai/agents';
import { setDefaultOpenAIClient } from '@openai/agents-openai';
import OpenAI from 'openai';


// Groq client banao
const groqClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

// Global default set karo
setDefaultOpenAIClient(groqClient);

const agent = new Agent({
  name: 'Assistant',
  instructions: 'You are a helpful assistant',
  model: 'llama-3.3-70b-versatile',
});

const result = await run(agent, 'Say hello and introduce yourself briefly.');
console.log('Final Output:', result.finalOutput);