
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
import { useEffect } from 'react';

// Компонент содержимого, который будет правильно реагировать на изменения языка
const IndexContent = () => {
  const { language } = useLanguage();
  
  useEffect(() => {
    // Принудительное обновление при изменении языка
    console.log('IndexContent language changed:', language);
    
    // Обновить стили для принудительного ререндеринга
    document.documentElement.style.opacity = '0.99';
    setTimeout(() => {
      document.documentElement.style.opacity = '1';
    }, 10);
  }, [language]);
  
  return (
    <div className="min-h-screen flex flex-col" key={`index-content-${language}`}>
      <Header key={`header-${language}`} />
      <main className="flex-grow">
        <Hero key={`hero-${language}`} />
        <AboutSection key={`about-${language}`} />
        <ServicesSection key={`services-${language}`} />
        <ProcessSection key={`process-${language}`} />
        <BlogSection key={`blog-${language}`} />
        <ContactForm key={`contact-${language}`} />
      </main>
      <Footer key={`footer-${language}`} />
      <AiChatbot key={`chatbot-${language}`} />
    </div>
  );
};

const Index = () => {
  return (
    <LanguageProvider>
      <IndexContent />
    </LanguageProvider>
  );
};

export default Index;
