import { useState } from "react";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { LandingPage } from "./components/LandingPage";
import { DocsPage } from "./components/DocsPage";
import { CatalogPage } from "./components/CatalogPage";
import { HeadlampPage } from "./components/HeadlampPage";
import { Button } from "./components/ui/button";
import { Layers } from "lucide-react";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showPageSelector, setShowPageSelector] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <LandingPage />;
      case 'docs':
        return <DocsPage />;
      case 'catalog':
        return <CatalogPage />;
      case 'headlamp':
        return <HeadlampPage />;
      default:
        return <LandingPage />;
    }
  };

  const pages = [
    { id: 'home', label: 'Landing Page', description: 'Flashy hero with animations' },
    { id: 'docs', label: 'Documentation', description: 'Docusaurus-style docs' },
    { id: 'catalog', label: 'App Catalog', description: 'Browse & deploy apps' },
    { id: 'headlamp', label: 'Headlamp Plugin', description: 'K8s dashboard integration' },
  ];

  return (
    <div className="min-h-screen bg-[#001233] text-[#979DAC]">
      <Toaster position="top-right" />
      {currentPage !== 'headlamp' && (
        <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      )}
      
      {renderPage()}
      
      {currentPage !== 'headlamp' && <Footer />}

      {/* Page Selector - Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {showPageSelector && (
          <div className="mb-4 bg-[#33415C] border border-[#002855] rounded-lg shadow-2xl p-4 min-w-[300px]">
            <h4 className="text-white mb-3">d0s.dev UI Kit Pages</h4>
            <div className="space-y-2">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => {
                    setCurrentPage(page.id);
                    setShowPageSelector(false);
                  }}
                  className={`w-full text-left p-3 rounded transition-all ${
                    currentPage === page.id
                      ? 'bg-[#0466C8]/20 border border-[#0466C8]/50'
                      : 'hover:bg-[#001233] border border-transparent'
                  }`}
                >
                  <div className="text-white mb-1">{page.label}</div>
                  <div className="text-[#979DAC]">{page.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        <Button
          onClick={() => setShowPageSelector(!showPageSelector)}
          style={{
            background: 'linear-gradient(135deg, #0466C8 0%, #023E7D 100%)',
          }}
          className="hover:scale-110 transition-transform text-white shadow-lg shadow-[#0466C8]/30 w-14 h-14 rounded-full p-0"
        >
          <Layers className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}