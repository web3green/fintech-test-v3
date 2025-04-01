/**
 * Утилита для управления кешем и хранилищем браузера
 */

// Функция для очистки кеша браузера
export const clearBrowserCache = async (): Promise<void> => {
  try {
    // Проверка, работаем ли мы в браузере
    if (typeof window === 'undefined' || typeof caches === 'undefined') {
      return;
    }

    console.log('[Cleanup] Попытка очистки кеша браузера...');

    // 1. Очистка кеша через Cache API, если доступно
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      console.log(`[Cleanup] Найдено ${cacheNames.length} кешей для очистки`);
      
      // Удаляем все кеши
      await Promise.all(
        cacheNames.map(cacheName => {
          console.log(`[Cleanup] Удаление кеша: ${cacheName}`);
          return caches.delete(cacheName);
        })
      );
    }

    // 2. Попытка очистить localStorage от предыдущих настроек
    try {
      localStorage.removeItem('logo-settings');
      localStorage.removeItem('logo-cache');
      localStorage.removeItem('logo-timestamp');
    } catch (e) {
      console.warn('[Cleanup] Не удалось очистить localStorage:', e);
    }

    console.log('[Cleanup] Кеш успешно очищен');
  } catch (error) {
    console.warn('[Cleanup] Ошибка при очистке кеша:', error);
  }
};

// Функция для перезагрузки страницы с принудительным обновлением
export const forcePageReload = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    console.log('[Cleanup] Принудительная перезагрузка страницы...');
    
    // Добавляем параметр к URL для обхода кеша
    const cacheBuster = new Date().getTime();
    const url = new URL(window.location.href);
    url.searchParams.set('cb', cacheBuster.toString());
    
    // Перезагружаем страницу с новым URL
    window.location.href = url.toString();
  } catch (error) {
    console.warn('[Cleanup] Ошибка при перезагрузке:', error);
    
    // Простая перезагрузка как запасной вариант
    window.location.reload();
  }
}; 