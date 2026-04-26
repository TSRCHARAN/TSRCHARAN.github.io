import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { BLOGS } from "../constants";
import { Briefcase, BookOpen, ChevronRight, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Sections";

type BlogCategory = "basics" | "interview" | "learning";

interface Category {
  id: BlogCategory;
  label: string;
  icon: React.ReactNode;
  color: string;
  colorCode: string;
}

const categories: Category[] = [
  { id: "basics", label: "AI/ML Basics", icon: <BookOpen size={20} />, color: "green", colorCode: "green-400" },
  { id: "interview", label: "Interview Experiences", icon: <Briefcase size={20} />, color: "brand", colorCode: "brand-400" },
  { id: "learning", label: "Advanced Learnings", icon: <BookOpen size={20} />, color: "indigo", colorCode: "indigo-400" },
];

export default function BlogsPage() {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>("basics");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getBlogsForCategory = () => {
    switch (selectedCategory) {
      case "basics":
        return BLOGS.basics;
      case "interview":
        return BLOGS.interviewExperiences;
      case "learning":
        return BLOGS.learnings;
      default:
        return [];
    }
  };

  const currentCategory = categories.find(c => c.id === selectedCategory);
  const blogs = getBlogsForCategory();

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
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

        {/* Category Selector */}
        <div className="mb-16">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? `glass border-${category.color}-500/50 bg-${category.color}-500/10`
                    : "glass border-zinc-500/20 hover:border-zinc-400/50"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`text-${category.colorCode}`}>
                  {category.icon}
                </div>
                <span>{category.label}</span>
                {selectedCategory === category.id && (
                  <motion.div
                    layoutId="activeCategory"
                    className={`absolute inset-0 rounded-xl border-2 border-${category.color}-500 pointer-events-none`}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Blogs Display */}
        <AnimatePresence mode="wait">
          <motion.section
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight mb-2">{currentCategory?.label}</h2>
              <p className="text-zinc-400">
                {blogs.length} article{blogs.length !== 1 ? "s" : ""} in this category
              </p>
            </div>

            {blogs.length > 0 ? (
              <div className="space-y-6">
                {blogs.map((blog, index) => (
                  <motion.div
                    key={blog.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link 
                      to={`/blog/${blog.id}`}
                      className="block glass p-8 rounded-2xl group hover:border-brand-500/50 transition-all"
                    >
                      <span className={`text-xs font-mono text-${currentCategory?.colorCode} mb-2 block`}>
                        {blog.date}
                      </span>
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-brand-400 transition-colors flex items-center gap-2">
                        {blog.title}
                        <ChevronRight size={20} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      </h3>
                      <p className="text-zinc-400 leading-relaxed">{blog.excerpt}</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="glass p-12 rounded-2xl text-center">
                <p className="text-zinc-400">No blogs in this category yet.</p>
              </div>
            )}
          </motion.section>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
