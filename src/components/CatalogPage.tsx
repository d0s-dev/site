import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Copy, Check, AlertCircle, Shield, Package, Database, Lock, Server, Globe, Image as ImageIcon, ChevronLeft } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { GopherSVG } from "./GopherSVG";
import { VulnerabilityBar } from "./VulnerabilityBar";

interface ImageData {
  name: string;
  digest: string;
  size: string;
  cves: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  packages: Array<{
    name: string;
    version: string;
    license: string;
  }>;
  vulnerabilities: Array<{
    id: string;
    severity: string;
    package: string;
    version: string;
    fixedVersion?: string;
    description: string;
  }>;
}

interface App {
  id: string;
  name: string;
  icon: any;
  version: string;
  category: string;
  description: string;
  dependencies?: string[];
  cves: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  packages: string[];
  images: ImageData[];
}

export function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [copiedCommand, setCopiedCommand] = useState(false);

  // This data structure is compatible with loading from JSON files
  // Future: Load from GitHub repo like: fetch('https://raw.githubusercontent.com/d0s-dev/catalog/main/apps.json')
  const apps: App[] = [
    {
      id: 'nginx',
      name: 'Nginx',
      icon: Server,
      version: '1.25.0',
      category: 'web',
      description: 'High-performance web server and reverse proxy',
      dependencies: [],
      cves: { critical: 0, high: 1, medium: 3, low: 5 },
      packages: ['nginx', 'openssl', 'pcre'],
      images: [
        {
          name: 'nginx:1.25.0-alpine',
          digest: 'sha256:abc123...',
          size: '23.4 MB',
          cves: { critical: 0, high: 1, medium: 2, low: 3 },
          packages: [
            { name: 'nginx', version: '1.25.0', license: 'BSD-2-Clause' },
            { name: 'openssl', version: '3.1.0', license: 'Apache-2.0' },
            { name: 'pcre', version: '8.45', license: 'BSD' },
          ],
          vulnerabilities: [
            {
              id: 'CVE-2024-1234',
              severity: 'high',
              package: 'openssl',
              version: '3.1.0',
              fixedVersion: '3.1.4',
              description: 'Buffer overflow vulnerability in SSL/TLS implementation',
            },
          ],
        },
        {
          name: 'nginx:1.25.0',
          digest: 'sha256:def456...',
          size: '142.8 MB',
          cves: { critical: 0, high: 0, medium: 1, low: 2 },
          packages: [
            { name: 'nginx', version: '1.25.0', license: 'BSD-2-Clause' },
            { name: 'openssl', version: '3.1.4', license: 'Apache-2.0' },
          ],
          vulnerabilities: [],
        },
      ],
    },
    {
      id: 'postgres',
      name: 'PostgreSQL',
      icon: Database,
      version: '15.3',
      category: 'database',
      description: 'Advanced open source relational database',
      dependencies: [],
      cves: { critical: 0, high: 0, medium: 2, low: 4 },
      packages: ['postgresql', 'libpq', 'openssl'],
      images: [
        {
          name: 'postgres:15.3-alpine',
          digest: 'sha256:ghi789...',
          size: '87.2 MB',
          cves: { critical: 0, high: 0, medium: 2, low: 4 },
          packages: [
            { name: 'postgresql', version: '15.3', license: 'PostgreSQL' },
            { name: 'libpq', version: '15.3', license: 'PostgreSQL' },
          ],
          vulnerabilities: [],
        },
      ],
    },
    {
      id: 'vault',
      name: 'Vault',
      icon: Lock,
      version: '1.15.0',
      category: 'security',
      description: 'Secure secrets management',
      dependencies: [],
      cves: { critical: 0, high: 0, medium: 1, low: 2 },
      packages: ['vault', 'consul'],
      images: [
        {
          name: 'vault:1.15.0',
          digest: 'sha256:jkl012...',
          size: '156.3 MB',
          cves: { critical: 0, high: 0, medium: 1, low: 2 },
          packages: [
            { name: 'vault', version: '1.15.0', license: 'MPL-2.0' },
            { name: 'consul', version: '1.17.0', license: 'MPL-2.0' },
          ],
          vulnerabilities: [],
        },
      ],
    },
    {
      id: 'keycloak',
      name: 'Keycloak',
      icon: Shield,
      version: '23.0.0',
      category: 'auth',
      description: 'Open source identity and access management',
      dependencies: ['postgres'],
      cves: { critical: 0, high: 2, medium: 4, low: 6 },
      packages: ['keycloak', 'java'],
      images: [
        {
          name: 'keycloak/keycloak:23.0.0',
          digest: 'sha256:mno345...',
          size: '428.1 MB',
          cves: { critical: 0, high: 2, medium: 4, low: 6 },
          packages: [
            { name: 'keycloak', version: '23.0.0', license: 'Apache-2.0' },
            { name: 'openjdk', version: '17.0.9', license: 'GPL-2.0' },
          ],
          vulnerabilities: [
            {
              id: 'CVE-2024-5678',
              severity: 'high',
              package: 'openjdk',
              version: '17.0.9',
              fixedVersion: '17.0.10',
              description: 'Security vulnerability in Java runtime',
            },
          ],
        },
      ],
    },
    {
      id: 'redis',
      name: 'Redis',
      icon: Database,
      version: '7.2.0',
      category: 'database',
      description: 'In-memory data structure store',
      dependencies: [],
      cves: { critical: 0, high: 0, medium: 1, low: 3 },
      packages: ['redis'],
      images: [
        {
          name: 'redis:7.2.0-alpine',
          digest: 'sha256:pqr678...',
          size: '29.1 MB',
          cves: { critical: 0, high: 0, medium: 1, low: 3 },
          packages: [
            { name: 'redis', version: '7.2.0', license: 'BSD-3-Clause' },
          ],
          vulnerabilities: [],
        },
      ],
    },
    {
      id: 'grafana',
      name: 'Grafana',
      icon: Globe,
      version: '10.2.0',
      category: 'monitoring',
      description: 'Analytics and monitoring platform',
      dependencies: [],
      cves: { critical: 1, high: 1, medium: 5, low: 8 },
      packages: ['grafana'],
      images: [
        {
          name: 'grafana/grafana:10.2.0',
          digest: 'sha256:stu901...',
          size: '298.7 MB',
          cves: { critical: 1, high: 0, medium: 3, low: 5 },
          packages: [
            { name: 'grafana', version: '10.2.0', license: 'AGPL-3.0' },
          ],
          vulnerabilities: [
            {
              id: 'CVE-2024-9999',
              severity: 'critical',
              package: 'grafana',
              version: '10.2.0',
              fixedVersion: '10.2.3',
              description: 'Authentication bypass vulnerability',
            },
          ],
        },
        {
          name: 'grafana/grafana:10.2.0-ubuntu',
          digest: 'sha256:vwx234...',
          size: '412.3 MB',
          cves: { critical: 0, high: 1, medium: 2, low: 3 },
          packages: [
            { name: 'grafana', version: '10.2.0', license: 'AGPL-3.0' },
          ],
          vulnerabilities: [],
        },
      ],
    },
  ];

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || app.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const copyCommand = (appName: string) => {
    navigator.clipboard.writeText(`d0s deploy ${appName.toLowerCase()}`);
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen pt-16 px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-white mb-4">App Catalog</h1>
          <p className="text-[#888888]">
            Browse & Deploy 1-Click Bundles – Scans & SBOMs Included
          </p>
        </motion.div>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#888888]" />
            <Input
              type="search"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#2d2d2d] border-white/10 text-[#f0f0f0] placeholder:text-[#888888]"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#2d2d2d] border border-white/10 rounded-md px-4 py-2 text-[#f0f0f0]"
          >
            <option value="all">All Categories</option>
            <option value="web">Web</option>
            <option value="database">Database</option>
            <option value="security">Security</option>
            <option value="auth">Authentication</option>
            <option value="monitoring">Monitoring</option>
          </select>
        </div>

        {/* Apps Grid */}
        {filteredApps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card className="bg-[#2d2d2d] border-white/10 p-6 h-full flex flex-col hover:border-[#00bfff]/50 transition-all hover:shadow-lg hover:shadow-[#00bfff]/10 cursor-pointer">
                  <div onClick={() => {
                    setSelectedApp(app);
                    setSelectedImage(null);
                  }}>
                    {/* Icon & Title */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#00bfff] to-[#0099cc] rounded-lg flex items-center justify-center flex-shrink-0">
                        <app.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white truncate">{app.name}</h3>
                        <p className="text-[#888888]">v{app.version}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[#888888] mb-4 line-clamp-2">
                      {app.description}
                    </p>

                    {/* Image Count */}
                    <div className="mb-4 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#888888]" />
                      <span className="text-[#888888]">
                        {app.images.length} {app.images.length === 1 ? 'image' : 'images'}
                      </span>
                    </div>

                    {/* Dependencies */}
                    {app.dependencies && app.dependencies.length > 0 && (
                      <div className="mb-4">
                        <Badge variant="outline" className="border-[#00bfff]/30 text-[#00bfff]">
                          Requires: {app.dependencies.join(', ')}
                        </Badge>
                      </div>
                    )}

                    {/* Vulnerability Bar */}
                    <div className="mb-2">
                      <VulnerabilityBar cves={app.cves} />
                    </div>
                  </div>

                  {/* Deploy Button */}
                  <div className="mt-auto pt-4 border-t border-white/5 flex gap-2">
                    <Button
                      onClick={() => {
                        setSelectedApp(app);
                        setSelectedImage(null);
                      }}
                      className="flex-1 bg-gradient-to-r from-[#00bfff] to-[#0099cc] hover:from-[#00d4ff] hover:to-[#00bfff] text-white"
                    >
                      Deploy
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyCommand(app.name);
                      }}
                      variant="outline"
                      size="icon"
                      className="border-white/10 hover:bg-[#00bfff]/10"
                    >
                      {copiedCommand ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="flex justify-center mb-6">
              <GopherSVG />
            </div>
            <h3 className="text-white mb-2">No apps found</h3>
            <p className="text-[#888888]">
              Build one with <code className="text-[#00bfff]">d0s build</code>!
            </p>
          </motion.div>
        )}
      </div>

      {/* App Detail Modal */}
      <AnimatePresence>
        {selectedApp && !selectedImage && (
          <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
            <DialogContent className="bg-[#2d2d2d] border-white/10 text-[#f0f0f0] max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-4 text-white">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#00bfff] to-[#0099cc] rounded-lg flex items-center justify-center">
                    <selectedApp.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div>{selectedApp.name}</div>
                    <div className="text-[#888888]">v{selectedApp.version}</div>
                  </div>
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Application details for {selectedApp.name} including overview, images, and deployment information
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="overview" className="mt-6">
                <TabsList className="bg-[#1a1a1a] border border-white/10">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-[#00bfff] data-[state=active]:text-white">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="images" className="data-[state=active]:bg-[#00bfff] data-[state=active]:text-white">
                    Images ({selectedApp.images.length})
                  </TabsTrigger>
                  <TabsTrigger value="details" className="data-[state=active]:bg-[#00bfff] data-[state=active]:text-white">
                    Details
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white mb-2">Description</h4>
                      <p className="text-[#888888]">{selectedApp.description}</p>
                    </div>

                    {selectedApp.dependencies && selectedApp.dependencies.length > 0 && (
                      <div>
                        <h4 className="text-white mb-2">Dependencies</h4>
                        <div className="flex gap-2">
                          {selectedApp.dependencies.map(dep => (
                            <Badge key={dep} variant="outline" className="border-[#00bfff]/30 text-[#00bfff]">
                              {dep}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="text-white mb-2">Overall Security Status</h4>
                      <VulnerabilityBar cves={selectedApp.cves} height="h-4" />
                      <div className="mt-2 flex gap-4 text-[#888888]">
                        <span>Critical: {selectedApp.cves.critical}</span>
                        <span>High: {selectedApp.cves.high}</span>
                        <span>Medium: {selectedApp.cves.medium}</span>
                        <span>Low: {selectedApp.cves.low}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white mb-2">Quick Deploy</h4>
                      <div className="bg-[#0d0d0d] rounded-lg border border-white/10 p-4 font-['JetBrains_Mono',monospace]">
                        <span className="text-[#00bfff]">$ </span>
                        <span className="text-[#f0f0f0]">d0s deploy {selectedApp.name.toLowerCase()}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="images" className="mt-6">
                  <div className="space-y-4">
                    <h4 className="text-white">Container Images</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {selectedApp.images.map((image, index) => (
                        <Card 
                          key={index} 
                          className="bg-[#1a1a1a] border-white/10 p-4 hover:border-[#00bfff]/50 transition-all cursor-pointer"
                          onClick={() => setSelectedImage(image)}
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#00bfff] to-[#0099cc] rounded flex items-center justify-center flex-shrink-0">
                              <ImageIcon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[#f0f0f0] mb-1 font-['JetBrains_Mono',monospace] break-all">
                                {image.name}
                              </div>
                              <div className="text-[#888888] mb-3">
                                Size: {image.size} • Digest: {image.digest.substring(0, 19)}...
                              </div>
                              <VulnerabilityBar cves={image.cves} height="h-3" />
                              <div className="mt-2 flex gap-3 text-[#888888]">
                                {image.cves.critical > 0 && <span className="text-red-500">C: {image.cves.critical}</span>}
                                {image.cves.high > 0 && <span className="text-orange-500">H: {image.cves.high}</span>}
                                {image.cves.medium > 0 && <span className="text-yellow-500">M: {image.cves.medium}</span>}
                                {image.cves.low > 0 && <span className="text-blue-500">L: {image.cves.low}</span>}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="mt-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white mb-2">Version</h4>
                      <p className="text-[#888888]">{selectedApp.version}</p>
                    </div>

                    <div>
                      <h4 className="text-white mb-2">Category</h4>
                      <Badge variant="outline" className="border-[#00bfff]/30 text-[#00bfff]">
                        {selectedApp.category}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="text-white mb-2">Total Images</h4>
                      <p className="text-[#888888]">{selectedApp.images.length}</p>
                    </div>

                    <div>
                      <h4 className="text-white mb-2">Environment Variables</h4>
                      <div className="bg-[#0d0d0d] rounded-lg border border-white/10 p-4 font-['JetBrains_Mono',monospace]">
                        <div className="text-[#888888]">No custom environment variables required</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 flex gap-3 justify-end border-t border-white/10 pt-6">
                <Button
                  variant="outline"
                  onClick={() => setSelectedApp(null)}
                  className="border-white/10"
                >
                  Close
                </Button>
                <Button className="bg-gradient-to-r from-[#00bfff] to-[#0099cc] hover:from-[#00d4ff] hover:to-[#00bfff] text-white">
                  Deploy {selectedApp.name}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Image Detail Modal */}
      <AnimatePresence>
        {selectedImage && selectedApp && (
          <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
            <DialogContent className="bg-[#2d2d2d] border-white/10 text-[#f0f0f0] max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-4 text-white">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedImage(null)}
                    className="hover:bg-[#1a1a1a]"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#00bfff] to-[#0099cc] rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-['JetBrains_Mono',monospace]">{selectedImage.name}</div>
                    <div className="text-[#888888]">{selectedImage.size}</div>
                  </div>
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Container image details for {selectedImage.name} including vulnerabilities, SBOM, and metadata
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 mb-6">
                <VulnerabilityBar cves={selectedImage.cves} height="h-4" />
              </div>

              <Tabs defaultValue="vulnerabilities" className="mt-6">
                <TabsList className="bg-[#1a1a1a] border border-white/10">
                  <TabsTrigger value="vulnerabilities" className="data-[state=active]:bg-[#00bfff] data-[state=active]:text-white">
                    Vulnerabilities ({selectedImage.vulnerabilities.length})
                  </TabsTrigger>
                  <TabsTrigger value="sbom" className="data-[state=active]:bg-[#00bfff] data-[state=active]:text-white">
                    SBOM ({selectedImage.packages.length})
                  </TabsTrigger>
                  <TabsTrigger value="details" className="data-[state=active]:bg-[#00bfff] data-[state=active]:text-white">
                    Details
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="vulnerabilities" className="mt-6">
                  <div className="space-y-4">
                    {selectedImage.vulnerabilities.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full border border-white/10 rounded-lg">
                          <thead className="bg-[#1a1a1a]">
                            <tr>
                              <th className="px-4 py-3 text-left text-[#f0f0f0] border-b border-white/10">CVE ID</th>
                              <th className="px-4 py-3 text-left text-[#f0f0f0] border-b border-white/10">Severity</th>
                              <th className="px-4 py-3 text-left text-[#f0f0f0] border-b border-white/10">Package</th>
                              <th className="px-4 py-3 text-left text-[#f0f0f0] border-b border-white/10">Version</th>
                              <th className="px-4 py-3 text-left text-[#f0f0f0] border-b border-white/10">Fixed In</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedImage.vulnerabilities.map((vuln, i) => (
                              <tr key={i} className="border-b border-white/5 hover:bg-[#1a1a1a]/50">
                                <td className="px-4 py-3 font-['JetBrains_Mono',monospace] text-[#00bfff]">
                                  {vuln.id}
                                </td>
                                <td className="px-4 py-3">
                                  <Badge className={`${
                                    vuln.severity === 'critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                    vuln.severity === 'high' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                    vuln.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                    'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                  }`}>
                                    {vuln.severity}
                                  </Badge>
                                </td>
                                <td className="px-4 py-3 text-[#f0f0f0] font-['JetBrains_Mono',monospace]">
                                  {vuln.package}
                                </td>
                                <td className="px-4 py-3 text-[#888888] font-['JetBrains_Mono',monospace]">
                                  {vuln.version}
                                </td>
                                <td className="px-4 py-3 text-[#888888] font-['JetBrains_Mono',monospace]">
                                  {vuln.fixedVersion || 'N/A'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        
                        <div className="mt-4 p-4 bg-[#1a1a1a] rounded-lg border border-white/10">
                          <h5 className="text-white mb-2">Vulnerability Details</h5>
                          {selectedImage.vulnerabilities.map((vuln, i) => (
                            <div key={i} className="mb-3 last:mb-0">
                              <div className="font-['JetBrains_Mono',monospace] text-[#00bfff] mb-1">
                                {vuln.id}
                              </div>
                              <p className="text-[#888888]">{vuln.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Shield className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h4 className="text-white mb-2">No vulnerabilities found</h4>
                        <p className="text-[#888888]">This image has no known CVEs</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="sbom" className="mt-6">
                  <div className="space-y-4">
                    <h4 className="text-white">Software Bill of Materials</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border border-white/10 rounded-lg">
                        <thead className="bg-[#1a1a1a]">
                          <tr>
                            <th className="px-4 py-3 text-left text-[#f0f0f0] border-b border-white/10">Package</th>
                            <th className="px-4 py-3 text-left text-[#f0f0f0] border-b border-white/10">Version</th>
                            <th className="px-4 py-3 text-left text-[#f0f0f0] border-b border-white/10">License</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedImage.packages.map((pkg, i) => (
                            <tr key={i} className="border-b border-white/5 hover:bg-[#1a1a1a]/50">
                              <td className="px-4 py-3 text-[#f0f0f0] font-['JetBrains_Mono',monospace]">
                                {pkg.name}
                              </td>
                              <td className="px-4 py-3 text-[#888888] font-['JetBrains_Mono',monospace]">
                                {pkg.version}
                              </td>
                              <td className="px-4 py-3 text-[#888888]">
                                {pkg.license}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="mt-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white mb-2">Image Name</h4>
                      <p className="text-[#888888] font-['JetBrains_Mono',monospace] break-all">
                        {selectedImage.name}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-white mb-2">Digest</h4>
                      <p className="text-[#888888] font-['JetBrains_Mono',monospace] break-all">
                        {selectedImage.digest}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-white mb-2">Size</h4>
                      <p className="text-[#888888]">{selectedImage.size}</p>
                    </div>

                    <div>
                      <h4 className="text-white mb-2">Security Summary</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="bg-[#1a1a1a] border-red-500/20 p-4 text-center">
                          <div className="text-red-500 mb-1">{selectedImage.cves.critical}</div>
                          <div className="text-[#888888]">Critical</div>
                        </Card>
                        <Card className="bg-[#1a1a1a] border-orange-500/20 p-4 text-center">
                          <div className="text-orange-500 mb-1">{selectedImage.cves.high}</div>
                          <div className="text-[#888888]">High</div>
                        </Card>
                        <Card className="bg-[#1a1a1a] border-yellow-500/20 p-4 text-center">
                          <div className="text-yellow-500 mb-1">{selectedImage.cves.medium}</div>
                          <div className="text-[#888888]">Medium</div>
                        </Card>
                        <Card className="bg-[#1a1a1a] border-blue-500/20 p-4 text-center">
                          <div className="text-blue-500 mb-1">{selectedImage.cves.low}</div>
                          <div className="text-[#888888]">Low</div>
                        </Card>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 flex gap-3 justify-end border-t border-white/10 pt-6">
                <Button
                  variant="outline"
                  onClick={() => setSelectedImage(null)}
                  className="border-white/10"
                >
                  Back to Images
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
