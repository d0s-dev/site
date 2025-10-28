import { motion } from "framer-motion";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Server, 
  Shield, 
  TrendingUp,
  Package,
  Database,
  Lock
} from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function HeadlampPage() {
  const activeApps = [
    { name: 'nginx', status: 'running', cvesHigh: 1, cvesTotal: 9 },
    { name: 'postgres', status: 'running', cvesHigh: 0, cvesTotal: 6 },
    { name: 'vault', status: 'running', cvesHigh: 0, cvesTotal: 3 },
  ];

  const catalogApps = [
    { name: 'Redis', icon: Database, version: '7.2.0', category: 'Database' },
    { name: 'Keycloak', icon: Lock, version: '23.0.0', category: 'Auth' },
    { name: 'Grafana', icon: Activity, version: '10.2.0', category: 'Monitoring' },
  ];

  const cveData = [
    { date: 'Oct 20', critical: 0, high: 5, medium: 12 },
    { date: 'Oct 21', critical: 0, high: 4, medium: 11 },
    { date: 'Oct 22', critical: 0, high: 3, medium: 10 },
    { date: 'Oct 23', critical: 0, high: 2, medium: 9 },
    { date: 'Oct 24', critical: 0, high: 1, medium: 8 },
    { date: 'Oct 25', critical: 0, high: 1, medium: 7 },
    { date: 'Oct 26', critical: 0, high: 1, medium: 6 },
  ];

  return (
    <div className="min-h-screen pt-16 bg-[#1a1a1a]">
      <div className="flex">
        {/* Headlamp-style Sidebar */}
        <aside className="w-64 bg-[#0d0d0d] border-r border-white/10 min-h-screen">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#326ce5] rounded flex items-center justify-center">
                <Server className="w-5 h-5 text-white" />
              </div>
              <span className="text-white">Headlamp</span>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            <div className="text-[#888888] mb-2">Cluster</div>
            <button className="w-full text-left px-3 py-2 text-[#f0f0f0] hover:bg-[#2d2d2d] rounded">
              Overview
            </button>
            <button className="w-full text-left px-3 py-2 text-[#f0f0f0] hover:bg-[#2d2d2d] rounded">
              Workloads
            </button>
            <button className="w-full text-left px-3 py-2 text-[#f0f0f0] hover:bg-[#2d2d2d] rounded">
              Storage
            </button>

            <div className="text-[#888888] mt-6 mb-2">d0s</div>
            <button className="w-full text-left px-3 py-2 bg-[#00bfff]/10 text-[#00bfff] rounded border-l-2 border-[#00bfff]">
              Dashboard
            </button>
            <button className="w-full text-left px-3 py-2 text-[#f0f0f0] hover:bg-[#2d2d2d] rounded">
              Catalog
            </button>
            <button className="w-full text-left px-3 py-2 text-[#f0f0f0] hover:bg-[#2d2d2d] rounded">
              Security Scans
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-white mb-8">d0s Dashboard</h1>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-[#2d2d2d] border-white/10 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#888888]">Active Apps</span>
                  <Activity className="w-5 h-5 text-[#00bfff]" />
                </div>
                <div className="text-white mb-1">3</div>
                <div className="text-green-500 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>All Running</span>
                </div>
              </Card>

              <Card className="bg-[#2d2d2d] border-white/10 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#888888]">Critical CVEs</span>
                  <Shield className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-white mb-1">0</div>
                <div className="text-green-500 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Secure</span>
                </div>
              </Card>

              <Card className="bg-[#2d2d2d] border-white/10 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#888888]">High CVEs</span>
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                </div>
                <div className="text-white mb-1">1</div>
                <div className="text-orange-500 flex items-center gap-1">
                  <span>Needs Attention</span>
                </div>
              </Card>

              <Card className="bg-[#2d2d2d] border-white/10 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#888888]">Total Scanned</span>
                  <Package className="w-5 h-5 text-[#00bfff]" />
                </div>
                <div className="text-white mb-1">18</div>
                <div className="text-[#888888]">Packages</div>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="apps" className="mb-8">
              <TabsList className="bg-[#2d2d2d] border border-white/10">
                <TabsTrigger value="apps" className="data-[state=active]:bg-[#00bfff] data-[state=active]:text-white">
                  Deployed Apps
                </TabsTrigger>
                <TabsTrigger value="catalog" className="data-[state=active]:bg-[#00bfff] data-[state=active]:text-white">
                  Catalog
                </TabsTrigger>
                <TabsTrigger value="security" className="data-[state=active]:bg-[#00bfff] data-[state=active]:text-white">
                  Security
                </TabsTrigger>
              </TabsList>

              <TabsContent value="apps" className="mt-6">
                <Card className="bg-[#2d2d2d] border-white/10">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-white/10">
                        <tr>
                          <th className="text-left p-4 text-[#f0f0f0]">Application</th>
                          <th className="text-left p-4 text-[#f0f0f0]">Status</th>
                          <th className="text-left p-4 text-[#f0f0f0]">CVEs</th>
                          <th className="text-left p-4 text-[#f0f0f0]">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeApps.map((app) => (
                          <tr key={app.name} className="border-b border-white/5 hover:bg-[#1a1a1a]">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-[#00bfff] to-[#0099cc] rounded flex items-center justify-center">
                                  <Server className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-[#f0f0f0]">{app.name}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                {app.status}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                {app.cvesHigh > 0 && (
                                  <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                                    {app.cvesHigh} High
                                  </Badge>
                                )}
                                <span className="text-[#888888]">{app.cvesTotal} total</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <Button variant="outline" size="sm" className="border-white/10 hover:bg-[#00bfff]/10">
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="catalog" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {catalogApps.map((app) => (
                    <Card key={app.name} className="bg-[#2d2d2d] border-white/10 p-6 hover:border-[#00bfff]/50 transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#00bfff] to-[#0099cc] rounded-lg flex items-center justify-center">
                          <app.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white">{app.name}</h4>
                          <p className="text-[#888888]">v{app.version}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-[#00bfff]/30 text-[#00bfff] mb-4">
                        {app.category}
                      </Badge>
                      <Button className="w-full bg-gradient-to-r from-[#00bfff] to-[#0099cc] hover:from-[#00d4ff] hover:to-[#00bfff] text-white">
                        Deploy
                      </Button>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="security" className="mt-6">
                <Card className="bg-[#2d2d2d] border-white/10 p-6">
                  <h3 className="text-white mb-6">CVE Trend (Last 7 Days)</h3>
                  
                  {/* Simple line chart visualization */}
                  <div className="h-64 flex items-end justify-between gap-2 mb-6">
                    {cveData.map((day, i) => {
                      const total = day.critical + day.high + day.medium;
                      const maxTotal = 17;
                      const height = (total / maxTotal) * 100;
                      
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                          <div className="w-full flex flex-col justify-end" style={{ height: '200px' }}>
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${height}%` }}
                              transition={{ duration: 0.5, delay: i * 0.1 }}
                              className="bg-gradient-to-t from-[#00bfff] to-[#0099cc] rounded-t"
                            />
                          </div>
                          <span className="text-[#888888]">{day.date.split(' ')[1]}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-orange-500 rounded-full" />
                        <span className="text-[#f0f0f0]">High Severity Issues</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[#888888]">1 active</span>
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                          Fix Now
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span className="text-[#f0f0f0]">Critical Severity Issues</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-green-500 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          0 active
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Quick Deploy */}
            <Card className="bg-gradient-to-r from-[#00bfff]/10 to-[#0099cc]/10 border-[#00bfff]/30 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white mb-2">Quick Deploy</h3>
                  <p className="text-[#888888]">Deploy new applications directly from Headlamp</p>
                </div>
                <Button className="bg-gradient-to-r from-[#00bfff] to-[#0099cc] hover:from-[#00d4ff] hover:to-[#00bfff] text-white">
                  Browse Catalog
                </Button>
              </div>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
