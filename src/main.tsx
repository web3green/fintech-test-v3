
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { updateSocialMetaTags, initializeFavicon } from './utils/metaTagManager'

// CRITICAL: Block gptengineer scripts ASAP
const blockGptEngineerScripts = () => {
  // Patch document.createElement to prevent GPTEng scripts from loading
  const originalCreateElement = Document.prototype.createElement;
  Document.prototype.createElement = function(tagName) {
    const element = originalCreateElement.call(this, tagName);
    if (tagName.toLowerCase() === 'script') {
      const originalSetAttribute = element.setAttribute;
      element.setAttribute = function(name, value) {
        if (name === 'src' && (
          value.includes('gpteng') || 
          value.includes('gptengineer') ||
          value.includes('engine')
        )) {
          console.log('Blocked loading of gptengineer script:', value);
          return element;
        }
        return originalSetAttribute.call(this, name, value);
      };
    }
    return element;
  };
  
  // Also intercept appendChild to prevent heart favicon
  const originalAppendChild = Node.prototype.appendChild;
  Node.prototype.appendChild = function(child) {
    if (child.nodeName === 'LINK') {
      const href = child.href || '';
      if (href.includes('heart') || 
          href.includes('favicon.ico') ||
          href.includes('gpteng') ||
          href.includes('gptengineer') ||
          href.includes('engine')) {
        console.log('Blocked appending of unwanted favicon:', href);
        return child; // Don't actually append
      }
    }
    if (child.nodeName === 'SCRIPT') {
      const src = child.src || '';
      if (src.includes('gpteng') || 
          src.includes('gptengineer') ||
          src.includes('engine')) {
        console.log('Blocked appending of gptengineer script:', src);
        return child; // Don't actually append
      }
    }
    return originalAppendChild.call(this, child);
  };
};

// Execute blocking IMMEDIATELY
blockGptEngineerScripts();

// Блокируем дефолтный favicon.ico и другие нежелательные иконки как можно раньше
document.head.insertAdjacentHTML('afterbegin', `
  <link rel="icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA/0lEQVR42mNkGGDAOOqAUQeMOmDUAaMO4D4AH2egFQAAgL7gNAOwAICvBzx+/Jjl4cOH8p8/f2YihJmZmbmYmJg3CQkJP6Fyn6H0F3Fxca+QkJCvKSkpX+Pi4r7/hYI/f/68//Tp09OJiYmvO39sEdZVNzU7evToWxkZme8gR/z8+fPPnz9/fv/69evv79+//0HB/4H4HxD/B+E/UP5/EP0fCYP4/xkYGBmA8v+A4vA4AMXRTwYsBuAK/FetWnVm7969x48cOXLi8ePHN27evHnj1q1bd+7cuXMPiO/CcBbQ9OfPn79y48aNG1euXLly+fLly5cuXbpw/vz5M2fOnDlNU1sAB1+QqgkWAlsAAAAASUVORK5CYII=" />
  <style>
    /* Block heart icon and other unwanted favicons */
    [rel="icon"][href*="heart"], 
    [rel*="icon"][href*="heart"],
    [rel="icon"][href*="favicon.ico"],
    [rel*="icon"][href*="favicon.ico"],
    [rel="icon"][href*="gptengineer"],
    [rel*="icon"][href*="gptengineer"],
    [rel="icon"][href*="gpteng"],
    [rel*="icon"][href*="gpteng"],
    [rel="icon"][href*="engine"],
    [rel*="icon"][href*="engine"] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      position: absolute !important;
      left: -9999px !important;
      top: -9999px !important;
    }
    
    /* Prevent any icons we don't explicitly allow */
    head > link[rel="icon"]:not([href^="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA"]) {
      display: none !important;
    }
  </style>
`);

// Функция для агрессивного переопределения нежелательных фавиконов
const overrideUnwantedFavicons = () => {
  console.log('Aggressively overriding unwanted favicons...');
  
  // Инициализация фавикона немедленно
  initializeFavicon();
  
  // Обновление мета-тегов
  updateSocialMetaTags();
  
  // Заставляем браузер показать наш фавикон путем неоднократной инициализации
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      initializeFavicon();
      updateSocialMetaTags();
    }, i * 50); // Очень частые обновления (каждые 50мс)
  }
  
  // Удаляем все нежелательные иконки из DOM
  const links = document.querySelectorAll('link');
  links.forEach(link => {
    const href = link.href || '';
    if (href.includes('heart') || 
        href.includes('favicon.ico') || 
        href.includes('gpteng') || 
        href.includes('gptengineer') ||
        href.includes('engine')) {
      console.log('Removing unwanted icon with URL:', href);
      link.remove();
    }
  });
  
  // Также проверяем и удаляем скрипты от gptengineer
  const scripts = document.querySelectorAll('script');
  scripts.forEach(script => {
    const src = script.src || '';
    if (src.includes('gpteng') || 
        src.includes('gptengineer') ||
        src.includes('engine')) {
      console.log('Removing script from gptengineer:', src);
      script.remove();
    }
  });
};

// Перехватываем кэшированный favicon.ico перед загрузкой всего остального
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, aggressively updating favicon...');
  
  // Создаем фиктивную ссылку favicon, чтобы перенаправить запросы браузера
  const link = document.createElement('link');
  link.rel = 'icon';
  link.href = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA/0lEQVR42mNkGGDAOOqAUQeMOmDUAaMO4D4AH2egFQAAgL7gNAOwAICvBzx+/Jjl4cOH8p8/f2YihJmZmbmYmJg3CQkJP6Fyn6H0F3Fxca+QkJCvKSkpX+Pi4r7/hYI/f/68//Tp09OJiYmvO39sEdZVNzU7evToWxkZme8gR/z8+fPPnz9/fv/69evv79+//0HB/4H4HxD/B+E/UP5/EP0fCYP4/xkYGBmA8v+A4vA4AMXRTwYsBuAK/FetWnVm7969x48cOXLi8ePHN27evHnj1q1bd+7cuXMPiO/CcBbQ9OfPn79y48aNG1euXLly+fLly5cuXbpw/vz5M2fOnDlNU1sAB1+QqgkWAlsAAAAASUVORK5CYII=';
  document.head.insertBefore(link, document.head.firstChild);
  
  // Затем переопределяем нашим реальным фавиконом
  overrideUnwantedFavicons();
  
  // Проверка на наличие скриптов от gptengineer
  const gptengScripts = document.querySelectorAll('script[src*="gpteng"], script[src*="gptengineer"], script[src*="engine"]');
  if (gptengScripts.length > 0) {
    console.log('Found gptengineer scripts, removing:', gptengScripts.length);
    gptengScripts.forEach(script => script.remove());
  }
  
  // Также блокируем любые будущие попытки загрузить эти скрипты
  const blockFutureScripts = document.createElement('script');
  blockFutureScripts.textContent = `
    (function() {
      const originalCreateElement = document.createElement;
      document.createElement = function(tagName) {
        const element = originalCreateElement.call(document, tagName);
        if (tagName.toLowerCase() === 'script') {
          const originalSetAttribute = element.setAttribute;
          element.setAttribute = function(name, value) {
            if (name === 'src' && (
              value.includes('gpteng') || 
              value.includes('gptengineer') ||
              value.includes('engine')
            )) {
              console.log('Blocked loading of gptengineer script:', value);
              return;
            }
            return originalSetAttribute.call(this, name, value);
          };
        }
        return element;
      };
    })();
  `;
  document.head.appendChild(blockFutureScripts);
});

// Вызов перед любым другим кодом
overrideUnwantedFavicons();

// Устанавливаем интервал для периодических обновлений, чтобы фавикон оставался обновленным
window.addEventListener('load', () => {
  console.log('Window loaded, setting up continuous monitoring');
  
  // Начальное агрессивное переопределение
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      overrideUnwantedFavicons();
    }, i * 100);
  }
  
  // Создаем MutationObserver для отслеживания изменений в head элементе
  const observer = new MutationObserver((mutations) => {
    let unwantedIconAdded = false;
    let unwantedScriptAdded = false;
    
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const addedNodes = Array.from(mutation.addedNodes);
        
        // Проверяем на нежелательные иконки
        unwantedIconAdded = addedNodes.some(node => {
          if (node.nodeName === 'LINK') {
            const href = (node as HTMLLinkElement).href;
            return href && (
              href.includes('heart') || 
              href.includes('favicon.ico') ||
              href.includes('gpteng') ||
              href.includes('gptengineer') ||
              href.includes('engine')
            );
          }
          return false;
        });
        
        // Проверяем на нежелательные скрипты
        unwantedScriptAdded = addedNodes.some(node => {
          if (node.nodeName === 'SCRIPT') {
            const src = (node as HTMLScriptElement).src;
            return src && (
              src.includes('gpteng') || 
              src.includes('gptengineer') ||
              src.includes('engine')
            );
          }
          return false;
        });
      }
    });
    
    if (unwantedIconAdded) {
      console.log('Unwanted icon detected in DOM mutation, removing it');
      overrideUnwantedFavicons();
    }
    
    if (unwantedScriptAdded) {
      console.log('Unwanted script detected in DOM mutation, removing it');
      const scripts = document.querySelectorAll('script[src*="gpteng"], script[src*="gptengineer"], script[src*="engine"]');
      scripts.forEach(script => script.remove());
    }
  });
  
  // Начинаем наблюдение за DOM
  observer.observe(document.head, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['href', 'src']
  });
  
  // Также наблюдаем за body на предмет динамически добавляемых скриптов
  const bodyObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasGptEngScript = addedNodes.some(node => {
          if (node.nodeName === 'SCRIPT') {
            const src = (node as HTMLScriptElement).src;
            return src && (
              src.includes('gpteng') || 
              src.includes('gptengineer') ||
              src.includes('engine')
            );
          }
          return false;
        });
        
        if (hasGptEngScript) {
          console.log('Detected gptengineer script in body, removing it');
          const scripts = document.querySelectorAll('script[src*="gpteng"], script[src*="gptengineer"], script[src*="engine"]');
          scripts.forEach(script => script.remove());
        }
      }
    });
  });
  
  bodyObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Проверяем на нежелательные иконки каждые 100мс
  setInterval(() => {
    // Проверяем, не вернулся ли нежелательный фавикон, и заменяем его
    const icons = document.querySelectorAll('link[rel^="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]');
    let foundUnwanted = false;
    
    icons.forEach(icon => {
      const href = icon.getAttribute('href') || '';
      if (href && (
        href.includes('heart') || 
        href.includes('favicon.ico') ||
        href.includes('gpteng') ||
        href.includes('gptengineer') ||
        href.includes('engine')
      )) {
        console.log('Found unwanted icon, removing:', href);
        icon.remove();
        foundUnwanted = true;
      }
    });
    
    if (foundUnwanted) {
      overrideUnwantedFavicons();
    } else {
      // Периодически обновляем фавикон даже если не обнаружено нежелательных иконок
      if (Date.now() % 1000 < 100) {
        initializeFavicon();
      }
    }
  }, 100);
});

// Дополнительный механизм для переопределения кэшированного фавикона
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    console.log('Page restored from cache, reinitializing favicon');
    overrideUnwantedFavicons();
  }
});

// Блокируем все запросы к gptengineer.co или связанным доменам
const originalFetch = window.fetch;
window.fetch = function(input, init) {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  if (url && (
    url.includes('gpteng') || 
    url.includes('gptengineer') ||
    url.includes('engine')
  )) {
    console.log('Blocked fetch request to:', url);
    return Promise.reject(new Error('Request blocked'));
  }
  return originalFetch.apply(this, arguments);
};

const originalXMLHttpRequest = window.XMLHttpRequest;
window.XMLHttpRequest = function() {
  const xhr = new originalXMLHttpRequest();
  const originalOpen = xhr.open;
  xhr.open = function(method, url, ...args) {
    if (url && typeof url === 'string' && (
      url.includes('gpteng') || 
      url.includes('gptengineer') ||
      url.includes('engine')
    )) {
      console.log('Blocked XHR request to:', url);
      throw new Error('Request blocked');
    }
    return originalOpen.call(this, method, url, ...args);
  };
  return xhr;
} as any;

createRoot(document.getElementById("root")!).render(<App />);
