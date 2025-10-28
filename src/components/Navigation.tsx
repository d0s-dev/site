import { Github, Package } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#001233]/95 backdrop-blur-sm border-b border-[#002855]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
          >
            <motion.div 
              className="w-10 h-10 rounded flex items-center justify-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #0466C8 0%, #023E7D 100%)',
              }}
              whileHover={{ scale: 1.05 }}
            >
              <Package className="w-5 h-5 text-white" />
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.1 }}
              />
            </motion.div>
            <span className="text-white font-mono" style={{ fontFamily: 'JetBrains Mono, monospace' }}>d0s.dev</span>
          </button>

          {/* Nav links */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('home')}
              className={`transition-colors relative ${
                currentPage === 'home' ? 'text-[#0466C8]' : 'text-[#979DAC] hover:text-white'
              }`}
            >
              Home
              {currentPage === 'home' && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 right-0 h-0.5"
                  style={{ background: 'linear-gradient(90deg, #0466C8, #023E7D)' }}
                />
              )}
            </button>
            <button
              onClick={() => onNavigate('docs')}
              className={`transition-colors relative ${
                currentPage === 'docs' ? 'text-[#0466C8]' : 'text-[#979DAC] hover:text-white'
              }`}
            >
              Docs
              {currentPage === 'docs' && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 right-0 h-0.5"
                  style={{ background: 'linear-gradient(90deg, #0466C8, #023E7D)' }}
                />
              )}
            </button>
            <button
              onClick={() => onNavigate('catalog')}
              className={`transition-colors relative ${
                currentPage === 'catalog' ? 'text-[#0466C8]' : 'text-[#979DAC] hover:text-white'
              }`}
            >
              Catalog
              {currentPage === 'catalog' && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 right-0 h-0.5"
                  style={{ background: 'linear-gradient(90deg, #0466C8, #023E7D)' }}
                />
              )}
            </button>
            <a
              href="https://github.com/d0s-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#979DAC] hover:text-[#0466C8] transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
