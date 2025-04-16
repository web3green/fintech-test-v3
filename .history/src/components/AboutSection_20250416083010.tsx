import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, UserRound, Handshake, ShieldCheck, Award, Clock, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { useIsMobile } from '@/hooks/use-mobile';
export function AboutSection() {
  const {
    t,
    language
  } = useLanguage();
  const isMobile = useIsMobile();
  return <section id="about" className="section-padding py-16 md:py-32 relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100/40 to-white dark:from-blue-950/30 dark:via-blue-900/10 dark:to-gray-900">
      <div className="container mx-auto px-6 md:px-8 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center max-w-7xl mx-auto">
          <div className="order-2 lg:order-1">
            <div className="relative rounded-xl overflow-hidden shadow-xl my-4 lg:mr-4">
              <div className="aspect-[4/3] bg-gradient-to-br from-fintech-blue-light via-fintech-blue to-fintech-blue-dark dark:from-fintech-blue-light dark:via-fintech-blue dark:to-fintech-blue-dark rounded-xl shadow-lg shadow-blue-500/20 dark:shadow-blue-500/30 relative overflow-hidden">
                {/* Декоративные элементы */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full filter blur-xl transform translate-x-20 -translate-y-20"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-300/20 rounded-full filter blur-xl transform -translate-x-20 translate-y-20"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent mix-blend-overlay"></div>
                
                <div className="absolute inset-0 flex items-center justify-center p-3 md:p-8">
                  <Card className="glass-card rounded-xl w-full shadow-lg backdrop-blur-md border border-white/20 dark:border-white/10 bg-gradient-to-br from-white/90 to-blue-50/80 dark:from-gray-900/90 dark:to-blue-950/80">
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <GlowingEffect glow={true} variant="blue" spread={30} blur={20} />
                    </div>
                    <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4 relative z-10">
                      <div className="flex items-center space-x-3 md:space-x-4">
                        <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-br from-fintech-orange to-fintech-orange-light dark:from-fintech-orange/40 dark:to-fintech-orange/60 flex items-center justify-center text-white font-bold text-base md:text-lg shadow-md border border-white/30 dark:border-gray-800/30">
                          FA
                        </div>
                        <div>
                          <div className="text-base md:text-lg font-medium text-gray-900 dark:text-white">
                            <span className="text-foreground dark:text-foreground">FinTechAssist</span>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-white/70">{language === 'en' ? 'Your global fintech partner' : 'Ваш глобальный финтех-партнер'}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 md:space-y-3 bg-white/90 dark:bg-gray-800/50 p-3 md:p-4 rounded-lg backdrop-blur-sm border border-gray-100 dark:border-white/5 shadow-sm">
                        <div className="flex items-center space-x-3 text-gray-800 dark:text-white">
                          <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center">
                            <UserRound className="h-4 w-4 md:h-5 md:w-5 text-fintech-blue dark:text-fintech-blue-light" />
                          </div>
                          <div className="text-sm md:text-base font-medium">{language === 'en' ? 'Personal manager for every client' : 'Персональный менеджер для каждого клиента'}</div>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-800 dark:text-white">
                          <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-orange-100 dark:bg-fintech-orange/15 flex items-center justify-center">
                            <Handshake className="h-4 w-4 md:h-5 md:w-5 text-fintech-orange dark:text-fintech-orange" />
                          </div>
                          <div className="text-sm md:text-base font-medium">{language === 'en' ? 'Full support at all stages' : 'Полное сопровождение на всех этапах'}</div>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-800 dark:text-white">
                          <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center">
                            <ShieldCheck className="h-4 w-4 md:h-5 md:w-5 text-fintech-blue dark:text-fintech-blue-light" />
                          </div>
                          <div className="text-sm md:text-base font-medium">{language === 'en' ? 'Working through escrow services' : 'Работа через сервисы гаранта'}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 md:gap-3 pt-2">
                        <div className="bg-gradient-to-br from-blue-50/80 to-blue-100/60 dark:from-blue-900/40 dark:to-blue-800/60 rounded-lg p-3 md:p-4 border border-blue-100/50 dark:border-blue-700/30 text-center">
                          <div className="text-xs md:text-sm text-blue-600 dark:text-blue-300">{language === 'en' ? 'Founded' : 'Основано'}</div>
                          <div className="mt-1 md:mt-2 font-semibold text-sm md:text-base text-blue-700 dark:text-blue-200">2015</div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50/80 to-orange-100/60 dark:from-fintech-orange/10 dark:to-fintech-orange/15 rounded-lg p-3 md:p-4 border border-orange-100/50 dark:border-fintech-orange/20 text-center">
                          <div className="text-xs md:text-sm text-fintech-orange dark:text-fintech-orange">{language === 'en' ? 'Team' : 'Команда'}</div>
                          <div className="mt-1 md:mt-2 font-semibold text-sm md:text-base text-fintech-orange dark:text-fintech-orange">10+ {language === 'en' ? 'experts' : 'экспертов'}</div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50/80 to-blue-100/60 dark:from-blue-900/40 dark:to-blue-800/60 rounded-lg p-3 md:p-4 border border-blue-100/50 dark:border-blue-700/30 text-center">
                          <div className="text-xs md:text-sm text-blue-600 dark:text-blue-300">{language === 'en' ? 'Clients' : 'Клиенты'}</div>
                          <div className="mt-1 md:mt-2 font-semibold text-sm md:text-base text-blue-700 dark:text-blue-200">500+</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Добавляем декоративные элементы вокруг карточки */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-400/20 dark:bg-blue-500/20 rounded-full filter blur-lg"></div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-orange-400/20 dark:bg-fintech-orange/15 rounded-full filter blur-lg"></div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 lg:ml-4">
            <div className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium bg-blue-500/20 text-blue-600 dark:bg-blue-600/30 dark:text-blue-300 mb-6 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
              {t('nav.about')}
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6 md:mb-8 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 dark:from-blue-400 dark:via-blue-300 dark:to-blue-500 bg-clip-text text-transparent">
              {t('about.title')}
            </h2>
            
            <div className="space-y-6 md:space-y-8">
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                {language === 'en' 
                  ? t('about.company.intro')
                  : t('about.company.intro')}
              </p>
              
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {t('about.description')}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 md:gap-6 my-8 md:my-10">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/80 dark:from-blue-950/40 dark:to-blue-900/60 p-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100/70 dark:border-blue-600/30 group hover:translate-y-[-2px]">
                <div className="flex items-center gap-4 mb-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 flex items-center justify-center shadow-md shadow-blue-400/20 group-hover:shadow-blue-400/30 transition-all duration-300">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-300 group-hover:scale-105 transition-transform duration-300">15+</div>
                </div>
                <div className="text-base text-blue-800 dark:text-blue-200 font-medium">{language === 'en' ? 'Countries' : 'Стран'}</div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-orange-100/80 dark:from-fintech-orange/10 dark:to-fintech-orange/15 p-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-orange-100/70 dark:border-fintech-orange/20 group hover:translate-y-[-2px]">
                <div className="flex items-center gap-4 mb-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-fintech-orange to-fintech-orange-light dark:from-fintech-orange/40 dark:to-fintech-orange/60 flex items-center justify-center shadow-md shadow-fintech-orange/20 group-hover:shadow-fintech-orange/15 transition-all duration-300">
                    <UserRound className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-fintech-orange dark:text-fintech-orange group-hover:scale-105 transition-transform duration-300">500+</div>
                </div>
                <div className="text-base text-fintech-orange dark:text-fintech-orange font-medium">{language === 'en' ? 'Clients' : 'Клиентов'}</div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-orange-100/80 dark:from-fintech-orange/10 dark:to-fintech-orange/15 p-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-orange-100/70 dark:border-fintech-orange/20 group hover:translate-y-[-2px]">
                <div className="flex items-center gap-4 mb-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-fintech-orange to-fintech-orange-light dark:from-fintech-orange/40 dark:to-fintech-orange/60 flex items-center justify-center shadow-md shadow-fintech-orange/20 group-hover:shadow-fintech-orange/15 transition-all duration-300">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-fintech-orange dark:text-fintech-orange group-hover:scale-105 transition-transform duration-300">98%</div>
                </div>
                <div className="text-base text-fintech-orange dark:text-fintech-orange font-medium">{language === 'en' ? 'Success Rate' : 'Успешных проектов'}</div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/80 dark:from-blue-950/40 dark:to-blue-900/60 p-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100/70 dark:border-blue-600/30 group hover:translate-y-[-2px]">
                <div className="flex items-center gap-4 mb-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 flex items-center justify-center shadow-md shadow-blue-400/20 group-hover:shadow-blue-400/30 transition-all duration-300">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-300 group-hover:scale-105 transition-transform duration-300">9+</div>
                </div>
                <div className="text-base text-blue-800 dark:text-blue-200 font-medium">{language === 'en' ? 'Years Experience' : 'Лет опыта'}</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50/30 to-blue-100/20 dark:from-blue-900/20 dark:to-blue-800/10 p-5 md:p-6 rounded-lg border border-blue-100/50 dark:border-blue-800/30 mb-8">
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {language === 'en' 
                  ? t('about.company.approach')
                  : t('about.company.approach')}
              </p>
            </div>
            
            <Button variant="outline" size="lg" className="group text-base bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 dark:from-blue-900/40 dark:to-blue-800/60 dark:hover:from-blue-800/60 dark:hover:to-blue-700/80 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 shadow-sm hover:shadow-md transition-all duration-300 mt-4 py-6" onClick={() => {
            const servicesElement = document.getElementById('services');
            if (servicesElement) {
              servicesElement.scrollIntoView({
                behavior: 'smooth'
              });
            }
          }}>
              {language === 'en' ? 'Explore Our Services' : 'Изучить наши услуги'}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Декоративные элементы для градиента */}
      <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
        <div className="w-64 h-64 md:w-96 md:h-96 bg-blue-300/20 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      <div className="absolute bottom-0 left-0 transform -translate-x-1/4 translate-y-1/4">
        <div className="w-64 h-64 md:w-96 md:h-96 bg-blue-200/30 dark:bg-blue-400/10 rounded-full blur-3xl"></div>
      </div>
    </section>;
}
}