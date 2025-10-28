import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ButtonProps } from './ui/button';

interface ParticleButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export function ParticleButton({ children, onClick, ...props }: ParticleButtonProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create particles
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
    }));

    setParticles(newParticles);

    // Clear particles after animation
    setTimeout(() => {
      setParticles([]);
    }, 1000);

    // Call original onClick if provided
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div className="relative inline-block">
      <Button onClick={handleClick} {...props}>
        {children}
      </Button>
      
      {/* Particles */}
      {particles.map((particle, index) => (
        <motion.div
          key={particle.id}
          className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
          style={{
            left: particle.x,
            top: particle.y,
            background: 'linear-gradient(135deg, #0466C8, #023E7D)',
          }}
          initial={{ scale: 1, opacity: 1 }}
          animate={{
            x: Math.cos((index * Math.PI * 2) / 12) * 80,
            y: Math.sin((index * Math.PI * 2) / 12) * 80,
            scale: 0,
            opacity: 0,
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}
