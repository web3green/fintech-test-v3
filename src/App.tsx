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

// Улучшенный компонент для управления мета-тегами с агрессивными обновлениями фавикона
const MetaTagUpdater = () => {
  const heartCheckInterval = useRef<number | null>(null);
  
  useEffect(() => {
    // Создаем MutationObserver для обнаружения любых изменений элементов head
    const observer = new MutationObserver((mutations) => {
      let needsUpdate = false;
      
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          const addedNodes = Array.from(mutation.addedNodes);
          // Проверяем, не добавлены ли какие-либо узлы с иконками сердца
          const faviconAdded = addedNodes.some(node => {
            if (node.nodeName === 'LINK') {
              const rel = (node as HTMLLinkElement).rel;
              const href = (node as HTMLLinkElement).href;
              return rel && ((rel.includes('icon') || rel === 'shortcut icon') && 
                (href.includes('favicon.ico') || href.includes('heart')));
            }
            return false;
          });
          
          if (faviconAdded) {
            console.log('Heart favicon detected, overriding immediately');
            needsUpdate = true;
          }
        }
        
        // Также проверяем изменения атрибутов существующих элементов
        if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
          const target = mutation.target as HTMLLinkElement;
          if (target.rel && target.rel.includes('icon') && 
              (target.href.includes('heart') || target.href.includes('favicon.ico'))) {
            console.log('Heart favicon attribute detected, overriding immediately');
            needsUpdate = true;
          }
        }
      }
      
      if (needsUpdate) {
        initializeFavicon();
        // Агрессивная серия обновле��ий при обнаружении нежелательного фавикона
        for (let i = 0; i < 5; i++) {
          setTimeout(() => initializeFavicon(), i * 100);
        }
      }
    });
    
    // Начинаем наблюдение за document.head для изменений
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['href']
    });
    
    // CSS-подход для скрытия сердечных фавиконов
    const style = document.createElement('style');
    style.textContent = `
      [rel="icon"][href*="heart"], 
      [rel="icon"][href*="favicon.ico"],
      [rel*="icon"][href*="heart"],
      [rel*="icon"][href*="favicon.ico"] {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    
    // Начальные быстрые обновления
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        initializeFavicon();
        updateSocialMetaTags();
      }, i * 200);
    }
    
    // Создаем временной интервал для постоянной проверки на сердечные иконки
    heartCheckInterval.current = window.setInterval(() => {
      // Ищем специально сердечные фавиконы
      const heartIcons = document.querySelectorAll('link[href*="heart"], link[href*="favicon.ico"]');
      if (heartIcons.length > 0) {
        console.log('Found and removing heart icons:', heartIcons.length);
        heartIcons.forEach(icon => icon.remove());
        initializeFavicon();
        
        // Агрессивный подход: несколько последовательных инициализаций
        for (let i = 0; i < 3; i++) {
          setTimeout(() => initializeFavicon(), i * 100);
        }
      } else {
        // Периодически реинициализируем в любом случае
        if (Date.now() % 8000 < 100) {
          initializeFavicon();
        }
      }
    }, 700) as unknown as number;
    
    // Устанавливаем интервал для периодических обновлений
    const interval = setInterval(() => {
      initializeFavicon();
      updateSocialMetaTags();
    }, 3000);
    
    // Очищаем интервал и наблюдатель при размонтировании
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
