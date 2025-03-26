
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from 'react';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import { updateSocialMetaTags, initializeFavicon } from "./utils/metaTagManager";

const queryClient = new QueryClient();

// Enhanced component for managing meta tags with aggressive favicon updates
const MetaTagUpdater = () => {
  useEffect(() => {
    // Create mutation observer to detect any changes to favicon links
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          const addedNodes = Array.from(mutation.addedNodes);
          // Check if any added nodes are icon links that could be heart favicons
          const faviconAdded = addedNodes.some(node => {
            if (node.nodeName === 'LINK') {
              const rel = (node as HTMLLinkElement).rel;
              const href = (node as HTMLLinkElement).href;
              return rel && (rel.includes('icon') && (href.includes('favicon.ico') || href.includes('heart')));
            }
            return false;
          });
          
          if (faviconAdded) {
            console.log('Heart favicon detected, overriding immediately');
            initializeFavicon();
          }
        }
      }
    });
    
    // Start observing document head for changes
    observer.observe(document.head, {
      childList: true,
      subtree: true
    });
    
    // Initial updates with aggressive favicon initialization
    initializeFavicon();
    updateSocialMetaTags();
    
    // Rapid initial updates
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        initializeFavicon();
        updateSocialMetaTags();
      }, i * 500);
    }
    
    // Set up interval for periodic updates
    const interval = setInterval(() => {
      initializeFavicon();
      updateSocialMetaTags();
    }, 5000);
    
    // Clean up interval and observer on unmount
    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return null;
};

const App = () => {
  // Check and apply saved theme on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
    
    // Prevent heart icon by initializing favicon again after app mounts
    initializeFavicon();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MetaTagUpdater />
        <Toaster />
        <Sonner position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin/*" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

