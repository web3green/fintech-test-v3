import { Briefcase, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FooterServiceLinksProps {
  mainServices: Array<{
    id: string;
    title: string;
    icon: React.ComponentType<{
      className?: string;
    }>;
  }>;
}

export function FooterServiceLinks({
  mainServices
}: FooterServiceLinksProps) {
  const {
    t,
    language
  } = useLanguage();

  return <div>
      <h3 className="font-display font-bold text-lg mb-4 flex items-center">
        <Briefcase className="h-4 w-4 mr-2 text-fintech-orange dark:text-fintech-orange/80" />
        {t('footer.services')}
      </h3>
      <ul className="space-y-3">
        {mainServices.slice(0, 5).map(service => <li key={service.id}>
            <a href="#services" className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue/80 transition-colors flex items-center">
              <service.icon className="h-3.5 w-3.5 mr-1.5 text-fintech-orange/70 dark:text-fintech-orange/60" />
              <span className="text-center text-sm">{service.title}</span>
            </a>
          </li>)}
        <li>
          <a href="#services" className="text-fintech-blue dark:text-fintech-blue/80 font-medium flex items-center hover:underline">
            <ChevronRight className="h-3.5 w-3.5" />
            <span>{language === 'en' ? 'View All Services' : 'Все услуги'}</span>
          </a>
        </li>
      </ul>
    </div>;
}
