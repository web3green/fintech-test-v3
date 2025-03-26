
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useRef } from 'react';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import { updateSocialMetaTags, blockHeartIcon, enforceOurFavicon, scanAndRemoveHeartIcons } from "./utils/metaTagManager";

const queryClient = new QueryClient();

// Enhanced component for managing meta tags
const MetaTagUpdater = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Initial update and block heart icon
    updateSocialMetaTags();
    blockHeartIcon();
    enforceOurFavicon();
    scanAndRemoveHeartIcons();
    
    // Set up interval for continuous updates (every 500ms)
    intervalRef.current = setInterval(() => {
      updateSocialMetaTags();
      blockHeartIcon();
      enforceOurFavicon();
      scanAndRemoveHeartIcons();
    }, 500);
    
    // Additional immediate updates with increased frequency
    for (let i = 1; i <= 10; i++) {
      setTimeout(() => {
        updateSocialMetaTags();
        blockHeartIcon();
        enforceOurFavicon();
        scanAndRemoveHeartIcons();
      }, i * 50); // Every 50ms for 500ms
    }
    
    // Also update on visibility change (tab focus)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Update multiple times when tab becomes visible
        updateSocialMetaTags();
        blockHeartIcon();
        enforceOurFavicon();
        scanAndRemoveHeartIcons();
        
        // Schedule additional updates
        for (let i = 1; i <= 10; i++) {
          setTimeout(() => {
            updateSocialMetaTags();
            blockHeartIcon();
            enforceOurFavicon();
            scanAndRemoveHeartIcons();
          }, i * 100);
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also update on network status change
    window.addEventListener('online', () => {
      updateSocialMetaTags();
      blockHeartIcon();
      enforceOurFavicon();
      scanAndRemoveHeartIcons();
    });
    
    // Clean up interval on unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', updateSocialMetaTags);
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
    
    // Ensure meta tags are set at component mount and block heart icon
    updateSocialMetaTags();
    blockHeartIcon();
    enforceOurFavicon();
    scanAndRemoveHeartIcons();
    
    // Additional updates after short delays with increased frequency
    for (let i = 1; i <= 20; i++) {
      setTimeout(() => {
        updateSocialMetaTags();
        blockHeartIcon();
        enforceOurFavicon();
        scanAndRemoveHeartIcons();
      }, i * 100);
    }
    
    // Create a MutationObserver to detect when new elements are added to the DOM
    const observer = new MutationObserver((mutations) => {
      let needsUpdate = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if any added nodes contain heart icons or are from gptengineer
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (
                element.tagName === 'LINK' && 
                element.getAttribute('rel')?.includes('icon') &&
                !element.getAttribute('href')?.includes('6bfd57a2-6c6a-4507-bb1d-2cde1517ebd1')
              ) {
                needsUpdate = true;
              }
            }
          });
        }
      });
      
      if (needsUpdate) {
        updateSocialMetaTags();
        blockHeartIcon();
        enforceOurFavicon();
        scanAndRemoveHeartIcons();
      }
    });
    
    // Start observing the document
    observer.observe(document, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['rel', 'href']
    });
    
    // Clean up observer on unmount
    return () => observer.disconnect();
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
