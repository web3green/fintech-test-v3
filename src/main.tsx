
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { forceCacheRefresh, refreshStylesheets } from './utils/cacheManager'
import { ensureOurBranding, scheduleMultipleBrandingUpdates } from './utils/brandingManager'
import { observeDOM } from './utils/domObserver'
import { setupHMR } from './utils/hmrManager'
import { setupEventListeners } from './utils/eventListenersManager'

// Ensure we have a stable root element
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found. Make sure there is a div with id 'root' in your HTML.");
}

// Use a single root instance to prevent the "container has already been passed to createRoot()" error
const root = createRoot(rootElement);

// Инициализировать мета-теги до загрузки React
document.addEventListener('DOMContentLoaded', () => {
  // Начальная настройка
  ensureOurBranding();
  
  // Принудительное обновление кэша
  forceCacheRefresh();
  
  // Запланировать несколько обновлений брендинга
  scheduleMultipleBrandingUpdates();
});

// Также добавить обработчики событий для обновления мета-тегов при необходимости
window.addEventListener('load', () => {
  console.log('📄 Страница полностью загружена');
  ensureOurBranding();
  
  // Обновить кэш после полной загрузки
  forceCacheRefresh();
  
  // Также обновить стили после полной загрузки
  refreshStylesheets();
  
  for (let i = 1; i <= 5; i++) {
    setTimeout(ensureOurBranding, i * 200);
  }
});

// Создать интервал для проверки и обновления нашего брендинга
setInterval(ensureOurBranding, 5000); // Проверять каждые 5 секунд

// Запускаем наблюдатель за DOM
const domObserver = observeDOM();

// Настраиваем обработчики событий
setupEventListeners();

// Render App only once to avoid duplicate instances
root.render(<App />);

// Setup HMR for development
setupHMR(root);
