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

2. Copy `.env.example` to `.env` and fill in your keys:
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

Custom query:
```bash
npm start "Compare PayPal vs Stripe for an e-commerce store in Europe"
```

## Example Output

```


📄 FINAL REPORT
════════════════════════════════════════════════════════════
{"findings": [
    "Stripe charges 1.4% + €0.25 for European card payments, while PayPal typically charges around 3.1% for similar transactions in Europe.",
    "For small orders, the difference is minor, but larger orders see significant 
cost differences.",
    "Stripe generally offers lower domestic card fees than PayPal, but both provide robust security features for e-commerce in Europe.",
    "Stripe supports more payment options, while PayPal excels in micropayments.",    "Stripe offers more technical control and flexibility, while PayPal provides broader consumer reach and convenience for quick setups in Europe.",
    "Stripe's customer support is developer-focused, whereas PayPal's is geared towards end users.",
    "Stripe is preferred by tech-savvy businesses, while PayPal suits those prioritizing ease of use."
],
"sources": [
    "https://payrequest.io/blog/paypal-vs-stripe-small-business-2026",
    "https://www.reddit.com/r/ecommerce/comments/bqkmj7/paypal_vs_stripe_do_customers_care/",
    "https://justt.ai/blog/stripe-vs-paypal-ecommerce-merchants/",
    "https://www.ionos.co.uk/digitalguide/online-marketing/online-sales/stripe-vs-paypal/",
    "https://lovable.dev/guides/stripe-vs-paypal-payment-processor-comparison",   
    "https://electroiq.com/stats/paypal-vs-stripe-statistics/",
    "https://www.jotform.com/blog/stripe-vs-paypal/",
    "https://tipalti.com/resources/learn/stripe-vs-paypal/",
    "https://wise.com/gb/blog/stripe-payments-vs-paypal"
]
}
...
```
---
Custom query:
```bash
 how do you see iran vs US WAR?
```
## Example Output

```
🤖 Starting multi-agent research pipeline...

🔎 Step 1/2: Researching...

❌ Error: 400 Failed to call a function. Please adjust your prompt. See 'failed_genration' for more details.

eration' for more details.
...
```

Custom query:
```bash
 geopolitical tensions between Iran and the United States
```
## Example Output

🤖 Starting multi-agent research pipeline...

🔎 Step 1/2: Researching...
✍️  Step 2/2: Writing report...

```

📄 FINAL REPORT
════════════════════════════════════════════════════════════
### 1. Overview
The relationship between the United States and Iran has been hostile and contentious, with a history of support, interference, and open hostility. Significant events include the 1979 hostage crisis and failed nuclear negotiations. The tension between the two countries has been persistent since the 1979 Iranian Revolution, with recent issues focusing on nuclear programs and sanctions.

### 2. Key Differences
The key aspects of the US-Iran relationship can be summarized as follows:
* Historical antagonism since the 1979 Iranian Revolution
* Ongoing issues with nuclear programs
* Economic sanctions imposed by the US, including those targeting Iran's financial and economic sectors in 2020

### 3. Pros & Cons
The pros and cons of the current US-Iran relationship are not explicitly stated in the provided findings. However, it can be inferred that:
* The sanctions have significant humanitarian impacts, restricting access to healthcare and education
* The relationship is marked by hostility and tension, which can lead to further conflict and instability

### 4. Recommendation
Based on the provided findings, it is recommended that the US and Iran work towards resolving their differences and improving their relationship. This could involve negotiations on nuclear programs and the easing of economic sanctions, which would help to alleviate humanitarian impacts and reduce tension between the two countries.

### 5. Sources
The sources used in this report include:
* https://www.youtube.com/watch?v=mMqxwbJKsAI
* https://www.amu.apus.edu/area-of-study/legal-studies/resources/us-iran-relations/
* https://en.wikipedia.org/wiki/Iran%E2%80%93United_States_relations
* https://www.congress.gov/crs-product/R47321
* https://www.bbc.com/news/topics/cv3nj70d4mqt
s resolving their differences and improving their relationship. This could involve negotiations on nuclear programs and the easing of economic sanctions, which would help to alleviate humanitarian impacts and reduce tension between the two countries.

### 5. Sources
The sources used in this report include:
* https://www.youtube.com/watch?v=mMqxwbJKsAI
* https://www.amu.apus.edu/area-of-study/legal-studies/resources/us-iran-relations/
* https://en.wikipedia.org/wiki/Iran%E2%80%93United_States_relations
* https://www.congress.gov/crs-product/R47321
* https://www.bbc.com/news/topics/cv3nj70d4mqt

### 5. Sources
The sources used in this report include:
* https://www.youtube.com/watch?v=mMqxwbJKsAI
* https://www.amu.apus.edu/area-of-study/legal-studies/resources/us-iran-relations/
* https://en.wikipedia.org/wiki/Iran%E2%80%93United_States_relations
* https://www.congress.gov/crs-product/R47321
* https://www.bbc.com/news/topics/cv3nj70d4mqt
* https://www.amu.apus.edu/area-of-study/legal-studies/resources/us-iran-relations/
* https://en.wikipedia.org/wiki/Iran%E2%80%93United_States_relations
* https://www.congress.gov/crs-product/R47321
* https://www.bbc.com/news/topics/cv3nj70d4mqt
/
* https://en.wikipedia.org/wiki/Iran%E2%80%93United_States_relations
* https://www.congress.gov/crs-product/R47321
* https://www.bbc.com/news/topics/cv3nj70d4mqt
* https://www.congress.gov/crs-product/R47321
* https://www.bbc.com/news/topics/cv3nj70d4mqt
* https://www.bbc.com/news/topics/cv3nj70d4mqt
* https://www.cfr.org/articles/us-relations-iran
* https://truthout.org/articles/us-expands-economic-fury-sanctions-on-iran-as-trump-declares-ceasefire/
* https://en.wikipedia.org/wiki/United_States_sanctions_against_Iran
* https://www.nortonrosefulbright.com/en-us/knowledge/publications/7b2febfd/increased-us-sanctions-on-iran

