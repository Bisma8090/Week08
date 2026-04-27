# PDF Intelligence Platform

A real multi-agent AI system built with the **OpenAI Agents SDK (JS/TS)** that analyzes PDF documents, reasons about user intent, and delegates work between specialized agents.

---

## Agent Architecture

```
User Input
    ↓
Router Agent          ← entry point, never answers, only routes
    ↓ handoff
┌───────────────────────────────────────┐
│  Document Analysis Agent              │  ← on upload
│  Summary Agent                        │  ← on summary request
│  QA Agent                             │  ← on questions
└───────────────────────────────────────┘
    ↓ tool calls
[extract_document_text | retrieve_relevant_chunks | locate_sections | count_words]
    ↓
Final Answer
```

### Agent Responsibilities

| Agent | Role |
|---|---|
| **Router Agent** | Understands intent, routes to the correct specialist. Never answers, never calls tools. |
| **Document Analysis Agent** | Identifies document type, extracts sections, themes, and entities using tools. |
| **Summary Agent** | Generates executive summaries and bullet highlights adapted to document type. |
| **QA Agent** | Answers questions strictly from document content. Returns "not in document" when info is missing. |

---

## Tools Used

| Tool | Purpose |
|---|---|
| `extract_document_text` | Returns full PDF text (capped at 12k chars to avoid token overflow) |
| `retrieve_relevant_chunks` | Keyword-scored chunk retrieval — finds the 3 most relevant 500-word chunks for a query |
| `locate_sections` | Heuristic heading detection from document lines |
| `count_words` | Returns word count and estimated token count |

Tools are explicitly called by agents — no fake outputs, no hardcoded results.

---

## Guardrails

Guardrails exist **outside prompts** as SDK-level enforcement:

| Guardrail | Type | What it does |
|---|---|---|
| `documentRelevanceGuardrail` | Input | Runs a lightweight agent to check if the query is document-related. Blocks off-topic requests (weather, jokes, etc.) before the main model runs. `runInParallel: false` to save tokens. |
| `hallucinationGuardrail` | Output | Runs a grounding-check agent on QA responses. Trips if the answer contains fabricated specific claims. |

When a guardrail trips, the system returns a clear blocked message instead of a hallucinated answer.

---

## How to Run Locally

### Prerequisites
- Node.js 20+
- MongoDB running locally (`mongodb://localhost:27017`)
- A Grok/OpenAI API key

### Backend (NestJS)

```bash
cd backend
# Set your API key in .env
echo "OPENAI_API_KEY=your_key_here" >> .env
npm run start:dev
# Runs on http://localhost:4000
```

### Frontend (Next.js)

```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

---

## Agent Design Notes

### Why agents were separated

- **Router Agent** is isolated so routing logic never bleeds into answering logic. If merged, the model would sometimes skip routing and answer directly.
- **Analysis vs Summary** are separate because analysis is structural (what IS the document) while summary is communicative (what SHOULD the user know). Merging them produces worse outputs for both tasks.
- **QA Agent** is isolated because it needs strict grounding constraints and an output guardrail. Other agents don't need this — applying it globally would block legitimate summary generation.

### What breaks if merged into one agent

- A single agent would route AND answer, violating the hard rule that the router never answers.
- Guardrails would need to apply to all tasks, causing false positives (e.g., blocking summaries that mention external concepts).
- Tool selection becomes ambiguous — the model would call all tools on every request instead of the right ones.
- Tracing becomes useless — you can't tell which "mode" the agent was in.

### Production improvements

- Replace keyword-scored chunk retrieval with real vector embeddings (pgvector / Pinecone).
- Add a **Citation Agent** that maps answers back to page numbers.
- Persist agent run traces to MongoDB for audit and fine-tuning.
- Add streaming responses via SSE for long summaries.
- Rate-limit per document to prevent abuse.
- Use `runInParallel: true` on the hallucination guardrail once latency is acceptable.

---

## Tech Stack

- **Frontend**: Next.js 14 (App Router), MUI v5, RTK Query
- **Backend**: NestJS, MongoDB + Mongoose
- **AI Layer**: `@openai/agents` SDK (JS/TS), Grok/OpenAI models
