import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Command {
  input: string;
  output: string;
}

interface MacTerminalProps {
  commands?: Command[];
  loop?: boolean;
  className?: string;
}

export function MacTerminal({ 
  commands = [
    { input: 'd0s init k3s', output: '[✓] Cluster ready' },
    { input: 'd0s deploy nginx --offline', output: '🚀 Live in 10s | Secure Bundle Locked' }
  ],
  loop = true,
  className = ''
}: MacTerminalProps) {
  const [displayedCommands, setDisplayedCommands] = useState<Array<{ input: string; output: string; showCursor: boolean }>>([]);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [showOutput, setShowOutput] = useState(false);

  useEffect(() => {
    if (currentCommandIndex >= commands.length) {
      if (loop) {
        setTimeout(() => {
          setDisplayedCommands([]);
          setCurrentCommandIndex(0);
          setCurrentInput('');
          setShowOutput(false);
        }, 3000);
      }
      return;
    }

    const command = commands[currentCommandIndex];
    
    // Type input
    if (currentInput.length < command.input.length) {
      const timeout = setTimeout(() => {
        setCurrentInput(command.input.slice(0, currentInput.length + 1));
      }, 50);
      return () => clearTimeout(timeout);
    }

    // Show output
    if (!showOutput) {
      const timeout = setTimeout(() => {
        setShowOutput(true);
        setDisplayedCommands([...displayedCommands, { 
          input: command.input, 
          output: command.output,
          showCursor: false 
        }]);
      }, 500);
      return () => clearTimeout(timeout);
    }

    // Move to next command
    const timeout = setTimeout(() => {
      setCurrentCommandIndex(currentCommandIndex + 1);
      setCurrentInput('');
      setShowOutput(false);
    }, 1500);
    return () => clearTimeout(timeout);
  }, [currentInput, showOutput, currentCommandIndex, commands, loop, displayedCommands]);

  return (
    <div className={`terminal-window ${className}`}>
      <div className="terminal-header">
        <div className="terminal-dot" style={{ background: '#023E7D' }} />
        <div className="terminal-dot" style={{ background: '#0353A4' }} />
        <div className="terminal-dot" style={{ background: '#0466C8' }} />
        <span className="ml-2 text-sm text-muted-foreground font-mono">d0s-terminal</span>
      </div>
      <div className="terminal-body min-h-[200px]">
        {displayedCommands.map((cmd, index) => (
          <div key={index} className="mb-3">
            <div className="flex items-center gap-2">
              <span className="text-primary">$</span>
              <span className="text-white font-mono">{cmd.input}</span>
            </div>
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-foreground ml-4 mt-1"
            >
              {cmd.output}
            </motion.div>
          </div>
        ))}
        
        {currentCommandIndex < commands.length && (
          <div className="flex items-center gap-2">
            <span className="text-primary">$</span>
            <span className="text-white font-mono">{currentInput}</span>
            <span className="cursor" />
          </div>
        )}
        
        {showOutput && currentCommandIndex < commands.length && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-foreground ml-4 mt-1"
          >
            {commands[currentCommandIndex].output}
          </motion.div>
        )}
      </div>
    </div>
  );
}
