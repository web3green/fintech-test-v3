
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { updateSocialMetaTags, initializeFavicon } from './utils/metaTagManager'

// Блокируем дефолтный favicon.ico как можно раньше
document.head.insertAdjacentHTML('afterbegin', `
  <link rel="icon" href="data:," />
  <style>
    [rel="icon"][href*="heart"], 
    [rel*="icon"][href*="heart"],
    [rel="icon"][href*="favicon.ico"],
    [rel*="icon"][href*="favicon.ico"] {
      display: none !important;
    }
  </style>
`);

// Функция для агрессивного переопределения сердечного фавикона
const overrideHeartFavicon = () => {
  console.log('Aggressively overriding heart favicon...');
  
  // Инициализация фавикона немедленно
  initializeFavicon();
  
  // Обновление мета-тегов
  updateSocialMetaTags();
  
  // Заставляем браузер показать наш фавикон путем неоднократной инициализации
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      initializeFavicon();
      updateSocialMetaTags();
    }, i * 150); // Более частые обновления (каждые 150мс)
  }
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
  overrideHeartFavicon();
  
  // Также проверяем наличие 'favicon.ico' в document.head и удаляем его
  const links = document.querySelectorAll('link');
  links.forEach(link => {
    if (link.href.includes('favicon.ico') || link.href.includes('heart')) {
      console.log('Removing link with heart or favicon.ico in URL:', link.href);
      link.remove();
    }
  });
});

// Вызов перед любым другим кодом
overrideHeartFavicon();

// Устанавливаем интервал для периодических обновлений, чтобы фавикон оставался обновленным
window.addEventListener('load', () => {
  console.log('Window loaded, setting up continuous monitoring');
  
  // Начальное агрессивное переопределение
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      overrideHeartFavicon();
    }, i * 200);
  }
  
  // Создаем MutationObserver для отслеживания изменений в head элементе
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const addedNodes = Array.from(mutation.addedNodes);
        const heartIconAdded = addedNodes.some(node => {
          if (node.nodeName === 'LINK') {
            const href = (node as HTMLLinkElement).href;
            return href && (href.includes('heart') || href.includes('favicon.ico'));
          }
          return false;
        });
        
        if (heartIconAdded) {
          console.log('Heart icon detected in DOM mutation, removing it');
          overrideHeartFavicon();
        }
      }
    });
  });
  
  // Начинаем наблюдение за DOM
  observer.observe(document.head, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['href']
  });
  
  setInterval(() => {
    // Проверяем, не вернулся ли сердечный фавикон, и заменяем его
    const icons = document.querySelectorAll('link[rel^="icon"]');
    let foundHeart = false;
    
    icons.forEach(icon => {
      const href = icon.getAttribute('href');
      if (href && (href.includes('heart') || href.includes('favicon.ico'))) {
        console.log('Found heart icon, removing:', href);
        icon.remove();
        foundHeart = true;
      }
    });
    
    if (foundHeart || Date.now() % 5000 < 100) {
      overrideHeartFavicon();
    } else {
      initializeFavicon();
    }
  }, 800); // Проверяем чаще (каждые 800мс)
});

// Дополнительный механизм для переопределения кэшированного фавикона
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    console.log('Page restored from cache, reinitializing favicon');
    overrideHeartFavicon();
  }
});

createRoot(document.getElementById("root")!).render(<App />);
