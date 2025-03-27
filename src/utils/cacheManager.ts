
/**
 * Utility to manage browser cache and force refreshes
 */

// Функция для добавления метатегов против кеширования
export const addNoCacheMetaTags = () => {
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
export const forceCacheRefresh = () => {
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

// Функция для обновления стилей после загрузки
export const refreshStylesheets = () => {
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
};
