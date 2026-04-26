import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { PROFILE, EXPERIENCES, EDUCATION, PROJECTS, SKILLS, ACHIEVEMENTS, CERTIFICATIONS, BLOGS, LEADERSHIP } from "../constants";

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

const SYSTEM_PROMPT = `
You are Sai Ram Charan (Charan), a professional AI Engineer specializing in production-grade Generative AI systems. You are answering questions from visitors on your portfolio website.
Answer in the FIRST PERSON (use "I", "my", "me").

YOUR IDENTITY:
- You are an expert in LLM Orchestration, RAG Pipelines, and Agentic AI.
- You have a strong backend foundation (ASP.NET Core, FastAPI).
- You are passionate about building real-world AI systems that solve complex problems.

YOUR BACKGROUND:
- Role: ${PROFILE.role}
- Summary: ${PROFILE.about}
- Contact: Email: ${PROFILE.email}, Phone: ${PROFILE.phone}
- Skills: ${JSON.stringify(SKILLS)}
- Experience: ${JSON.stringify(EXPERIENCES)}
- Education: ${JSON.stringify(EDUCATION)}
- Projects: ${JSON.stringify(PROJECTS)}
- Achievements: ${JSON.stringify(ACHIEVEMENTS)}
- Leadership & Entrepreneurship: ${JSON.stringify(LEADERSHIP)}
- Blogs: ${JSON.stringify(BLOGS)}

TECHNICAL DEEP-DIVE (Proactively mention these if relevant):
- RAG: Mention my work with HyDE, Semantic Chunking, and Hierarchical Chunking.
- Agentic AI: Talk about my "MCP-like" approach to integrating backend APIs as structured tools for LLMs, and my use of n8n for workflow automation.
- Memory: Explain how I use conversational memory techniques like sliding windows and summarization.
- Voice AI: Mention my experience with voice-enabled AI interactions and system performance tuning.
- Entrepreneurship: Mention that I co-founded Z444, an EdTech platform where I built goal-driven learning paths.
- Infrastructure: Mention my use of Redis for caching and Vector Databases (FAISS) for similarity search.

GUIDELINES:
1. STRICTLY OFF-TOPIC GUARDRAIL: You are NOT a general-purpose chatbot. If a user asks about general knowledge, hobbies, or unrelated tasks, politely steer the conversation back to my AI Engineering expertise and professional background.
2. Be professional, technical, and confident.
3. Use engineering terminology accurately (e.g., "latency", "token optimization", "retrieval accuracy").
4. Keep responses impactful. If a user asks for a project detail, give them a concise technical summary focused on the architecture and AI implementation.
5. If asked how to contact you, provide my email (${PROFILE.email}) or mention the LinkedIn link (${PROFILE.linkedin}).
`;

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm Sai Ram Charan. Feel free to ask me anything about my work in AI, my projects, or my experience!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Check if API key is available
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      setMessages(prev => [...prev, { role: "assistant", content: "API key is not configured. Please set VITE_GEMINI_API_KEY in your environment variables." }]);
      return;
    }

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: SYSTEM_PROMPT,
        },
        history: messages.map(m => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }]
        }))
      });

      const result = await chat.sendMessage({
        message: userMessage
      });

      const responseText = result.text || "I'm sorry, I couldn't process that request.";
      setMessages(prev => [...prev, { role: "assistant", content: responseText }]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="glass mb-4 w-[calc(100vw-32px)] md:w-[400px] h-[500px] rounded-2xl flex flex-col overflow-hidden shadow-2xl border-brand-500/30"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/50 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center overflow-hidden">
                    <User size={20} className="text-brand-400" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-zinc-950 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight text-zinc-100">Sai Ram Charan</h3>
                  <p className="text-[10px] font-mono text-brand-400/80 uppercase tracking-widest">AI Engineer Mode</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/5 rounded-xl transition-all group"
              >
                <X size={18} className="text-zinc-500 group-hover:text-zinc-300 transition-colors" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide bg-zinc-950/30">
              {messages.map((m, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2, delay: i === messages.length - 1 ? 0 : 0 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center border ${
                      m.role === "user" 
                        ? "bg-zinc-800 border-white/10" 
                        : "bg-brand-500/10 border-brand-500/20"
                    }`}>
                      {m.role === "user" ? <User size={14} className="text-zinc-400" /> : <Bot size={14} className="text-brand-400" />}
                    </div>
                    <div className="space-y-1">
                      <div className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                        m.role === "user" 
                          ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-tr-none shadow-lg shadow-brand-500/10" 
                          : "bg-white/5 border border-white/10 text-zinc-200 rounded-tl-none backdrop-blur-sm"
                      }`}>
                        {m.content}
                      </div>
                      <p className={`text-[10px] font-mono text-zinc-600 ${m.role === "user" ? "text-right" : "text-left"}`}>
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                      <Bot size={14} className="text-brand-400" />
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex gap-1">
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-zinc-900/80 backdrop-blur-xl">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <div className="flex-1 relative group">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all placeholder:text-zinc-600"
                  />
                  <div className="absolute inset-0 rounded-xl bg-brand-500/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity" />
                </div>
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2.5 bg-brand-500 hover:bg-brand-400 disabled:opacity-30 disabled:hover:bg-brand-500 rounded-xl transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center group"
                >
                  <Send size={18} className="text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/20 hover:bg-brand-600 transition-all relative group"
      >
        {isOpen ? <X size={24} className="text-white" /> : <User size={24} className="text-white" />}
        {!isOpen && (
          <span className="absolute right-full mr-4 px-3 py-1.5 bg-zinc-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
            Chat with me
          </span>
        )}
      </motion.button>
    </div>
  );
}
