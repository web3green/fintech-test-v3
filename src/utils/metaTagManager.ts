
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

// Функция для предотвращения запроса браузером дефолтного favicon.ico
const blockDefaultFavicon = () => {
  // Создаем пустой фавикон чтобы предотвратить запрос браузером favicon.ico
  const link = document.createElement('link');
  link.rel = 'icon';
  link.href = 'data:,';
  document.head.insertBefore(link, document.head.firstChild);
};

// Полностью удаляем favicon.ico если он существует по пути
const removeFaviconByHref = (href: string) => {
  const links = document.querySelectorAll('link');
  links.forEach(link => {
    if (link.href.includes(href)) {
      console.log('Removing specific favicon by href:', href);
      link.remove();
    }
  });
};

// Функция блокировки сердечка
const blockHeartIcon = () => {
  // Добавляем CSS для блокировки сердечка
  const style = document.createElement('style');
  style.textContent = `
    [rel="icon"][href*="heart"],
    [rel="icon"][href*="favicon.ico"],
    [rel*="icon"][href*="heart"],
    [rel*="icon"][href*="favicon.ico"] {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
};

// Функция для инициализации фавикона с экстремальным приоритетом
export const initializeFavicon = () => {
  try {
    const { absolute: logoUrl } = getLogoUrl(false);
    
    // Блокируем сердечко CSS правилом
    blockHeartIcon();
    
    // Блокируем стандартный фавикон сначала
    blockDefaultFavicon();
    
    // Специально ищем и удаляем любую сердечную иконку или favicon.ico
    removeFaviconByHref('favicon.ico');
    removeFaviconByHref('heart');
    
    // Удаляем все существующие ссылки на фавиконы - более агрессивный подход
    const existingIcons = document.querySelectorAll('link[rel^="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]');
    console.log('Removing existing favicons:', existingIcons.length);
    existingIcons.forEach(icon => icon.remove());
    
    // Сначала создаем base64 фавикон, чтобы немедленно переопределить любые стандартные
    createFaviconElementFromBase64();
    
    // Затем добавляем наши обычные ссылки на фавикон
    const favIcon = document.createElement('link');
    favIcon.rel = 'icon';
    favIcon.href = logoUrl;
    favIcon.type = 'image/png';
    // Добавляем более высокий приоритет, вставляя в начало head
    document.head.insertBefore(favIcon, document.head.firstChild);
    
    const shortcutIcon = document.createElement('link');
    shortcutIcon.rel = 'shortcut icon';
    shortcutIcon.href = logoUrl;
    shortcutIcon.type = 'image/png';
    document.head.insertBefore(shortcutIcon, document.head.firstChild);
    
    const appleIcon = document.createElement('link');
    appleIcon.rel = 'apple-touch-icon';
    appleIcon.href = logoUrl;
    document.head.insertBefore(appleIcon, document.head.firstChild);
    
    // Создаем маску иконки, чтобы переопределить любой стандартный фавикон
    const maskIcon = document.createElement('link');
    maskIcon.rel = 'mask-icon';
    maskIcon.href = logoUrl;
    document.head.insertBefore(maskIcon, document.head.firstChild);
    
    // Пытаемся переопределить favicon.ico напрямую ссылкой
    const faviconIco = document.createElement('link');
    faviconIco.rel = 'icon';
    faviconIco.href = logoUrl;
    faviconIco.type = 'image/x-icon';
    document.head.insertBefore(faviconIco, document.head.firstChild);
    
    console.log('Favicon initialized successfully with:', logoUrl);
  } catch (error) {
    console.error('Error initializing favicon:', error);
  }
};
