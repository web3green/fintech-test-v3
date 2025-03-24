
import { useLanguage } from '@/contexts/LanguageContext';

export function FooterLogo() {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-display font-bold">
        <span className="text-red-500">Fin</span>
        <span className="text-fintech-blue dark:text-fintech-blue-light">Tech</span>
        <span className="text-fintech-orange">Assist</span>
      </h3>
      <p className="text-muted-foreground max-w-xs">
        {t('footer.description')}
      </p>
    </div>
  );
}
