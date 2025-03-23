
import { Building, Landmark, Wallet, Gamepad, CreditCard, BarChart3, Briefcase, Shield, Globe, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { GlowingEffect } from './ui/glowing-effect';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

export function ServicesSection() {
  const { t } = useLanguage();

  const services = [
    {
      id: 'company-formation',
      title: 'International Company Formation',
      description: 'Company registration in various jurisdictions (UAE, Singapore, Hong Kong, Europe)',
      icon: Building,
      color: 'bg-blue-50 dark:bg-blue-950',
      iconColor: 'text-fintech-blue dark:text-fintech-blue-light',
      borderColor: 'border-fintech-blue/20',
    },
    {
      id: 'financial-licensing',
      title: 'Financial Licensing',
      description: 'Obtaining fintech licenses (EMI, PSP, payment licenses)',
      icon: Landmark,
      color: 'bg-orange-50 dark:bg-orange-950',
      iconColor: 'text-fintech-orange dark:text-fintech-orange-light',
      borderColor: 'border-fintech-orange/20',
    },
    {
      id: 'crypto-regulation',
      title: 'Cryptocurrency Regulation',
      description: 'Crypto exchange and trading platform licensing, VASP registration',
      icon: Wallet,
      color: 'bg-purple-50 dark:bg-purple-950',
      iconColor: 'text-purple-500',
      borderColor: 'border-purple-500/20',
    },
    {
      id: 'gambling-licensing',
      title: 'Gambling Licensing',
      description: 'Online casino and bookmaker licenses in various jurisdictions',
      icon: Gamepad,
      color: 'bg-emerald-50 dark:bg-emerald-950',
      iconColor: 'text-emerald-500',
      borderColor: 'border-emerald-500/20',
    },
    {
      id: 'payment-solutions',
      title: 'International Payment Solutions',
      description: 'Corporate account opening abroad and merchant account setup',
      icon: CreditCard,
      color: 'bg-blue-50 dark:bg-blue-950',
      iconColor: 'text-fintech-blue dark:text-fintech-blue-light',
      borderColor: 'border-fintech-blue/20',
    },
    {
      id: 'tax-planning',
      title: 'Tax Planning',
      description: 'International tax structuring and compliance with global standards',
      icon: BarChart3,
      color: 'bg-orange-50 dark:bg-orange-950',
      iconColor: 'text-fintech-orange dark:text-fintech-orange-light',
      borderColor: 'border-fintech-orange/20',
    },
    {
      id: 'investment',
      title: 'Investment Attraction',
      description: 'Venture financing assistance and IPO preparation',
      icon: Briefcase,
      color: 'bg-purple-50 dark:bg-purple-950',
      iconColor: 'text-purple-500',
      borderColor: 'border-purple-500/20',
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property Protection',
      description: 'International trademark registration and IT solution patenting',
      icon: Shield,
      color: 'bg-emerald-50 dark:bg-emerald-950',
      iconColor: 'text-emerald-500',
      borderColor: 'border-emerald-500/20',
    },
    {
      id: 'business-immigration',
      title: 'Business Immigration',
      description: 'Residence permits and citizenship through investment programs',
      icon: Globe,
      color: 'bg-blue-50 dark:bg-blue-950',
      iconColor: 'text-fintech-blue dark:text-fintech-blue-light',
      borderColor: 'border-fintech-blue/20',
    },
    {
      id: 'compliance',
      title: 'Compliance and Regulatory Services',
      description: 'AML/KYC policy development and regulatory compliance',
      icon: Scale,
      color: 'bg-orange-50 dark:bg-orange-950',
      iconColor: 'text-fintech-orange dark:text-fintech-orange-light',
      borderColor: 'border-fintech-orange/20',
    },
  ];

  return (
    <section className="section-padding bg-gray-50 dark:bg-gray-900">
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
            <Card 
              key={service.id} 
              className={`relative h-full hover:shadow-lg transition-all duration-300 border ${service.borderColor} animate-fade-up`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-5 h-full flex flex-col">
                <div className={`${service.color} rounded-full p-3 inline-flex items-center justify-center mb-3 w-10 h-10`}>
                  <service.icon className={`h-5 w-5 ${service.iconColor}`} />
                </div>
                <h3 className="text-base sm:text-lg font-display font-bold mb-2 line-clamp-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm mb-3 flex-grow">{service.description}</p>
                <Button 
                  variant="ghost" 
                  className="p-0 h-auto mt-auto text-fintech-blue hover:text-fintech-blue-dark dark:text-fintech-blue-light flex items-center gap-1 group text-sm justify-start"
                  asChild
                >
                  <Link to={`/services#${service.id}`}>
                    Learn More
                    <span className="transition-transform duration-300 transform group-hover:translate-x-1">→</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            className="bg-fintech-blue hover:bg-fintech-blue-dark text-white button-glow"
            asChild
          >
            <Link to="/services">
              View All Services
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
