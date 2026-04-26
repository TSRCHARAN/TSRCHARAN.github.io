import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { PROJECTS } from "../constants";
import ReactMarkdown from "react-markdown";
import { motion } from "motion/react";
import { ArrowLeft, ExternalLink, Cpu, Rocket, Github } from "lucide-react";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Sections";

export default function ProjectDetail() {
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  
  const project = PROJECTS.find(p => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-4xl font-bold mb-4 px-4">404: Neural Path Not Found</h1>
        <Link to="/" className="text-brand-400 hover:underline flex items-center gap-2">
          <ArrowLeft size={20} /> Back to Nexus
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link to="/#projects" className="text-zinc-500 hover:text-brand-400 transition-colors flex items-center gap-2 mb-8 group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>

          <header className="mb-12">
            <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight glow-text leading-tight">
                {project.title}
              </h1>
              <div className="flex gap-4">
                {project.githubUrl && (
                  <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-3 glass rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all shadow-lg flex items-center gap-2"
                    title="View GitHub Repository"
                  >
                    <Github size={24} />
                    <span className="hidden sm:inline font-medium text-sm">Repository</span>
                  </a>
                )}
                {project.link !== "#" && (
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-3 glass rounded-xl text-brand-400 hover:text-white hover:bg-brand-500 transition-all shadow-lg shadow-brand-500/10 flex items-center gap-2"
                    title="Visit Live Site"
                  >
                    <ExternalLink size={24} />
                    <span className="hidden sm:inline font-medium text-sm">Live Demo</span>
                  </a>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {project.tech.map((t, i) => (
                <div key={i} className="flex items-center gap-2 bg-zinc-800/50 border border-zinc-700/50 px-4 py-2 rounded-full text-zinc-300 text-sm font-mono">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                  {t}
                </div>
              ))}
            </div>
          </header>

          <div className="grid md:grid-cols-[1fr_300px] gap-12">
            <div className="prose prose-invert prose-zinc max-w-none">
              <div className="markdown-body">
                <ReactMarkdown>{project.fullDescription || project.description}</ReactMarkdown>
              </div>
            </div>

            <aside className="space-y-8">
              {/* System Specs - Dashboard Style */}
              <div className="glass p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 blur-3xl -z-10 group-hover:bg-brand-500/10 transition-colors" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-brand-500/10 rounded-lg">
                    <Cpu className="text-brand-400" size={18} />
                  </div>
                  <h3 className="font-bold uppercase tracking-[0.2em] text-[10px] text-zinc-400">System Architecture</h3>
                </div>
                <div className="space-y-4">
                  {(project as any).specs?.map((spec: any, i: number) => (
                    <div key={i} className="flex flex-col gap-1 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-tight">{spec.label}</span>
                      <span className="text-sm font-bold text-zinc-100 group-hover:text-brand-400 transition-colors">{spec.value}</span>
                    </div>
                  )) || (
                    <p className="text-sm text-zinc-500 italic">Technical specs pending...</p>
                  )}
                </div>
              </div>

              {/* Deliverables - Highlighting AI focus */}
              <div className="glass p-6 rounded-2xl border border-white/5 relative bg-zinc-950/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-brand-500/10 rounded-lg">
                    <Rocket className="text-brand-400" size={18} />
                  </div>
                  <h3 className="font-bold uppercase tracking-[0.2em] text-[10px] text-zinc-400">Core Deliverables</h3>
                </div>
                <div className="space-y-3">
                  {(project as any).deliverables?.map((item: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 group/item">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500/50 group-hover/item:bg-brand-400 group-hover/item:scale-125 transition-all shrink-0" />
                      <span className="text-sm text-zinc-400 group-hover/item:text-zinc-200 transition-colors leading-relaxed">
                        {item}
                      </span>
                    </div>
                  )) || (
                    <p className="text-sm text-zinc-500 italic">Project deliverables defined in blueprint.</p>
                  )}
                </div>
              </div>

              {/* Status Indicator */}
              <div className="glass p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-3">
                <div className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400">Production Ready</span>
              </div>
            </aside>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
