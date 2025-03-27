
/**
 * Utility to manage window and document event listeners
 */

import { forceCacheRefresh } from './cacheManager';
import { ensureOurBranding } from './brandingManager';

// Setup document and window event listeners
export const setupEventListeners = () => {
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
};
