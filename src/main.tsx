
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// CRITICAL: Define our favicon base64 data
const OUR_FAVICON_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA/0lEQVR42mNkGGDAOOqAUQeMOmDUAaMO4D4AH2egFQAAgL7gNAOwAICvBzx+/Jjl4cOH8p8/f2YihJmZmbmYmJg3CQkJP6Fyn6H0F3Fxca+QkJCvKSkpX+Pi4r7/hYI/f/68//Tp09OJiYmvO39sEdZVNzU7evToWxkZme8gR/z8+fPPnz9/fv/69evv79+//0HB/4H4HxD/B+E/UP5/EP0fCYP4/xkYGBmA8v+A4vA4AMXRTwYsBuAK/FetWnVm7969x48cOXLi8ePHN27evHnj1q1bd+7cuXMPiO/CcBbQ9OfPn79y48aNG1euXLly+fLly5cuXbpw/vz5M2fOnDlNU1sAB1+QqgkWAlsAAAAASUVORK5CYII=';

// Блокируем дефолтный favicon.ico и другие нежелательные иконки как можно раньше
document.head.insertAdjacentHTML('afterbegin', `
  <link rel="icon" href="${OUR_FAVICON_BASE64}" />
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

// Функция для установки нашего фавикона
const setOurFavicon = () => {
  // Удаляем все нежелательные иконки
  const unwantedIcons = document.querySelectorAll(
    'link[href*="heart"], link[href*="favicon.ico"], link[href*="gpteng"], link[href*="gptengineer"]'
  );
  unwantedIcons.forEach(icon => icon.remove());
  
  // Добавляем наш фавикон
  const link = document.createElement('link');
  link.rel = 'icon';
  link.href = OUR_FAVICON_BASE64;
  document.head.appendChild(link);
};

// Вызываем функцию установки фавикона немедленно
setOurFavicon();

// Переопределяем родные методы DOM для блокировки нежелательных элементов
const originalCreateElement = Document.prototype.createElement;
Document.prototype.createElement = function(tagName) {
  const element = originalCreateElement.call(this, tagName);
  if (tagName.toLowerCase() === 'link') {
    const originalSetAttribute = element.setAttribute;
    element.setAttribute = function(name, value) {
      if (name === 'rel' && value.includes('icon')) {
        console.log('Intercepted favicon creation');
        if (name === 'href' && (
          value.includes('heart') || 
          value.includes('favicon.ico') ||
          value.includes('gpteng') || 
          value.includes('gptengineer')
        )) {
          console.log('Blocked unwanted favicon:', value);
          return element;
        }
      }
      return originalSetAttribute.call(this, name, value);
    };
  }
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

// Также перехватываем appendChild для предотвращения добавления нежелательных элементов
const originalAppendChild = Node.prototype.appendChild;
Node.prototype.appendChild = function(child) {
  if (child.nodeName === 'LINK') {
    const rel = child.rel || '';
    const href = child.href || '';
    if (rel.includes('icon') && (
      href.includes('heart') || 
      href.includes('favicon.ico') ||
      href.includes('gpteng') || 
      href.includes('gptengineer')
    )) {
      console.log('Blocked appending of unwanted favicon:', href);
      return child;
    }
  }
  if (child.nodeName === 'SCRIPT') {
    const src = child.src || '';
    if (src.includes('gpteng') || 
        src.includes('gptengineer') ||
        src.includes('engine')) {
      console.log('Blocked appending of gptengineer script:', src);
      return child;
    }
  }
  return originalAppendChild.call(this, child);
};

// Устанавливаем интервалы для агрессивного переопределения фавикона
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, aggressively updating favicon...');
  
  // Устанавливаем фавикон несколько раз с небольшими интервалами
  for (let i = 0; i < 20; i++) {
    setTimeout(setOurFavicon, i * 100);
  }
  
  // Устанавливаем интервал для периодической проверки и обновления
  setInterval(() => {
    const unwantedIcons = document.querySelectorAll(
      'link[href*="heart"], link[href*="favicon.ico"], link[href*="gpteng"], link[href*="gptengineer"]'
    );
    
    if (unwantedIcons.length > 0) {
      console.log('Found unwanted favicons, removing them');
      unwantedIcons.forEach(icon => icon.remove());
      setOurFavicon();
    }
  }, 500);
});

// Рендерим приложение
createRoot(document.getElementById("root")!).render(<App />);
