
import { useState } from 'react';
import { Check } from 'lucide-react'; 
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
    <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Check className="h-4 w-4 text-green-500 mr-2" />
          <p className="text-muted-foreground text-sm">
            © {currentYear} <span className="text-foreground dark:text-foreground">FinTechAssist</span>. {t('footer.rights')}
          </p>
        </div>
        <div className="flex space-x-6">
          <button 
            onClick={() => setPrivacyDialogOpen(true)}
            className="text-sm text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors"
          >
            {t('footer.privacy')}
          </button>
          <button 
            onClick={() => setTermsDialogOpen(true)}
            className="text-sm text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors"
          >
            {t('footer.terms')}
          </button>
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
