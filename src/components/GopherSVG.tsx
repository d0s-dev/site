import { motion } from "framer-motion";

export function GopherSVG() {
  return (
    <motion.svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{ 
        y: [0, -5, 0],
        rotate: [0, 2, 0, -2, 0]
      }}
      transition={{ 
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Gopher body - blue tinted */}
      <ellipse cx="100" cy="120" rx="50" ry="45" fill="#4dd4ff" />
      
      {/* Head */}
      <circle cx="100" cy="70" r="35" fill="#4dd4ff" />
      
      {/* Eyes */}
      <circle cx="88" cy="65" r="5" fill="#1a1a1a" />
      <circle cx="112" cy="65" r="5" fill="#1a1a1a" />
      <circle cx="90" cy="63" r="2" fill="#ffffff" />
      <circle cx="114" cy="63" r="2" fill="#ffffff" />
      
      {/* Nose */}
      <ellipse cx="100" cy="75" rx="4" ry="3" fill="#1a1a1a" />
      
      {/* Smile */}
      <path
        d="M 95 78 Q 100 82 105 78"
        stroke="#1a1a1a"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Ears */}
      <ellipse cx="70" cy="55" rx="12" ry="18" fill="#4dd4ff" />
      <ellipse cx="130" cy="55" rx="12" ry="18" fill="#4dd4ff" />
      
      {/* Left arm - waving */}
      <motion.g
        animate={{ rotate: [0, -30, 0, -30, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "65px 100px" }}
      >
        <ellipse cx="60" cy="110" rx="12" ry="30" fill="#4dd4ff" transform="rotate(-20 60 110)" />
        <ellipse cx="48" cy="105" rx="8" ry="10" fill="#4dd4ff" />
      </motion.g>
      
      {/* Right arm */}
      <ellipse cx="140" cy="110" rx="12" ry="30" fill="#4dd4ff" transform="rotate(20 140 110)" />
      <ellipse cx="152" cy="115" rx="8" ry="10" fill="#4dd4ff" />
      
      {/* Feet */}
      <ellipse cx="85" cy="160" rx="15" ry="10" fill="#4dd4ff" />
      <ellipse cx="115" cy="160" rx="15" ry="10" fill="#4dd4ff" />
      
      {/* Deploy icon - Kubernetes style */}
      <motion.g
        animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <path
          d="M 150 75 L 158 80 L 158 90 L 150 95 L 142 90 L 142 80 Z"
          fill="#00bfff"
          stroke="#ffffff"
          strokeWidth="1.5"
        />
        <circle cx="150" cy="85" r="3" fill="#ffffff" />
      </motion.g>
    </motion.svg>
  );
}
