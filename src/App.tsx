
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

// Enhanced component for managing meta tags
const MetaTagUpdater = () => {
  useEffect(() => {
    // Initial updates with favicon initialization
    initializeFavicon();
    updateSocialMetaTags();
    
    // Set up interval for periodic updates
    const interval = setInterval(() => {
      initializeFavicon(); // Periodically re-initialize favicon
      updateSocialMetaTags();
    }, 15000);
    
    // Attempt additional early updates to ensure proper loading
    setTimeout(() => {
      initializeFavicon();
      updateSocialMetaTags();
    }, 1000);
    
    setTimeout(() => {
      initializeFavicon();
      updateSocialMetaTags();
    }, 5000);
    
    // Clean up interval on unmount
    return () => clearInterval(interval);
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
