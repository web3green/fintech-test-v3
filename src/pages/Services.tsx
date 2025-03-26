
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Building2, BarChart4, UserCog, BadgeCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Services() {
  const { t } = useLanguage();

  const services = [
    {
      id: 'registration',
      title: t('services.registration'),
      description: t('services.registration.desc'),
      icon: Building2,
      color: 'bg-gradient-to-br from-fintech-blue to-fintech-blue-light',
      features: [
        'Fast company registration in 10+ jurisdictions',
        'Full legal compliance and documentation',
        'Corporate structure optimization',
        'Post-registration support',
        'Tax-efficient setup'
      ]
    },
    {
      id: 'accounts',
      title: t('services.accounts'),
      description: t('services.accounts.desc'),
      icon: BarChart4,
      color: 'bg-gradient-to-br from-fintech-orange to-fintech-orange-light',
      features: [
        'Personal and business account opening',
        'Multi-currency accounts',
        'Remote account opening process',
        'Access to global banking network',
        'Ongoing banking relationship management'
      ]
    },
    {
      id: 'nominee',
      title: t('services.nominee'),
      description: t('services.nominee.desc'),
      icon: UserCog,
      color: 'bg-gradient-to-br from-purple-500 to-purple-400',
      features: [
        'Professional nominee directors',
        'Nominee shareholders',
        'Legal and compliant service',
        'Full confidentiality',
        'Regular reporting and transparency'
      ]
    },
    {
      id: 'licenses',
      title: t('services.licenses'),
      description: t('services.licenses.desc'),
      icon: BadgeCheck,
      color: 'bg-gradient-to-br from-emerald-500 to-emerald-400',
      features: [
        'Financial services licensing',
        'Payment processing licenses',
        'Cryptocurrency licenses',
        'Gaming and betting licenses',
        'License renewal and compliance monitoring'
      ]
    }
  ];

  const scrollToContact = () => {
    const contactSection = document.querySelector('.contact-form-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
                <span className="text-red-500">Fin</span><span className="text-fintech-blue">Tech</span><span className="text-fintech-orange">Assist</span> Services
              </h1>
              <p className="text-xl text-muted-foreground">
                Comprehensive financial and business solutions tailored to your needs
              </p>
            </div>
          </div>
        </section>

        {/* Services Detail */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-fintech-blue/10 text-fintech-blue dark:bg-fintech-blue/20 dark:text-fintech-blue-light mb-4">
                <span className="flex h-2 w-2 rounded-full bg-fintech-blue mr-2"></span>
                {t('services.badge')}
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                {t('services.title')}
              </h2>
              <p className="text-xl text-muted-foreground">
                {t('services.subtitle')}
              </p>
            </div>

            <div className="space-y-24">
              {services.map((service, index) => (
                <div 
                  key={service.id}
                  id={service.id}
                  className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className={`${index % 2 !== 0 ? 'md:order-2' : ''}`}>
                    <div className="inline-flex items-center space-x-2 mb-4">
                      <div className={`p-3 rounded-lg ${service.color} shadow-lg relative`}>
                        <service.icon className="h-6 w-6 text-white" />
                        <div className="absolute inset-0 rounded-lg">
                          <GlowingEffect 
                            blur={1} 
                            spread={20} 
                            glow={true} 
                            disabled={false} 
                            inactiveZone={0.2}
                            proximity={40}
                          />
                        </div>
                      </div>
                      <h3 className="text-2xl font-display font-bold">{service.title}</h3>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      {service.description}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <div className="mr-2 mt-1 text-fintech-blue dark:text-fintech-blue-light">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      onClick={scrollToContact}
                      className="bg-fintech-blue hover:bg-fintech-blue-dark text-white transition-all duration-300"
                    >
                      Request Service <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                  <div className={`relative rounded-2xl overflow-hidden ${index % 2 !== 0 ? 'md:order-1' : ''}`}>
                    <div className="aspect-video bg-gray-200 dark:bg-gray-800 relative">
                      <img 
                        src={`https://source.unsplash.com/random/800x600?business,finance,${service.id}`} 
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0">
                        <GlowingEffect 
                          blur={2} 
                          spread={30} 
                          glow={true} 
                          disabled={false} 
                          inactiveZone={0.4}
                          proximity={60}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-lg relative overflow-hidden">
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-fintech-blue/5 dark:bg-fintech-blue/10"></div>
                <GlowingEffect 
                  blur={10} 
                  spread={40} 
                  glow={true} 
                  disabled={false} 
                  inactiveZone={0.2}
                  proximity={100}
                />
              </div>
              <div className="relative z-10 text-center">
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
                  Need a Custom Solution?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  We understand that every business is unique. Contact us to discuss your specific requirements and how we can tailor our services to meet your needs.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <Button 
                    onClick={scrollToContact}
                    className="bg-fintech-blue hover:bg-fintech-blue-dark text-white transition-all duration-300 w-full sm:w-auto"
                  >
                    Request Consultation
                  </Button>
                  <Link to="/about">
                    <Button 
                      variant="outline" 
                      className="w-full sm:w-auto"
                    >
                      Learn About Us
                    </Button>
                  </Link>
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
