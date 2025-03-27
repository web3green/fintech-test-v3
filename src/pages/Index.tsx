
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
    }, 10);
    
    // Принудительное обновление компонента
    setForceUpdate(prev => prev + 1);
    
    // Также вызвать событие обновления языка для дочерних компонентов
    const event = new CustomEvent('content:language-update', { detail: { language, timestamp: Date.now() } });
    window.dispatchEvent(event);
    
  }, [language]);
  
  // Обработчик для принудительного обновления при видимости страницы
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Страница стала видимой - обновляем контент');
        setForceUpdate(prev => prev + 1);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Также обновляем при первом монтировании
    setForceUpdate(prev => prev + 1);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col" 
         key={`index-content-${language}-${forceUpdate}`}
         data-language={language}>
      <Header key={`header-${language}-${forceUpdate}`} />
      <main className="flex-grow">
        <Hero key={`hero-${language}-${forceUpdate}`} />
        <AboutSection key={`about-${language}-${forceUpdate}`} />
        <ServicesSection key={`services-${language}-${forceUpdate}`} />
        <ProcessSection key={`process-${language}-${forceUpdate}`} />
        <BlogSection key={`blog-${language}-${forceUpdate}`} />
        <ContactForm key={`contact-${language}-${forceUpdate}`} />
      </main>
      <Footer key={`footer-${language}-${forceUpdate}`} />
      <AiChatbot key={`chatbot-${language}-${forceUpdate}`} />
    </div>
  );
};

// Улучшенный компонент LanguageInitializer для гарантированной инициализации языка
const LanguageInitializer = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Принудительная синхронизация языка при монтировании
    try {
      const storedLang = localStorage.getItem('language');
      console.log('LanguageInitializer: Инициализация с языком из localStorage:', storedLang);
      
      if (storedLang) {
        // Установка атрибутов для немедленного применения стилей
        document.documentElement.setAttribute('lang', storedLang);
        document.documentElement.setAttribute('data-language', storedLang);
      } else {
        // Если язык не установлен, используем русский по умолчанию
        localStorage.setItem('language', 'ru');
        document.documentElement.setAttribute('lang', 'ru');
        document.documentElement.setAttribute('data-language', 'ru');
      }
    } catch (e) {
      console.warn('Ошибка при инициализации языка:', e);
    }
  }, []);
  
  return <>{children}</>;
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
