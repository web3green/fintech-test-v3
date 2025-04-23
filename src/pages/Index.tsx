import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Footer } from '@/components/Footer';
import { AiChatbot } from '@/components/AiChatbot';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2 } from 'lucide-react';
import { Suspense, lazy } from 'react';

const AboutSection = lazy(() => 
  import('@/components/AboutSection').then(module => ({ default: module.AboutSection }))
);
const ServicesSection = lazy(() => 
  import('@/components/ServicesSection').then(module => ({ default: module.ServicesSection }))
);
const ProcessSection = lazy(() => 
  import('@/components/ProcessSection').then(module => ({ default: module.ProcessSection }))
);
const BlogSection = lazy(() => 
  import('@/components/BlogSection').then(module => ({ default: module.BlogSection }))
);
const ContactForm = lazy(() => 
  import('@/components/ContactForm').then(module => ({ default: module.ContactForm }))
);

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
        <Suspense fallback={<LoadingSpinner />}>
          <AboutSection />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <ServicesSection />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <ProcessSection />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <BlogSection />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <ContactForm />
        </Suspense>
      </main>
      <Footer />
      <AiChatbot />
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="min-h-[40vh] flex items-center justify-center bg-background">
    <Loader2 className="h-10 w-10 animate-spin text-fintech-blue" />
  </div>
);

export default Index;
