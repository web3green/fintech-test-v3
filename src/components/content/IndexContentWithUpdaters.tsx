
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { AboutSection } from '@/components/AboutSection';
import { ServicesSection } from '@/components/ServicesSection';
import { ProcessSection } from '@/components/ProcessSection';
import { BlogSection } from '@/components/BlogSection';
import { ContactForm } from '@/components/ContactForm';
import { Footer } from '@/components/Footer';
import { AiChatbot } from '@/components/AiChatbot';
import { ContentUpdater } from './ContentUpdater';

export const IndexContentWithUpdaters: React.FC = () => {
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
  
  // Также обновляем при первом монтировании
  useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, []);
  
  // Генерируем уникальный ключ на основе языка и счетчика обновлений
  const getComponentKey = (baseName: string) => 
    `${baseName}-${language}-${forceUpdate}-${Date.now()}`;
  
  return (
    <>
      <ContentUpdater 
        language={language}
        setForceUpdate={setForceUpdate}
      />
      
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
    </>
  );
};
