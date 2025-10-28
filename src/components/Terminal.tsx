import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface TerminalProps {
  lines: { text: string; delay: number; color?: string }[];
  className?: string;
}

export function Terminal({ lines, className = " }: TerminalProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);

  useEffect(() => {
    if (currentLine >= lines.length) return;

    const line = lines[currentLine];
    
    if (currentChar < line.text.length) {
      const timer = setTimeout(() => {
        setCurrentChar(currentChar + 1);
      }, 30);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setDisplayedLines([...displayedLines, line.text]);
        setCurrentLine(currentLine + 1);
        setCurrentChar(0);
      }, line.delay);
      return () => clearTimeout(timer);
    }
  }, [currentChar, currentLine, displayedLines, lines]);

  return (
    <div className={`bg-[#0d0d0d] rounded-lg border border-white/10 overflow-hidden ${className}`}>
      {/* Terminal header */}
      <div className="bg-[#1a1a1a] px-4 py-2 flex items-center gap-2 border-b border-white/10">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <span className="text-[#888888] font-['JetBrains_Mono',monospace] ml-2">
          terminal
        </span>
      </div>
      
      {/* Terminal content */}
      <div className="p-4 font-['JetBrains_Mono',monospace] min-h-[200px]">
        {displayedLines.map((line, i) => (
          <div key={i} className="mb-1">
            <span className="text-[#00bfff]">$ </span>
            <span 
              className="text-[#f0f0f0]"
              dangerouslySetInnerHTML={{ 
                __html: line.replace(/--\w+/g, '<span class="text-[#00bfff]">$&</span>')
                          .replace(/✓/g, '<span class="text-[#27c93f]">✓</span>')
                          .replace(/→/g, '<span class="text-[#00bfff]">→</span>')
              }}
            />
          </div>
        ))}
        
        {currentLine < lines.length && (
          <div className="mb-1">
            <span className="text-[#00bfff]">$ </span>
            <span className="text-[#f0f0f0]">
              {lines[currentLine].text.substring(0, currentChar)}
            </span>
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-2 h-4 bg-[#00bfff] ml-0.5"
            />
          </div>
        )}
      </div>
    </div>
  );
}
