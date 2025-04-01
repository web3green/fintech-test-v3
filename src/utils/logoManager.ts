/**
 * Утилита для управления логотипом
 * 
 * Этот модуль предоставляет функции для:
 * 1. Получения URL логотипа (как относительного, так и абсолютного)
 * 2. Установки фавикона на основе логотипа
 */

import { LOGO_BASE64 } from './logoBase64';

// Экспортируем встроенный логотип для использования в компонентах
export const EMBEDDED_LOGO = LOGO_BASE64;

/**
 * Получает URL логотипа в относительном и абсолютном формате
 * @returns Объект с относительным и абсолютным URL логотипа
 */
export function getLogoUrl() {
  return { relative: LOGO_BASE64, absolute: LOGO_BASE64 };
}

/**
 * Устанавливает фавикон на основе встроенного логотипа
 * Минимальная реализация без блокирующих операций
 */
export function setFavicon() {
  // Не выполняем на сервере
  if (typeof document === 'undefined') return;
  
  // Асинхронное выполнение с безопасным fallback
  setTimeout(() => {
    try {
      // Создаем новый элемент фавикона
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/png';
      
      // Используем встроенный base64 логотип
      link.href = LOGO_BASE64;
      
      // Добавляем в head
      document.head.appendChild(link);
    } catch (error) {
      // Игнорируем ошибки
      console.warn('Не удалось установить favicon:', error);
    }
  }, 100);
} 