
import { Building, Landmark, Wallet, Gamepad, CreditCard, BarChart3, Briefcase, Shield, Globe, Scale, ChevronDown, ChevronUp } from 'lucide-react';
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

export function ServicesSection() {
  const { t } = useLanguage();
  const [openServices, setOpenServices] = useState<string[]>([]);

  const toggleService = (id: string) => {
    setOpenServices(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const services = [
    {
      id: 'company-formation',
      title: 'International Company Formation',
      description: 'Company registration in various jurisdictions (UAE, Singapore, Hong Kong, Europe)',
      details: 'Our expert team assists with complete company formation services across multiple jurisdictions. We handle all paperwork, legal requirements, and registration processes to ensure a smooth establishment of your business entity abroad.',
      icon: Building,
      color: 'bg-blue-50 dark:bg-blue-950',
      iconColor: 'text-fintech-blue dark:text-fintech-blue-light',
      borderColor: 'border-fintech-blue/20',
    },
    {
      id: 'financial-licensing',
      title: 'Financial Licensing',
      description: 'Obtaining fintech licenses (EMI, PSP, payment licenses)',
      details: 'We guide you through the complex process of obtaining financial licenses for your business. Our services include application preparation, regulatory compliance, and ongoing support throughout the licensing process.',
      icon: Landmark,
      color: 'bg-orange-50 dark:bg-orange-950',
      iconColor: 'text-fintech-orange dark:text-fintech-orange-light',
      borderColor: 'border-fintech-orange/20',
    },
    {
      id: 'crypto-regulation',
      title: 'Cryptocurrency Regulation',
      description: 'Crypto exchange and trading platform licensing, VASP registration',
      details: 'Navigate the evolving landscape of cryptocurrency regulation with our specialized services. We assist with exchange licensing, trading platform compliance, and VASP registration in crypto-friendly jurisdictions.',
      icon: Wallet,
      color: 'bg-purple-50 dark:bg-purple-950',
      iconColor: 'text-purple-500',
      borderColor: 'border-purple-500/20',
    },
    {
      id: 'gambling-licensing',
      title: 'Gambling Licensing',
      description: 'Online casino and bookmaker licenses in various jurisdictions',
      details: 'Secure the necessary gambling licenses for your online casino or bookmaking operation. Our team has extensive experience with gaming regulations across multiple jurisdictions and can guide you through the entire licensing process.',
      icon: Gamepad,
      color: 'bg-emerald-50 dark:bg-emerald-950',
      iconColor: 'text-emerald-500',
      borderColor: 'border-emerald-500/20',
    },
    {
      id: 'payment-solutions',
      title: 'International Payment Solutions',
      description: 'Corporate account opening abroad and merchant account setup',
      details: 'Access global payment solutions with our comprehensive corporate account and merchant setup services. We connect you with reliable banking partners and payment processors to facilitate seamless international transactions.',
      icon: CreditCard,
      color: 'bg-blue-50 dark:bg-blue-950',
      iconColor: 'text-fintech-blue dark:text-fintech-blue-light',
      borderColor: 'border-fintech-blue/20',
    },
    {
      id: 'tax-planning',
      title: 'Tax Planning',
      description: 'International tax structuring and compliance with global standards',
      details: 'Optimize your tax structure with our international tax planning services. We develop compliant strategies that align with global standards while maximizing efficiency for your business operations across multiple jurisdictions.',
      icon: BarChart3,
      color: 'bg-orange-50 dark:bg-orange-950',
      iconColor: 'text-fintech-orange dark:text-fintech-orange-light',
      borderColor: 'border-fintech-orange/20',
    },
    {
      id: 'investment',
      title: 'Investment Attraction',
      description: 'Venture financing assistance and IPO preparation',
      details: 'Attract the right investors with our specialized investment services. From venture capital fundraising to IPO preparation, our team provides comprehensive support to position your business for successful funding rounds.',
      icon: Briefcase,
      color: 'bg-purple-50 dark:bg-purple-950',
      iconColor: 'text-purple-500',
      borderColor: 'border-purple-500/20',
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property Protection',
      description: 'International trademark registration and IT solution patenting',
      details: 'Safeguard your innovations and brand identity with our intellectual property services. We handle international trademark registrations, patent applications, and comprehensive IP protection strategies tailored to your business needs.',
      icon: Shield,
      color: 'bg-emerald-50 dark:bg-emerald-950',
      iconColor: 'text-emerald-500',
      borderColor: 'border-emerald-500/20',
    },
    {
      id: 'business-immigration',
      title: 'Business Immigration',
      description: 'Residence permits and citizenship through investment programs',
      details: 'Explore global mobility options with our business immigration services. We specialize in residence permits and citizenship-by-investment programs, providing end-to-end support for entrepreneurs and investors seeking international relocation.',
      icon: Globe,
      color: 'bg-blue-50 dark:bg-blue-950',
      iconColor: 'text-fintech-blue dark:text-fintech-blue-light',
      borderColor: 'border-fintech-blue/20',
    },
    {
      id: 'compliance',
      title: 'Compliance and Regulatory Services',
      description: 'AML/KYC policy development and regulatory compliance',
      details: 'Stay compliant with evolving regulations through our specialized compliance services. We develop and implement AML/KYC policies, conduct compliance audits, and ensure your operations meet all applicable regulatory requirements.',
      icon: Scale,
      color: 'bg-orange-50 dark:bg-orange-950',
      iconColor: 'text-fintech-orange dark:text-fintech-orange-light',
      borderColor: 'border-fintech-orange/20',
    },
  ];

  return (
    <section id="services" className="section-padding bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-fintech-blue/10 text-fintech-blue dark:bg-fintech-blue/20 dark:text-fintech-blue-light mb-4">
            <span className="flex h-2 w-2 rounded-full bg-fintech-blue mr-2"></span>
            {t('services.badge')}
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Our Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive consulting solutions for international business, licensing, and compliance
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
          {services.map((service, index) => (
            <Collapsible 
              key={service.id}
              open={openServices.includes(service.id)}
              onOpenChange={() => toggleService(service.id)}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Card 
                className={`relative h-full transition-all duration-300 border ${service.borderColor} hover:shadow-lg ${openServices.includes(service.id) ? 'shadow-md' : ''}`}
              >
                <CollapsibleTrigger className="w-full text-left">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className={`${service.color} rounded-full p-3 inline-flex items-center justify-center mb-3 w-10 h-10`}>
                        <service.icon className={`h-5 w-5 ${service.iconColor}`} />
                      </div>
                      <div className="ml-auto">
                        {openServices.includes(service.id) ? (
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

                <CollapsibleContent>
                  <div className="px-5 pb-4 pt-0 border-t border-border/30 mt-1">
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
                      Request Consultation
                    </Button>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            className="bg-fintech-blue hover:bg-fintech-blue-dark text-white button-glow"
            onClick={() => {
              // Instead of navigating to services detail, we'll scroll to contact
              const contactElement = document.getElementById('contact');
              if (contactElement) {
                contactElement.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
}
