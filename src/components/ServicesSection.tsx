import { Building, Landmark, Wallet, Gamepad, CreditCard, BarChart3, Briefcase, Shield, Globe, Scale, ChevronDown, ChevronUp, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { GlowingEffect } from './ui/glowing-effect';
import { useState } from 'react';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { motion, AnimatePresence } from 'framer-motion';

export function ServicesSection() {
  const { t } = useLanguage();
  const [openService, setOpenService] = useState<string | null>(null);

  const toggleService = (id: string) => {
    setOpenService(prev => prev === id ? null : id);
  };

  const services = [
    {
      id: 'company-formation',
      title: t('services.company-formation.title'),
      description: t('services.company-formation.short'),
      details: t('services.company-formation.details'),
      icon: Building,
      color: 'bg-blue-50 dark:bg-blue-950',
      iconColor: 'text-fintech-blue dark:text-fintech-blue-light',
      borderColor: 'border-fintech-blue/20',
    },
    {
      id: 'financial-licensing',
      title: t('services.financial-licensing.title'),
      description: t('services.financial-licensing.short'),
      details: t('services.financial-licensing.details'),
      icon: Landmark,
      color: 'bg-orange-50 dark:bg-orange-950',
      iconColor: 'text-fintech-orange dark:text-fintech-orange-light',
      borderColor: 'border-fintech-orange/20',
    },
    {
      id: 'crypto-regulation',
      title: t('services.crypto-regulation.title'),
      description: t('services.crypto-regulation.short'),
      details: t('services.crypto-regulation.details'),
      icon: Wallet,
      color: 'bg-purple-50 dark:bg-purple-950',
      iconColor: 'text-purple-500',
      borderColor: 'border-purple-500/20',
    },
    {
      id: 'gambling-licensing',
      title: t('services.gambling-licensing.title'),
      description: t('services.gambling-licensing.short'),
      details: t('services.gambling-licensing.details'),
      icon: Gamepad,
      color: 'bg-emerald-50 dark:bg-emerald-950',
      iconColor: 'text-emerald-500',
      borderColor: 'border-emerald-500/20',
    },
    {
      id: 'payment-solutions',
      title: t('services.payment-solutions.title'),
      description: t('services.payment-solutions.short'),
      details: t('services.payment-solutions.details'),
      icon: CreditCard,
      color: 'bg-blue-50 dark:bg-blue-950',
      iconColor: 'text-fintech-blue dark:text-fintech-blue-light',
      borderColor: 'border-fintech-blue/20',
    },
    {
      id: 'fiat-crypto',
      title: t('services.fiat-crypto.title'),
      description: t('services.fiat-crypto.short'),
      details: t('services.fiat-crypto.details'),
      icon: Banknote,
      color: 'bg-purple-50 dark:bg-purple-950',
      iconColor: 'text-purple-500',
      borderColor: 'border-purple-500/20',
    },
    {
      id: 'tax-planning',
      title: t('services.tax-planning.title'),
      description: t('services.tax-planning.short'),
      details: t('services.tax-planning.details'),
      icon: BarChart3,
      color: 'bg-orange-50 dark:bg-orange-950',
      iconColor: 'text-fintech-orange dark:text-fintech-orange-light',
      borderColor: 'border-fintech-orange/20',
    },
    {
      id: 'investment',
      title: t('services.investment.title'),
      description: t('services.investment.short'),
      details: t('services.investment.details'),
      icon: Briefcase,
      color: 'bg-purple-50 dark:bg-purple-950',
      iconColor: 'text-purple-500',
      borderColor: 'border-purple-500/20',
    },
    {
      id: 'nominee',
      title: t('services.nominee.title'),
      description: t('services.nominee.short'),
      details: t('services.nominee.details'),
      icon: Shield,
      color: 'bg-emerald-50 dark:bg-emerald-950',
      iconColor: 'text-emerald-500',
      borderColor: 'border-emerald-500/20',
    },
  ];

  return (
    <section id="services" className="section-padding bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-fintech-blue/10 text-fintech-blue dark:bg-fintech-blue/20 dark:text-fintech-blue-light mb-4">
            <span className="flex h-2 w-2 rounded-full bg-fintech-blue mr-2"></span>
            {t('services.badge')}
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            {t('services.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              layout
              className="animate-fade-up"
              style={{ animationDelay: `${index * 50}ms` }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.3,
                layout: { duration: 0.3, type: "spring" }
              }}
            >
              <Collapsible 
                open={openService === service.id}
                onOpenChange={() => toggleService(service.id)}
                className={`h-full transition-all duration-300 ${openService === service.id ? 'z-10 relative' : ''}`}
              >
                <Card 
                  className={`relative h-full transition-all duration-300 border ${service.borderColor} hover:shadow-lg ${openService === service.id ? 'shadow-md' : ''}`}
                >
                  <CollapsibleTrigger className="w-full text-left">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className={`${service.color} rounded-full p-3 inline-flex items-center justify-center mb-3 w-10 h-10`}>
                          <service.icon className={`h-5 w-5 ${service.iconColor}`} />
                        </div>
                        <div className="ml-auto">
                          {openService === service.id ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                      <h3 className="text-base sm:text-lg font-display font-bold mb-2 line-clamp-2">{service.title}</h3>
                      <p className="text-muted-foreground text-sm mb-0">{service.description}</p>
                    </CardContent>
                  </CollapsibleTrigger>

                  <AnimatePresence>
                    {openService === service.id && (
                      <CollapsibleContent forceMount>
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-5 pb-4 pt-0 border-t border-border/30 mt-1"
                        >
                          <p className="text-sm text-foreground/90 mb-4">{service.details}</p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className={`text-xs w-full ${service.iconColor} border-${service.iconColor}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              // Instead of navigation, we can scroll to contact form
                              const contactSection = document.getElementById('contact');
                              if (contactSection) {
                                contactSection.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                          >
                            {t('cta.request')}
                          </Button>
                        </motion.div>
                      </CollapsibleContent>
                    )}
                  </AnimatePresence>
                </Card>
              </Collapsible>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            className="bg-fintech-orange hover:bg-fintech-orange-light text-white button-glow dark:bg-fintech-orange/80 dark:hover:bg-fintech-orange/90"
            onClick={() => {
              // Instead of navigating to services detail, we'll scroll to contact
              const contactElement = document.getElementById('contact');
              if (contactElement) {
                contactElement.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            {t('cta.getStarted')}
          </Button>
        </div>
      </div>
    </section>
  );
}
