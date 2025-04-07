import { useState } from 'react';
import { Check, ArrowUp } from 'lucide-react'; 
import { useLanguage } from '@/contexts/LanguageContext';
import { PrivacyPolicyDialog } from './PrivacyPolicyDialog';
import { TermsOfServiceDialog } from './TermsOfServiceDialog';

interface FooterCopyrightProps {
  scrollToTop: () => void;
}

export function FooterCopyright({ scrollToTop }: FooterCopyrightProps) {
  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);

  return (
    <div className="pt-8 mt-8 border-t border-gray-200 dark:border-gray-800/60">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground dark:text-muted-foreground/80">
            © {currentYear} <span className="text-foreground dark:text-foreground">FinTechAssist</span>. {t('footer.rights')}
          </span>
          <button
            onClick={() => setPrivacyDialogOpen(true)}
            className="text-sm text-muted-foreground hover:text-fintech-blue dark:text-muted-foreground/80 dark:hover:text-fintech-blue/80 transition-colors"
          >
            {t('footer.privacy')}
          </button>
          <button
            onClick={() => setTermsDialogOpen(true)}
            className="text-sm text-muted-foreground hover:text-fintech-blue dark:text-muted-foreground/80 dark:hover:text-fintech-blue/80 transition-colors"
          >
            {t('footer.terms')}
          </button>
        </div>
        <button
          onClick={scrollToTop}
          className="flex items-center space-x-1 text-sm text-fintech-blue hover:text-fintech-blue-dark dark:text-fintech-blue/80 dark:hover:text-fintech-blue transition-colors"
        >
          <span>{t('footer.backToTop')}</span>
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
      
      <PrivacyPolicyDialog 
        open={privacyDialogOpen} 
        onOpenChange={setPrivacyDialogOpen} 
      />
      
      <TermsOfServiceDialog 
        open={termsDialogOpen} 
        onOpenChange={setTermsDialogOpen} 
      />
    </div>
  );
}
