import { tool } from "@openai/agents";
import { tavily } from "@tavily/core";

const client = tavily({ apiKey: process.env.TAVILY_API_KEY });

let searchCount = 0;
export const resetSearchCount = () => { searchCount = 0; };

export const tavilySearchTool = tool({
  name: "tavily_search",
  description: "Search the web for factual, up-to-date information. Call once with a single plain text query string.",
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "A single search query string.",
      },
    },
    required: ["query"],
    additionalProperties: false,
  },
  execute: async ({ query }) => {
    if (searchCount >= 5) {
      return JSON.stringify({ error: "Max search limit (5) reached for this run." });
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

    return JSON.stringify({
      answer: response.answer ?? "",
      findings,
      searchesUsed: searchCount,
    });
  },
});
