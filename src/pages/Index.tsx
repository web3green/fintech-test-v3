
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ServicesSection } from '@/components/ServicesSection';
import { ProcessSection } from '@/components/ProcessSection';
import { ContactForm } from '@/components/ContactForm';
import { Footer } from '@/components/Footer';
import { AiChatbot } from '@/components/AiChatbot';
import { LanguageProvider } from '@/contexts/LanguageContext';

const Index = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Hero />
          <ServicesSection />
          <ProcessSection />
          <ContactForm />
        </main>
        <Footer />
        <AiChatbot />
      </div>
    </LanguageProvider>
  );
};

export default Index;
