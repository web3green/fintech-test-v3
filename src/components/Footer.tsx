import { Link } from 'react-router-dom';
import { Facebook, X, Instagram, Linkedin, Mail, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';

type SocialLink = {
  id: number;
  platform: string;
  url: string;
  icon: string;
};

export function Footer() {
  const { t } = useLanguage();
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
  
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-display font-bold">
              <span className="text-fintech-blue dark:text-fintech-blue-light">Fin</span>
              <span className="text-fintech-orange">Tech</span>
              <span className="text-foreground">assist</span>
            </h3>
            <p className="text-muted-foreground max-w-xs">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4 pt-2">
              {socialLinks.map((link) => (
                <a 
                  key={link.id}
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-500 hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors"
                >
                  {renderSocialIcon(link.icon)}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-display font-bold text-lg mb-4">{t('footer.links')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                  {t('nav.howItWorks')}
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                  {t('nav.services')}
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                  {t('nav.blog')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-display font-bold text-lg mb-4">{t('footer.services')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                  {t('services.registration')}
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                  {t('services.accounts')}
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                  {t('services.nominee')}
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                  {t('services.licenses')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-display font-bold text-lg mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-4">
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-fintech-blue dark:text-fintech-blue-light flex-shrink-0" />
                <a href="tel:+447450574905" className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                  +44 7450 574905
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-fintech-blue dark:text-fintech-blue-light flex-shrink-0" />
                <a href="mailto:info@fintech-assist.com" className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                  info@fintech-assist.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © {currentYear} FintechAssist. {t('footer.rights')}
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                {t('footer.privacy')}
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                {t('footer.terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
