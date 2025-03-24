
import { ChevronRight, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FooterNavLinksProps {
  scrollToSection: (sectionId: string) => void;
}

export function FooterNavLinks({ scrollToSection }: FooterNavLinksProps) {
  const { t } = useLanguage();

  return (
    <div>
      <h3 className="font-display font-bold text-lg mb-4 flex items-center">
        <Globe className="h-4 w-4 mr-2 text-fintech-blue dark:text-fintech-blue-light" />
        {t('footer.links')}
      </h3>
      <ul className="space-y-3">
        <li>
          <button 
            onClick={() => scrollToSection('about')}
            className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors flex items-center"
          >
            <ChevronRight className="h-3.5 w-3.5 text-fintech-blue/70 dark:text-fintech-blue-light/70" />
            <span>{t('nav.about')}</span>
          </button>
        </li>
        <li>
          <button 
            onClick={() => scrollToSection('process')}
            className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors flex items-center"
          >
            <ChevronRight className="h-3.5 w-3.5 text-fintech-blue/70 dark:text-fintech-blue-light/70" />
            <span>{t('nav.howItWorks')}</span>
          </button>
        </li>
        <li>
          <button 
            onClick={() => scrollToSection('services')}
            className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors flex items-center"
          >
            <ChevronRight className="h-3.5 w-3.5 text-fintech-blue/70 dark:text-fintech-blue-light/70" />
            <span>{t('nav.services')}</span>
          </button>
        </li>
        <li>
          <button 
            onClick={() => scrollToSection('blog')}
            className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors flex items-center"
          >
            <ChevronRight className="h-3.5 w-3.5 text-fintech-blue/70 dark:text-fintech-blue-light/70" />
            <span>{t('nav.blog')}</span>
          </button>
        </li>
        <li>
          <button 
            onClick={() => scrollToSection('contact')}
            className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors flex items-center"
          >
            <ChevronRight className="h-3.5 w-3.5 text-fintech-blue/70 dark:text-fintech-blue-light/70" />
            <span>{t('nav.contact')}</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
