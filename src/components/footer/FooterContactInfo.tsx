
import { Mail, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface FooterContactInfoProps {
  scrollToSection: (sectionId: string) => void;
}

export function FooterContactInfo({ scrollToSection }: FooterContactInfoProps) {
  const { t } = useLanguage();

  return (
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
            onClick={() => scrollToSection('contact')}
          >
            {t('cta.getStarted')}
          </Button>
        </li>
      </ul>
    </div>
  );
}
