
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useRef } from 'react';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

// Константа нашего фавикона для блокировки нежелательных иконок
const OUR_FAVICON_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA/0lEQVR42mNkGGDAOOqAUQeMOmDUAaMO4D4AH2egFQAAgL7gNAOwAICvBzx+/Jjl4cOH8p8/f2YihJmZmbmYmJg3CQkJP6Fyn6H0F3Fxca+QkJCvKSkpX+Pi4r7/hYI/f/68//Tp09OJiYmvO39sEdZVNzU7evToWxkZme8gR/z8+fPPnz9/fv/69evv79+//0HB/4H4HxD/B+E/UP5/EP0fCYP4/xkYGBmA8v+A4vA4AMXRTwYsBuAK/FetWnVm7969x48cOXLi8ePHN27evHnj1q1bd+7cuXMPiO/CcBbQ9OfPn79y48aNG1euXLly+fLly5cuXbpw/vz5M2fOnDlNU1sAB1+QqgkWAlsAAAAASUVORK5CYII=';

// Компонент для агрессивного управления фавиконом
const FaviconManager = () => {
  const checkIntervalRef = useRef<number | null>(null);
  
  // Функция установки нашего фавикона
  const setOurFavicon = () => {
    // Удаляем все нежелательные иконки
    const unwantedIcons = document.querySelectorAll(
      'link[href*="heart"], link[href*="favicon.ico"], link[href*="gpteng"], link[href*="gptengineer"]'
    );
    
    if (unwantedIcons.length > 0) {
      console.log('Found and removing unwanted icons:', unwantedIcons.length);
      unwantedIcons.forEach(icon => icon.remove());
    }
    
    // Добавляем наш фавикон
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = OUR_FAVICON_BASE64;
    document.head.appendChild(link);
    
    // Добавляем дополнительные типы иконок для максимального охвата браузеров
    const iconTypes = [
      { rel: 'shortcut icon', type: 'image/png' },
      { rel: 'apple-touch-icon' }
    ];
    
    iconTypes.forEach(iconType => {
      const link = document.createElement('link');
      link.rel = iconType.rel;
      link.href = OUR_FAVICON_BASE64;
      if (iconType.type) {
        link.type = iconType.type;
      }
      document.head.appendChild(link);
    });
  };
  
  useEffect(() => {
    // Создаем MutationObserver для отслеживания изменений в <head>
    const observer = new MutationObserver((mutations) => {
      let needsUpdate = false;
      
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          const addedNodes = Array.from(mutation.addedNodes);
          
          // Проверяем добавленные элементы на нежелательные иконки
          addedNodes.forEach(node => {
            if (node.nodeName === 'LINK') {
              const linkElement = node as HTMLLinkElement;
              const href = linkElement.href || '';
              const rel = linkElement.rel || '';
              
              if (rel.includes('icon') && (
                href.includes('heart') || 
                href.includes('favicon.ico') ||
                href.includes('gpteng') || 
                href.includes('gptengineer') ||
                href.includes('engine')
              )) {
                console.log('Detected unwanted favicon:', href);
                needsUpdate = true;
                linkElement.remove();
              }
            }
          });
        }
      }
      
      if (needsUpdate) {
        console.log('DOM changed, reinitializing favicon');
        setOurFavicon();
      }
    });
    
    // Начинаем наблюдение за <head>
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['href', 'rel']
    });
    
    // Устанавливаем фавикон немедленно
    setOurFavicon();
    
    // Устанавливаем интервал для регулярных проверок
    checkIntervalRef.current = window.setInterval(() => {
      // Ищем нежелательные фавиконы
      const unwantedIcons = document.querySelectorAll(
        'link[href*="heart"], link[href*="favicon.ico"], link[href*="gpteng"], link[href*="gptengineer"], link[href*="engine"]'
      );
      
      if (unwantedIcons.length > 0) {
        console.log('Interval check found unwanted icons:', unwantedIcons.length);
        unwantedIcons.forEach(icon => icon.remove());
        setOurFavicon();
      }
    }, 200) as unknown as number;
    
    // Начальные частые обновления для повышения надежности
    for (let i = 0; i < 20; i++) {
      setTimeout(setOurFavicon, i * 100);
    }
    
    // Очистка при размонтировании
    return () => {
      observer.disconnect();
      if (checkIntervalRef.current !== null) {
        clearInterval(checkIntervalRef.current);
      }
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
    
    // Блокируем нежелательные фавиконы сразу при загрузке
    const blockUnwantedFavicons = () => {
      // Удаляем все нежелательные иконки
      const unwantedIcons = document.querySelectorAll(
        'link[href*="heart"], link[href*="favicon.ico"], link[href*="gpteng"], link[href*="gptengineer"], link[href*="engine"]'
      );
      
      if (unwantedIcons.length > 0) {
        console.log('Initial cleanup found unwanted icons:', unwantedIcons.length);
        unwantedIcons.forEach(icon => icon.remove());
      }
      
      // Добавляем наш фавикон
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = OUR_FAVICON_BASE64;
      document.head.appendChild(link);
    };
    
    // Выполняем блокировку сразу и через небольшие интервалы
    blockUnwantedFavicons();
    for (let i = 0; i < 10; i++) {
      setTimeout(blockUnwantedFavicons, i * 100);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <FaviconManager />
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
