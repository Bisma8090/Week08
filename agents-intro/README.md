
#  Multi-Agent CLI Assistant (OpenAI Agents SDK)

##  Overview

This project is a **CLI based Multi-Agent AI system** developed using the **OpenAI Agents SDK**. The main purpose of this system is to demonstrate how modern AI applications are built using an **agentic architecture instead of a single prompt-based LLM approach**.

In traditional AI applications, a single large language model is used to process user input and generate responses directly. However, in real-world production systems, this approach is limited because it lacks modularity, task specialization, and structured decision-making.

To solve this problem, this project implements a **multi-agent system** where different agents are responsible for different types of tasks. These agents work together through a routing mechanism, tool usage, and controlled delegation (handoffs), making the system more intelligent, scalable, and organized.

The system continuously takes user input from the terminal, processes it through a decision-making pipeline, and returns the most appropriate response using specialized agents.

---

##  Features

This system includes multiple important features that represent real-world agentic AI design patterns:

- A **multi-agent architecture** consisting of a router agent and multiple specialized agents that handle different domains of tasks.
- Integration of **tools**, such as a calculator and a word counter, to allow agents to perform accurate and deterministic operations instead of guessing results.
- A **guardrail system** that filters and blocks unsafe, irrelevant, or inappropriate user inputs before they are processed by the agents.
- A **handoff mechanism** that allows the router agent to delegate tasks to the most suitable specialized agent instead of answering directly.
- A **continuous CLI-based interaction loop** where users can repeatedly ask questions without restarting the system.
- An optional **tracing feature** that helps in debugging and understanding how the agent system processes and routes each request.

---

##  Agent Architecture

The system is designed using multiple agents, each having a specific role and responsibility. This modular approach ensures better organization and accuracy.

---

###  Router Agent

The Router Agent is the central decision-making component of the system. It acts as the entry point for all user inputs.

Its responsibilities include:
- Receiving the raw input from the user
- Analyzing the type of query
- Determining which specialized agent should handle the request
- Delegating the task using handoffs

The router agent does not generate final answers by itself. Instead, it focuses only on routing logic. This ensures separation of concerns and improves system design quality.

Routing rules used in this system are:
- Mathematical queries are forwarded to the Math Agent
- Programming or coding-related queries are forwarded to the Programming Agent
- General knowledge or factual queries are forwarded to the General QA Agent

---

###  Math Agent

The Math Agent is responsible for handling all mathematical and numerical problems.

Its main characteristics include:
- It specializes in solving arithmetic and mathematical expressions
- It uses the **Calculator Tool** to perform computations instead of manually calculating answers
- It ensures accuracy by relying on deterministic tool execution rather than LLM guessing

This agent is important because mathematical accuracy is critical, and LLMs alone may produce incorrect results without tool support.

---

###  Programming Agent

The Programming Agent is designed to assist with programming-related tasks.Its responsibile for answering questions related to programming languages.

---

###  General QA Agent

The General QA Agent is responsible for handling general-purpose questions that do not fall under math or programming categories like Providing factual and informative responses, Handling general knowledge queries.

---

##  Tools

Tools are external functions that agents can call to perform specific tasks that require precision and cannot be reliably handled by language model reasoning alone.

---

###  Calculator Tool

The Calculator Tool is used to evaluate mathematical expressions accurately.

Instead of manually computing results, the Math Agent passes expressions to this tool.

Example input: 12 * 4 + 2


The tool evaluates the expression and returns the correct numerical result.

---

###  Word Counter Tool

The Word Counter Tool is used to analyze text inputs.

It calculates:
- Total number of words
- Total number of characters

Example output: Words: 10, Characters: 45

This tool is mainly used by the Programming Agent when working with text-based or string analysis tasks.

---

##  Guardrails

The system includes a guardrail mechanism that ensures safe and controlled input processing before any agent handles the request.

The guardrail system performs input validation and blocks unsafe or irrelevant queries.

###  Blocked Keywords

The following types of inputs are blocked:

- hacking or exploitation related queries
- illegal activities
- violent content
- weapons or harmful materials
- drugs or prohibited substances

### Rules Applied

- If a user input contains any restricted keyword, the system immediately blocks the request and does not pass it to any agent.
- If the input is too short or meaningless (less than 2 characters), it is also rejected.

This ensures that the system remains safe, controlled, and production-ready.

---

##  System Flow

The system follows a structured execution pipeline that ensures proper validation, routing, and response generation.

This flow ensures that every request passes through proper validation and is handled by the most suitable component.

---

##  Setup Instructions

To run this project locally, follow the steps below carefully.

---

### 1. Clone Repository

First, clone the project repository from GitHub:

```bash
git clone https://github.com/Bisma8090/Week08/tree/main/agents-intro
cd agents-intro
```
### 2. Install Dependencies

```bash
npm install
```
### 3. Create Environment File

Create a .env file in the root directory:
```bash
OPENAI_API_KEY=your_api_key_here
```
### 4. Run Hello World Agent

```bash
node hello.js
```
### 5. Start CLI Assistant


```bash
node index.js
```
---

##  How to Use

After starting the CLI, you can enter queries.
##  Examples

### Math
```text
What is 15 * 3 + 2?
```
### Programming
```text
Explain async/await in JavaScript
```
### General
```text
What is Newton's second law?
```
---

##  Tracing

You can control tracing in CLI using the following commands:
```bash
trace on
 ```
or 
```bash
trace off
 ```
 Tracing helps in debugging and understanding how agents work internally.

 ## Conclusion

This project demonstrates a complete Agentic AI system using OpenAI Agents SDK.
It successfully implements:
- Multi-agent architecture
- Intelligent routing system
- Tool-based computation
- Guardrail safety layer
- Structured execution pipeline
