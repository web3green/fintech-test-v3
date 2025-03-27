
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import { updateSocialMetaTags, blockHeartIcon, enforceOurFavicon, scanAndRemoveHeartIcons } from "./utils/metaTagManager";
import { toast } from "sonner";

const APP_VERSION = Date.now().toString();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      staleTime: 5 * 60 * 1000, // 5 минут
    },
  },
});

const VersionChecker = () => {
  useEffect(() => {
    const savedVersion = localStorage.getItem('app_version');
    
    if (savedVersion && savedVersion !== APP_VERSION) {
      console.log('Обнаружена новая версия приложения. Обновление...');
      localStorage.setItem('app_version', APP_VERSION);
      
      if ('caches' in window) {
        caches.keys().then(cacheNames => {
          cacheNames.forEach(cacheName => {
            caches.delete(cacheName);
          });
        });
      }
      
      toast.info('Обновляем приложение до последней версии...', {
        duration: 3000,
        onAutoClose: () => window.location.reload()
      });
    } else {
      localStorage.setItem('app_version', APP_VERSION);
    }
  }, []);

  return null;
};

const MetaTagUpdater = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    console.log('MetaTagUpdater mounted - setting up watchers');
    
    updateSocialMetaTags();
    blockHeartIcon();
    enforceOurFavicon();
    scanAndRemoveHeartIcons();
    
    intervalRef.current = setInterval(() => {
      console.log('MetaTagUpdater interval check');
      updateSocialMetaTags();
      blockHeartIcon();
      enforceOurFavicon();
      scanAndRemoveHeartIcons();
    }, 500);
    
    for (let i = 1; i <= 10; i++) {
      setTimeout(() => {
        updateSocialMetaTags();
        blockHeartIcon();
        enforceOurFavicon();
        scanAndRemoveHeartIcons();
      }, i * 50);
    }
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Tab became visible - updating branding');
        updateSocialMetaTags();
        blockHeartIcon();
        enforceOurFavicon();
        scanAndRemoveHeartIcons();
        
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
    
    window.addEventListener('online', () => {
      console.log('Network came online - updating branding');
      updateSocialMetaTags();
      blockHeartIcon();
      enforceOurFavicon();
      scanAndRemoveHeartIcons();
    });
    
    return () => {
      console.log('MetaTagUpdater unmounting - cleaning up');
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', updateSocialMetaTags);
    };
  }, []);

  return null;
};

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log('App component mounted - initial branding setup');
    
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
    
    updateSocialMetaTags();
    blockHeartIcon();
    enforceOurFavicon();
    scanAndRemoveHeartIcons();
    
    for (let i = 1; i <= 20; i++) {
      setTimeout(() => {
        updateSocialMetaTags();
        blockHeartIcon();
        enforceOurFavicon();
        scanAndRemoveHeartIcons();
      }, i * 100);
    }
    
    const observer = new MutationObserver((mutations) => {
      let needsUpdate = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              
              if (
                element.tagName === 'LINK' && 
                element.getAttribute('rel')?.includes('icon') &&
                !element.getAttribute('href')?.includes('6bfd57a2-6c6a-4507-bb1d-2cde1517ebd1')
              ) {
                console.log('Detected non-FinTechAssist favicon:', element.getAttribute('href'));
                needsUpdate = true;
              }
              
              if (element.tagName === 'SVG') {
                console.log('New SVG element detected - checking for heart paths');
                needsUpdate = true;
              }
            }
          });
        }
      });
      
      if (needsUpdate) {
        console.log('DOM mutations detected - updating branding');
        updateSocialMetaTags();
        blockHeartIcon();
        enforceOurFavicon();
        scanAndRemoveHeartIcons();
      }
    });
    
    observer.observe(document, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['rel', 'href', 'src', 'class', 'id']
    });
    
    setIsLoaded(true);
    
    return () => observer.disconnect();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MetaTagUpdater />
        <VersionChecker />
        <Toaster />
        <Sonner />
        {isLoaded && (
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin/*" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
