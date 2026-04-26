import { useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { BLOGS } from "../constants";
import { Briefcase, BookOpen, ChevronRight, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Sections";

export default function BlogsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-32 pb-24 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <Link to="/" className="text-zinc-500 hover:text-brand-400 transition-colors flex items-center gap-2 mb-8 group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Portfolio
          </Link>
          <h1 className="text-3xl md:text-6xl font-bold tracking-tight mb-4 glow-text">Technical Insights</h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl">
            A collection of my thoughts on AI engineering, RAG systems, and my journey through the evolving landscape of LLMs.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Interview Experiences */}
          <section>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
                <Briefcase className="text-brand-400" size={20} />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Interview Experiences</h2>
            </div>
            
            <div className="space-y-8">
              {BLOGS.interviewExperiences.map((blog, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    to={`/blog/${blog.id}`}
                    className="block glass p-8 rounded-2xl group hover:border-brand-500/50 transition-all"
                  >
                    <span className="text-xs font-mono text-brand-400 mb-2 block">{blog.date}</span>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-brand-400 transition-colors flex items-center gap-2">
                      {blog.title}
                      <ChevronRight size={20} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </h3>
                    <p className="text-zinc-400 leading-relaxed">{blog.excerpt}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Learning Blogs */}
          <section>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <BookOpen className="text-indigo-400" size={20} />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Learning Blogs</h2>
            </div>
            
            <div className="space-y-8">
              {BLOGS.learnings.map((blog, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    to={`/blog/${blog.id}`}
                    className="block glass p-8 rounded-2xl group hover:border-brand-500/50 transition-all"
                  >
                    <span className="text-xs font-mono text-indigo-400 mb-2 block">{blog.date}</span>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-brand-400 transition-colors flex items-center gap-2">
                      {blog.title}
                      <ChevronRight size={20} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </h3>
                    <p className="text-zinc-400 leading-relaxed">{blog.excerpt}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
