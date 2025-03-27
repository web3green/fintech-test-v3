
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { 
  updateSocialMetaTags, 
  blockHeartIcon, 
  enforceOurFavicon, 
  scanAndRemoveHeartIcons 
} from './utils/metaTagManager'

// Function to clean heart symbols from document title
const cleanHeartSymbolsFromTitle = () => {
  const heartSymbols = ['♥', '♡', '❤', '❥', '❣', '❦', '❧', '♥️', '❤️'];
  let currentTitle = document.title;
  let hasChanges = false;
  
  // Remove any heart symbols from title
  heartSymbols.forEach(symbol => {
    if (currentTitle.includes(symbol)) {
      currentTitle = currentTitle.replace(new RegExp(symbol, 'g'), '');
      hasChanges = true;
    }
  });
  
  // If we made changes, update the title
  if (hasChanges) {
    document.title = currentTitle.trim();
    // If title is now empty, set a default
    if (!document.title.trim()) {
      document.title = 'FinTechAssist: Финансовые решения для бизнеса';
    }
  }
};

// НОВЫЙ КОД: Функция для принудительного обновления кэша при загрузке
const forceCacheRefresh = () => {
  // Добавляем случайный параметр к URL всех CSS файлов для сброса кэша
  document.querySelectorAll('link[rel="stylesheet"]').forEach(linkEl => {
    if (linkEl instanceof HTMLLinkElement && linkEl.href) {
      const url = new URL(linkEl.href);
      url.searchParams.set('_cache', Date.now().toString());
      linkEl.href = url.toString();
    }
  });
  
  // Аналогично для скриптов
  document.querySelectorAll('script[src]').forEach(scriptEl => {
    if (scriptEl instanceof HTMLScriptElement && scriptEl.src && !scriptEl.src.includes('gptengineer')) {
      const originalSrc = scriptEl.src;
      const url = new URL(originalSrc);
      url.searchParams.set('_cache', Date.now().toString());
      
      // Для некоторых скриптов может потребоваться их пересоздание для гарантированной перезагрузки
      if (!originalSrc.includes('inline') && !originalSrc.includes('dynamic')) {
        const parent = scriptEl.parentNode;
        if (parent) {
          const newScript = document.createElement('script');
          newScript.src = url.toString();
          newScript.type = scriptEl.type;
          newScript.async = scriptEl.async;
          newScript.defer = scriptEl.defer;
          parent.replaceChild(newScript, scriptEl);
        }
      }
    }
  });
  
  // Подсказка браузеру о необходимости обновить все ресурсы
  if (window.performance && window.performance.getEntriesByType) {
    try {
      const resources = window.performance.getEntriesByType('resource');
      resources.forEach(resource => {
        if (resource.name && !resource.name.includes('gptengineer')) {
          const url = new URL(resource.name);
          const isCss = url.pathname.endsWith('.css');
          const isJs = url.pathname.endsWith('.js');
          
          if (isCss || isJs) {
            const cacheBusterUrl = `${url.origin}${url.pathname}?_cache=${Date.now()}${url.search}`;
            
            // Предзагрузить ресурс
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = cacheBusterUrl;
            document.head.appendChild(link);
            
            // Удалить после небольшой задержки
            setTimeout(() => link.remove(), 1000);
          }
        }
      });
    } catch (e) {
      console.warn('Failed to analyze resource timing:', e);
    }
  }
  
  console.log('🔄 Cache refresh forced at:', new Date().toISOString());
};

// Function to ensure our meta tags and favicon are set
const ensureOurBranding = () => {
  // Block any heart icons
  blockHeartIcon();
  
  // Initial update
  updateSocialMetaTags();
  
  // Enforce our favicon
  enforceOurFavicon();
  
  // Scan DOM for heart icons
  scanAndRemoveHeartIcons();
  
  // Clean heart symbols from title
  cleanHeartSymbolsFromTitle();
};

// Initialize meta tags before React loads
document.addEventListener('DOMContentLoaded', () => {
  // Initial setup
  ensureOurBranding();
  
  // НОВЫЙ КОД: Принудительное обновление кэша
  forceCacheRefresh();
  
  // Schedule multiple updates with shorter delays and more iterations
  for (let i = 1; i <= 50; i++) {
    setTimeout(ensureOurBranding, i * 20); // Update every 20ms for 1 second
  }
  
  // Additional updates after longer delays to catch late-loading states
  setTimeout(ensureOurBranding, 1000);
  setTimeout(ensureOurBranding, 2000);
  setTimeout(ensureOurBranding, 3000);
  setTimeout(ensureOurBranding, 5000);
  setTimeout(ensureOurBranding, 10000);
});

// Also add event listeners to update meta tags when needed
window.addEventListener('load', () => {
  ensureOurBranding();
  // НОВЫЙ КОД: Еще раз обновить кэш после полной загрузки
  forceCacheRefresh();
  
  for (let i = 1; i <= 20; i++) {
    setTimeout(ensureOurBranding, i * 50);
  }
});

// Create an interval to continuously check and update our branding
setInterval(ensureOurBranding, 1000); // Check every second

// Create a MutationObserver to watch for document title changes
const titleObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.type === 'childList' || mutation.type === 'characterData') {
      cleanHeartSymbolsFromTitle();
    }
  });
});

// Start observing the title element
if (document.querySelector('title')) {
  titleObserver.observe(document.querySelector('title')!, {
    childList: true,
    characterData: true,
    subtree: true
  });
}

// НОВЫЙ КОД: Обработчик события видимости страницы
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    console.log('⚡ Page became visible - refreshing cache and branding');
    forceCacheRefresh();
    ensureOurBranding();
  }
});

// НОВЫЙ КОД: Активное обновление при смене сети
window.addEventListener('online', () => {
  console.log('🌐 Network connection restored - refreshing cache');
  forceCacheRefresh();
  ensureOurBranding();
});

// React app initialization
createRoot(document.getElementById("root")!).render(<App />);
