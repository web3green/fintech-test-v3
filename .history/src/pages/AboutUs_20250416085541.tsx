import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Briefcase, Globe, Clock, Award, UserRound } from 'lucide-react';

export default function AboutUs() {
  const { t, language } = useLanguage();

  const stats = [
    { value: '15+', label: language === 'en' ? 'Countries' : 'Стран', icon: Globe, color: 'bg-blue-500' },
    { value: '500+', label: language === 'en' ? 'Clients' : 'Клиентов', icon: UserRound, color: 'bg-fintech-orange' },
    { value: '98%', label: language === 'en' ? 'Success Rate' : 'Успешных проектов', icon: Award, color: 'bg-fintech-orange' },
    { value: '9+', label: language === 'en' ? 'Years Experience' : 'Лет опыта', icon: Clock, color: 'bg-blue-500' },
  ];

  const team = [
    {
      name: 'Alex Morgan',
      position: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a',
      description: 'With over 15 years of experience in international finance and business registration, Alex leads our company with expertise and vision.'
    },
    {
      name: 'Sarah Johnson',
      position: 'Legal Director',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
      description: 'Sarah oversees all legal aspects of our company, ensuring top-quality service and legal compliance for all clients.'
    },
    {
      name: 'Michael Chen',
      position: 'Financial Consultant',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7',
      description: 'Michael specializes in international banking and helps clients navigate complex financial requirements.'
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section - центрированный верхний блок как в Services.tsx */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/30 dark:to-gray-900">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-blue-500/20 text-blue-600 dark:bg-blue-600/30 dark:text-blue-300">
                <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                {t('nav.about')}
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-6">
              About Our Company
              </h1>
            
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-muted-foreground mb-4">
                {language === 'en' 
                  ? 'FintechAssist is a UK-based full-service consulting company. Our team has deep experience in banking, finance, law, and compliance.'
                  : 'FintechAssist - Британская консалтингово-сервисная компания полного цикла. Мы - команда с большим опытом в банковской, финансовой, юридической сфере и комплаенса.'}
              </p>
              <p className="text-lg text-muted-foreground">
                {language === 'en' 
                  ? 'We help businesses navigate the complex world of international finance'
                  : 'Мы помогаем бизнесу ориентироваться в сложном мире международных финансов'}
              </p>
            </div>
          </div>
        </section>

        {/* About Content */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Левая колонка с карточкой */}
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <div className="bg-gradient-to-br from-fintech-blue to-fintech-blue-dark p-10 relative">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full filter blur-xl transform translate-x-20 -translate-y-20"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-300/20 rounded-full filter blur-xl transform -translate-x-20 translate-y-20"></div>
                  
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8 border border-white/20">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-fintech-orange to-fintech-orange-light flex items-center justify-center text-white font-bold text-xl">
                        FA
                      </div>
                      <div>
                        <div className="text-lg font-medium text-white">
                          FinTechAssist
                        </div>
                        <div className="text-sm text-white/70">
                          {language === 'en' ? 'Your global fintech partner' : 'Ваш глобальный финтех-партнер'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3 bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/5">
                      <div className="flex items-center space-x-3 text-white">
                        <div className="h-8 w-8 rounded-full bg-blue-400/30 flex items-center justify-center">
                          <UserRound className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-sm font-medium">{language === 'en' ? 'Personal manager for every client' : 'Персональный менеджер для каждого клиента'}</div>
                      </div>
                      
                      <div className="flex items-center space-x-3 text-white">
                        <div className="h-8 w-8 rounded-full bg-fintech-orange/30 flex items-center justify-center">
                          <Briefcase className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-sm font-medium">{language === 'en' ? 'Full support at all stages' : 'Полное сопровождение на всех этапах'}</div>
                      </div>
                      
                      <div className="flex items-center space-x-3 text-white">
                        <div className="h-8 w-8 rounded-full bg-blue-400/30 flex items-center justify-center">
                          <Award className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-sm font-medium">{language === 'en' ? 'Working through escrow services' : 'Работа через сервисы гаранта'}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 mt-6">
                      <div className="bg-white/10 rounded-lg p-3 border border-white/10 text-center">
                        <div className="text-xs text-white/80">{language === 'en' ? 'Founded' : 'Основано'}</div>
                        <div className="mt-1 font-semibold text-sm text-white">2015</div>
                      </div>
                      <div className="bg-fintech-orange/20 rounded-lg p-3 border border-fintech-orange/30 text-center">
                        <div className="text-xs text-white/80">{language === 'en' ? 'Team' : 'Команда'}</div>
                        <div className="mt-1 font-semibold text-sm text-white">10+ {language === 'en' ? 'experts' : 'экспертов'}</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 border border-white/10 text-center">
                        <div className="text-xs text-white/80">{language === 'en' ? 'Clients' : 'Клиенты'}</div>
                        <div className="mt-1 font-semibold text-sm text-white">500+</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Правая колонка с текстом и статистикой */}
              <div className="space-y-8">
              <div>
                  <p className="text-lg text-muted-foreground mb-6">
                    {language === 'en' 
                      ? t('about.company.intro')
                      : t('about.company.intro')}
                  </p>
                  
                  <p className="text-muted-foreground mb-6">
                    {language === 'en' 
                      ? 'We help businesses navigate the complex world of international finance'
                      : 'Мы помогаем бизнесу ориентироваться в сложном мире международных финансов'}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`h-10 w-10 rounded-full ${stat.color} flex items-center justify-center shadow-md`}>
                          <stat.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gradient-to-br from-blue-50/80 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 p-5 rounded-lg border border-blue-100/70 dark:border-blue-700/30">
                  <p className="text-gray-700 dark:text-gray-300">
                    {language === 'en' 
                      ? t('about.company.approach')
                      : t('about.company.approach')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium bg-fintech-blue/10 text-fintech-blue dark:bg-fintech-blue/20 dark:text-fintech-blue-light mb-4">
                <span className="flex h-2 w-2 rounded-full bg-fintech-blue mr-2"></span>
                Our Team
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Meet the Experts Behind Fintech-Assist
              </h2>
              <p className="text-xl text-muted-foreground">
                Our team combines expertise in finance, law, and international business to deliver exceptional solutions for our clients.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div 
                  key={index} 
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="h-64 overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-display font-bold mb-1">{member.name}</h3>
                    <p className="text-fintech-blue dark:text-fintech-blue-light mb-4">{member.position}</p>
                    <p className="text-muted-foreground">{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Company Services - Full width section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium bg-fintech-blue/10 text-fintech-blue dark:bg-fintech-blue/20 dark:text-fintech-blue-light mb-4">
                  <span className="flex h-2 w-2 rounded-full bg-fintech-blue mr-2"></span>
                  Our Services
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">
                  Comprehensive Solutions
                </h2>
                
                <div className="prose prose-lg dark:prose-invert mx-auto">
                  <p className="mb-6 text-muted-foreground text-center">
                    {language === 'en' 
                      ? t('about.company.services')
                      : t('about.company.services')}
                  </p>
                  
                  <p className="text-lg font-medium text-center text-foreground">
                    {language === 'en' 
                      ? t('about.company.conclusion')
                      : t('about.company.conclusion')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
