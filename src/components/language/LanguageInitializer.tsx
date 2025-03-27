
import { useEffect, useState } from 'react';

interface LanguageInitializerProps {
  children: React.ReactNode;
}

export const LanguageInitializer: React.FC<LanguageInitializerProps> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    // Принудительная синхронизация языка при монтировании
    try {
      // Проверка наличия языка в localStorage
      const storedLang = localStorage.getItem('language');
      console.log('LanguageInitializer: Инициализация с языком из localStorage:', storedLang);
      
      if (storedLang && (storedLang === 'en' || storedLang === 'ru')) {
        // Установка атрибутов для немедленного применения стилей
        document.documentElement.setAttribute('lang', storedLang);
        document.documentElement.setAttribute('data-language', storedLang);
      } else {
        // Если язык не установлен, используем русский по умолчанию
        localStorage.setItem('language', 'ru');
        document.documentElement.setAttribute('lang', 'ru');
        document.documentElement.setAttribute('data-language', 'ru');
      }
      
      // Также проверим наличие метки времени последнего обновления
      const lastUpdate = localStorage.getItem('language_updated');
      if (!lastUpdate) {
        localStorage.setItem('language_updated', Date.now().toString());
      }
      
      // Добавим дополнительную проверку совместимости языка
      // с настройками браузера пользователя
      const userLanguage = navigator.language;
      console.log('Язык браузера пользователя:', userLanguage);
      
      // Анализируем настройки браузера пользователя
      if (!storedLang && userLanguage) {
        if (userLanguage.startsWith('ru')) {
          localStorage.setItem('language', 'ru');
          document.documentElement.setAttribute('lang', 'ru');
          document.documentElement.setAttribute('data-language', 'ru');
        } else if (userLanguage.startsWith('en')) {
          localStorage.setItem('language', 'en');
          document.documentElement.setAttribute('lang', 'en');
          document.documentElement.setAttribute('data-language', 'en');
        }
      }
      
      setInitialized(true);
    } catch (e) {
      console.warn('Ошибка при инициализации языка:', e);
      setInitialized(true); // Все равно устанавливаем, чтобы продолжить рендеринг
    }
  }, []);
  
  // Отображаем содержимое только после инициализации
  return initialized ? <>{children}</> : null;
};
