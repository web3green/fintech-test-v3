
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { updateSocialMetaTags, initializeFavicon } from './utils/metaTagManager'

// Блокируем дефолтный favicon.ico и другие нежелательные иконки как можно раньше
document.head.insertAdjacentHTML('afterbegin', `
  <link rel="icon" href="data:," />
  <style>
    [rel="icon"][href*="heart"], 
    [rel*="icon"][href*="heart"],
    [rel="icon"][href*="favicon.ico"],
    [rel*="icon"][href*="favicon.ico"],
    [rel="icon"][href*="gptengineer"],
    [rel*="icon"][href*="gptengineer"],
    [rel="icon"][href*="gpteng"],
    [rel*="icon"][href*="gpteng"] {
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
    }, i * 100); // Очень частые обновления (каждые 100мс)
  }
  
  // Удаляем все нежелательные иконки из DOM
  const links = document.querySelectorAll('link');
  links.forEach(link => {
    const href = link.href || '';
    if (href.includes('heart') || 
        href.includes('favicon.ico') || 
        href.includes('gpteng') || 
        href.includes('gptengineer')) {
      console.log('Removing unwanted icon with URL:', href);
      link.remove();
    }
  });
};

// Перехватываем кэшированный favicon.ico перед загрузкой всего остального
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, aggressively updating favicon...');
  
  // Создаем фиктивную ссылку favicon, чтобы перенаправить запросы браузера
  const link = document.createElement('link');
  link.rel = 'icon';
  link.href = 'data:,'; // Пустой фавикон для предотвращения запросов браузером favicon.ico
  document.head.appendChild(link);
  
  // Затем переопределяем нашим реальным фавиконом
  overrideUnwantedFavicons();
  
  // Также проверяем наличие нежелательных иконок в document.head и удаляем их
  const links = document.querySelectorAll('link');
  links.forEach(link => {
    const href = link.href || '';
    if (href.includes('heart') || 
        href.includes('favicon.ico') || 
        href.includes('gpteng') || 
        href.includes('gptengineer')) {
      console.log('Removing unwanted icon with URL:', href);
      link.remove();
    }
  });
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
    }, i * 150);
  }
  
  // Создаем MutationObserver для отслеживания изменений в head элементе
  const observer = new MutationObserver((mutations) => {
    let unwantedIconAdded = false;
    
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const addedNodes = Array.from(mutation.addedNodes);
        unwantedIconAdded = addedNodes.some(node => {
          if (node.nodeName === 'LINK') {
            const href = (node as HTMLLinkElement).href;
            return href && (
              href.includes('heart') || 
              href.includes('favicon.ico') ||
              href.includes('gpteng') ||
              href.includes('gptengineer')
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
  });
  
  // Начинаем наблюдение за DOM
  observer.observe(document.head, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['href']
  });
  
  // Проверяем на нежелательные иконки каждые 500мс
  setInterval(() => {
    // Проверяем, не вернулся ли нежелательный фавикон, и заменяем его
    const icons = document.querySelectorAll('link[rel^="icon"]');
    let foundUnwanted = false;
    
    icons.forEach(icon => {
      const href = icon.getAttribute('href') || '';
      if (href && (
        href.includes('heart') || 
        href.includes('favicon.ico') ||
        href.includes('gpteng') ||
        href.includes('gptengineer')
      )) {
        console.log('Found unwanted icon, removing:', href);
        icon.remove();
        foundUnwanted = true;
      }
    });
    
    if (foundUnwanted || Date.now() % 3000 < 100) {
      overrideUnwantedFavicons();
    } else {
      initializeFavicon();
    }
  }, 500);
});

// Дополнительный механизм для переопределения кэшированного фавикона
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    console.log('Page restored from cache, reinitializing favicon');
    overrideUnwantedFavicons();
  }
});

createRoot(document.getElementById("root")!).render(<App />);
