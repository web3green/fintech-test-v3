
/**
 * Utility to manage meta tags for proper social media sharing
 */

// Define the image URL with both absolute and relative paths
export const getLogoUrl = (withTimestamp = true) => {
  const timestamp = withTimestamp ? `?t=${Date.now()}` : '';
  
  // Use the Lovable preview URL for the logo since it works reliably
  const logoUrl = `https://preview--fintech-simplicity.lovable.app/lovable-uploads/3655bf6b-6880-47b7-b1f7-9129d0f48bc0.png${timestamp}`;
  
  return {
    relative: logoUrl,
    absolute: logoUrl
  };
};

// Track last update time to prevent too frequent updates
let lastUpdateTimestamp = 0;
const UPDATE_INTERVAL = 5000; // 5 seconds

// Update meta tags for social sharing
export const updateSocialMetaTags = () => {
  const now = Date.now();
  
  // Prevent updating too frequently
  if (now - lastUpdateTimestamp < UPDATE_INTERVAL) {
    return null;
  }
  
  lastUpdateTimestamp = now;
  
  const { absolute: logoUrl } = getLogoUrl();
  
  // Helper function to create or update meta tags
  const updateMetaTag = (selector: string, value: string, isProperty = true) => {
    let meta = isProperty 
      ? document.querySelector(`meta[property="${selector}"]`)
      : document.querySelector(`meta[name="${selector}"]`);
      
    if (!meta) {
      meta = document.createElement('meta');
      if (isProperty) {
        meta.setAttribute('property', selector);
      } else {
        meta.setAttribute('name', selector);
      }
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', value);
  };
  
  // Update all social media tags with the new URL
  updateMetaTag('og:image', logoUrl);
  updateMetaTag('og:image:url', logoUrl);
  updateMetaTag('og:image:secure_url', logoUrl);
  updateMetaTag('twitter:image', logoUrl);
  
  // Force no caching
  updateMetaTag('Cache-Control', 'no-cache, no-store, must-revalidate', false);
  updateMetaTag('Pragma', 'no-cache', false);
  updateMetaTag('Expires', '0', false);
  
  console.log('Meta tags updated with new URL:', logoUrl);
  
  // Update favicon links
  initializeFavicon();
  
  return logoUrl;
};

// Наше точное лого компании как base64 строка - напрямую встроена чтобы избежать любых сетевых запросов
// Это квадратная синяя иконка соответствующая нашему бренду
const OUR_LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA/0lEQVR42mNkGGDAOOqAUQeMOmDUAaMO4D4AH2egFQAAgL7gNAOwAICvBzx+/Jjl4cOH8p8/f2YihJmZmbmYmJg3CQkJP6Fyn6H0F3Fxca+QkJCvKSkpX+Pi4r7/hYI/f/68//Tp09OJiYmvO39sEdZVNzU7evToWxkZme8gR/z8+fPPnz9/fv/69evv79+//0HB/4H4HxD/B+E/UP5/EP0fCYP4/xkYGBmA8v+A4vA4AMXRTwYsBuAK/FetWnVm7969x48cOXLi8ePHN27evHnj1q1bd+7cuXMPiO/CcBbQ9OfPn79y48aNG1euXLly+fLly5cuXbpw/vz5M2fOnDlNU1sAB1+QqgkWAlsAAAAASUVORK5CYII=';

// Функция для поиска и блокировки всех нежелательных скриптов
const blockUndesiredScripts = () => {
  const scripts = document.querySelectorAll('script');
  scripts.forEach(script => {
    const src = script.src || '';
    if (src.includes('gpteng') || src.includes('gptengineer') || src.includes('engine')) {
      console.log('Blocking undesired script:', src);
      script.remove();
    }
  });
};

// Функция для прямого создания и вставки новой favicon.ico в DOM
// Этот подход перехватывает запросы браузера для favicon.ico
const createFaviconElementFromBase64 = () => {
  // Создаем элемент ссылки для фавикона используя нашу встроенную base64 лого
  const link = document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'icon';
  link.href = OUR_LOGO_BASE64;
  
  // Добавляем фавикон в head документа с наивысшим приоритетом
  document.head.insertBefore(link, document.head.firstChild);
  
  return link;
};

// Создание пустой картинки для блокировки стандартного favicon.ico запроса
const blockDefaultFavicon = () => {
  // Создаем пустой фавикон чтобы предотвратить запрос браузером favicon.ico
  const link = document.createElement('link');
  link.rel = 'icon';
  link.href = 'data:,';
  document.head.insertBefore(link, document.head.firstChild);
};

// Массовое удаление всех favicon.ico и сердечных иконок
const removeAllUnwantedFavicons = () => {
  const links = document.querySelectorAll('link');
  links.forEach(link => {
    const href = link.href || '';
    const rel = link.rel || '';
    
    if (rel.includes('icon') || rel === 'shortcut icon' || rel === 'apple-touch-icon') {
      if (href.includes('heart') || 
          href.includes('favicon.ico') ||
          href.includes('gpteng') || 
          href.includes('gptengineer') ||
          href.includes('engine') ||
          !href.includes(OUR_LOGO_BASE64.substring(0, 30))) {
        console.log('Removing unwanted favicon:', href);
        link.remove();
      }
    }
  });
};

// Функция блокировки сердечка и других нежелательных иконок CSS-правилами
const blockHeartIcon = () => {
  // Проверяем существует ли уже наш стиль
  if (document.getElementById('favicon-blocker')) {
    return;
  }
  
  // Добавляем CSS для блокировки сердечка и других нежелательных иконок
  const style = document.createElement('style');
  style.id = 'favicon-blocker';
  style.textContent = `
    /* Блокируем все нежелательные иконки */
    [rel="icon"][href*="heart"],
    [rel="icon"][href*="favicon.ico"],
    [rel*="icon"][href*="heart"],
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
    
    /* Разрешаем только наши иконки */
    [rel="icon"][href^="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA"],
    [rel="shortcut icon"][href^="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA"],
    [rel="apple-touch-icon"][href^="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA"] {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      position: static !important;
    }
  `;
  document.head.appendChild(style);
};

// Блокировка скрипта gpteng.co
const blockGptEngScript = () => {
  // Поиск скрипта от gpteng.co
  const scripts = document.querySelectorAll('script');
  scripts.forEach(script => {
    if (script.src && (
      script.src.includes('gpteng.co') || 
      script.src.includes('gptengineer') ||
      script.src.includes('engine')
    )) {
      console.log('Found and blocking GPTEngineer script:', script.src);
      
      // Удаляем скрипт
      script.remove();
      
      // Также блокируем все потенциальные будущие скрипты от того же домена
      const scriptBlocking = document.createElement('script');
      scriptBlocking.textContent = `
        // Блокируем все скрипты от gptengineer
        const originalCreateElement = document.createElement;
        document.createElement = function(tagName) {
          const element = originalCreateElement.call(document, tagName);
          if (tagName.toLowerCase() === 'script') {
            const originalSetAttribute = element.setAttribute;
            element.setAttribute = function(name, value) {
              if (name === 'src' && (
                value.includes('gpteng.co') || 
                value.includes('gptengineer') ||
                value.includes('engine')
              )) {
                console.log('Blocking script:', value);
                return;
              }
              return originalSetAttribute.call(this, name, value);
            };
          }
          return element;
        };
      `;
      document.head.appendChild(scriptBlocking);
    }
  });
};

// Функция для агрессивного переписывания тегов head, чтобы заблокировать нежелательные иконки
const overrideHeadTags = () => {
  // Блокируем нежелательные скрипты
  blockGptEngScript();
  blockUndesiredScripts();
  
  // Удаляем все нежелательные иконки
  removeAllUnwantedFavicons();
  
  // Блокируем стандартный favicon.ico запрос
  blockDefaultFavicon();
  
  // Добавляем CSS правила для блокировки нежелательных иконок
  blockHeartIcon();
  
  // Создаем новую favicon с нашим логотипом
  createFaviconElementFromBase64();
  
  // Добавляем еще иконки с нашим логотипом
  const { absolute: logoUrl } = getLogoUrl(false);
  
  // Создаем дополнительные иконки
  const iconTypes = [
    { rel: 'icon', type: 'image/png' },
    { rel: 'shortcut icon', type: 'image/png' },
    { rel: 'apple-touch-icon' }
  ];
  
  // Создаем все типы иконок
  iconTypes.forEach(iconType => {
    const link = document.createElement('link');
    link.rel = iconType.rel;
    link.href = logoUrl;
    if (iconType.type) {
      link.type = iconType.type;
    }
    document.head.insertBefore(link, document.head.firstChild);
  });
};

// Функция для инициализации фавикона с экстремальным приоритетом
export const initializeFavicon = () => {
  try {
    // Блокируем сердечко и другие нежелательные иконки CSS правилом
    blockHeartIcon();
    
    // Полностью переопределяем все теги в head для блокировки нежелательных иконок
    overrideHeadTags();
    
    console.log('Favicon initialized successfully');
    
    // Обеспечиваем, что наша функция будет вызвана снова, если что-то изменится в DOM
    if (!window['faviconObserver']) {
      const observer = new MutationObserver((mutations) => {
        let needsUpdate = false;
        
        for (const mutation of mutations) {
          if (mutation.type === 'childList' || mutation.type === 'attributes') {
            needsUpdate = true;
            break;
          }
        }
        
        if (needsUpdate) {
          console.log('DOM changed, reinitializing favicon');
          overrideHeadTags();
        }
      });
      
      // Наблюдаем за изменениями в head
      observer.observe(document.head, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['href', 'rel']
      });
      
      window['faviconObserver'] = observer;
    }
  } catch (error) {
    console.error('Error initializing favicon:', error);
  }
};
