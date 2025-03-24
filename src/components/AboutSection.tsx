
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, UserRound, Handshake, ShieldCheck, Award, Clock, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { GlowingEffect } from '@/components/ui/glowing-effect';

export function AboutSection() {
  const { t, language } = useLanguage();
  
  return (
    <section id="about" className="section-padding">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl">
              {/* Changed background gradient to be more subtle in light mode */}
              <div className="aspect-[4/3] bg-gradient-to-br from-fintech-blue/80 to-fintech-blue-dark dark:from-fintech-blue/90 dark:to-fintech-blue-dark rounded-xl">
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <Card className="glass-card rounded-xl w-full mx-auto shadow-lg relative transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <GlowingEffect glow={true} variant="default" spread={30} blur={20} />
                    </div>
                    <CardContent className="p-6 space-y-4 relative z-10">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-fintech-orange to-fintech-orange-light flex items-center justify-center text-white font-bold text-base shadow-md">
                          FA
                        </div>
                        <div>
                          <div className="text-lg font-medium text-gray-900 dark:text-white">
                            <span className="text-red-500">Fin</span><span className="text-fintech-blue-light">Tech</span><span className="text-fintech-orange">Assist</span>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-white/70">{language === 'en' ? 'Your global fintech partner' : 'Ваш глобальный финтех-партнер'}</div>
                        </div>
                      </div>
                      
                      {/* Updated background and text colors for better light mode appearance */}
                      <div className="space-y-3 bg-white/80 dark:bg-gray-900/30 p-3 rounded-lg backdrop-blur-sm border border-gray-200 dark:border-white/10 shadow-sm">
                        <div className="flex items-center space-x-3 text-gray-800 dark:text-white group transition-all duration-300 hover:translate-x-1">
                          <div className="h-8 w-8 rounded-full bg-fintech-orange/20 flex items-center justify-center">
                            <UserRound className="h-4 w-4 text-fintech-orange" />
                          </div>
                          <div className="text-sm font-medium">{language === 'en' ? 'Personal manager for every client' : 'Персональный менеджер для каждого клиента'}</div>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-800 dark:text-white group transition-all duration-300 hover:translate-x-1">
                          <div className="h-8 w-8 rounded-full bg-fintech-blue-light/20 flex items-center justify-center">
                            <Handshake className="h-4 w-4 text-fintech-blue-light" />
                          </div>
                          <div className="text-sm font-medium">{language === 'en' ? 'Full support at all stages' : 'Полное сопровождение на всех этапах'}</div>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-800 dark:text-white group transition-all duration-300 hover:translate-x-1">
                          <div className="h-8 w-8 rounded-full bg-green-400/20 flex items-center justify-center">
                            <ShieldCheck className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="text-sm font-medium">{language === 'en' ? 'Working through escrow services' : 'Работа через сервисы гаранта'}</div>
                        </div>
                      </div>
                      
                      {/* Updated grid section with better light mode styling */}
                      <div className="grid grid-cols-3 gap-3 pt-2">
                        <div className="bg-white/80 dark:bg-gray-900/30 rounded-lg p-3 border border-gray-200 dark:border-white/10 text-center transition-all duration-300 hover:bg-white/100 dark:hover:bg-gray-900/50 shadow-sm">
                          <div className="text-xs text-gray-500 dark:text-white/70">{language === 'en' ? 'Founded' : 'Основано'}</div>
                          <div className="mt-1 font-semibold text-gray-900 dark:text-white">2015</div>
                        </div>
                        <div className="bg-white/80 dark:bg-gray-900/30 rounded-lg p-3 border border-gray-200 dark:border-white/10 text-center transition-all duration-300 hover:bg-white/100 dark:hover:bg-gray-900/50 shadow-sm">
                          <div className="text-xs text-gray-500 dark:text-white/70">{language === 'en' ? 'Team' : 'Команда'}</div>
                          <div className="mt-1 font-semibold text-gray-900 dark:text-white">10+ {language === 'en' ? 'experts' : 'экспертов'}</div>
                        </div>
                        <div className="bg-white/80 dark:bg-gray-900/30 rounded-lg p-3 border border-gray-200 dark:border-white/10 text-center transition-all duration-300 hover:bg-white/100 dark:hover:bg-gray-900/50 shadow-sm">
                          <div className="text-xs text-gray-500 dark:text-white/70">{language === 'en' ? 'Clients' : 'Клиенты'}</div>
                          <div className="mt-1 font-semibold text-gray-900 dark:text-white">500+</div>
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
            
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              {t('about.title')}
            </h2>
            
            <p className="text-muted-foreground mb-6">
              {t('about.description')}
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-full bg-fintech-blue/10 dark:bg-fintech-blue/20 flex items-center justify-center">
                    <Globe className="h-4 w-4 text-fintech-blue dark:text-fintech-blue-light" />
                  </div>
                  <div className="text-2xl font-bold text-fintech-blue dark:text-fintech-blue-light">50+</div>
                </div>
                <div className="text-sm text-muted-foreground">{language === 'en' ? 'Countries' : 'Стран'}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-full bg-fintech-orange/10 dark:bg-fintech-orange/20 flex items-center justify-center">
                    <UserRound className="h-4 w-4 text-fintech-orange" />
                  </div>
                  <div className="text-2xl font-bold text-fintech-orange">500+</div>
                </div>
                <div className="text-sm text-muted-foreground">{language === 'en' ? 'Clients' : 'Клиентов'}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-full bg-fintech-blue/10 dark:bg-fintech-blue/20 flex items-center justify-center">
                    <Award className="h-4 w-4 text-fintech-blue dark:text-fintech-blue-light" />
                  </div>
                  <div className="text-2xl font-bold text-fintech-blue dark:text-fintech-blue-light">98%</div>
                </div>
                <div className="text-sm text-muted-foreground">{language === 'en' ? 'Success Rate' : 'Успешных проектов'}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-full bg-fintech-orange/10 dark:bg-fintech-orange/20 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-fintech-orange" />
                  </div>
                  <div className="text-2xl font-bold text-fintech-orange">7+</div>
                </div>
                <div className="text-sm text-muted-foreground">{language === 'en' ? 'Years Experience' : 'Лет опыта'}</div>
              </div>
            </div>
            
            <Button variant="outline" className="group" onClick={() => {
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
