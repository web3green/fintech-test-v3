import { Mail, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface FooterContactInfoProps {
  scrollToSection: (sectionId: string) => void;
}

export function FooterContactInfo({ scrollToSection }: FooterContactInfoProps) {
  const { t, language } = useLanguage();

  return (
    <div>
      <h3 className="font-display font-bold text-lg mb-4 flex items-center">
        <Phone className="h-4 w-4 mr-2 text-fintech-orange dark:text-fintech-orange/80" />
        {t('footer.contact')}
      </h3>
      <ul className="space-y-3">
        <li>
          <a href="tel:+442045772490" className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue/80 transition-colors flex items-center">
            <Phone className="h-3.5 w-3.5 mr-1.5 text-fintech-orange/70 dark:text-fintech-orange/60" />
            <span className="text-sm">+44 204 577 24 90</span>
          </a>
        </li>
        <li>
          <a href="mailto:info@fintech-assist.com" className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue/80 transition-colors flex items-center">
            <Mail className="h-3.5 w-3.5 mr-1.5 text-fintech-orange/70 dark:text-fintech-orange/60" />
            <span className="text-sm">info@fintech-assist.com</span>
          </a>
        </li>
        <li>
          <button onClick={() => scrollToSection('contact')} className="text-fintech-blue dark:text-fintech-blue/80 font-medium flex items-center hover:underline">
            <ChevronRight className="h-3.5 w-3.5" />
            <span>{language === 'en' ? 'Contact Us' : 'Связаться с нами'}</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
