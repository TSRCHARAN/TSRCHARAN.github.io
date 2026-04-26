import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { BLOGS } from "../constants";
import ReactMarkdown from "react-markdown";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Sections";

export default function BlogPost() {
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  
  const allBlogs = [...BLOGS.basics, ...BLOGS.interviewExperiences, ...BLOGS.learnings];
  const blog = allBlogs.find(b => b.id === id);

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-4xl font-bold mb-4">404: Blog Not Found</h1>
        <Link to="/" className="text-brand-400 hover:underline flex items-center gap-2">
          <ArrowLeft size={20} /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-32 pb-24 px-6 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link to="/blogs" className="text-zinc-500 hover:text-brand-400 transition-colors flex items-center gap-2 mb-8 group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Blogs
          </Link>

          <div className="flex items-center gap-4 text-zinc-500 text-sm font-mono mb-6">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              {blog.date}
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              5 min read
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-8 glow-text leading-tight">
            {blog.title}
          </h1>

          <div className="prose prose-invert prose-zinc max-w-none">
            <div className="markdown-body">
              <ReactMarkdown>{blog.content}</ReactMarkdown>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
