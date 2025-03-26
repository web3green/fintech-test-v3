
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
          // Проверяем добавленные узлы на нежелательные иконки
          const unwantedIconAdded = addedNodes.some(node => {
            if (node.nodeName === 'LINK') {
              const rel = (node as HTMLLinkElement).rel;
              const href = (node as HTMLLinkElement).href;
              return rel && ((rel.includes('icon') || rel === 'shortcut icon') && 
                (href.includes('favicon.ico') || 
                 href.includes('heart') ||
                 href.includes('gpteng') ||
                 href.includes('gptengineer')));
            }
            return false;
          });
          
          if (unwantedIconAdded) {
            console.log('Unwanted favicon detected, overriding immediately');
            needsUpdate = true;
          }
        }
        
        // Также проверяем изменения атрибутов существующих элементов
        if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
          const target = mutation.target as HTMLLinkElement;
          if (target.rel && target.rel.includes('icon') && 
              (target.href.includes('heart') || 
               target.href.includes('favicon.ico') ||
               target.href.includes('gpteng') ||
               target.href.includes('gptengineer'))) {
            console.log('Unwanted favicon attribute detected, overriding immediately');
            needsUpdate = true;
          }
        }
      }
      
      if (needsUpdate) {
        initializeFavicon();
        // Агрессивная серия обновлений при обнаружении нежелательного фавикона
        for (let i = 0; i < 10; i++) {
          setTimeout(() => initializeFavicon(), i * 50);
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
    
    // CSS-подход для скрытия нежелательных фавиконов
    const style = document.createElement('style');
    style.textContent = `
      [rel="icon"][href*="heart"], 
      [rel="icon"][href*="favicon.ico"],
      [rel*="icon"][href*="heart"],
      [rel*="icon"][href*="favicon.ico"],
      [rel="icon"][href*="gptengineer"],
      [rel*="icon"][href*="gptengineer"],
      [rel="icon"][href*="gpteng"],
      [rel*="icon"][href*="gpteng"] {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    
    // Блокируем внешний скрипт из gpteng.co если он пытается добавить favicon
    const scriptObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          const addedNodes = Array.from(mutation.addedNodes);
          const gptengineerScriptAdded = addedNodes.some(node => {
            return node.nodeName === 'SCRIPT' && 
                  ((node as HTMLScriptElement).src || '').includes('gpteng');
          });
          
          if (gptengineerScriptAdded) {
            console.log('GPTEngineer script detected, scheduling extra favicon updates');
            // Запускаем агрессивную серию обновлений фавикона
            for (let i = 0; i < 20; i++) {
              setTimeout(() => {
                initializeFavicon();
                updateSocialMetaTags();
              }, 500 + i * 100); // Начинаем через 500мс после обнаружения скрипта
            }
          }
        }
      }
    });
    
    // Наблюдаем за body для обнаружения добавления скриптов
    scriptObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Начальные быстрые обновления
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        initializeFavicon();
        updateSocialMetaTags();
      }, i * 100);
    }
    
    // Создаем временной интервал для постоянной проверки на нежелательные иконки
    heartCheckInterval.current = window.setInterval(() => {
      // Ищем нежелательные фавиконы
      const unwantedIcons = document.querySelectorAll(
        'link[href*="heart"], link[href*="favicon.ico"], link[href*="gpteng"], link[href*="gptengineer"]'
      );
      if (unwantedIcons.length > 0) {
        console.log('Found and removing unwanted icons:', unwantedIcons.length);
        unwantedIcons.forEach(icon => icon.remove());
        initializeFavicon();
        
        // Агрессивный подход: несколько последовательных инициализаций
        for (let i = 0; i < 5; i++) {
          setTimeout(() => initializeFavicon(), i * 50);
        }
      } else {
        // Периодически реинициализируем в любом случае
        if (Date.now() % 5000 < 100) {
          initializeFavicon();
        }
      }
    }, 300) as unknown as number;
    
    // Устанавливаем интервал для периодических обновлений
    const interval = setInterval(() => {
      initializeFavicon();
      updateSocialMetaTags();
    }, 2000);
    
    // Очищаем интервалы и наблюдатели при размонтировании
    return () => {
      clearInterval(interval);
      if (heartCheckInterval.current !== null) {
        clearInterval(heartCheckInterval.current);
      }
      observer.disconnect();
      scriptObserver.disconnect();
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
    
    // Prevent unwanted icons by initializing favicon again after app mounts
    initializeFavicon();
    
    // Prevent external scripts from adding unwanted favicons
    const blockExternalFavicons = () => {
      // Block any potential favicon.ico request
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = 'data:,'; // Empty favicon
      document.head.insertBefore(link, document.head.firstChild);
      
      // Add CSS to block unwanted favicons
      const style = document.createElement('style');
      style.textContent = `
        [rel="icon"][href*="heart"], 
        [rel="icon"][href*="favicon.ico"],
        [rel*="icon"][href*="heart"],
        [rel*="icon"][href*="favicon.ico"],
        [rel="icon"][href*="gptengineer"],
        [rel*="icon"][href*="gptengineer"],
        [rel="icon"][href*="gpteng"],
        [rel*="icon"][href*="gpteng"] {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
      
      // Remove any unwanted favicons
      const unwantedLinks = document.querySelectorAll(
        'link[href*="heart"], link[href*="favicon.ico"], link[href*="gpteng"], link[href*="gptengineer"]'
      );
      unwantedLinks.forEach(link => link.remove());
    };
    
    // Вызываем блокировку сразу и через небольшие интервалы для надежности
    blockExternalFavicons();
    for (let i = 0; i < 10; i++) {
      setTimeout(blockExternalFavicons, 100 * i);
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
