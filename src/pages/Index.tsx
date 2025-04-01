import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { AboutSection } from '@/components/AboutSection';
import { ServicesSection } from '@/components/ServicesSection';
import { ProcessSection } from '@/components/ProcessSection';
import { BlogSection } from '@/components/BlogSection';
import { ContactForm } from '@/components/ContactForm';
import { Footer } from '@/components/Footer';
import { AiChatbot } from '@/components/AiChatbot';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { isLoading } = useLanguage();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-fintech-blue mx-auto mb-4" />
          <p className="text-lg font-medium text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <AboutSection />
        <ServicesSection />
        <ProcessSection />
        <BlogSection />
        <ContactForm />
      </main>
      <Footer />
      <AiChatbot />
    </div>
  );
};

export default Index;
