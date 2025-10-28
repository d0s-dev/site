import React from 'react';
import { motion } from 'framer-motion';
import { Lock, LockOpen, Rocket, Settings, Smartphone, Cloud, Puzzle, Globe, Terminal as TerminalIcon, LineChart } from 'lucide-react';

interface Cube3DProps {
  icon?: 'lock' | 'rocket' | 'settings' | 'smartphone' | 'cloud' | 'puzzle' | 'globe' | 'terminal' | 'chart';
  size?: 'sm' | 'md' | 'lg';
  floating?: boolean;
  glowing?: boolean;
  unlockOnHover?: boolean;
  className?: string;
}

export function Cube3D({ 
  icon = 'lock', 
  size = 'md',
  floating = false,
  glowing = false,
  unlockOnHover = false,
  className = ''
}: Cube3DProps) {
  const [isUnlocked, setIsUnlocked] = React.useState(false);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const faceSizes = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const iconSizes = {
    sm: 20,
    md: 28,
    lg: 36
  };

  const icons = {
    lock: isUnlocked ? LockOpen : Lock,
    rocket: Rocket,
    settings: Settings,
    smartphone: Smartphone,
    cloud: Cloud,
    puzzle: Puzzle,
    globe: Globe,
    terminal: TerminalIcon,
    chart: LineChart
  };

  const Icon = icons[icon];

  return (
    <motion.div
      className={`cube-container ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      onHoverStart={() => unlockOnHover && setIsUnlocked(true)}
      onHoverEnd={() => unlockOnHover && setIsUnlocked(false)}
    >
      <motion.div
        className={`cube ${sizeClasses[size]} relative`}
        style={{
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateY: floating ? [0, 360] : 0,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }}
        whileHover={{
          scale: 1.1,
          rotateY: floating ? undefined : 180,
          transition: { duration: 0.6 }
        }}
      >
        {/* Front Face */}
        <div 
          className={`cube-face ${faceSizes[size]} ${glowing ? 'glow' : ''}`}
          style={{
            position: 'absolute',
            background: 'linear-gradient(135deg, #0466C8 0%, #023E7D 100%)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            transform: `rotateY(0deg) translateZ(${size === 'sm' ? '32px' : size === 'md' ? '48px' : '64px'})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Icon size={iconSizes[size]} className="text-white" />
        </div>

        {/* Back Face */}
        <div 
          className={`cube-face ${faceSizes[size]}`}
          style={{
            position: 'absolute',
            background: 'linear-gradient(135deg, #023E7D 0%, #0353A4 100%)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            transform: `rotateY(180deg) translateZ(${size === 'sm' ? '32px' : size === 'md' ? '48px' : '64px'})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Icon size={iconSizes[size]} className="text-white opacity-60" />
        </div>

        {/* Right Face */}
        <div 
          className={`cube-face ${faceSizes[size]}`}
          style={{
            position: 'absolute',
            background: 'linear-gradient(135deg, #0353A4 0%, #0466C8 100%)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            transform: `rotateY(90deg) translateZ(${size === 'sm' ? '32px' : size === 'md' ? '48px' : '64px'})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Icon size={iconSizes[size]} className="text-white opacity-40" />
        </div>

        {/* Left Face */}
        <div 
          className={`cube-face ${faceSizes[size]}`}
          style={{
            position: 'absolute',
            background: 'linear-gradient(135deg, #023E7D 0%, #0466C8 100%)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            transform: `rotateY(-90deg) translateZ(${size === 'sm' ? '32px' : size === 'md' ? '48px' : '64px'})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Icon size={iconSizes[size]} className="text-white opacity-40" />
        </div>

        {/* Top Face */}
        <div 
          className={`cube-face ${faceSizes[size]}`}
          style={{
            position: 'absolute',
            background: 'linear-gradient(135deg, #0466C8 0%, #0353A4 100%)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            transform: `rotateX(90deg) translateZ(${size === 'sm' ? '32px' : size === 'md' ? '48px' : '64px'})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Icon size={iconSizes[size]} className="text-white opacity-60" />
        </div>

        {/* Bottom Face */}
        <div 
          className={`cube-face ${faceSizes[size]}`}
          style={{
            position: 'absolute',
            background: 'linear-gradient(135deg, #023E7D 0%, #001845 100%)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            transform: `rotateX(-90deg) translateZ(${size === 'sm' ? '32px' : size === 'md' ? '48px' : '64px'})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Icon size={iconSizes[size]} className="text-white opacity-30" />
        </div>
      </motion.div>

      {/* Particles on unlock */}
      {isUnlocked && unlockOnHover && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full"
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{
                x: Math.cos((i * Math.PI * 2) / 8) * 60,
                y: Math.sin((i * Math.PI * 2) / 8) * 60,
                scale: 0,
                opacity: 0
              }}
              transition={{ duration: 0.8 }}
              style={{
                top: '50%',
                left: '50%',
                marginTop: '-4px',
                marginLeft: '-4px'
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
}
