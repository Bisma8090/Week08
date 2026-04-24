import "dotenv/config";
import OpenAI from "openai";
import readline from "readline";
import { setDefaultModelProvider, OpenAIProvider, run, setTracingDisabled } from "@openai/agents";
import { managerAgent } from "./agents/managerAgent.js";
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

managerAgent.model = GROQ_MODEL;
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

  console.log("🤖 Manager Agent delegating tasks...\n");
  const result = await run(managerAgent, query, { maxTurns: 30 });

  console.log("\n📄 FINAL REPORT");
  console.log("═".repeat(60));
  console.log(result.finalOutput);
}

main().catch((err) => {
  console.error("❌ Error:", err.message ?? err);
  process.exit(1);
});
