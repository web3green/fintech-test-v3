
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { AboutSection } from '@/components/AboutSection';
import { ServicesSection } from '@/components/ServicesSection';
import { ProcessSection } from '@/components/ProcessSection';
import { BlogSection } from '@/components/BlogSection';
import { ContactForm } from '@/components/ContactForm';
import { Footer } from '@/components/Footer';
import { AiChatbot } from '@/components/AiChatbot';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { IndustriesSection } from '@/components/IndustriesSection';

const Index = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Hero />
          <AboutSection />
          <ServicesSection />
          <ProcessSection />
          <IndustriesSection /> {/* Added the new Industries Section */}
          <BlogSection />
          <ContactForm />
        </main>
        <Footer />
        <AiChatbot />
      </div>
    </LanguageProvider>
  );
};

export default Index;
