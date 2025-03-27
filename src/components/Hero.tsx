
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { GlowingEffect } from './ui/glowing-effect';
import { Card } from './ui/card';
import { useEffect, useState } from 'react';

export function Hero() {
  const { t, language } = useLanguage();
  const [forceUpdate, setForceUpdate] = useState(0);

  // Эффект для принудительного обновления при изменении языка
  useEffect(() => {
    console.log('Hero component rerendering with language:', language);
    setForceUpdate(prev => prev + 1);
    
    // Также слушаем событие обновления языка
    const handleLanguageUpdate = () => {
      console.log('Hero received language update event');
      setForceUpdate(prev => prev + 1);
    };
    
    window.addEventListener('content:language-update', handleLanguageUpdate);
    window.addEventListener('language:changed', handleLanguageUpdate);
    
    return () => {
      window.removeEventListener('content:language-update', handleLanguageUpdate);
      window.removeEventListener('language:changed', handleLanguageUpdate);
    };
  }, [language]);
  
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  
  // Убедимся, что компонент обновляется при изменении языка
  return (
    <section 
      className="relative overflow-hidden bg-blue-50 dark:bg-blue-950/90 pt-20 md:pt-24 lg:pt-28 pb-20 md:pb-24"
      key={`hero-section-${language}-${forceUpdate}`}
      data-language={language}
    >
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 z-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold leading-tight mb-6 animate-fade-up">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-lg animate-fade-up" style={{
              animationDelay: '100ms'
            }}>
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 animate-fade-up" style={{
              animationDelay: '200ms'
            }}>
              <Button 
                className="bg-fintech-blue hover:bg-fintech-blue-light text-white transition-all duration-300" 
                onClick={scrollToContact}
              >
                {t('cta.consultation')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="border-fintech-blue/20 text-fintech-blue hover:text-fintech-blue-dark dark:text-fintech-blue-light hover:bg-fintech-blue/5" 
                onClick={() => {
                  const servicesElement = document.getElementById('services');
                  if (servicesElement) {
                    servicesElement.scrollIntoView({
                      behavior: 'smooth'
                    });
                  }
                }}
              >
                {t('nav.services')}
              </Button>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 relative z-10">
            <div className="relative p-4">
              <div className="relative bg-white dark:bg-blue-900 rounded-2xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-fintech-blue/5 to-fintech-orange/5"></div>
                  <GlowingEffect blur={6} spread={60} glow={true} disabled={false} inactiveZone={0.3} proximity={100} />
                </div>
                
                <div className="relative p-6 md:p-8">
                  <div className="flex items-center mb-8">
                    <div className="h-12 w-12 rounded-full bg-fintech-blue flex items-center justify-center text-white font-bold text-lg">
                      FA
                    </div>
                    <div className="ml-4">
                      <div className="font-bold text-xl">
                        <span className="text-foreground dark:text-foreground">{t('hero.companyName')}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">{t('hero.companyTagline')}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
                        <Button variant="outline" className="p-3 h-auto text-sm font-medium bg-blue-500 hover:bg-blue-600 border-transparent text-white transition-all duration-200 hover:scale-105">
                          {t('hero.category.fintech')}
                        </Button>
                        <Button variant="outline" className="p-3 h-auto text-sm font-medium bg-blue-600 hover:bg-blue-700 border-transparent text-white transition-all duration-200 hover:scale-105">
                          {t('hero.category.ecommerce')}
                        </Button>
                        <Button variant="outline" className="p-3 h-auto text-sm font-medium bg-blue-500 hover:bg-blue-600 border-transparent text-white transition-all duration-200 hover:scale-105">
                          {t('hero.category.blockchain')}
                        </Button>
                        <Button variant="outline" className="p-3 h-auto text-sm font-medium bg-blue-600 hover:bg-blue-700 border-transparent text-white transition-all duration-200 hover:scale-105">
                          {t('hero.category.startups')}
                        </Button>
                        <Button variant="outline" className="p-3 h-auto text-sm font-medium bg-blue-500 hover:bg-blue-600 border-transparent text-white transition-all duration-200 hover:scale-105">
                          {t('hero.category.neobanks')}
                        </Button>
                        <Button variant="outline" className="p-3 h-auto text-sm font-medium bg-blue-600 hover:bg-blue-700 border-transparent text-white transition-all duration-200 hover:scale-105">
                          {t('hero.category.wallets')}
                        </Button>
                        <Button variant="outline" className="p-3 h-auto text-sm font-medium bg-blue-500 hover:bg-blue-600 border-transparent text-white transition-all duration-200 hover:scale-105">
                          {t('hero.category.gaming')}
                        </Button>
                        <Button variant="outline" className="p-3 h-auto text-sm font-medium bg-blue-600 hover:bg-blue-700 border-transparent text-white transition-all duration-200 hover:scale-105">
                          {t('hero.category.saas')}
                        </Button>
                        <Button variant="outline" className="p-3 h-auto text-sm font-medium bg-blue-500 hover:bg-blue-600 border-transparent text-white transition-all duration-200 hover:scale-105">
                          {t('hero.category.edtech')}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="p-4 rounded-lg border-0 bg-blue-400">
                        <div className="text-xs text-white dark:text-white mb-1">{t('hero.card.banking.title')}</div>
                        <div className="font-medium text-white dark:text-white">{t('hero.card.banking.subtitle')}</div>
                      </Card>
                      
                      <Card className="p-4 rounded-lg border-0 bg-blue-500">
                        <div className="text-xs text-white dark:text-white mb-2">{t('hero.card.licenses.title')}</div>
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-block text-xs bg-blue-300 dark:bg-blue-700/70 text-white dark:text-white px-2 py-1 rounded">{t('hero.license.emi')}</span>
                          <span className="inline-block text-xs bg-blue-400 dark:bg-blue-700/70 text-white dark:text-white px-2 py-1 rounded">{t('hero.license.crypto')}</span>
                          <span className="inline-block text-xs bg-blue-300 dark:bg-blue-700/70 text-white dark:text-white px-2 py-1 rounded">{t('hero.license.igaming')}</span>
                          <span className="inline-block text-xs bg-blue-400 dark:bg-blue-700/70 text-white dark:text-white px-2 py-1 rounded">{t('hero.license.psp')}</span>
                          <span className="inline-block text-xs bg-blue-300 dark:bg-blue-700/70 text-white dark:text-white px-2 py-1 rounded">{t('hero.license.gambling')}</span>
                          <span className="inline-block text-xs bg-blue-400 dark:bg-blue-700/70 text-white dark:text-white px-2 py-1 rounded">{t('hero.license.emoney')}</span>
                        </div>
                      </Card>
                    </div>
                    
                    <Card className="p-4 rounded-lg border-0 bg-blue-500">
                      <div className="text-xs text-white mb-2">{t('hero.card.jurisdictions.title')}</div>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-block text-xs bg-blue-400 dark:bg-blue-700/70 text-white dark:text-white px-2 py-1 rounded">{t('hero.jurisdiction.mga')}</span>
                        <span className="inline-block text-xs bg-blue-300 dark:bg-blue-700/70 text-white dark:text-white px-2 py-1 rounded">{t('hero.jurisdiction.curacao')}</span>
                        <span className="inline-block text-xs bg-blue-400 dark:bg-blue-700/70 text-white dark:text-white px-2 py-1 rounded">{t('hero.jurisdiction.fca')}</span>
                        <span className="inline-block text-xs bg-blue-300 dark:bg-blue-700/70 text-white dark:text-white px-2 py-1 rounded">{t('hero.jurisdiction.aml')}</span>
                        <span className="inline-block text-xs bg-blue-400 dark:bg-blue-700/70 text-white dark:text-white px-2 py-1 rounded">{t('hero.jurisdiction.compliance')}</span>
                      </div>
                    </Card>
                    
                    <div className="pt-4 border-t border-blue-100 dark:border-blue-800">
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-white dark:text-white bg-blue-300 dark:bg-blue-300/30 px-2 py-1 rounded">{t('hero.stats.countries')}</div>
                        <div className="text-white dark:text-white bg-blue-300 dark:bg-blue-300/30 px-2 py-1 rounded">{t('hero.stats.clients')}</div>
                        <div className="text-white dark:text-white bg-blue-300 dark:bg-blue-300/30 px-2 py-1 rounded">{t('hero.stats.years')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-blue-400/30 dark:bg-blue-500/20 rounded-full blur-3xl"></div>
              </div>
              <div className="absolute bottom-0 left-0 transform -translate-x-1/4 translate-y-1/4">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-blue-500/30 dark:bg-blue-400/20 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-blue-200/30 dark:from-blue-700/10 to-transparent"></div>
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-blue-200/30 dark:from-blue-700/10 to-transparent"></div>
    </section>
  );
}
