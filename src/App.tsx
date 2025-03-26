import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useRef } from 'react';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import { updateSocialMetaTags, initializeFavicon } from "./utils/metaTagManager";

const queryClient = new QueryClient();

// Enhanced component for managing meta tags with aggressive favicon updates
const MetaTagUpdater = () => {
  const heartCheckInterval = useRef<number | null>(null);
  
  useEffect(() => {
    // Create mutation observer to detect any changes to head elements
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
      subtree: true,
      attributes: true,
      attributeFilter: ['href']
    });
    
    // Initial updates with aggressive favicon initialization
    initializeFavicon();
    updateSocialMetaTags();
    
    // CSS-based approach to hide heart favicons
    const style = document.createElement('style');
    style.textContent = `
      [rel="icon"][href*="heart"], 
      [rel="icon"][href*="favicon.ico"] {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    
    // Rapid initial updates
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        initializeFavicon();
        updateSocialMetaTags();
      }, i * 300);
    }
    
    // Create a timed interval to keep checking for heart icons
    heartCheckInterval.current = window.setInterval(() => {
      // Look specifically for heart favicon
      const heartIcons = document.querySelectorAll('link[href*="heart"], link[href*="favicon.ico"]');
      if (heartIcons.length > 0) {
        console.log('Found and removing heart icons:', heartIcons.length);
        heartIcons.forEach(icon => icon.remove());
        initializeFavicon();
      } else {
        // Periodically reinitialize anyway
        if (Date.now() % 10000 < 100) {
          initializeFavicon();
        }
      }
    }, 1000) as unknown as number;
    
    // Set up interval for periodic updates
    const interval = setInterval(() => {
      initializeFavicon();
      updateSocialMetaTags();
    }, 5000);
    
    // Clean up interval and observer on unmount
    return () => {
      clearInterval(interval);
      if (heartCheckInterval.current !== null) {
        clearInterval(heartCheckInterval.current);
      }
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
    
    // Attempt to intercept any favicon.ico request
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = 'data:,'; // Empty favicon to prevent browser from requesting favicon.ico
    document.head.insertBefore(link, document.head.firstChild);
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
