import { tool } from "@openai/agents";
import { tavily } from "@tavily/core";
import { z } from "zod";

const client = tavily({ apiKey: process.env.TAVILY_API_KEY });

let searchCount = 0;
export const resetSearchCount = () => { searchCount = 0; };

export const tavilySearchTool = tool({
  name: "tavily_search",
  description: "Search the web for factual, up-to-date information on a topic. Returns key findings and source URLs. IMPORTANT: Call this tool ONE time with ONE query string. Do NOT pass arrays or multiple queries in a single call.",
  parameters: z.object({
    query: z.string().describe("A single search query string to look up. Must be a plain string, not an array."),
  }),
  execute: async ({ query }) => {
    if (searchCount >= 5) {
      return { error: "Max search limit (5) reached for this run." };
    }
    searchCount++;

    const response = await client.search(query, {
      maxResults: 5,
      includeAnswer: true,
    });

    const findings = response.results.map((r) => ({
      title: r.title,
      summary: r.content?.slice(0, 300),
      url: r.url,
    }));

    return {
      answer: response.answer ?? "",
      findings,
      searchesUsed: searchCount,
    };
  },
});
