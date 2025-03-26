
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
  return <section className="relative overflow-hidden bg-blue-50 dark:bg-blue-950/90 pt-20 md:pt-24 lg:pt-28 pb-20 md:pb-24">
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
              <Button className="bg-fintech-blue hover:bg-fintech-blue-light text-white transition-all duration-300" onClick={scrollToContact}>
                {t('cta.consultation')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-fintech-blue/20 text-fintech-blue hover:text-fintech-blue-dark dark:text-fintech-blue-light hover:bg-fintech-blue/5" onClick={() => {
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
                        <span className="text-foreground dark:text-foreground">FinTechAssist</span>
                      </div>
                      <div className="text-sm text-muted-foreground">Global Financial Solutions</div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
                        <Button variant="outline" className="p-3 h-auto text-sm font-medium bg-blue-500 hover:bg-blue-600 border-transparent text-white transition-all duration-200 hover:scale-105">
                          Fintech
                        </Button>
                        <Button variant="outline" className="p-3 h-auto text-sm font-medium bg-blue-600 hover:bg-blue-700 border-transparent text-white transition-all duration-200 hover:scale-105">
                          E-commerce
                        </Button>
                        <Button variant="outline" className="p-3 h-auto text-sm font-medium bg-blue-500 hover:bg-blue-600 border-transparent text-white transition-all duration-200 hover:scale-105">
                          Blockchain
                        </Button>
                        <Button variant="outline" className="p-3 h-auto text-sm font-medium bg-blue-600 hover:bg-blue-700 border-transparent text-white transition-all duration-200 hover:scale-105">
                          Startups
                        </Button>
                        <Button variant="outline" className="p-3 h-auto text-sm font-medium bg-blue-500 hover:bg-blue-600 border-transparent text-white transition-all duration-200 hover:scale-105">
                          Neobanks
                        </Button>
                        <Button variant="outline" className="p-3 h-auto text-sm font-medium bg-blue-600 hover:bg-blue-700 border-transparent text-white transition-all duration-200 hover:scale-105">
                          Digital Wallets
                        </Button>
                        <Button variant="outline" className="p-3 h-auto text-sm font-medium bg-blue-500 hover:bg-blue-600 border-transparent text-white transition-all duration-200 hover:scale-105">
                          Gaming
                        </Button>
                        <Button variant="outline" className="p-3 h-auto text-sm font-medium bg-blue-600 hover:bg-blue-700 border-transparent text-white transition-all duration-200 hover:scale-105">
                          SaaS
                        </Button>
                        <Button variant="outline" className="p-3 h-auto text-sm font-medium bg-blue-500 hover:bg-blue-600 border-transparent text-white transition-all duration-200 hover:scale-105">
                          EdTech
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="p-4 rounded-lg border-0 bg-blue-200">
                        <div className="text-xs text-white dark:text-white mb-1">Banking</div>
                        <div className="font-medium text-black dark:text-white">Accounts Worldwide</div>
                      </Card>
                      
                      <Card className="bg-blue-200 dark:bg-blue-800/30 p-4 rounded-lg border-0">
                        <div className="text-xs text-white dark:text-white mb-2">Licenses</div>
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-block text-xs bg-blue-300 dark:bg-blue-700/70 text-black dark:text-white px-2 py-1 rounded">EMI</span>
                          <span className="inline-block text-xs bg-blue-400 dark:bg-blue-700/70 text-black dark:text-white px-2 py-1 rounded">Crypto</span>
                          <span className="inline-block text-xs bg-blue-300 dark:bg-blue-700/70 text-black dark:text-white px-2 py-1 rounded">iGaming</span>
                          <span className="inline-block text-xs bg-blue-400 dark:bg-blue-700/70 text-black dark:text-white px-2 py-1 rounded">PSP</span>
                          <span className="inline-block text-xs bg-blue-300 dark:bg-blue-700/70 text-black dark:text-white px-2 py-1 rounded">Gambling</span>
                          <span className="inline-block text-xs bg-blue-400 dark:bg-blue-700/70 text-black dark:text-white px-2 py-1 rounded">E-Money</span>
                        </div>
                      </Card>
                    </div>
                    
                    <Card className="bg-blue-100 dark:bg-blue-800/50 p-4 rounded-lg border-0">
                      <div className="text-xs text-white dark:text-white mb-2">Global Jurisdictions</div>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-block text-xs bg-blue-400 dark:bg-blue-700/70 text-black dark:text-white px-2 py-1 rounded">MGA</span>
                        <span className="inline-block text-xs bg-blue-300 dark:bg-blue-700/70 text-black dark:text-white px-2 py-1 rounded">Curaçao</span>
                        <span className="inline-block text-xs bg-blue-400 dark:bg-blue-700/70 text-black dark:text-white px-2 py-1 rounded">FCA</span>
                        <span className="inline-block text-xs bg-blue-300 dark:bg-blue-700/70 text-black dark:text-white px-2 py-1 rounded">AML5</span>
                        <span className="inline-block text-xs bg-blue-400 dark:bg-blue-700/70 text-black dark:text-white px-2 py-1 rounded">Casino Compliance</span>
                      </div>
                    </Card>
                    
                    <div className="pt-4 border-t border-blue-100 dark:border-blue-800">
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-black dark:text-white">15+ Countries</div>
                        <div className="text-black dark:text-white">500+ Clients</div>
                        <div className="text-black dark:text-white">9+ Years</div>
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
    </section>;
}
