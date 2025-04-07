import { ChevronRight, Globe, Link2, Info, Briefcase, Settings, FileText, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FooterNavLinksProps {
  scrollToSection: (sectionId: string) => void;
}

export function FooterNavLinks({ scrollToSection }: FooterNavLinksProps) {
  const { t } = useLanguage();

  return (
    <div>
      <h3 className="font-display font-bold text-lg mb-4 flex items-center">
        <Link2 className="h-4 w-4 mr-2 text-fintech-orange dark:text-fintech-orange/80" />
        {t('footer.links')}
      </h3>
      <ul className="space-y-3">
        <li>
          <button onClick={() => scrollToSection('about')} className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue/80 transition-colors flex items-center">
            <Info className="h-3.5 w-3.5 mr-1.5 text-fintech-orange/70 dark:text-fintech-orange/60" />
            <span className="text-sm">{t('nav.about')}</span>
          </button>
        </li>
        <li>
          <button onClick={() => scrollToSection('services')} className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue/80 transition-colors flex items-center">
            <Briefcase className="h-3.5 w-3.5 mr-1.5 text-fintech-orange/70 dark:text-fintech-orange/60" />
            <span className="text-sm">{t('nav.services')}</span>
          </button>
        </li>
        <li>
          <button onClick={() => scrollToSection('process')} className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue/80 transition-colors flex items-center">
            <Settings className="h-3.5 w-3.5 mr-1.5 text-fintech-orange/70 dark:text-fintech-orange/60" />
            <span className="text-sm">{t('nav.howItWorks')}</span>
          </button>
        </li>
        <li>
          <button onClick={() => scrollToSection('blog')} className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue/80 transition-colors flex items-center">
            <FileText className="h-3.5 w-3.5 mr-1.5 text-fintech-orange/70 dark:text-fintech-orange/60" />
            <span className="text-sm">{t('nav.blog')}</span>
          </button>
        </li>
        <li>
          <button onClick={() => scrollToSection('contact')} className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue/80 transition-colors flex items-center">
            <Mail className="h-3.5 w-3.5 mr-1.5 text-fintech-orange/70 dark:text-fintech-orange/60" />
            <span className="text-sm">{t('nav.contact')}</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
