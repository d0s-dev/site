import { Github, Package, Users } from "lucide-react";
import { Button } from "./ui/button";

export function Footer() {
  return (
    <footer className="bg-[#001233] border-t border-[#002855] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div 
                className="w-10 h-10 rounded flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #0466C8 0%, #023E7D 100%)',
                }}
              >
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-mono" style={{ fontFamily: 'JetBrains Mono, monospace' }}>d0s.dev</span>
            </div>
            <p className="text-[#979DAC] mb-4 max-w-md">
              Deploy on Steroids: 1-Click Kubernetes Deploys, Open Source & Free
            </p>
            <p className="text-[#7D8597]">
              © 2025 d0s.dev. Licensed under Apache 2.0
            </p>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-[#979DAC] hover:text-[#0466C8] transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-[#979DAC] hover:text-[#0466C8] transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-[#979DAC] hover:text-[#0466C8] transition-colors">
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="text-[#979DAC] hover:text-[#0466C8] transition-colors">
                  Community
                </a>
              </li>
            </ul>
          </div>

          {/* Open Source */}
          <div>
            <h4 className="text-white mb-4">Open Source</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://github.com/d0s-dev" 
                  className="text-[#979DAC] hover:text-[#0466C8] transition-colors flex items-center gap-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="text-[#979DAC] hover:text-[#0466C8] transition-colors">
                  Contributing
                </a>
              </li>
              <li>
                <a href="#" className="text-[#979DAC] hover:text-[#0466C8] transition-colors">
                  License
                </a>
              </li>
              <li>
                <a href="#" className="text-[#979DAC] hover:text-[#0466C8] transition-colors">
                  Roadmap
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Join Contributors CTA */}
        <div className="mt-12 pt-8 border-t border-[#002855]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h4 className="text-white mb-2">Join the Community</h4>
              <p className="text-[#979DAC]">
                Built with ❤️ by the Kubernetes community
              </p>
            </div>
            <Button
              style={{
                background: 'linear-gradient(135deg, #0466C8 0%, #023E7D 100%)',
              }}
              className="whitespace-nowrap"
            >
              <Users className="w-4 h-4 mr-2" />
              Join Contributors
            </Button>
          </div>
        </div>

        {/* Bottom links */}
        <div className="mt-8 pt-6 border-t border-[#002855]/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-4">
            <a href="#" className="text-[#7D8597] hover:text-[#0466C8] transition-colors">
              Privacy
            </a>
            <a href="#" className="text-[#7D8597] hover:text-[#0466C8] transition-colors">
              Terms
            </a>
            <a href="#" className="text-[#7D8597] hover:text-[#0466C8] transition-colors">
              Security
            </a>
          </div>
          <div className="flex items-center gap-2 text-[#7D8597]">
            <span>Powered by</span>
            <a href="https://zarf.dev" className="text-[#0466C8] hover:underline">Zarf</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
