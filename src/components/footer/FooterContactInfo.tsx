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
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-fintech-blue dark:text-fintech-blue-light flex-shrink-0">
              <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"></path>
              <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"></path>
            </svg>
          </div>
          <a href="https://wa.me/447450574905" className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
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
