import { Briefcase, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
interface FooterServiceLinksProps {
  scrollToSection: (sectionId: string) => void;
  mainServices: Array<{
    id: string;
    title: string;
    icon: React.ComponentType<{
      className?: string;
    }>;
  }>;
}
export function FooterServiceLinks({
  scrollToSection,
  mainServices
}: FooterServiceLinksProps) {
  const {
    t,
    language
  } = useLanguage();
  return <div>
      <h3 className="font-display font-bold text-lg mb-4 flex items-center">
        <Briefcase className="h-4 w-4 mr-2 text-fintech-orange dark:text-fintech-orange-light" />
        {t('footer.services')}
      </h3>
      <ul className="space-y-3">
        {mainServices.slice(0, 5).map(service => <li key={service.id}>
            <button onClick={() => scrollToSection('services')} className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors flex items-center">
              <service.icon className="h-3.5 w-3.5 mr-1.5 text-fintech-orange/70 dark:text-fintech-orange-light/70" />
              <span className="text-left">{service.title}</span>
            </button>
          </li>)}
        <li>
          <button onClick={() => scrollToSection('services')} className="text-fintech-blue dark:text-fintech-blue-light font-medium flex items-center hover:underline">
            <ChevronRight className="h-3.5 w-3.5" />
            <span>{language === 'en' ? 'View All Services' : 'Все услуги'}</span>
          </button>
        </li>
      </ul>
    </div>;
}