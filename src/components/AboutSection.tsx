import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, UserRound, Handshake, ShieldCheck, Award, Clock, Globe, BookOpenCheck, FileCheck, Building, BarChart4, HandCoins, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { useIsMobile } from '@/hooks/use-mobile';

export function AboutSection() {
  const {
    t,
    language
  } = useLanguage();
  const isMobile = useIsMobile();
  
  return (
    <>
      {/* Заголовок раздела */}
      <section id="about-header" className="py-12 md:py-16 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-950/20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-blue-500/20 text-blue-600 dark:bg-blue-600/30 dark:text-blue-300 mb-4 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
            {t('nav.about')}
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6 md:mb-8 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 dark:from-blue-400 dark:via-blue-300 dark:to-blue-500 bg-clip-text text-transparent">
            {t('about.main_title_header', 'FintechAssist')}
          </h2>
          
          <p className="max-w-3xl mx-auto text-muted-foreground text-lg md:text-xl text-justify">
            {t('about.main_subtitle_header', 'UK-based full-service consulting company with deep experience in banking, finance, law, and compliance')}
          </p>
        </div>
      </section>
      
      {/* Основной раздел "О нас" */}
      <section id="about" className="section-padding py-8 md:py-24 relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100/40 to-white dark:from-blue-950/30 dark:via-blue-900/10 dark:to-gray-900">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative rounded-xl overflow-hidden shadow-xl my-2 lg:mr-2">
              <div className="aspect-[4/3] bg-gradient-to-br from-fintech-blue-light via-fintech-blue to-fintech-blue-dark dark:from-fintech-blue-light dark:via-fintech-blue dark:to-fintech-blue-dark rounded-xl shadow-lg shadow-blue-500/20 dark:shadow-blue-500/30 relative overflow-hidden">
                {/* Декоративные элементы */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full filter blur-xl transform translate-x-20 -translate-y-20"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-300/20 rounded-full filter blur-xl transform -translate-x-20 translate-y-20"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent mix-blend-overlay"></div>
                
                <div className="absolute inset-0 flex items-center justify-center p-2 md:p-6">
                  <Card className="glass-card rounded-xl w-full shadow-lg backdrop-blur-md border border-white/20 dark:border-white/10 bg-gradient-to-br from-white/90 to-blue-50/80 dark:from-gray-900/90 dark:to-blue-950/80">
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                        <GlowingEffect glow={true} spread={30} blur={20} />
                    </div>
                    <CardContent className="p-3 md:p-4 space-y-2 md:space-y-3 relative z-10">
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-fintech-orange to-fintech-orange-light dark:from-fintech-orange/40 dark:to-fintech-orange/60 flex items-center justify-center text-white font-bold text-base shadow-md border border-white/30 dark:border-gray-800/30">
                          FA
                        </div>
                        <div>
                          <div className="text-sm md:text-base font-medium text-gray-900 dark:text-white">
                            <span className="text-foreground dark:text-foreground">FinTechAssist</span>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-white/70">{t('about.hero.subtitle', 'Your global fintech partner')}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-1.5 md:space-y-2 bg-white/90 dark:bg-gray-800/50 p-2 md:p-3 rounded-lg backdrop-blur-sm border border-gray-100 dark:border-white/5 shadow-sm">
                        <div className="flex items-center space-x-2 text-gray-800 dark:text-white">
                          <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center">
                            <UserRound className="h-3.5 w-3.5 md:h-4 md:w-4 text-fintech-blue dark:text-fintech-blue-light" />
                          </div>
                          <div className="text-xs md:text-sm font-medium">{t('about.hero.feature1', 'Personal manager for every client')}</div>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-800 dark:text-white">
                          <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-orange-100 dark:bg-fintech-orange/15 flex items-center justify-center">
                            <Handshake className="h-3.5 w-3.5 md:h-4 md:w-4 text-fintech-orange dark:text-fintech-orange" />
                          </div>
                          <div className="text-xs md:text-sm font-medium">{t('about.hero.feature2', 'Full support at all stages')}</div>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-800 dark:text-white">
                          <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center">
                            <ShieldCheck className="h-3.5 w-3.5 md:h-4 md:w-4 text-fintech-blue dark:text-fintech-blue-light" />
                          </div>
                          <div className="text-xs md:text-sm font-medium">{t('about.hero.feature3', 'Working through escrow services')}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-1 md:gap-2 pt-1">
                        <div className="bg-gradient-to-br from-blue-50/80 to-blue-100/60 dark:from-blue-900/40 dark:to-blue-800/60 rounded-lg p-2 md:p-3 border border-blue-100/50 dark:border-blue-700/30 text-center">
                          <div className="text-2xs md:text-xs text-blue-600 dark:text-blue-300">{t('about.hero.stat_founded_label', 'Founded')}</div>
                          <div className="mt-0.5 md:mt-1 font-semibold text-xs md:text-sm text-blue-700 dark:text-blue-200">{t('about.hero.stat_founded_value', '2015')}</div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50/80 to-orange-100/60 dark:from-fintech-orange/10 dark:to-fintech-orange/15 rounded-lg p-2 md:p-3 border border-orange-100/50 dark:border-fintech-orange/20 text-center">
                          <div className="text-2xs md:text-xs text-fintech-orange dark:text-fintech-orange">{t('about.hero.stat_team_label', 'Team')}</div>
                          <div className="mt-0.5 md:mt-1 font-semibold text-xs md:text-sm text-fintech-orange dark:text-fintech-orange">{t('about.hero.stat_team_value', '10+ experts')}</div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50/80 to-blue-100/60 dark:from-blue-900/40 dark:to-blue-800/60 rounded-lg p-2 md:p-3 border border-blue-100/50 dark:border-blue-700/30 text-center">
                          <div className="text-2xs md:text-xs text-blue-600 dark:text-blue-300">{t('about.hero.stat_clients_label', 'Clients')}</div>
                          <div className="mt-0.5 md:mt-1 font-semibold text-xs md:text-sm text-blue-700 dark:text-blue-200">{t('about.hero.stat_clients_value', '300+')}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Добавляем декоративные элементы вокруг карточки */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-400/20 dark:bg-blue-500/20 rounded-full filter blur-lg"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-orange-400/20 dark:bg-fintech-orange/15 rounded-full filter blur-lg"></div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 lg:ml-2">
            <p className="text-muted-foreground mb-5 md:mb-6 text-sm md:text-base leading-relaxed">
              {t('about.description')}
            </p>
            
            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/80 dark:from-blue-950/40 dark:to-blue-900/60 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100/70 dark:border-blue-600/30 group hover:translate-y-[-2px]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 flex items-center justify-center shadow-md shadow-blue-400/20 group-hover:shadow-blue-400/30 transition-all duration-300">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-300 group-hover:scale-105 transition-transform duration-300">20+</div>
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-200 font-medium">{language === 'en' ? 'Countries' : 'Стран'}</div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-orange-100/80 dark:from-fintech-orange/10 dark:to-fintech-orange/15 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-orange-100/70 dark:border-fintech-orange/20 group hover:translate-y-[-2px]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-fintech-orange to-fintech-orange-light dark:from-fintech-orange/40 dark:to-fintech-orange/60 flex items-center justify-center shadow-md shadow-fintech-orange/20 group-hover:shadow-fintech-orange/15 transition-all duration-300">
                    <UserRound className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-fintech-orange dark:text-fintech-orange group-hover:scale-105 transition-transform duration-300">300+</div>
                </div>
                <div className="text-sm text-fintech-orange dark:text-fintech-orange font-medium">{language === 'en' ? 'Clients' : 'Клиентов'}</div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-orange-100/80 dark:from-fintech-orange/10 dark:to-fintech-orange/15 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-orange-100/70 dark:border-fintech-orange/20 group hover:translate-y-[-2px]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-fintech-orange to-fintech-orange-light dark:from-fintech-orange/40 dark:to-fintech-orange/60 flex items-center justify-center shadow-md shadow-fintech-orange/20 group-hover:shadow-fintech-orange/15 transition-all duration-300">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-fintech-orange dark:text-fintech-orange group-hover:scale-105 transition-transform duration-300">98%</div>
                </div>
                <div className="text-sm text-fintech-orange dark:text-fintech-orange font-medium">{language === 'en' ? 'Success Rate' : 'Успешных проектов'}</div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/80 dark:from-blue-950/40 dark:to-blue-900/60 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100/70 dark:border-blue-600/30 group hover:translate-y-[-2px]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 flex items-center justify-center shadow-md shadow-blue-400/20 group-hover:shadow-blue-400/30 transition-all duration-300">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-300 group-hover:scale-105 transition-transform duration-300">9+</div>
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-200 font-medium">{language === 'en' ? 'Years Experience' : 'Лет опыта'}</div>
              </div>
            </div>
            
            <Button variant="outline" className="group text-sm bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 dark:from-blue-900/40 dark:to-blue-800/60 dark:hover:from-blue-800/60 dark:hover:to-blue-700/80 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 shadow-sm hover:shadow-md transition-all duration-300 mt-2" onClick={() => {
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
      
      {/* Декоративные элементы для градиента */}
      <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
        <div className="w-40 h-40 md:w-64 md:h-64 bg-blue-300/20 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      <div className="absolute bottom-0 left-0 transform -translate-x-1/4 translate-y-1/4">
        <div className="w-40 h-40 md:w-64 md:h-64 bg-blue-200/30 dark:bg-blue-400/10 rounded-full blur-3xl"></div>
      </div>
      </section>

      {/* Блок во всю ширину с текстом о компании */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-950/30">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-blue-700 dark:text-blue-400">
              {t('about.intro.title', 'Your Trusted Financial Partner')}
            </h3>
            
            <p className="text-muted-foreground mb-8 text-base md:text-lg leading-relaxed">
              {t('about.intro.description', "Whether you're a startup or a growing company, we attentively study your goals and demands, developing tailor-made solutions that perfectly align with your needs. We provide a comprehensive range of services, from company registration and account opening to financial licensing and accounting support.")}
            </p>
            
            <div className="flex justify-center">
              <div className="inline-flex h-1 bg-gradient-to-r from-blue-300 via-blue-500 to-fintech-blue-light w-24 rounded"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Блок с двумя частями и карточками */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-950/20 dark:to-gray-900">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Левая колонка */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-6 text-blue-700 dark:text-blue-400">
                {t('about.expertise.main_title', 'Our Expertise')}
              </h3>
              
              <div className="space-y-4">
                <Card className="bg-white dark:bg-gray-800/50 shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100 dark:border-blue-900/40">
                  <CardContent className="p-5 flex gap-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center flex-shrink-0">
                      <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1 text-blue-800 dark:text-blue-300">
                        {t('about.expertise.company_formation.title', 'Company Formation')}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {t('about.expertise.company_formation.description', 'We help establish your business entity in various jurisdictions with all necessary documentation.')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white dark:bg-gray-800/50 shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100 dark:border-blue-900/40">
                  <CardContent className="p-5 flex gap-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center flex-shrink-0">
                      <BarChart4 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1 text-blue-800 dark:text-blue-300">
                        {t('about.expertise.financial_licensing.title', 'Financial Licensing')}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {t('about.expertise.financial_licensing.description', 'Obtain regulatory approval and financial licenses across multiple international jurisdictions.')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white dark:bg-gray-800/50 shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100 dark:border-blue-900/40">
                  <CardContent className="p-5 flex gap-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center flex-shrink-0">
                      <BookOpenCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1 text-blue-800 dark:text-blue-300">
                        {t('about.expertise.accounting_services.title', 'Accounting Services')}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {t('about.expertise.accounting_services.description', 'Professional accounting and financial reporting tailored to your business needs.')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Правая колонка */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-6 text-fintech-orange dark:text-fintech-orange">
                {t('about.why_choose_us.main_title', 'Why Choose Us')}
              </h3>
              
              <div className="space-y-4">
                <Card className="bg-white dark:bg-gray-800/50 shadow-md hover:shadow-lg transition-all duration-300 border border-orange-100 dark:border-fintech-orange/20">
                  <CardContent className="p-5 flex gap-4">
                    <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-fintech-orange/15 flex items-center justify-center flex-shrink-0">
                      <Users className="h-6 w-6 text-fintech-orange dark:text-fintech-orange" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1 text-fintech-orange dark:text-fintech-orange">
                        {t('about.why_choose_us.expert_team.title', 'Expert Team')}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {t('about.why_choose_us.expert_team.description', 'Our team has deep experience in banking, finance, law, and compliance across multiple jurisdictions.')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white dark:bg-gray-800/50 shadow-md hover:shadow-lg transition-all duration-300 border border-orange-100 dark:border-fintech-orange/20">
                  <CardContent className="p-5 flex gap-4">
                    <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-fintech-orange/15 flex items-center justify-center flex-shrink-0">
                      <HandCoins className="h-6 w-6 text-fintech-orange dark:text-fintech-orange" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1 text-fintech-orange dark:text-fintech-orange">
                        {t('about.why_choose_us.tailored_solutions.title', 'Tailored Solutions')}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {t('about.why_choose_us.tailored_solutions.description', 'We develop custom solutions aligned perfectly with your business goals and specific needs.')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white dark:bg-gray-800/50 shadow-md hover:shadow-lg transition-all duration-300 border border-orange-100 dark:border-fintech-orange/20">
                  <CardContent className="p-5 flex gap-4">
                    <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-fintech-orange/15 flex items-center justify-center flex-shrink-0">
                      <FileCheck className="h-6 w-6 text-fintech-orange dark:text-fintech-orange" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1 text-fintech-orange dark:text-fintech-orange">
                        {t('about.why_choose_us.complete_documentation.title', 'Complete Documentation')}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {t('about.why_choose_us.complete_documentation.description', 'We prepare all necessary documentation, including business plans, AML policies, and application forms.')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Заключительный блок с текстом */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-gray-900">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-700 to-fintech-orange bg-clip-text text-transparent">
              {t('about.conclusion.main_title', 'Ready to Transform Your Financial Future?')}
            </h3>
            
            <p className="text-muted-foreground mb-8 text-base md:text-lg leading-relaxed">
              {t('about.conclusion.description', "Our team will handle all the necessary documentation, leveraging our years of expertise to ensure a smooth process. Our services are designed to fully meet our clients' needs in the fintech and financial sectors.")}
            </p>
            
            <Button 
              className="bg-gradient-to-r from-blue-600 to-fintech-blue hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t('about.conclusion.cta_button', 'Contact Us Today')}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}