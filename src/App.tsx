
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import { updateSocialMetaTags, enforceOurFavicon } from "./utils/metaTagManager";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      staleTime: 1000 * 60 * 5, // 5 минут
      retry: 2
    },
  },
});

// Регистрация Service Worker для управления кешированием
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js', { 
          scope: '/',
          updateViaCache: 'none' // Отключаем кеширование для самого Service Worker
        });
        
        // Обновляем Service Worker, если доступна новая версия
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        
        // Обработка обновления Service Worker
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('Новая версия Service Worker доступна');
                // Отправляем сообщение для пропуска ожидания
                newWorker.postMessage({ type: 'SKIP_WAITING' });
              }
            });
          }
        });
        
        console.log('Service Worker успешно зарегистрирован:', registration.scope);
        
        // Обработка обновления страницы при обновлении Service Worker
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!refreshing) {
            refreshing = true;
            console.log('Service Worker обновлен, перезагружаем страницу');
            window.location.reload();
          }
        });
        
      } catch (error) {
        console.error('Ошибка регистрации Service Worker:', error);
      }
    });
  }
};

// Очистка кеша
const clearCache = async () => {
  if ('caches' in window) {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map(key => caches.delete(key)));
      console.log('Кеш успешно очищен');
      
      // Отправить сообщение Service Worker для очистки кеша
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
      }
    } catch (error) {
      console.error('Ошибка при очистке кеша:', error);
    }
  }
};

// Улучшенный компонент для управления мета-тегами
const MetaTagUpdater = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    console.log('MetaTagUpdater mounted - setting up watchers');
    setMounted(true);
    
    // Начальное обновление
    updateSocialMetaTags();
    enforceOurFavicon();
    
    // Настроить интервал для непрерывных обновлений (каждые 2 секунды)
    intervalRef.current = setInterval(() => {
      console.log('MetaTagUpdater interval check');
      updateSocialMetaTags();
      enforceOurFavicon();
    }, 2000);
    
    // Также обновлять при изменении видимости (фокус вкладки)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Tab became visible - updating branding');
        updateSocialMetaTags();
        enforceOurFavicon();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Также обновлять при изменении статуса сети
    window.addEventListener('online', () => {
      console.log('Network came online - updating branding');
      updateSocialMetaTags();
      enforceOurFavicon();
    });
    
    // Также обновлять при изменении языка
    window.addEventListener('language:changed', () => {
      console.log('Language changed - updating branding');
      updateSocialMetaTags();
      enforceOurFavicon();
      
      // Также обновить стили
      document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
        if (link instanceof HTMLLinkElement && link.href) {
          const url = new URL(link.href);
          url.searchParams.set('_refresh', Date.now().toString());
          link.href = url.toString();
        }
      });
    });
    
    // Очистить интервал при размонтировании
    return () => {
      console.log('MetaTagUpdater unmounting - cleaning up');
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', updateSocialMetaTags);
      window.removeEventListener('language:changed', updateSocialMetaTags);
    };
  }, []);

  return mounted ? <div id="meta-tag-updater" style={{ display: 'none' }} /> : null;
};

const App = () => {
  // Проверить и применить сохраненную тему при начальной загрузке
  useEffect(() => {
    console.log('App component mounted - initial branding setup');
    
    // Регистрация Service Worker
    registerServiceWorker();
    
    // Очистка кеша при загрузке приложения
    clearCache();
    
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
    
    // Обеспечить установку мета-тегов при монтировании компонента
    updateSocialMetaTags();
    enforceOurFavicon();
    
    // Создать MutationObserver для обнаружения добавления новых элементов в DOM
    const observer = new MutationObserver((mutations) => {
      let needsUpdate = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Проверить, есть ли среди добавленных узлов ссылки на favicon
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              
              // Искать любые вновь добавленные ссылки на favicon
              if (
                element.tagName === 'LINK' && 
                element.getAttribute('rel')?.includes('icon') &&
                !element.getAttribute('href')?.includes('6bfd57a2-6c6a-4507-bb1d-2cde1517ebd1')
              ) {
                console.log('Detected non-FinTechAssist favicon:', element.getAttribute('href'));
                needsUpdate = true;
              }
            }
          });
        }
      });
      
      if (needsUpdate) {
        console.log('DOM mutations detected - updating branding');
        updateSocialMetaTags();
        enforceOurFavicon();
      }
    });
    
    // Начать наблюдение за документом со всеми возможными параметрами для максимального обнаружения
    observer.observe(document, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['rel', 'href']
    });
    
    // Очистить observer при размонтировании
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
            <Route path="/" element={<Index key="index-page" />} />
            <Route path="/admin/*" element={<Admin key="admin-page" />} />
            {/* ДОБАВЛЯТЬ ВСЕ ПОЛЬЗОВАТЕЛЬСКИЕ МАРШРУТЫ ВЫШЕ МАРШРУТА CATCH-ALL "*" */}
            <Route path="*" element={<NotFound key="not-found-page" />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
