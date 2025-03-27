import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { 
  updateSocialMetaTags, 
  enforceOurFavicon 
} from './utils/metaTagManager'

// Ensure we have a stable root element
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found. Make sure there is a div with id 'root' in your HTML.");
}

// Use a single root instance to prevent the "container has already been passed to createRoot()" error
const root = createRoot(rootElement);

// Добавляем метатеги для предотвращения кеширования
const addNoCacheMetaTags = () => {
  const metaTags = [
    { httpEquiv: 'Cache-Control', content: 'no-cache, no-store, must-revalidate, max-age=0' },
    { httpEquiv: 'Pragma', content: 'no-cache' },
    { httpEquiv: 'Expires', content: '0' },
    // Добавляем уникальный идентификатор версии для принудительного сброса кеша
    { name: 'app-version', content: `${Date.now()}` }
  ];

  metaTags.forEach(meta => {
    // Удаляем существующие теги, если они есть
    const existingTag = document.querySelector(`meta[${meta.httpEquiv ? 'http-equiv' : 'name'}="${meta.httpEquiv || meta.name}"]`);
    if (existingTag) existingTag.remove();
    
    // Создаем и добавляем новый тег
    const metaTag = document.createElement('meta');
    if (meta.httpEquiv) metaTag.httpEquiv = meta.httpEquiv;
    if (meta.name) metaTag.name = meta.name;
    metaTag.content = meta.content;
    document.head.appendChild(metaTag);
  });
  
  console.log('🚫 Добавлены метатеги для предотвращения кеширования');
};

// Функция для принудительного обновления кэша
const forceCacheRefresh = () => {
  console.log('🔄 Принудительное обновление кэша:', new Date().toISOString());
  
  // Добавляем метатеги против кеширования
  addNoCacheMetaTags();
  
  // Добавить случайный параметр к URL всех CSS файлов для сброса кэша
  document.querySelectorAll('link[rel="stylesheet"]').forEach(linkEl => {
    if (linkEl instanceof HTMLLinkElement && linkEl.href) {
      const url = new URL(linkEl.href);
      url.searchParams.set('_cache', Date.now().toString());
      linkEl.href = url.toString();
      console.log('📑 Обновление CSS:', url.toString());
    }
  });
  
  // То же самое для скриптов
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
          console.log('📜 Обновление Script:', url.toString());
        }
      }
    }
  });
  
  // Намекнуть браузеру обновить все ресурсы
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
            console.log('🔍 Предзагрузка ресурса:', cacheBusterUrl);
            
            // Удалить через короткую задержку
            setTimeout(() => link.remove(), 1000);
          }
        }
      });
    } catch (e) {
      console.warn('❌ Не удалось проанализировать resource timing:', e);
    }
  }
  
  // Создать и применить временный стиль для принудительного обновления отображения
  const forceRepaintStyle = document.createElement('style');
  forceRepaintStyle.textContent = 'body { animation: force-repaint 0.1s; } @keyframes force-repaint { from { opacity: 0.99; } to { opacity: 1; } }';
  document.head.appendChild(forceRepaintStyle);
  
  // Удалить стиль через короткую задержку
  setTimeout(() => forceRepaintStyle.remove(), 300);
  
  // Принудительно заставить браузер перезагрузить некоторые ресурсы
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister();
        console.log('🧹 Отменена регистрация Service Worker');
      });
    });
  }
  
  // Попытка очистить кеш с помощью Cache API, если доступно
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        caches.delete(cacheName);
        console.log('🧹 Удален кеш:', cacheName);
      });
    });
  }
};

// Функция для обеспечения нашего брендинга
const ensureOurBranding = () => {
  // Начальное обновление
  updateSocialMetaTags();
  
  // Применить наш favicon
  enforceOurFavicon();
};

// Инициализировать мета-теги до загрузки React
document.addEventListener('DOMContentLoaded', () => {
  // Начальная настройка
  ensureOurBranding();
  
  // Принудительное обновление кэша
  forceCacheRefresh();
  
  // Запланировать несколько обновлений с меньшими задержками и большим количеством повторений
  for (let i = 1; i <= 10; i++) {
    setTimeout(ensureOurBranding, i * 100); // Обновлять каждые 100мс в течение 1 секунды
  }
  
  // Дополнительные обновления после более длительных задержек для обработки состояний поздней загрузки
  setTimeout(ensureOurBranding, 2000);
  setTimeout(ensureOurBranding, 5000);
});

// Также добавить обработчики событий для обновления мета-тегов при необходимости
window.addEventListener('load', () => {
  console.log('📄 Страница полностью загружена');
  ensureOurBranding();
  // Обновить кэш после полной загрузки
  forceCacheRefresh();
  
  // Также обновить стили после полной загрузки
  document.querySelectorAll('link[rel="stylesheet"]').forEach(linkEl => {
    if (linkEl instanceof HTMLLinkElement) {
      // Клонировать стиль для обновления
      const newLink = document.createElement('link');
      newLink.rel = 'stylesheet';
      newLink.href = `${linkEl.href}?_t=${Date.now()}`;
      newLink.onload = () => {
        // После загрузки нового стиля удалить старый
        linkEl.remove();
        console.log('🎨 Стиль переподключен:', newLink.href);
      };
      document.head.appendChild(newLink);
    }
  });
  
  for (let i = 1; i <= 5; i++) {
    setTimeout(ensureOurBranding, i * 200);
  }
});

// Создать интервал для проверки и обновления нашего брендинга
setInterval(ensureOurBranding, 5000); // Проверять каждые 5 секунд

// Добавим проверку изменений в DOM и принудительное обновление при них
const observeDOM = () => {
  const observer = new MutationObserver(mutations => {
    let shouldRefresh = false;
    mutations.forEach(mutation => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        shouldRefresh = true;
      }
    });
    
    if (shouldRefresh) {
      console.log('🔄 Обнаружены изменения в DOM, обновляем кеш');
      ensureOurBranding();
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src', 'href', 'style', 'class']
  });
  
  return observer;
};

// Запускаем наблюдатель за DOM
const domObserver = observeDOM();

// Обработка события видимости страницы
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    console.log('⚡ Страница стала видимой - обновляем кэш и брендинг');
    forceCacheRefresh();
    ensureOurBranding();
  }
});

// Обработка изменения статуса сети
window.addEventListener('online', () => {
  console.log('🌐 Сетевое соединение восстановлено - обновляем кэш');
  forceCacheRefresh();
  ensureOurBranding();
});

// Добавить обработчик для принудительного обновления страницы при смене языка
window.addEventListener('languagechange', () => {
  console.log('🌍 Обнаружено изменение языка - обновляем кэш');
  forceCacheRefresh();
});

// Создать пользовательское событие для принудительного обновления содержимого
const refreshEvent = new CustomEvent('app:refresh');
window.dispatchEvent(refreshEvent);

// Render App only once to avoid duplicate instances
root.render(<App />);

// Add explicit HMR handling for development mode
if (import.meta.hot) {
  try {
    // Correctly configured HMR acceptance for App component
    import.meta.hot.accept('./App.tsx', () => {
      console.log('🔄 Hot Module Replacement: Updating App component');
      try {
        // Render the updated App component
        root.render(<App />);
      } catch (error) {
        console.error('❌ Error during HMR update:', error);
      }
    });
    
    // Accept global HMR
    import.meta.hot.accept();
    
    // Add listener for HMR errors
    import.meta.hot.on('error', (error) => {
      console.error('❌ HMR Error:', error);
    });
  } catch (err) {
    console.error('HMR setup failed:', err);
    // Fallback - if HMR fails, refresh the page
    window.location.reload();
  }
}
