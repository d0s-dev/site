import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MacTerminal } from './MacTerminal';

const demoSteps = [
  {
    title: 'Build',
    commands: [
      { input: 'd0s package create nginx', output: '[✓] Package created: nginx-1.0.0.tar.zst' },
      { input: 'd0s package inspect nginx-1.0.0.tar.zst', output: '📦 Size: 45MB | Images: 2 | Signed: ✓' }
    ]
  },
  {
    title: 'Deploy',
    commands: [
      { input: 'd0s deploy nginx-1.0.0.tar.zst', output: '🚀 Deploying nginx...' },
      { input: '', output: '[✓] Deployment complete in 8.2s' }
    ]
  },
  {
    title: 'Scan',
    commands: [
      { input: 'd0s scan nginx --vulnerabilities', output: '🔍 Scanning for vulnerabilities...' },
      { input: '', output: '[✓] 0 Critical | 0 High | 2 Medium | 5 Low' }
    ]
  }
];

export function DemoReel() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="relative">
      {/* Step indicators */}
      <div className="flex justify-center gap-4 mb-8">
        {demoSteps.map((step, index) => (
          <motion.button
            key={step.title}
            onClick={() => setCurrentStep(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-lg transition-all ${
              currentStep === index
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'bg-card text-foreground hover:bg-card-surface'
            }`}
          >
            {step.title}
          </motion.button>
        ))}
      </div>

      {/* Terminal carousel */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(4, 102, 200, 0.2)',
              borderRadius: '12px',
              border: '1px solid rgba(4, 102, 200, 0.3)',
            }}
          >
            <MacTerminal
              commands={demoSteps[currentStep].commands}
              loop={false}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Step description */}
      <motion.div
        key={`desc-${currentStep}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="text-center mt-6 text-foreground"
      >
        <p className="text-lg">
          {currentStep === 0 && 'Create secure Zarf packages with all dependencies bundled'}
          {currentStep === 1 && 'Deploy to any Kubernetes cluster in seconds'}
          {currentStep === 2 && 'Automated security scanning and SBOM generation'}
        </p>
      </motion.div>
    </div>
  );
}
