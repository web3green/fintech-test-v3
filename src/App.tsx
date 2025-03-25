
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

// Компонент для управления метатегами
const MetaTagUpdater = () => {
  useEffect(() => {
    // Устанавливаем приоритетные мета-теги для превью
    const updateMetaTags = () => {
      // Очищаем существующие метатеги с аналогичными свойствами
      document.querySelectorAll('meta[property^="og:image"]').forEach(tag => {
        if (tag.getAttribute('property') !== 'og:image:alt' && 
            tag.getAttribute('property') !== 'og:image:width' && 
            tag.getAttribute('property') !== 'og:image:height') {
          tag.remove();
        }
      });

      // Создаем новые метатеги с актуальными данными
      const metaTags = [
        {property: 'og:image', content: `https://test.mcaweb.xyz/lovable-uploads/8f51558f-dcfd-4921-b6e4-112532ad0723.png?v=${Date.now()}`},
        {property: 'og:image:secure_url', content: `https://test.mcaweb.xyz/lovable-uploads/8f51558f-dcfd-4921-b6e4-112532ad0723.png?v=${Date.now()}`},
        {property: 'og:image:url', content: `https://test.mcaweb.xyz/lovable-uploads/8f51558f-dcfd-4921-b6e4-112532ad0723.png?v=${Date.now()}`},
        {property: 'twitter:image', content: `https://test.mcaweb.xyz/lovable-uploads/8f51558f-dcfd-4921-b6e4-112532ad0723.png?v=${Date.now()}`}
      ];

      metaTags.forEach(({property, content}) => {
        const meta = document.createElement('meta');
        meta.setAttribute('property', property);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      });
    };

    updateMetaTags();
    
    // Обновляем метатеги каждые 5 секунд для случая, если кто-то попытается получить превью
    const interval = setInterval(updateMetaTags, 5000);
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
