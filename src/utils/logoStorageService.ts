/**
 * Локальный сервис для работы с логотипом
 * Заменяет функциональность logoStorageService.ts без использования Supabase
 */

import { LOGO_BASE64 } from './logoBase64';

// Константа для пути к логотипу
const LOCAL_LOGO_PATH = '/logo.svg';

// Функция для логирования с префиксом
const debug = (message: string, ...args: any[]) => {
  console.log(`[LOGO] ${message}`, ...args);
};

/**
 * Безопасная инициализация логотипа без подключения к Supabase
 */
export const safeInitializeLogoStorage = async (): Promise<void> => {
  try {
    debug('Локальная инициализация логотипа');
    
    // Устанавливаем favicon
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        // Импортируем функцию для установки фавикона
        import('@/utils/metaTagManager').then(({ setFavicon }) => {
          debug('Установка локального favicon');
          setFavicon();
        }).catch(err => {
          console.error('Ошибка при импорте setFavicon:', err);
        });
      }
    }, 100);
  } catch (error) {
    console.error('[ERROR] Ошибка при инициализации логотипа:', error);
  }
};

/**
 * Возвращает URL локального логотипа
 */
export const getLogoUrlFromStorage = async (): Promise<string> => {
  debug('Получаем URL логотипа из локального хранилища');
  return LOCAL_LOGO_PATH;
};

/**
 * Безопасная версия getLogoUrlFromStorage
 */
export const getLogoUrlSafe = async (): Promise<string> => {
  try {
    return LOCAL_LOGO_PATH;
  } catch (error) {
    console.error('Ошибка при получении URL логотипа:', error);
    return LOCAL_LOGO_PATH;
  }
};

/**
 * Заглушка функции загрузки логотипа, которая всегда возвращает успешный результат с локальным логотипом
 */
export const uploadLogoToStorage = async (file: File): Promise<{success: boolean, logoUrl?: string, error?: string}> => {
  debug('Загрузка логотипа в локальное хранилище не поддерживается');
  console.warn('Загрузка логотипа в хранилище не поддерживается в локальном режиме');
  
  return {
    success: true,
    logoUrl: LOCAL_LOGO_PATH,
    error: 'Загрузка логотипа в хранилище не поддерживается в локальном режиме'
  };
};

/**
 * Пустая функция проверки подключения к хранилищу, которая всегда возвращает локальный режим
 */
export const checkLogoStorageConnection = async (): Promise<{connected: boolean, logoExists: boolean}> => {
  return {
    connected: false,
    logoExists: true
  };
}; 