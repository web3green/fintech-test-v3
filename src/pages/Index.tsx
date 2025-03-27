
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { AboutSection } from '@/components/AboutSection';
import { ServicesSection } from '@/components/ServicesSection';
import { ProcessSection } from '@/components/ProcessSection';
import { BlogSection } from '@/components/BlogSection';
import { ContactForm } from '@/components/ContactForm';
import { Footer } from '@/components/Footer';
import { AiChatbot } from '@/components/AiChatbot';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';

// Компонент содержимого, который будет правильно реагировать на изменения языка
const IndexContent = () => {
  const { language } = useLanguage();
  const [forceUpdate, setForceUpdate] = useState(0);
  
  useEffect(() => {
    // Принудительное обновление при изменении языка
    console.log('IndexContent language changed:', language);
    
    // Обновить стили для принудительного ререндеринга
    document.documentElement.style.opacity = '0.99';
    setTimeout(() => {
      document.documentElement.style.opacity = '1';
      
      // Дополнительно обновить все динамически загружаемые ресурсы
      document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
        if (link instanceof HTMLLinkElement && link.href) {
          const url = new URL(link.href);
          url.searchParams.set('_lang', `${language}_${Date.now()}`);
          link.href = url.toString();
        }
      });
    }, 10);
    
    // Принудительное обновление компонента
    setForceUpdate(prev => prev + 1);
    
    // Также вызвать событие обновления языка для дочерних компонентов
    const event = new CustomEvent('content:language-update', { 
      detail: { language, timestamp: Date.now() } 
    });
    window.dispatchEvent(event);
    
    // Проверка и принудительное обновление всех инлайн-скриптов
    document.querySelectorAll('script').forEach(script => {
      if (script.innerHTML.includes('language') || script.innerHTML.includes('lang')) {
        const parent = script.parentNode;
        if (parent) {
          const newScript = document.createElement('script');
          newScript.innerHTML = script.innerHTML;
          parent.replaceChild(newScript, script);
        }
      }
    });
    
  }, [language]);
  
  // Обработчик для принудительного обновления при видимости страницы
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Страница стала видимой - обновляем контент');
        // Проверка языка
        const storedLang = localStorage.getItem('language');
        const currentLangAttr = document.documentElement.getAttribute('lang');
        
        if (storedLang && storedLang !== currentLangAttr) {
          console.log('Обнаружено несоответствие языков при возвращении на страницу:', 
                     { stored: storedLang, current: currentLangAttr });
                     
          // Принудительное обновление страницы при несоответствии
          window.location.reload();
        } else {
          // Иначе просто обновляем компоненты
          setForceUpdate(prev => prev + 1);
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Также обновляем при первом монтировании
    setForceUpdate(prev => prev + 1);
    
    // Добавляем слушатель событий для внешних изменений языка
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'language') {
        console.log('Изменение языка обнаружено через localStorage:', e.newValue);
        if (e.newValue) {
          // Проверить текущий язык контекста
          const htmlLang = document.documentElement.getAttribute('lang');
          if (htmlLang !== e.newValue) {
            console.log('Обнаружено несоответствие языков из localStorage:', 
                       { new: e.newValue, current: htmlLang });
            
            // Принудительное обновление страницы
            window.location.reload();
          }
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Генерируем уникальный ключ на основе языка и счетчика обновлений
  const getComponentKey = (baseName: string) => 
    `${baseName}-${language}-${forceUpdate}-${Date.now()}`;
  
  return (
    <div className="min-h-screen flex flex-col force-update-on-language-change" 
         key={getComponentKey('index-content')}
         data-language={language}>
      <Header key={getComponentKey('header')} />
      <main className="flex-grow">
        <Hero key={getComponentKey('hero')} />
        <AboutSection key={getComponentKey('about')} />
        <ServicesSection key={getComponentKey('services')} />
        <ProcessSection key={getComponentKey('process')} />
        <BlogSection key={getComponentKey('blog')} />
        <ContactForm key={getComponentKey('contact')} />
      </main>
      <Footer key={getComponentKey('footer')} />
      <AiChatbot key={getComponentKey('chatbot')} />
    </div>
  );
};

// Улучшенный компонент LanguageInitializer для гарантированной инициализации языка
const LanguageInitializer = ({ children }: { children: React.ReactNode }) => {
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

const Index = () => {
  return (
    <LanguageInitializer>
      <LanguageProvider>
        <IndexContent />
      </LanguageProvider>
    </LanguageInitializer>
  );
};

export default Index;
