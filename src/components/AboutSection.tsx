import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, UserRound, Handshake, ShieldCheck, Award, Clock, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { useIsMobile } from '@/hooks/use-mobile';

export function AboutSection() {
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  
  return (
    <section id="about" className="section-padding py-8 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative rounded-xl overflow-hidden shadow-xl my-2">
              <div className="aspect-[4/3] bg-gradient-to-br from-fintech-blue/80 to-fintech-blue-dark dark:from-fintech-blue/90 dark:to-fintech-blue-dark rounded-xl">
                <div className="absolute inset-0 flex items-center justify-center p-2 md:p-8">
                  <Card className="glass-card rounded-xl w-full shadow-lg">
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <GlowingEffect glow={true} variant="default" spread={30} blur={20} />
                    </div>
                    <CardContent className="p-3 md:p-4 space-y-2 md:space-y-3 relative z-10">
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-fintech-orange to-fintech-orange-light flex items-center justify-center text-white font-bold text-base shadow-md">
                          FA
                        </div>
                        <div>
                          <div className="text-sm md:text-base font-medium text-gray-900 dark:text-white">
                            <span className="text-foreground dark:text-foreground">FinTechAssist</span>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-white/70">{language === 'en' ? 'Your global fintech partner' : 'Ваш глобальный финтех-партнер'}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-1.5 md:space-y-2 bg-white/80 dark:bg-gray-900/30 p-2 md:p-3 rounded-lg backdrop-blur-sm border border-gray-200 dark:border-white/10 shadow-sm">
                        <div className="flex items-center space-x-2 text-gray-800 dark:text-white">
                          <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-fintech-orange/20 flex items-center justify-center">
                            <UserRound className="h-3.5 w-3.5 md:h-4 md:w-4 text-fintech-orange" />
                          </div>
                          <div className="text-xs md:text-sm font-medium">{language === 'en' ? 'Personal manager for every client' : 'Персональный менеджер для каждого клиента'}</div>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-800 dark:text-white">
                          <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-fintech-blue-light/20 flex items-center justify-center">
                            <Handshake className="h-3.5 w-3.5 md:h-4 md:w-4 text-fintech-blue-light" />
                          </div>
                          <div className="text-xs md:text-sm font-medium">{language === 'en' ? 'Full support at all stages' : 'Полное сопровождение на всех этапах'}</div>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-800 dark:text-white">
                          <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-green-400/20 flex items-center justify-center">
                            <ShieldCheck className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-500" />
                          </div>
                          <div className="text-xs md:text-sm font-medium">{language === 'en' ? 'Working through escrow services' : 'Работа через сервисы гаранта'}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-1 md:gap-2 pt-1">
                        <div className="bg-white/80 dark:bg-gray-900/30 rounded-lg p-2 md:p-3 border border-gray-200 dark:border-white/10 text-center">
                          <div className="text-2xs md:text-xs text-gray-500 dark:text-white/70">{language === 'en' ? 'Founded' : 'Основано'}</div>
                          <div className="mt-0.5 md:mt-1 font-semibold text-xs md:text-sm text-gray-900 dark:text-white">2015</div>
                        </div>
                        <div className="bg-white/80 dark:bg-gray-900/30 rounded-lg p-2 md:p-3 border border-gray-200 dark:border-white/10 text-center">
                          <div className="text-2xs md:text-xs text-gray-500 dark:text-white/70">{language === 'en' ? 'Team' : 'Команда'}</div>
                          <div className="mt-0.5 md:mt-1 font-semibold text-xs md:text-sm text-gray-900 dark:text-white">10+ {language === 'en' ? 'experts' : 'экспертов'}</div>
                        </div>
                        <div className="bg-white/80 dark:bg-gray-900/30 rounded-lg p-2 md:p-3 border border-gray-200 dark:border-white/10 text-center">
                          <div className="text-2xs md:text-xs text-gray-500 dark:text-white/70">{language === 'en' ? 'Clients' : 'Клиенты'}</div>
                          <div className="mt-0.5 md:mt-1 font-semibold text-xs md:text-sm text-gray-900 dark:text-white">500+</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-fintech-blue/10 text-fintech-blue dark:bg-fintech-blue/20 dark:text-fintech-blue-light mb-4">
              <span className="flex h-2 w-2 rounded-full bg-fintech-blue mr-2"></span>
              {t('nav.about')}
            </div>
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold mb-4 md:mb-6">
              {t('about.title')}
            </h2>
            
            <p className="text-muted-foreground mb-5 md:mb-6 text-sm md:text-base">
              {t('about.description')}
            </p>
            
            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-full bg-fintech-blue/10 dark:bg-fintech-blue/20 flex items-center justify-center">
                    <Globe className="h-4 w-4 text-fintech-blue dark:text-fintech-blue-light" />
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-fintech-blue dark:text-fintech-blue-light">50+</div>
                </div>
                <div className="text-sm text-muted-foreground">{language === 'en' ? 'Countries' : 'Стран'}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-full bg-fintech-orange/10 dark:bg-fintech-orange/20 flex items-center justify-center">
                    <UserRound className="h-4 w-4 text-fintech-orange" />
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-fintech-orange">500+</div>
                </div>
                <div className="text-sm text-muted-foreground">{language === 'en' ? 'Clients' : 'Клиентов'}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-full bg-fintech-blue/10 dark:bg-fintech-blue/20 flex items-center justify-center">
                    <Award className="h-4 w-4 text-fintech-blue dark:text-fintech-blue-light" />
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-fintech-blue dark:text-fintech-blue-light">98%</div>
                </div>
                <div className="text-sm text-muted-foreground">{language === 'en' ? 'Success Rate' : 'Успешных проектов'}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-full bg-fintech-orange/10 dark:bg-fintech-orange/20 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-fintech-orange" />
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-fintech-orange">7+</div>
                </div>
                <div className="text-sm text-muted-foreground">{language === 'en' ? 'Years Experience' : 'Лет опыта'}</div>
              </div>
            </div>
            
            <Button variant="outline" className="group text-sm" onClick={() => {
            const servicesElement = document.getElementById('services');
            if (servicesElement) {
              servicesElement.scrollIntoView({
                behavior: 'smooth'
              });
            }
          }}>
              {language === 'en' ? 'Explore Our Services' : 'Изучить наши услуги'}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
