import "dotenv/config";
import OpenAI from "openai";
import readline from "readline";
import { setDefaultModelProvider, OpenAIProvider, run, setTracingDisabled } from "@openai/agents";
import { researchAgent } from "./agents/researchAgent.js";
import { writerAgent } from "./agents/writerAgent.js";
import { resetSearchCount } from "./tools/tavilySearch.js";

setTracingDisabled(true);

const groqClient = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

setDefaultModelProvider(
  new OpenAIProvider({
    openAIClient: groqClient,
    useResponses: false,
  })
);

const GROQ_MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
researchAgent.model = GROQ_MODEL;
writerAgent.model = GROQ_MODEL;

function askQuestion(prompt) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  let query = process.argv[2];

  if (!query) {
    query = await askQuestion("Enter your research query: ");
  }

  if (!query) {
    console.error("❌ No query provided.");
    process.exit(1);
  }

  console.log("\n🔍 Query:", query);
  console.log("─".repeat(60));
  console.log("🤖 Starting multi-agent research pipeline...\n");

  resetSearchCount();

  // Step 1: Research Agent gathers facts
  console.log("🔎 Step 1/2: Research Agent gathering data...\n");
  const researchResult = await run(researchAgent, query, { maxTurns: 15 });
  const researchData = researchResult.finalOutput;

  // Step 2: Writer Agent produces the final report
  console.log("✍️  Step 2/2: Writer Agent producing report...\n");
  const writerInput = `Here is the research data for the query "${query}":\n\n${researchData}\n\nProduce a structured Markdown report based only on this data.`;
  const writerResult = await run(writerAgent, writerInput, { maxTurns: 5 });

  console.log("\n📄 FINAL REPORT");
  console.log("═".repeat(60));
  console.log(writerResult.finalOutput);
}

main().catch((err) => {
  console.error("❌ Error:", err.message ?? err);
  process.exit(1);
});
