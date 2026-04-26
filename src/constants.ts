export const PROFILE = {
  name: "SAI RAM CHARAN",
  role: "AI Engineer — Generative AI — LLM Systems — RAG — Agentic AI",
  tagline: "Specializing in production-grade Generative AI systems and Agentic workflows.",
  about: "AI Engineer with 2+ years of backend experience, specializing in building production-grade Generative AI systems and LLM-powered applications. Experienced in RAG pipelines, conversational memory, and agentic workflows with MCP-like tool integration. Focused on building scalable, real-world AI systems including voice-enabled assistants and automated workflows.",
  email: "tsr.charan@gmail.com",
  phone: "+91 9100152939",
  location: "India",
  resumeUrl: "#", // Placeholder
  github: "https://github.com/", // Placeholder
  linkedin: "https://linkedin.com/in/", // Placeholder
};

export const EXPERIENCES = [
  {
    company: "Digital Trust Technologies",
    role: "Software Engineer – AI & Backend",
    period: "Feb 2024 – Present",
    description: `– Designed and developed scalable backend systems using ASP.NET Core and FastAPI for API orchestration and AI-driven workflows.
– Built and evolved LLM-powered chatbot systems into RAG-based pipelines using semantic and hierarchical chunking to significantly improve response relevance.
– Improved retrieval accuracy using HyDE and enhanced context handling using conversational memory techniques such as sliding window and summarization.
– Designed and implemented agentic AI workflows by integrating backend APIs as structured tools, enabling LLM-driven action execution for onboarding, validation, and automation.
– Developed voice-enabled AI interactions and optimized system performance using Redis caching and efficient API design, improving latency and scalability.
– Built secure APIs with OAuth/OpenID Connect and implemented microservice monitoring systems to improve system reliability and incident response time.
– Automated operational workflows including reporting, monitoring, and recruitment pipelines using n8n workflows.`,
    skills: ["FastAPI", "ASP.NET Core", "RAG", "Agentic AI", "Redis", "OAuth", "n8n"],
  },
];

export const LEADERSHIP = [
  {
    role: "Co-Founder",
    organization: "Z444 – EdTech Platform",
    description: `– Built a goal-driven learning platform with data-driven content delivery.
– Developed mobile and backend systems using React Native and Node.js.
– Applied ML-based user engagement logic to personalize learning pathways.`,
  }
];

export const EDUCATION = [
  {
    school: "BITS Pilani – WILP",
    degree: "M.Tech – Artificial Intelligence & Machine Learning",
    period: "2025 – Present",
    gpa: "CGPA: 9.00",
  },
  {
    school: "SRKR Engineering College",
    degree: "B.Tech – Artificial Intelligence & Data Science",
    period: "2020 – 2024",
    gpa: "CGPA: 9.24",
  }
];

export const PROJECTS = [
  {
    title: "S.AI – Conversational AI with Long-Term Memory",
    description: "Architected a conversational AI system with long-term memory using summarization-based context retention. Designed a FastAPI orchestration layer for prompt routing and token optimization. Enabled multi-turn dialogue with context-aware responses.",
    tech: ["FastAPI", "LLM APIs", "Context Management"],
    link: "#",
  },
  {
    title: "GitHub Repository RAG System",
    description: "Developed a RAG system for natural language querying over code repositories. Applied semantic chunking preserving code structure and generated code-aware embeddings for documentation and retrieval relevance.",
    tech: ["FastAPI", "FAISS", "Semantic Chunking"],
    link: "#",
  },
  {
    title: "YouTube Video RAG System",
    description: "Built a RAG system for question-answering over YouTube videos using transcript extraction. Processed transcripts into semantic chunks and designed prompt construction combining retrieved context and queries.",
    tech: ["FastAPI", "LLM APIs", "Vector DB"],
    link: "#",
  },
];

export const SKILLS = [
  { category: "Languages", items: ["Python", "C#", "SQL", "JavaScript", "TypeScript"] },
  { category: "Generative AI", items: ["LLM APIs (OpenAI, Gemini, Groq, Ollama)", "RAG", "Prompt Engineering", "HyDE", "Semantic/Hierarchical Chunking", "Conversational Memory", "Token Optimization"] },
  { category: "Agentic AI", items: ["Tool Calling", "MCP-like Integration", "Workflow Automation (n8n)"] },
  { category: "ML / NLP", items: ["Scikit-learn", "TensorFlow", "NLP Pipelines", "Intent Classification", "Model Evaluation"] },
  { category: "AI Infrastructure", items: ["Vector Databases (FAISS)", "Embeddings", "Similarity Search", "Streaming Inference"] },
  { category: "Backend", items: ["FastAPI", "ASP.NET Core", "Node.js", "REST APIs", "API Orchestration"] },
  { category: "Frameworks", items: ["NumPy", "Pandas", "Matplotlib", "React Native"] },
  { category: "Tools", items: ["Git", "GitHub", "Jupyter", "VS Code", "Postman", "DSA"] },
  { category: "Database", items: ["PostgreSQL", "MongoDB", "Redis"] },
];

export const CERTIFICATIONS = [
  {
    name: "Deep Learning Specialization",
    issuer: "DeepLearning.AI",
    date: "2022",
  },
  {
    name: "TensorFlow Developer Certificate",
    issuer: "Google",
    date: "2021",
  },
];

export const ACHIEVEMENTS = [
  {
    title: "Agentic AI Pioneer",
    description: "Currently exploring and implementing advanced agentic workflows and tool-calling integrations.",
  },
  {
    title: "Scalable Backend Architect",
    description: "Successfully transitioned legacy chatbot systems into high-performance RAG pipelines.",
  },
];

export const BLOGS = {
  interviewExperiences: [
    {
      id: "interview-2024",
      title: "Interviewing for AI Roles in 2024",
      date: "Jan 2024",
      excerpt: "Sharing my experience interviewing for AI & Backend roles at top tech firms.",
      content: `
# Interviewing for AI Roles in 2024

The landscape of AI interviewing has shifted significantly. It's no longer just about knowing how to train a model; it's about **system design**, **RAG architectures**, and **agentic reasoning**.

## Key Focus Areas
1. **RAG Systems**: Expect deep dives into chunking strategies, vector databases, and retrieval optimization (HyDE, Re-ranking).
2. **LLM Orchestration**: How do you handle long-term memory? How do you optimize tokens?
3. **Backend Scalability**: AI doesn't live in a vacuum. You need to know how to build robust APIs (FastAPI/ASP.NET) to serve these models.

## My Experience
In my recent rounds, I was asked to design a system that could handle natural language queries over a massive codebase. This led to the creation of my GitHub RAG project...
      `
    },
  ],
  learnings: [
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
  ],
};
