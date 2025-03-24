
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FooterCopyrightProps {
  scrollToTop: () => void;
}

export function FooterCopyright({ scrollToTop }: FooterCopyrightProps) {
  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
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
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              scrollToTop();
            }} 
            className="text-sm text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors"
          >
            {language === 'en' ? 'Back to Top' : 'Наверх'}
          </a>
        </div>
      </div>
    </div>
  );
}
