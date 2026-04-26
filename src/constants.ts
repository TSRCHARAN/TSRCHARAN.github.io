import { basicBlogs } from "./data/blogs/basics";
import { interviewBlogs } from "./data/blogs/interviews";
import { learningBlogs } from "./data/blogs/learnings";

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
    description: "Designed and implemented scalable backend systems for AI applications, improving latency and reliability.",
  }
];

export const BLOGS = {
  basics: basicBlogs,
  interviewExperiences: interviewBlogs,
  learnings: learningBlogs,
};
