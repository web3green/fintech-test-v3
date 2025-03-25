
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

export function FooterLogo() {
  const { t } = useLanguage();
  const timestamp = Date.now();
  const logoPath = `/lovable-uploads/8f51558f-dcfd-4921-b6e4-112532ad0723.png?nocache=${timestamp}`;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <img 
          src={logoPath} 
          alt="FinTechAssist Logo" 
          className="h-8 w-auto mr-2" 
        />
        <h3 className="text-2xl font-display font-bold">
          <span className="text-red-500">Fin</span>
          <span className="text-fintech-blue dark:text-fintech-blue-light">Tech</span>
          <span className="text-fintech-orange">Assist</span>
        </h3>
      </div>
      <p className="text-muted-foreground max-w-xs">
        {t('footer.description')}
      </p>
    </div>
  );
}
