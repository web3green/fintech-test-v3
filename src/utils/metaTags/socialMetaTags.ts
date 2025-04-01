/**
 * Модуль для управления социальными метатегами
 */

import { EMBEDDED_LOGO } from '../logoManager';

/**
 * Метаданные для социальных сетей (OG, Twitter)
 */
export const getSocialMetaTags = (options = {}) => {
  const {
    title = 'FinTechAssist - Финансовый учёт для бизнеса',
    description = 'Удобное и безопасное программное обеспечение для ведения финансового учёта, подготовки отчётности и автоматизации бизнес-процессов',
    imageUrl = EMBEDDED_LOGO, // Используем встроенный логотип для надежности
    url = 'https://fintechassist.app/',
    twitterHandle = '@fintechassist',
    locale = 'ru_RU',
    type = 'website',
  } = options;

  // Основные метатеги для всех платформ
  const baseTags = [
    { name: 'description', content: description },
  ];

  // Open Graph метатеги (Facebook, LinkedIn и др.)
  const ogTags = [
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: imageUrl },
    { property: 'og:url', content: url },
    { property: 'og:type', content: type },
    { property: 'og:locale', content: locale },
    { property: 'og:site_name', content: 'FinTechAssist' },
  ];

  // Twitter метатеги
  const twitterTags = [
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: twitterHandle },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: imageUrl },
    { name: 'twitter:creator', content: twitterHandle },
  ];

  return [...baseTags, ...ogTags, ...twitterTags];
};

/**
 * Обновляет мета-теги для социальных сетей
 * Максимально безопасная неблокирующая реализация
 */
export const updateSocialMetaTags = () => {
  // Не выполняем на сервере
  if (typeof document === 'undefined') return;
  
  // Асинхронное выполнение
  setTimeout(() => {
    try {
      // Минимальный набор метатегов
      const metaTags = [
        { name: 'description', content: 'FinTechAssist - финансовый учёт для бизнеса' },
        { property: 'og:title', content: 'FinTechAssist' },
        { property: 'og:description', content: 'Финансовый учёт и отчётность' }
      ];
      
      // Обновляем только несколько ключевых метатегов
      metaTags.forEach(tag => {
        try {
          const selector = tag.name 
            ? `meta[name="${tag.name}"]` 
            : `meta[property="${tag.property}"]`;
          
          let element = document.querySelector(selector);
          
          if (!element) {
            element = document.createElement('meta');
            if (tag.name) element.setAttribute('name', tag.name);
            if (tag.property) element.setAttribute('property', tag.property);
            document.head.appendChild(element);
          }
          
          element.setAttribute('content', tag.content);
        } catch (e) {
          // Игнорируем ошибки для отдельных тегов
        }
      });
    } catch (error) {
      // Полностью игнорируем ошибки
      console.warn('Метатеги не обновлены:', error);
    }
  }, 200);
};
