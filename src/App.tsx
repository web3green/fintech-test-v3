
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useRef } from 'react';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import { updateSocialMetaTags, blockHeartIcon } from "./utils/metaTagManager";

const queryClient = new QueryClient();

// Enhanced component for managing meta tags
const MetaTagUpdater = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Initial update and block heart icon
    updateSocialMetaTags();
    blockHeartIcon();
    
    // Set up interval for continuous updates (every 3 seconds)
    intervalRef.current = setInterval(updateSocialMetaTags, 3000);
    
    // Additional immediate updates
    setTimeout(updateSocialMetaTags, 100);
    setTimeout(updateSocialMetaTags, 500);
    setTimeout(updateSocialMetaTags, 1500);
    
    // Also update on visibility change (tab focus)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Update multiple times when tab becomes visible
        updateSocialMetaTags();
        setTimeout(updateSocialMetaTags, 100);
        setTimeout(updateSocialMetaTags, 500);
        setTimeout(updateSocialMetaTags, 1000);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also update on network status change
    window.addEventListener('online', updateSocialMetaTags);
    
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
    
    // Additional updates after short delays
    setTimeout(updateSocialMetaTags, 200);
    setTimeout(updateSocialMetaTags, 1000);
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
