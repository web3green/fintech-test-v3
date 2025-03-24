
import { Link } from 'react-router-dom';
import { Facebook, X, Instagram, Linkedin, Mail, Phone, Building, Landmark, Wallet, Gamepad, CreditCard, BarChart3, Briefcase, Shield, ChevronRight, Globe, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

type SocialLink = {
  id: number;
  platform: string;
  url: string;
  icon: string;
};

export function Footer() {
  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  
  useEffect(() => {
    // Get social links from localStorage if available
    const storedLinks = localStorage.getItem('socialLinks');
    if (storedLinks) {
      setSocialLinks(JSON.parse(storedLinks));
    } else {
      // Default social links
      const defaultLinks = [
        { id: 1, platform: 'facebook', url: 'https://facebook.com', icon: 'facebook' },
        { id: 2, platform: 'twitter', url: 'https://x.com', icon: 'twitter' },
        { id: 3, platform: 'instagram', url: 'https://instagram.com', icon: 'instagram' },
        { id: 4, platform: 'telegram', url: 'https://t.me/fintechassist', icon: 'telegram' },
        { id: 5, platform: 'linkedin', url: 'https://linkedin.com', icon: 'linkedin' }
      ];
      setSocialLinks(defaultLinks);
      localStorage.setItem('socialLinks', JSON.stringify(defaultLinks));
    }
  }, []);
  
  // Function to render the appropriate icon
  const renderSocialIcon = (icon: string) => {
    switch (icon.toLowerCase()) {
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'twitter':
        return <X className="h-5 w-5" />;
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5" />;
      case 'telegram':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M18.384,22.779c0.322,0.228 0.737,0.285 1.107,0.145c0.37,-0.141 0.642,-0.457 0.724,-0.84c0.869,-4.084 2.977,-14.421 3.768,-18.136c0.06,-0.28 -0.04,-0.571 -0.26,-0.758c-0.22,-0.187 -0.525,-0.241 -0.797,-0.14c-4.193,1.552 -17.106,6.397 -22.384,8.35c-0.335,0.124 -0.553,0.446 -0.542,0.799c0.012,0.354 0.25,0.661 0.593,0.764c2.367,0.708 5.474,1.693 5.474,1.693c0,0 1.452,4.385 2.209,6.615c0.095,0.28 0.314,0.5 0.603,0.576c0.288,0.075 0.596,-0.004 0.811,-0.207c1.216,-1.148 3.096,-2.923 3.096,-2.923c0,0 3.572,2.619 5.598,4.062Zm-11.01,-8.677l1.679,5.538l0.373,-3.507c0,0 6.487,-5.851 10.185,-9.186c0.108,-0.098 0.123,-0.262 0.033,-0.377c-0.089,-0.115 -0.253,-0.142 -0.376,-0.064c-4.286,2.737 -11.894,7.596 -11.894,7.596Z" />
          </svg>
        );
      default:
        return <X className="h-5 w-5" />;
    }
  };

  // Main services from ServicesSection
  const mainServices = [
    {
      id: 'company-formation',
      title: t('services.company-formation.title'),
      icon: Building
    },
    {
      id: 'financial-licensing',
      title: t('services.financial-licensing.title'),
      icon: Landmark
    },
    {
      id: 'crypto-regulation',
      title: t('services.crypto-regulation.title'),
      icon: Wallet
    },
    {
      id: 'gambling-licensing',
      title: t('services.gambling-licensing.title'),
      icon: Gamepad
    },
    {
      id: 'payment-solutions',
      title: t('services.payment-solutions.title'),
      icon: CreditCard
    },
    {
      id: 'tax-planning',
      title: t('services.tax-planning.title'),
      icon: BarChart3
    },
  ];
  
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
        {/* Top section with logo and description */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-4 lg:col-span-1 space-y-6">
            <h3 className="text-2xl font-display font-bold">
              <span className="text-red-500">Fin</span>
              <span className="text-fintech-blue dark:text-fintech-blue-light">Tech</span>
              <span className="text-fintech-orange">Assist</span>
            </h3>
            <p className="text-muted-foreground max-w-xs">
              {t('footer.description')}
            </p>
            
            <div className="flex flex-wrap gap-3 pt-1">
              {socialLinks.map((link) => (
                <a 
                  key={link.id}
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-gray-100 dark:bg-gray-800 p-2.5 rounded-full text-gray-500 hover:text-fintech-blue hover:bg-fintech-blue/10 dark:hover:text-fintech-blue-light dark:hover:bg-fintech-blue-light/10 transition-all duration-200"
                  aria-label={link.platform}
                >
                  {renderSocialIcon(link.icon)}
                </a>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-4 lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {/* Navigation Links */}
              <div>
                <h3 className="font-display font-bold text-lg mb-4 flex items-center">
                  <Globe className="h-4 w-4 mr-2 text-fintech-blue dark:text-fintech-blue-light" />
                  {t('footer.links')}
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link to="/about" className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors flex items-center">
                      <ChevronRight className="h-3.5 w-3.5 text-fintech-blue/70 dark:text-fintech-blue-light/70" />
                      <span>{t('nav.about')}</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/how-it-works" className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors flex items-center">
                      <ChevronRight className="h-3.5 w-3.5 text-fintech-blue/70 dark:text-fintech-blue-light/70" />
                      <span>{t('nav.howItWorks')}</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/services" className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors flex items-center">
                      <ChevronRight className="h-3.5 w-3.5 text-fintech-blue/70 dark:text-fintech-blue-light/70" />
                      <span>{t('nav.services')}</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/blog" className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors flex items-center">
                      <ChevronRight className="h-3.5 w-3.5 text-fintech-blue/70 dark:text-fintech-blue-light/70" />
                      <span>{t('nav.blog')}</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors flex items-center">
                      <ChevronRight className="h-3.5 w-3.5 text-fintech-blue/70 dark:text-fintech-blue-light/70" />
                      <span>{t('nav.contact')}</span>
                    </Link>
                  </li>
                </ul>
              </div>
              
              {/* Services Links - Updated with main services */}
              <div>
                <h3 className="font-display font-bold text-lg mb-4 flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-fintech-orange dark:text-fintech-orange-light" />
                  {t('footer.services')}
                </h3>
                <ul className="space-y-3">
                  {mainServices.slice(0, 5).map((service) => (
                    <li key={service.id}>
                      <Link 
                        to={`/services#${service.id}`} 
                        className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors flex items-center"
                      >
                        <service.icon className="h-3.5 w-3.5 mr-1.5 text-fintech-orange/70 dark:text-fintech-orange-light/70" />
                        <span>{service.title}</span>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link 
                      to="/services" 
                      className="text-fintech-blue dark:text-fintech-blue-light font-medium flex items-center hover:underline"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                      <span>{language === 'en' ? 'View All Services' : 'Все услуги'}</span>
                    </Link>
                  </li>
                </ul>
              </div>
              
              {/* Contact Information */}
              <div>
                <h3 className="font-display font-bold text-lg mb-4 flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-fintech-blue dark:text-fintech-blue-light" />
                  {t('footer.contact')}
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <div className="bg-fintech-blue/10 dark:bg-fintech-blue-light/10 p-2 rounded-full mr-3">
                      <Phone className="h-4 w-4 text-fintech-blue dark:text-fintech-blue-light flex-shrink-0" />
                    </div>
                    <a href="tel:+447450574905" className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                      +44 7450 574905
                    </a>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-fintech-blue/10 dark:bg-fintech-blue-light/10 p-2 rounded-full mr-3">
                      <Mail className="h-4 w-4 text-fintech-blue dark:text-fintech-blue-light flex-shrink-0" />
                    </div>
                    <a href="mailto:info@fintech-assist.com" className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                      info@fintech-assist.com
                    </a>
                  </li>
                  <li>
                    <Button 
                      className="w-full mt-2 bg-fintech-blue hover:bg-fintech-blue-dark text-white"
                      onClick={() => {
                        const contactSection = document.getElementById('contact');
                        if (contactSection) {
                          contactSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      {t('cta.request')}
                    </Button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer bottom with copyright and legal links */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Heart className="h-4 w-4 text-red-500 mr-2" />
              <p className="text-muted-foreground text-sm">
                © {currentYear} <span className="text-red-500">Fin</span><span className="text-fintech-blue dark:text-fintech-blue-light">Tech</span><span className="text-fintech-orange">Assist</span>. {t('footer.rights')}
              </p>
            </div>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                {t('footer.privacy')}
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                {t('footer.terms')}
              </Link>
              <a href="#" className="text-sm text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                {language === 'en' ? 'Sitemap' : 'Карта сайта'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
