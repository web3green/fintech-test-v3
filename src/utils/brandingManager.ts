
/**
 * Utility to manage site branding and ensure consistent visual identity
 */

import { updateSocialMetaTags, enforceOurFavicon } from './metaTagManager';

// Функция для обеспечения нашего брендинга
export const ensureOurBranding = () => {
  // Начальное обновление
  updateSocialMetaTags();
  
  // Применить наш favicon
  enforceOurFavicon();
};

// Функция для планирования обновлений брендинга
export const scheduleMultipleBrandingUpdates = () => {
  // Запланировать несколько обновлений с меньшими задержками и большим количеством повторений
  for (let i = 1; i <= 10; i++) {
    setTimeout(ensureOurBranding, i * 100); // Обновлять каждые 100мс в течение 1 секунды
  }
  
  // Дополнительные обновления после более длительных задержек для обработки состояний поздней загрузки
  setTimeout(ensureOurBranding, 2000);
  setTimeout(ensureOurBranding, 5000);
};
