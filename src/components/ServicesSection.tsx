
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ServicesList } from './services/ServicesList';

export function ServicesSection() {
  const { t } = useLanguage();

  return (
    <section id="services" className="section-padding bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-fintech-blue/10 text-fintech-blue dark:bg-fintech-blue/20 dark:text-fintech-blue-light mb-4">
            <span className="flex h-2 w-2 rounded-full bg-fintech-blue mr-2"></span>
            {t('services.badge')}
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            {t('services.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>
        
        <ServicesList />
        
        <div className="mt-12 text-center">
          <Button 
            className="bg-fintech-orange hover:bg-fintech-orange-light text-white button-glow"
            onClick={() => {
              // Instead of navigating to services detail, we'll scroll to contact
              const contactElement = document.getElementById('contact');
              if (contactElement) {
                contactElement.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            {t('cta.getStarted')}
          </Button>
        </div>
      </div>
    </section>
  );
}
