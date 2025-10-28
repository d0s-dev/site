import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Cube3D } from './Cube3D';
import { MacTerminal } from './MacTerminal';
import { AnimatedCounter } from './AnimatedCounter';
import { DemoReel } from './DemoReel';
import { ParticleButton } from './ParticleButton';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Rocket, 
  Settings, 
  Smartphone, 
  Lock, 
  Cloud, 
  Puzzle, 
  Globe, 
  Terminal as TerminalIcon, 
  LineChart,
  Check,
  X,
  Copy,
  ChevronRight,
  Shield,
  Zap,
  Package
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';

export function LandingPage() {
  const [showInstallDialog, setShowInstallDialog] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!', {
        duration: 2000,
      });
    } catch (err) {
      // Fallback for environments where clipboard API is blocked
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success('Copied to clipboard!', {
          duration: 2000,
        });
      } catch (e) {
        toast.error('Failed to copy. Please copy manually.', {
          duration: 3000,
        });
      }
      document.body.removeChild(textArea);
    }
  };

  const features = [
    {
      icon: 'rocket' as const,
      title: '1-Click Speed',
      description: 'Deploy/update/secure apps instantly.',
      color: '#0466C8'
    },
    {
      icon: 'settings' as const,
      title: 'Opt-in Mutations',
      description: 'Zarf upgrades, no namespace chaos.',
      color: '#0353A4'
    },
    {
      icon: 'smartphone' as const,
      title: 'Edge-Lightweight',
      description: 'RPi-ready, dev-to-edge.',
      color: '#023E7D'
    },
    {
      icon: 'lock' as const,
      title: 'Secure Bundles',
      description: 'Zarf-packages: Controlled, compliant.',
      color: '#0466C8',
      glow: true
    },
    {
      icon: 'cloud' as const,
      title: 'Offline/Hybrid',
      description: 'Air-gapped or cloud – seamless.',
      color: '#0353A4'
    },
    {
      icon: 'puzzle' as const,
      title: 'Modular Catalog',
      description: 'Mix apps, future-proof.',
      color: '#023E7D'
    },
    {
      icon: 'globe' as const,
      title: 'Cloud-Agnostic',
      description: 'K3s/Kind → EKS/GKE.',
      color: '#0466C8'
    },
    {
      icon: 'terminal' as const,
      title: 'CLI/TUI Mastery',
      description: 'Zero YAML, K8s-native.',
      color: '#0353A4'
    },
    {
      icon: 'chart' as const,
      title: 'O&M Excellence',
      description: 'Live SBOM/CVEs, auto-scans.',
      color: '#023E7D'
    }
  ];

  const comparison = [
    { feature: 'Deployment Speed', d0s: '10s', manual: '30min+', bigbang: '15min', cnoe: '20min' },
    { feature: 'Offline Support', d0s: true, manual: false, bigbang: false, cnoe: false },
    { feature: 'Footprint', d0s: '20Mi', manual: 'N/A', bigbang: '500Mi+', cnoe: '300Mi+' },
    { feature: 'Built-in Integrations', d0s: true, manual: false, bigbang: true, cnoe: true },
    { feature: 'Air-Gap Ready', d0s: true, manual: false, bigbang: false, cnoe: false },
  ];

  const catalogApps = [
    { name: 'Nginx', icon: 'rocket' as const, vulnerabilities: 0 },
    { name: 'Keycloak', icon: 'lock' as const, vulnerabilities: 2 },
    { name: 'PostgreSQL', icon: 'globe' as const, vulnerabilities: 1 },
    { name: 'PLG Stack', icon: 'chart' as const, vulnerabilities: 0 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 md:px-8">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(4, 102, 200, 0.1) 0%, transparent 50%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.h1 
                className="text-6xl md:text-7xl lg:text-8xl mb-6 text-white"
                style={{ 
                  textShadow: '0 0 40px rgba(4, 102, 200, 0.5)',
                  fontFamily: 'JetBrains Mono, monospace'
                }}
              >
                Deploy <span className="gradient-text">Secure</span>
              </motion.h1>
              <p className="text-2xl md:text-3xl lg:text-4xl mb-8 text-foreground">
                1-Click K8s Deploys: Laptop → DoD Air-Gapped
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="relative overflow-hidden group shadow-lg hover:shadow-2xl hover:shadow-primary/50 transition-shadow duration-300"
                    style={{
                      background: 'linear-gradient(135deg, #0466C8 0%, #023E7D 50%, #0353A4 100%)',
                    }}
                    onClick={() => setShowInstallDialog(true)}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.5 }}
                      style={{ opacity: 0.1 }}
                    />
                    <motion.div
                      className="absolute inset-0"
                      animate={{
                        boxShadow: [
                          '0 0 20px rgba(4, 102, 200, 0.3)',
                          '0 0 40px rgba(4, 102, 200, 0.5)',
                          '0 0 20px rgba(4, 102, 200, 0.3)',
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                    <span className="relative z-10">Get CLI</span>
                    <ChevronRight className="ml-2 h-4 w-4 relative z-10" />
                  </Button>
                </motion.div>
                <ParticleButton
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Deploy First Cube
                  <Package className="ml-2 h-4 w-4" />
                </ParticleButton>
              </div>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                <Badge variant="outline" className="border-primary text-primary">
                  <Shield className="w-3 h-3 mr-1" />
                  DoD Compliant
                </Badge>
                <Badge variant="outline" className="border-primary text-primary">
                  <Zap className="w-3 h-3 mr-1" />
                  20Mi Footprint
                </Badge>
                <Badge variant="outline" className="border-primary text-primary">
                  <Package className="w-3 h-3 mr-1" />
                  Zarf-Ready
                </Badge>
              </div>
            </motion.div>

            {/* Right: 3D Cube Stack */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="flex justify-center items-center"
            >
              <div className="relative">
                {/* Stack of 3D Cubes */}
                <motion.div
                  style={{ y }}
                  className="flex flex-col items-center gap-8"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Cube3D icon="lock" size="lg" floating glowing unlockOnHover />
                  </motion.div>
                  <div className="flex gap-8">
                    <motion.div
                      whileHover={{ scale: 1.15, y: -10 }}
                      whileTap={{ scale: 0.85 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Cube3D icon="rocket" size="md" floating />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.15, y: -10 }}
                      whileTap={{ scale: 0.85 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Cube3D icon="settings" size="md" floating />
                    </motion.div>
                  </div>
                  <div className="flex gap-8">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      whileTap={{ scale: 0.8, rotate: -10 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Cube3D icon="cloud" size="sm" floating />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: -10 }}
                      whileTap={{ scale: 0.8, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Cube3D icon="globe" size="sm" floating />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      whileTap={{ scale: 0.8, rotate: -10 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Cube3D icon="puzzle" size="sm" floating />
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Terminal at bottom of hero */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 max-w-3xl mx-auto"
          >
            <MacTerminal
              commands={[
                { input: 'd0s init k3s', output: '[✓] Cluster ready' },
                { input: 'd0s deploy nginx --offline', output: '🚀 Live in 10s | Secure Bundle Locked' },
                { input: 'd0s scan --sbom', output: '✓ All packages verified | 0 CVEs detected' },
              ]}
              loop
            />
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 md:px-8 relative overflow-hidden">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl mb-4 text-white">
              Why Choose <span className="gradient-text">d0s</span>?
            </h2>
            <p className="text-xl text-foreground max-w-2xl mx-auto">
              Secure, lightweight, and blazing fast Kubernetes deployments
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="relative group"
              >
                <div 
                  className="bg-card border border-border rounded-xl p-6 h-full hover:border-primary transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #33415C 0%, #2a3548 100%)',
                  }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">
                      <Cube3D 
                        icon={feature.icon} 
                        size="sm" 
                        unlockOnHover={feature.icon === 'lock'}
                        glowing={feature.glow}
                      />
                    </div>
                    <h3 className="text-xl mb-2 text-white">{feature.title}</h3>
                    <p className="text-foreground">{feature.description}</p>
                  </div>
                  {feature.glow && (
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: 'linear-gradient(135deg, rgba(4, 102, 200, 0.1) 0%, rgba(2, 62, 125, 0.1) 100%)',
                        filter: 'blur(20px)',
                      }}
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 px-4 md:px-8 bg-card/30">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl mb-4 text-white">
              d0s vs. The Rest
            </h2>
            <p className="text-xl text-foreground">
              See why d0s is the superior choice for Kubernetes deployments
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="overflow-x-auto"
          >
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-foreground">Feature</th>
                  <th className="text-center p-4 text-primary">d0s</th>
                  <th className="text-center p-4 text-muted-foreground">Manual</th>
                  <th className="text-center p-4 text-muted-foreground">BigBang</th>
                  <th className="text-center p-4 text-muted-foreground">CNOE</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, index) => (
                  <motion.tr
                    key={row.feature}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="border-b border-border hover:bg-card/50 transition-colors"
                  >
                    <td className="p-4 text-white">{row.feature}</td>
                    <td className="text-center p-4">
                      {typeof row.d0s === 'boolean' ? (
                        row.d0s ? (
                          <Check className="inline text-primary" />
                        ) : (
                          <X className="inline text-muted-foreground" />
                        )
                      ) : (
                        <span className="text-primary font-mono">{row.d0s}</span>
                      )}
                    </td>
                    <td className="text-center p-4">
                      {typeof row.manual === 'boolean' ? (
                        row.manual ? (
                          <Check className="inline text-muted-foreground" />
                        ) : (
                          <X className="inline text-muted-foreground" />
                        )
                      ) : (
                        <span className="text-muted-foreground font-mono">{row.manual}</span>
                      )}
                    </td>
                    <td className="text-center p-4">
                      {typeof row.bigbang === 'boolean' ? (
                        row.bigbang ? (
                          <Check className="inline text-muted-foreground" />
                        ) : (
                          <X className="inline text-muted-foreground" />
                        )
                      ) : (
                        <span className="text-muted-foreground font-mono">{row.bigbang}</span>
                      )}
                    </td>
                    <td className="text-center p-4">
                      {typeof row.cnoe === 'boolean' ? (
                        row.cnoe ? (
                          <Check className="inline text-muted-foreground" />
                        ) : (
                          <X className="inline text-muted-foreground" />
                        )
                      ) : (
                        <span className="text-muted-foreground font-mono">{row.cnoe}</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* Demo Reel */}
      <section className="py-24 px-4 md:px-8">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl mb-4 text-white">
              See It In <span className="gradient-text">Action</span>
            </h2>
            <p className="text-xl text-foreground">
              From build to deploy to scan in seconds
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <DemoReel />
          </motion.div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-24 px-4 md:px-8 bg-card/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: 1000, suffix: '+', label: 'GitHub Stars' },
              { value: 50, suffix: '+', label: 'Secure Cubes' },
              { value: 99.9, suffix: '%', label: 'Uptime' },
              { value: 10, suffix: 's', label: 'Deploy Time' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl text-white mb-2">
                  <AnimatedCounter 
                    end={stat.value} 
                    suffix={stat.suffix}
                    className="gradient-text"
                  />
                </div>
                <div className="text-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog Tease */}
      <section className="py-24 px-4 md:px-8">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl mb-4 text-white">
              Explore the <span className="gradient-text">Catalog</span>
            </h2>
            <p className="text-xl text-foreground">
              Pre-secured, ready-to-deploy application packages
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {catalogApps.map((app, index) => (
              <motion.div
                key={app.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="bg-card border border-border rounded-xl p-6 text-center hover:border-primary transition-all cursor-pointer"
              >
                <div className="flex justify-center mb-4">
                  <Cube3D icon={app.icon} size="sm" />
                </div>
                <h3 className="text-xl mb-2 text-white">{app.name}</h3>
                <Badge 
                  variant={app.vulnerabilities === 0 ? 'default' : 'destructive'}
                  className={app.vulnerabilities === 0 ? 'bg-green-600' : ''}
                >
                  {app.vulnerabilities === 0 ? (
                    <>
                      <Lock className="w-3 h-3 mr-1" />
                      Secure
                    </>
                  ) : (
                    `${app.vulnerabilities} CVEs`
                  )}
                </Badge>
                <Button variant="ghost" className="mt-4 w-full text-primary hover:bg-primary/10">
                  Deploy Now
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section 
        className="py-32 px-4 md:px-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0466C8 0%, #023E7D 50%, #0353A4 100%)',
        }}
      >
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl mb-6 text-white">
              Unlock Your First Cube
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Get started with d0s in seconds
            </p>
            
            <div className="bg-background/90 backdrop-blur-lg rounded-xl p-6 mb-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <code className="text-sm md:text-base font-mono text-primary flex-1 text-left">
                  curl -sSL https://d0s.dev/install | sh
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard('curl -sSL https://d0s.dev/install | sh')}
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
              <MacTerminal
                commands={[
                  { input: 'curl -sSL https://d0s.dev/install | sh', output: '✓ d0s installed successfully' },
                  { input: 'd0s --version', output: 'd0s v1.0.0' },
                  { input: 'd0s init', output: '🚀 Ready to deploy!' },
                ]}
                loop
              />
            </div>
          </motion.div>
        </div>

        {/* Background animation */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </section>

      {/* Install Dialog */}
      <Dialog open={showInstallDialog} onOpenChange={setShowInstallDialog}>
        <DialogContent 
          className="border-primary/30"
          style={{
            background: 'rgba(0, 18, 51, 0.7)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px 0 rgba(4, 102, 200, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-white">Install d0s CLI</DialogTitle>
            <DialogDescription className="text-foreground/90">
              Quick installation instructions for d0s
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm mb-2 text-white">macOS / Linux</h4>
              <div 
                className="rounded-lg p-4 flex items-center justify-between gap-4"
                style={{
                  background: 'rgba(0, 18, 51, 0.5)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(92, 103, 125, 0.3)',
                }}
              >
                <code className="text-sm font-mono text-primary">
                  curl -sSL https://d0s.dev/install | sh
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard('curl -sSL https://d0s.dev/install | sh')}
                  className="hover:bg-primary/20"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <h4 className="text-sm mb-2 text-white">Windows (PowerShell)</h4>
              <div 
                className="rounded-lg p-4 flex items-center justify-between gap-4"
                style={{
                  background: 'rgba(0, 18, 51, 0.5)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(92, 103, 125, 0.3)',
                }}
              >
                <code className="text-sm font-mono text-primary">
                  iwr https://d0s.dev/install.ps1 | iex
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard('iwr https://d0s.dev/install.ps1 | iex')}
                  className="hover:bg-primary/20"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
