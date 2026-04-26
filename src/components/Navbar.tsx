import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/#about" },
  { name: "Experience", href: "/#experience" },
  { name: "Skills", href: "/#skills" },
  { name: "Projects", href: "/#projects" },
  { name: "Blogs", href: "/blogs" },
  { name: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 md:p-6 pointer-events-none">
      <div className="w-full max-w-4xl flex flex-col items-center pointer-events-auto">
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass w-full md:w-auto px-6 py-3 rounded-2xl md:rounded-full flex items-center justify-between md:justify-center gap-8 shadow-2xl relative z-50 transition-all duration-300"
        >
          {/* Logo / Name Mobile */}
          <Link to="/" className="md:hidden font-bold text-lg tracking-tighter text-brand-400">
            SRC<span className="text-white">.AI</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.href} 
                className="text-sm font-medium text-zinc-400 hover:text-brand-400 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-white/5 rounded-xl transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </motion.div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 10, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="md:hidden w-full glass rounded-3xl p-6 mt-2 flex flex-col gap-4 shadow-2xl overflow-hidden border-brand-500/20"
            >
              <div className="absolute inset-0 bg-brand-500/5 -z-10" />
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link 
                    to={link.href} 
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-bold text-zinc-200 hover:text-brand-400 transition-colors flex items-center justify-between group"
                  >
                    <span>{link.name}</span>
                    <span className="text-[10px] font-mono text-zinc-600 group-hover:text-brand-500 transition-colors">0{i + 1}</span>
                  </Link>
                </motion.div>
              ))}
              
              {/* Decorative AI line */}
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">Neural Network Standby</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
