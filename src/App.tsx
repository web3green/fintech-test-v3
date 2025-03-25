
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from 'react';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

// Enhanced component for managing meta tags
const MetaTagUpdater = () => {
  useEffect(() => {
    // Function to update all meta tags with fresh cache-busting
    const updateMetaTags = () => {
      const timestamp = Date.now();
      const logoUrl = `https://test.mcaweb.xyz/lovable-uploads/8f51558f-dcfd-4921-b6e4-112532ad0723.png?nocache=${timestamp}`;
      
      // Create or update meta tags
      const updateOrCreateMetaTag = (selectorOrProperty, value, isProperty = true) => {
        let meta;
        if (isProperty) {
          meta = document.querySelector(`meta[property="${selectorOrProperty}"]`);
          if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', selectorOrProperty);
            document.head.appendChild(meta);
          }
        } else {
          meta = document.querySelector(`meta[name="${selectorOrProperty}"]`);
          if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', selectorOrProperty);
            document.head.appendChild(meta);
          }
        }
        meta.setAttribute('content', value);
      };
      
      // Update all relevant meta tags
      updateOrCreateMetaTag('og:image', logoUrl);
      updateOrCreateMetaTag('og:image:url', logoUrl);
      updateOrCreateMetaTag('og:image:secure_url', logoUrl);
      updateOrCreateMetaTag('twitter:image', logoUrl, false);
      
      // Update cache control headers
      updateOrCreateMetaTag('Cache-Control', 'no-cache, no-store, must-revalidate', false);
      updateOrCreateMetaTag('Pragma', 'no-cache', false);
      updateOrCreateMetaTag('Expires', '0', false);
      
      console.log("Метатеги обновлены с временной меткой:", timestamp);
    };

    // Initial update
    updateMetaTags();
    
    // Set up interval for periodic updates
    const interval = setInterval(updateMetaTags, 3000);
    
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
