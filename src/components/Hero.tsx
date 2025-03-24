
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { GlowingEffect } from './ui/glowing-effect';

export function Hero() {
  const { t } = useLanguage();
  
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <section className="relative overflow-hidden bg-gray-50 dark:bg-gray-900 pt-20 md:pt-24 lg:pt-28 pb-20 md:pb-24">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 z-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold leading-tight mb-6 animate-fade-up">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-lg animate-fade-up" style={{ animationDelay: '100ms' }}>
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 animate-fade-up" style={{ animationDelay: '200ms' }}>
              <Button 
                className="bg-fintech-orange hover:bg-fintech-orange-light text-white transition-all duration-300"
                onClick={scrollToContact}
              >
                {t('hero.cta')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="border-fintech-blue/20 text-fintech-blue hover:text-fintech-blue-dark dark:text-fintech-blue-light hover:bg-fintech-blue/5"
                onClick={() => {
                  const servicesElement = document.getElementById('services');
                  if (servicesElement) {
                    servicesElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {t('nav.services')}
              </Button>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 relative z-10">
            <div className="relative p-4">
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-fintech-blue/5 to-fintech-orange/5"></div>
                  <GlowingEffect 
                    blur={6} 
                    spread={60} 
                    glow={true} 
                    disabled={false} 
                    inactiveZone={0.3}
                    proximity={100}
                  />
                </div>
                
                <div className="relative p-6 md:p-8">
                  <div className="flex items-center mb-8">
                    <div className="h-12 w-12 rounded-full bg-fintech-blue flex items-center justify-center text-white font-bold text-lg">
                      FA
                    </div>
                    <div className="ml-4">
                      <div className="font-bold text-xl">
                        <span className="text-red-500">Fin</span><span className="text-fintech-blue">Tech</span><span className="text-fintech-orange">Assist</span>
                      </div>
                      <div className="text-sm text-muted-foreground">Global Financial Solutions</div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-xs text-center">Fintech</div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-xs text-center">E-commerce</div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-xs text-center">Blockchain</div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-xs text-center">Startups</div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-xs text-center">Neobanks</div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-xs text-center">Digital Wallets</div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-xs text-center">Gaming</div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-xs text-center">SaaS</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-fintech-blue/10 dark:bg-fintech-blue/20 p-4 rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">Banking</div>
                        <div className="font-medium">Accounts Worldwide</div>
                      </div>
                      <div className="bg-fintech-orange/10 dark:bg-fintech-orange/20 p-4 rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">Licenses</div>
                        <div className="font-medium">EMI & Crypto</div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-muted-foreground">15+ Countries</div>
                        <div className="text-muted-foreground">500+ Clients</div>
                        <div className="text-muted-foreground">7+ Years</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-fintech-blue/30 dark:bg-fintech-blue/20 rounded-full blur-3xl"></div>
              </div>
              <div className="absolute bottom-0 left-0 transform -translate-x-1/4 translate-y-1/4">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-fintech-orange/30 dark:bg-fintech-orange/20 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-fintech-blue/5 to-transparent"></div>
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-fintech-orange/5 to-transparent"></div>
    </section>
  );
}
