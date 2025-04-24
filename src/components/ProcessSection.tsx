import { SquareStack, SquareCheck, Boxes } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { GlowingEffect } from './ui/glowing-effect';

export function ProcessSection() {
  const { t } = useLanguage();

  const steps = [
    {
      id: 1,
      title: t('process.step1'),
      description: t('process.step1.desc'),
      icon: SquareStack,
      color: 'bg-gradient-to-br from-fintech-blue to-fintech-blue-light',
    },
    {
      id: 2,
      title: t('process.step2'),
      description: t('process.step2.desc'),
      icon: Boxes,
      color: 'bg-gradient-to-br from-fintech-orange to-fintech-orange-light',
    },
    {
      id: 3,
      title: t('process.step3'),
      description: t('process.step3.desc'),
      icon: SquareCheck,
      color: 'bg-gradient-to-br from-emerald-500 to-emerald-400',
    },
  ];

  return (
    <section id="how-it-works" className="section-padding">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-fintech-blue/10 text-fintech-blue dark:bg-fintech-blue/20 dark:text-fintech-blue-light mb-4">
            <span className="flex h-2 w-2 rounded-full bg-fintech-blue mr-2 dark:bg-fintech-blue-light"></span>
            {t('process.badge')}
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            {t('process.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('process.subtitle').replace('<FinTechAssist>', '<span class="text-foreground dark:text-foreground">FinTechAssist</span>')}
          </p>
        </div>
        
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-[calc(16.66%-0.5rem)] right-[calc(16.66%-0.5rem)] h-0.5 bg-gray-200 dark:bg-gray-800 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className="relative flex flex-col items-center text-center animate-fade-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`glass-card rounded-xl p-6 shadow-lg relative ${step.color} mb-6 hover-scale`}>
                  <step.icon className="h-8 w-8 text-white" />
                  <div className="absolute inset-0 rounded-xl">
                    <GlowingEffect 
                      blur={2} 
                      spread={30} 
                      glow={true} 
                      disabled={false} 
                      inactiveZone={0.2}
                      proximity={60}
                    />
                  </div>
                </div>
                <h3 className="text-xl font-display font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
