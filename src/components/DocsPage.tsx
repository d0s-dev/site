import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronDown, Search, Book, Terminal as TerminalIcon, Wrench, Boxes, Code } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

export function DocsPage() {
  const [expandedSections, setExpandedSections] = useState<string[]>(['cli', 'tutorials']);
  const [selectedDoc, setSelectedDoc] = useState('installation');

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const sidebarNav = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Book,
      items: [
        { id: 'installation', title: 'Installation' },
        { id: 'quickstart', title: 'Quick Start' },
      ],
    },
    {
      id: 'cli',
      title: 'CLI Commands',
      icon: TerminalIcon,
      items: [
        { id: 'init', title: 'd0s init' },
        { id: 'build', title: 'd0s build' },
        { id: 'deploy', title: 'd0s deploy' },
        { id: 'get', title: 'd0s get' },
        { id: 'delete', title: 'd0s delete' },
      ],
    },
    {
      id: 'tutorials',
      title: 'Tutorials',
      icon: Wrench,
      items: [
        { id: 'offline-mode', title: 'Offline Mode' },
        { id: 'custom-apps', title: 'Custom Apps' },
      ],
    },
    {
      id: 'integrations',
      title: 'Integrations',
      icon: Boxes,
      items: [
        { id: 'zarf', title: 'Zarf' },
        { id: 'crossplane', title: 'Crossplane' },
      ],
    },
    {
      id: 'api',
      title: 'API Reference',
      icon: Code,
      items: [
        { id: 'api-overview', title: 'Overview' },
      ],
    },
  ];

  const docContent = {
    installation: {
      title: 'Installation',
      content: [
        {
          type: 'text',
          content: 'Get started with d0s in seconds. Choose your preferred installation method.',
        },
        {
          type: 'heading',
          content: 'Quick Install',
        },
        {
          type: 'text',
          content: 'Run the following command to install d0s:',
        },
        {
          type: 'code',
          language: 'bash',
          content: 'curl -sSfL get.d0s.dev | sh',
        },
        {
          type: 'heading',
          content: 'Go Install',
        },
        {
          type: 'text',
          content: 'If you have Go installed, you can install d0s using:',
        },
        {
          type: 'code',
          language: 'bash',
          content: 'go install github.com/d0s-dev/d0s/cmd/d0s@latest',
        },
        {
          type: 'heading',
          content: 'Verify Installation',
        },
        {
          type: 'code',
          language: 'bash',
          content: 'd0s version',
        },
      ],
    },
    deploy: {
      title: 'd0s deploy',
      content: [
        {
          type: 'text',
          content: 'Deploy applications to your Kubernetes cluster with a single command.',
        },
        {
          type: 'heading',
          content: 'Basic Usage',
        },
        {
          type: 'code',
          language: 'bash',
          content: 'd0s deploy <app-name> [flags]',
        },
        {
          type: 'heading',
          content: 'Examples',
        },
        {
          type: 'code',
          language: 'bash',
          content: `# Deploy nginx
d0s deploy nginx

# Deploy in offline mode
d0s deploy nginx --offline

# Deploy with custom namespace
d0s deploy postgres --namespace production`,
        },
        {
          type: 'heading',
          content: 'Flags',
        },
        {
          type: 'table',
          headers: ['Flag', 'Description', 'Default'],
          rows: [
            ['--offline', 'Use offline bundle', 'false'],
            ['--namespace', 'Target namespace', 'default'],
            ['--wait', 'Wait for deployment', 'true'],
          ],
        },
      ],
    },
    'custom-apps': {
      title: 'Custom d0s.yaml',
      content: [
        {
          type: 'text',
          content: 'Create custom application packages with the d0s.yaml configuration file.',
        },
        {
          type: 'heading',
          content: 'Configuration Format',
        },
        {
          type: 'code',
          language: 'yaml',
          content: `name: my-app
version: 1.0.0
description: My custom application

integrations:
  - name: zarf
    enabled: true
  - name: security
    enabled: true
    
components:
  - name: frontend
    images:
      - nginx:latest
    manifests:
      - frontend.yaml
      
  - name: backend
    images:
      - node:18
    manifests:
      - backend.yaml`,
        },
      ],
    },
  };

  const renderContent = (doc: typeof docContent.installation) => {
    return (
      <div className="space-y-6">
        <h1 className="text-white border-b-2 border-[#00bfff] inline-block pb-2">
          {doc.title}
        </h1>
        
        {doc.content.map((block, index) => {
          switch (block.type) {
            case 'text':
              return (
                <p key={index} className="text-[#f0f0f0]">
                  {block.content}
                </p>
              );
            case 'heading':
              return (
                <h3 key={index} className="text-white mt-8">
                  {block.content}
                </h3>
              );
            case 'code':
              return (
                <div key={index} className="bg-[#0d0d0d] rounded-lg border border-white/10 p-4 overflow-x-auto">
                  <pre className="font-['JetBrains_Mono',monospace] text-[#f0f0f0]">
                    {block.content}
                  </pre>
                </div>
              );
            case 'table':
              return (
                <div key={index} className="overflow-x-auto">
                  <table className="w-full border border-white/10 rounded-lg overflow-hidden">
                    <thead className="bg-[#2d2d2d]">
                      <tr>
                        {block.headers?.map((header, i) => (
                          <th key={i} className="px-4 py-2 text-left text-[#f0f0f0] border-b border-white/10">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows?.map((row, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-[#2d2d2d]/50">
                          {row.map((cell, j) => (
                            <td key={j} className="px-4 py-2 text-[#888888] font-['JetBrains_Mono',monospace]">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            default:
              return null;
          }
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-80 bg-[#0d0d0d] border-r border-white/10 min-h-screen sticky top-16 hidden lg:block">
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="p-6">
              <div className="mb-6">
                <Input
                  type="search"
                  placeholder="Search docs..."
                  className="bg-[#1a1a1a] border-white/10 text-[#f0f0f0] placeholder:text-[#888888]"
                />
              </div>

              <nav className="space-y-1">
                {sidebarNav.map((section) => (
                  <div key={section.id}>
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between px-3 py-2 text-[#f0f0f0] hover:bg-[#2d2d2d] rounded transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <section.icon className="w-4 h-4" />
                        <span>{section.title}</span>
                      </div>
                      {expandedSections.includes(section.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>

                    {expandedSections.includes(section.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="ml-6 mt-1 space-y-1"
                      >
                        {section.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setSelectedDoc(item.id)}
                            className={`w-full text-left px-3 py-1.5 rounded transition-colors ${
                              selectedDoc === item.id
                                ? 'bg-[#00bfff]/10 text-[#00bfff]'
                                : 'text-[#888888] hover:text-[#f0f0f0] hover:bg-[#2d2d2d]'
                            }`}
                          >
                            {item.title}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Version switcher */}
              <div className="mb-8 flex items-center justify-between">
                <div className="text-[#888888]">
                  d0s.dev Documentation
                </div>
                <select className="bg-[#2d2d2d] border border-white/10 rounded px-3 py-1 text-[#f0f0f0]">
                  <option>v0.1.0</option>
                  <option>main</option>
                </select>
              </div>

              {renderContent(docContent[selectedDoc as keyof typeof docContent] || docContent.installation)}

              {/* Navigation footer */}
              <div className="mt-16 pt-8 border-t border-white/10 flex justify-between">
                <Button variant="outline" className="border-white/10 text-[#888888]">
                  Previous
                </Button>
                <Button className="bg-gradient-to-r from-[#00bfff] to-[#0099cc] text-white">
                  Next
                </Button>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
