import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { GlowingEffect } from './ui/glowing-effect';
import { Card } from './ui/card';
export function Hero() {
  const {
    t
  } = useLanguage();
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  // Маппинг категорий на соответствующие сервисы
  const categoryToServiceMap = {
    'fintech': 'financial-licensing',
    'ecommerce': 'payment-solutions',
    'crypto': 'crypto-regulation',
    'startups': 'company-formation',
    'neobanks': 'payment-solutions',
    'wallets': 'fiat-crypto',
    'gaming': 'gambling-licensing',
    'saas': 'tax-planning',
    'web3': 'crypto-regulation'
  };

  // Функция для скролла к выбранной категории сервиса
  const scrollToService = (category: string) => {
    // Скроллим сначала к секции услуг
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });

      // Получаем ID соответствующего сервиса
      const serviceId = categoryToServiceMap[category];
      
      // Даем небольшую задержку перед тем, как открыть соответствующую услугу
      setTimeout(() => {
        // Находим элемент услуги по ID
        const serviceElement = document.getElementById(serviceId);
        if (serviceElement) {
          // Если сервис найден, открываем его (эмулируем клик)
          serviceElement.click();
          
          // Скроллим к этому элементу
          serviceElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
    }
  };

  return <section className="relative overflow-hidden bg-blue-50 dark:bg-blue-950 pt-14 md:pt-16 lg:pt-20 pb-20 md:pb-28">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="order-2 lg:order-1 z-10 pt-16 md:pt-20">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.9] tracking-tight mb-16 animate-fade-up max-w-3xl bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 max-w-2xl animate-fade-up" style={{
            animationDelay: '100ms'
          }}>
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 animate-fade-up" style={{
            animationDelay: '200ms'
          }}>
              <Button className="bg-fintech-blue hover:bg-fintech-blue-light text-white transition-all duration-300 text-base py-5 px-7" onClick={scrollToContact}>
                {t('cta.consultation')}
                <ArrowRight className="ml-2.5 h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-fintech-blue/20 text-fintech-blue hover:text-fintech-blue-dark dark:text-fintech-blue-light hover:bg-fintech-blue/5 text-base py-5 px-7" onClick={() => {
              const servicesElement = document.getElementById('services');
              if (servicesElement) {
                servicesElement.scrollIntoView({
                  behavior: 'smooth'
                });
              }
            }}>
                {t('nav.services')}
              </Button>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 relative z-10">
            <div className="relative p-4">
              <div className="relative bg-white dark:bg-gray-900/80 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-fintech-blue/5 to-fintech-orange/5 dark:from-blue-900/40 dark:to-blue-950/60"></div>
                  <GlowingEffect blur={6} spread={60} glow={true} disabled={false} inactiveZone={0.3} proximity={100} />
                </div>
                
                <div className="relative p-6 md:p-8">
                  <div className="flex items-center mb-8">
                    <div className="h-12 w-12 rounded-full bg-fintech-blue dark:bg-fintech-orange/80 flex items-center justify-center text-white font-bold text-lg">
                      FA
                    </div>
                    <div className="ml-4">
                      <div className="font-bold text-xl">
                        <span className="text-foreground dark:text-white/90">FinTechAssist</span>
                      </div>
                      <div className="text-sm text-muted-foreground dark:text-white/70">{t('hero.companyTagline')}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
                        <Button 
                          variant="outline" 
                          className="p-3 h-auto text-sm font-medium bg-gradient-to-br from-fintech-blue/70 to-fintech-blue/90 hover:from-fintech-blue/80 hover:to-fintech-blue/95 dark:from-fintech-blue/30 dark:to-fintech-blue/50 border-transparent text-white transition-all duration-200 hover:scale-105"
                          onClick={() => scrollToService('fintech')}
                        >
                          {t('hero.category.fintech')}
                        </Button>
                        <Button 
                          variant="outline" 
                          className="p-3 h-auto text-sm font-medium bg-gradient-to-br from-fintech-orange/70 to-fintech-orange/90 hover:from-fintech-orange/80 hover:to-fintech-orange/95 dark:from-fintech-orange/30 dark:to-fintech-orange/50 border-transparent text-white transition-all duration-200 hover:scale-105 dark:shadow-[0_0_15px_rgba(255,165,0,0.15)]"
                          onClick={() => scrollToService('ecommerce')}
                        >
                          {t('hero.category.ecommerce')}
                        </Button>
                        <Button 
                          variant="outline" 
                          className="p-3 h-auto text-sm font-medium bg-gradient-to-br from-fintech-blue/70 to-fintech-blue/90 hover:from-fintech-blue/80 hover:to-fintech-blue/95 dark:from-fintech-blue/30 dark:to-fintech-blue/50 border-transparent text-white transition-all duration-200 hover:scale-105"
                          onClick={() => scrollToService('crypto')}
                        >
                          {t('hero.category.crypto')}
                        </Button>
                        <Button 
                          variant="outline" 
                          className="p-3 h-auto text-sm font-medium bg-gradient-to-br from-fintech-orange/70 to-fintech-orange/90 hover:from-fintech-orange/80 hover:to-fintech-orange/95 dark:from-fintech-orange/30 dark:to-fintech-orange/50 border-transparent text-white transition-all duration-200 hover:scale-105 dark:shadow-[0_0_15px_rgba(255,165,0,0.15)]"
                          onClick={() => scrollToService('startups')}
                        >
                          {t('hero.category.startups')}
                        </Button>
                        <Button 
                          variant="outline" 
                          className="p-3 h-auto text-sm font-medium bg-gradient-to-br from-fintech-blue/70 to-fintech-blue/90 hover:from-fintech-blue/80 hover:to-fintech-blue/95 dark:from-fintech-blue/30 dark:to-fintech-blue/50 border-transparent text-white transition-all duration-200 hover:scale-105"
                          onClick={() => scrollToService('neobanks')}
                        >
                          {t('hero.category.neobanks')}
                        </Button>
                        <Button 
                          variant="outline" 
                          className="p-3 h-auto text-sm font-medium bg-gradient-to-br from-fintech-orange/70 to-fintech-orange/90 hover:from-fintech-orange/80 hover:to-fintech-orange/95 dark:from-fintech-orange/30 dark:to-fintech-orange/50 border-transparent text-white transition-all duration-200 hover:scale-105 dark:shadow-[0_0_15px_rgba(255,165,0,0.15)]"
                          onClick={() => scrollToService('wallets')}
                        >
                          {t('hero.category.wallets')}
                        </Button>
                        <Button 
                          variant="outline" 
                          className="p-3 h-auto text-sm font-medium bg-gradient-to-br from-fintech-blue/70 to-fintech-blue/90 hover:from-fintech-blue/80 hover:to-fintech-blue/95 dark:from-fintech-blue/30 dark:to-fintech-blue/50 border-transparent text-white transition-all duration-200 hover:scale-105"
                          onClick={() => scrollToService('gaming')}
                        >
                          {t('hero.category.gaming')}
                        </Button>
                        <Button 
                          variant="outline" 
                          className="p-3 h-auto text-sm font-medium bg-gradient-to-br from-fintech-orange/70 to-fintech-orange/90 hover:from-fintech-orange/80 hover:to-fintech-orange/95 dark:from-fintech-orange/30 dark:to-fintech-orange/50 border-transparent text-white transition-all duration-200 hover:scale-105 dark:shadow-[0_0_15px_rgba(255,165,0,0.15)]"
                          onClick={() => scrollToService('saas')}
                        >
                          {t('hero.category.saas')}
                        </Button>
                        <Button 
                          variant="outline" 
                          className="p-3 h-auto text-sm font-medium bg-gradient-to-br from-fintech-blue/70 to-fintech-blue/90 hover:from-fintech-blue/80 hover:to-fintech-blue/95 dark:from-fintech-blue/30 dark:to-fintech-blue/50 border-transparent text-white transition-all duration-200 hover:scale-105"
                          onClick={() => scrollToService('web3')}
                        >
                          {t('hero.category.web3')}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="p-4 rounded-lg border-0 bg-gradient-to-br from-fintech-blue/45 to-fintech-blue/65 dark:from-fintech-blue/30 dark:to-fintech-blue/50">
                        <div className="text-xs text-white dark:text-white/90 mb-1">{t('hero.card.banking.title')}</div>
                        <div className="font-medium text-white dark:text-white/90">{t('hero.card.banking.subtitle')}</div>
                      </Card>
                      
                      <Card className="p-4 rounded-lg border-0 bg-gradient-to-br from-fintech-orange/45 to-fintech-orange/65 dark:from-fintech-orange/30 dark:to-fintech-orange/50 dark:shadow-[0_0_20px_rgba(255,165,0,0.15)]">
                        <div className="text-xs text-white dark:text-white/90 mb-2">{t('hero.card.licenses.title')}</div>
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-block text-xs bg-fintech-blue/90 dark:bg-fintech-blue/70 text-white dark:text-white/90 px-2 py-1 rounded shadow-[0_0_8px_rgba(59,130,246,0.25)] dark:shadow-[0_0_8px_rgba(59,130,246,0.35)]">{t('hero.license.emi')}</span>
                          <span className="inline-block text-xs bg-fintech-orange/65 dark:bg-fintech-orange/40 text-white dark:text-white/90 px-2 py-1 rounded shadow-[0_0_8px_rgba(255,165,0,0.15)] dark:shadow-[0_0_8px_rgba(255,165,0,0.25)]">{t('hero.license.crypto')}</span>
                          <span className="inline-block text-xs bg-fintech-blue/90 dark:bg-fintech-blue/70 text-white dark:text-white/90 px-2 py-1 rounded shadow-[0_0_8px_rgba(59,130,246,0.25)] dark:shadow-[0_0_8px_rgba(59,130,246,0.35)]">{t('hero.license.igaming')}</span>
                          <span className="inline-block text-xs bg-fintech-orange/65 dark:bg-fintech-orange/40 text-white dark:text-white/90 px-2 py-1 rounded shadow-[0_0_8px_rgba(255,165,0,0.15)] dark:shadow-[0_0_8px_rgba(255,165,0,0.25)]">{t('hero.license.psp')}</span>
                          <span className="inline-block text-xs bg-fintech-blue/90 dark:bg-fintech-blue/70 text-white dark:text-white/90 px-2 py-1 rounded shadow-[0_0_8px_rgba(59,130,246,0.25)] dark:shadow-[0_0_8px_rgba(59,130,246,0.35)]">{t('hero.license.gambling')}</span>
                          <span className="inline-block text-xs bg-fintech-orange/65 dark:bg-fintech-orange/40 text-white dark:text-white/90 px-2 py-1 rounded shadow-[0_0_8px_rgba(255,165,0,0.15)] dark:shadow-[0_0_8px_rgba(255,165,0,0.25)]">{t('hero.license.emoney')}</span>
                        </div>
                      </Card>
                    </div>
                    
                    <Card className="p-4 rounded-lg border-0 bg-gradient-to-br from-fintech-blue/45 to-fintech-blue/65">
                      <div className="text-xs text-white dark:text-white mb-2">{t('hero.card.jurisdictions.title')}</div>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-block text-xs bg-fintech-blue-light/45 dark:bg-fintech-blue-dark/45 text-white dark:text-white px-2 py-1 rounded">{t('hero.jurisdiction.mga')}</span>
                        <span className="inline-block text-xs bg-fintech-blue-light/55 dark:bg-fintech-blue-dark/55 text-white dark:text-white px-2 py-1 rounded">{t('hero.jurisdiction.curacao')}</span>
                        <span className="inline-block text-xs bg-fintech-blue-light/45 dark:bg-fintech-blue-dark/45 text-white dark:text-white px-2 py-1 rounded">{t('hero.jurisdiction.fca')}</span>
                        <span className="inline-block text-xs bg-fintech-blue-light/55 dark:bg-fintech-blue-dark/55 text-white dark:text-white px-2 py-1 rounded">{t('hero.jurisdiction.aml')}</span>
                        <span className="inline-block text-xs bg-fintech-blue-light/45 dark:bg-fintech-blue-dark/45 text-white dark:text-white px-2 py-1 rounded">{t('hero.jurisdiction.compliance')}</span>
                      </div>
                    </Card>
                    
                    <div className="pt-4 border-t border-blue-100 dark:border-blue-800">
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-white dark:text-white bg-fintech-blue/45 dark:bg-fintech-blue/70 px-2 py-1 rounded shadow-[0_0_8px_rgba(59,130,246,0.25)] dark:shadow-[0_0_8px_rgba(59,130,246,0.35)]">{t('hero.stats.countries')}</div>
                        <div className="text-white dark:text-white bg-fintech-blue/45 dark:bg-fintech-blue/70 px-2 py-1 rounded shadow-[0_0_8px_rgba(59,130,246,0.25)] dark:shadow-[0_0_8px_rgba(59,130,246,0.35)]">{t('hero.stats.clients')}</div>
                        <div className="text-white dark:text-white bg-fintech-blue/45 dark:bg-fintech-blue/70 px-2 py-1 rounded shadow-[0_0_8px_rgba(59,130,246,0.25)] dark:shadow-[0_0_8px_rgba(59,130,246,0.35)]">{t('hero.stats.years')}</div>
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
      
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-blue-200/30 dark:from-blue-700/20 to-transparent"></div>
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-blue-200/30 dark:from-blue-700/20 to-transparent"></div>
    </section>;
}
