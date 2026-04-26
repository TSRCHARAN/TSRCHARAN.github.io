export const learningBlogs = [
  {
    id: "rag-deep-dive",
    title: "Deep Dive into RAG Pipelines",
    date: "Mar 2024",
    excerpt: "Everything I learned about HyDE, semantic chunking, and retrieval optimization.",
    content: `
# Deep Dive into RAG Pipelines

Retrieval-Augmented Generation (RAG) is the backbone of modern LLM applications. Here's a breakdown of the advanced techniques I've implemented.

## 1. Semantic Chunking
Instead of fixed-size chunks, we use embedding similarity to find natural break points in text. This preserves context much better.

## 2. HyDE (Hypothetical Document Embeddings)
By generating a "fake" answer first and using *that* to search the vector DB, we bridge the gap between user queries and stored documents.

## 3. Conversational Memory
Implementing a sliding window or summarization-based memory is crucial for multi-turn dialogues.
    `
  },
  {
    id: "agentic-ai-rise",
    title: "The Rise of Agentic AI",
    date: "Apr 2024",
    excerpt: "Why tool-calling and MCP-like integrations are the future of AI workflows.",
    content: `
# The Rise of Agentic AI

We are moving from "Chatbots" to "Agents". Agents don't just talk; they **act**.

## Tool Calling
By integrating backend APIs as tools, LLMs can now perform tasks like:
- Validating user data against a database.
- Triggering automated workflows.
- Interacting with external systems via MCP-like protocols.

## The Future
The next step is multi-agent systems where specialized agents collaborate to solve complex problems.
    `
  },
];
