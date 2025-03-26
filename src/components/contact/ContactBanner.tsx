
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ContactBannerProps {
  telegramLink: string;
}

export function ContactBanner({ telegramLink }: ContactBannerProps) {
  const { t } = useLanguage();

  return (
    <div className="mb-10 animate-fade-up">
      <div className="bg-fintech-blue rounded-xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-fintech-blue to-transparent opacity-80"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-fintech-orange/20 rounded-full mix-blend-overlay filter blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-display font-bold mb-2">{t('contact.instant.title')}</h3>
            <p className="text-white/80 max-w-lg">
              {t('contact.instant.subtitle')}
            </p>
          </div>
          
          <a 
            href={telegramLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 bg-white text-fintech-blue font-medium px-6 py-3 rounded-full hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <MessageCircle className="h-5 w-5" />
            <span>{t('contact.instant.button')}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
