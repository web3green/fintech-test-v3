
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { getLogoUrl } from '@/utils/metaTagManager';

export function FooterLogo() {
  const { t } = useLanguage();
  const { relative: logoPath, absolute: absoluteLogoUrl } = getLogoUrl();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <img 
          src={logoPath} 
          alt="FinTechAssist Logo" 
          className="h-8 w-auto mr-2"
          onError={(e) => {
            console.error("Error loading logo from relative path, trying absolute URL");
            (e.target as HTMLImageElement).src = absoluteLogoUrl;
          }}
        />
        <h3 className="text-2xl font-display font-bold text-foreground dark:text-foreground">
          FinTechAssist
        </h3>
      </div>
      <p className="text-muted-foreground max-w-xs">
        {t('footer.description')}
      </p>
    </div>
  );
}
