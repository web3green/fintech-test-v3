import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useRef } from 'react';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import { updateSocialMetaTags } from "./utils/favicon/socialMetaUtils";
import { initializeFavicon } from "./utils/favicon/faviconManager";

const queryClient = new QueryClient();

const MetaTagUpdater = () => {
  const heartCheckInterval = useRef<number | null>(null);
  
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      let needsUpdate = false;
      
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          const addedNodes = Array.from(mutation.addedNodes);
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
        for (let i = 0; i < 10; i++) {
          setTimeout(() => initializeFavicon(), i * 50);
        }
      }
    });
    
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['href']
    });
    
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
            for (let i = 0; i < 20; i++) {
              setTimeout(() => {
                initializeFavicon();
                updateSocialMetaTags();
              }, 500 + i * 100);
            }
          }
        }
      }
    });
    
    scriptObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        initializeFavicon();
        updateSocialMetaTags();
      }, i * 100);
    }
    
    heartCheckInterval.current = window.setInterval(() => {
      const unwantedIcons = document.querySelectorAll(
        'link[href*="heart"], link[href*="favicon.ico"], link[href*="gpteng"], link[href*="gptengineer"]'
      );
      if (unwantedIcons.length > 0) {
        console.log('Found and removing unwanted icons:', unwantedIcons.length);
        unwantedIcons.forEach(icon => icon.remove());
        initializeFavicon();
        
        for (let i = 0; i < 5; i++) {
          setTimeout(() => initializeFavicon(), i * 50);
        }
      } else {
        if (Date.now() % 5000 < 100) {
          initializeFavicon();
        }
      }
    }, 300) as unknown as number;
    
    const interval = setInterval(() => {
      initializeFavicon();
      updateSocialMetaTags();
    }, 2000);
    
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
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
    
    initializeFavicon();
    
    const blockExternalFavicons = () => {
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = 'data:,'; // Empty favicon
      document.head.insertBefore(link, document.head.firstChild);
      
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
      
      const unwantedLinks = document.querySelectorAll(
        'link[href*="heart"], link[href*="favicon.ico"], link[href*="gpteng"], link[href*="gptengineer"]'
      );
      unwantedLinks.forEach(link => link.remove());
    };
    
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
