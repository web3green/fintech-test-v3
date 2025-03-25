
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
    // Функция для установки метатегов
    const updateMetaTags = () => {
      const logoUrl = 'https://test.mcaweb.xyz/lovable-uploads/8f51558f-dcfd-4921-b6e4-112532ad0723.png';
      
      // Обновляем все OG и Twitter метатеги с изображениями
      const metaTags = {
        'og:image': logoUrl,
        'og:image:url': logoUrl,
        'og:image:secure_url': logoUrl,
        'twitter:image': logoUrl
      };
      
      for (const [property, content] of Object.entries(metaTags)) {
        // Ищем существующий тег
        let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
        
        // Если тег не существует, создаем новый
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          document.head.appendChild(meta);
        }
        
        // Устанавливаем содержимое
        meta.setAttribute('content', `${content}?v=${Date.now()}`);
      }
      
      console.log("Метатеги проверены и обновлены");
    };

    // Вызываем функцию обновления
    updateMetaTags();
    
    // Устанавливаем интервал обновления метатегов
    const interval = setInterval(updateMetaTags, 10000);
    
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
