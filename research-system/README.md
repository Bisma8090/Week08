# Multi-Agent Research Assistant

A multi-agent AI system built with the OpenAI Agents SDK that researches real-world topics and produces structured reports.

## Architecture

```
User Query
    ↓
Manager Agent (Orchestrator)
    ↓
Research Agent (uses Tavily Search)
    ↓
Writer Agent (produces final report)
    ↓
Structured Markdown Report
```

### Agents

| Agent | Role | Tools |
|-------|------|-------|
| ManagerAgent | Orchestrates the pipeline, delegates tasks | None (handoffs only) |
| ResearchAgent | Gathers factual data via web search | Tavily Search (max 5 calls) |
| WriterAgent | Normalizes research and writes the report | None |

## Setup

1. Clone the repo and install dependencies:
```bash
npm install
```

2. and fill in your keys in .env:
```bash
cp  .env
```

3. Add your API keys to `.env`:
```
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
TAVILY_API_KEY=your_tavily_api_key
```

Get your keys:
- Groq: https://console.groq.com
- Tavily: https://app.tavily.com

## Run

```bash
npm start
```

Pass a custom query directly:
```bash
npm start "Compare Stripe vs Razorpay for a SaaS in Pakistan"
```

Or run without arguments to be prompted:
```bash
npm start
# Enter your research query: Compare Stripe vs Razorpay for a SaaS in Pakistan
```

## Example Output

```

🔍 Query: Compare Stripe vs Razorpay for a SaaS in Pakistan
────────────────────────────────────────────────────────────
🤖 Starting multi-agent research pipeline...

🔎 Step 1/2: Research Agent gathering data...

✍️  Step 2/2: Writer Agent producing report...


📄 FINAL REPORT
════════════════════════════════════════════════════════════
## Overview
The report compares Stripe and Razorpay for a SaaS in Pakistan, highlighting their differences and pros and cons. Stripe offers superior international support, while Razorpay is more cost-effective for local Pakistani transactions. However, Razorpay is not directly available in Pakistan, and alternatives like XPay are used instead.

## Key Differences
* Stripe charges around 2.9% + 30 paisa per transaction
* Razorpay charges 2% + 1.5% in Pakistan (note: may vary as Razorpay is not directly available in Pakistan)
* International support: Stripe is superior, while Razorpay's availability is limited in Pakistan

## Pros & Cons
The pros and cons of using Stripe and Razorpay in Pakistan can be summarized as follows:
- Stripe: superior international support, but higher transaction fees
- Razorpay (or its alternatives): more cost-effective for local transactions, but 
limited international support and availability in Pakistan

## Recommendation
For SaaS payment processing in Pakistan, consider reliable options like JazzCash, 
EasyPaisa, and LemonSqueezy. Weigh the importance of international support against transaction fees when deciding between Stripe and Razorpay (or its alternatives).
The pros and cons of using Stripe and Razorpay in Pakistan can be summarized as follows:
- Stripe: superior international support, but higher transaction fees
- Razorpay (or its alternatives): more cost-effective for local transactions, but 
limited international support and availability in Pakistan

## Recommendation
For SaaS payment processing in Pakistan, consider reliable options like JazzCash, 
EasyPaisa, and LemonSqueezy. Weigh the importance of international support against transaction fees when deciding between Stripe and Razorpay (or its alternatives).


## Recommendation
For SaaS payment processing in Pakistan, consider reliable options like JazzCash, 
EasyPaisa, and LemonSqueezy. Weigh the importance of international support against transaction fees when deciding between Stripe and Razorpay (or its alternatives).

 transaction fees when deciding between Stripe and Razorpay (or its alternatives).


## Sources
* https://www.reddit.com/r/SaaS/comments/1mmbobe/stripe_vs_razorpay_for_an_indian_saas_planning_to/
* https://www.xstak.com/blog/payment-gateways-in-pakistan
* https://www.playto.so/upi-payments-platform-for-private-saas-agency-in-pakistan 
* https://razorpay.com/pricing/
```


## Example Output

```

🔍 Query: how do you see iran vs US war?
────────────────────────────────────────────────────────────
🤖 Starting multi-agent research pipeline...

🔎 Step 1/2: Research Agent gathering data...

✍️  Step 2/2: Writer Agent producing report...


📄 FINAL REPORT
════════════════════════════════════════════════════════════
## Overview
The research data provides insights into the potential conflict between Iran and the US, including historical context and current events. The findings suggest that 
the US has been involved in military operations against Iran, and there are concerns about the division of war powers between Congress and the White House.

## Key Differences
* The US has been involved in various military operations against Iran, including 
the 2025 United States strikes on Iranian nuclear sites.
* The US Constitution divides war powers between Congress and the White House, with only Congress able to declare war.
* The conflict has weakened the United States' position in the great power rivalries of the 21st century.

## Pros & Cons
The pros and cons of a potential Iran-US war are not explicitly stated in the research data. However, it can be inferred that the conflict has had negative consequences for the US, including damaging its position in the great power rivalries. On 
the other hand, the US may have achieved some of its objectives, such as restricting the influence of its great power rivals.

## Recommendation
Based on the research data, it is recommended that the US exercise caution in its 
dealings with Iran and consider the potential consequences of military action. The US should also ensure that it is acting in accordance with its Constitution and respecting the division of war powers between Congress and the White House.        

## Sources
* https://en.wikipedia.org/wiki/Iran%E2%80%93United_States_war
* https://www.youtube.com/watch?v=ajf10YY-bYc
* https://theconversation.com/4-ways-the-war-in-iran-has-weakened-the-united-states-in-the-great-power-game-279069
* https://www.youtube.com/watch?v=2UBNPtkeyYE
* https://arabcenterdc.org/resource/the-us-israel-war-on-iran-analyses-and-perspectives/

---
