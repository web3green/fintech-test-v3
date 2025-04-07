import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ContactBannerProps {
  telegramLink: string;
}

export function ContactBanner({ telegramLink }: ContactBannerProps) {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '150ms' }}>
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-fintech-orange to-fintech-orange-light dark:from-fintech-orange/80 dark:to-fintech-orange-light/80 p-3 rounded-full shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M21.633 4.654c-.035-.096-.087-.184-.153-.264a.901.901 0 0 0-.303-.214a1.025 1.025 0 0 0-.375-.077c-.172 0-.34.042-.489.123l-17.33 7.468a.752.752 0 0 0-.366.298a.79.79 0 0 0-.115.422c.005.152.054.298.14.42a.76.76 0 0 0 .352.266l4.146 1.39c.265.089.548.033.77-.153l7.921-6.587-6.476 7.068a.776.776 0 0 0-.188.81l1.925 6.382c.05.162.142.305.267.41a.76.76 0 0 0 .443.178.767.767 0 0 0 .453-.113.746.746 0 0 0 .3-.37l2.412-5.932 3.19 2.343c.118.086.25.144.392.168a.792.792 0 0 0 .419-.037.762.762 0 0 0 .334-.249.776.776 0 0 0 .153-.397l2.035-12.171a.787.787 0 0 0-.084-.467z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">{t('contact.instant.title')}</h3>
              <p className="text-white/80">{t('contact.instant.subtitle')}</p>
            </div>
          </div>
          <a
            href={telegramLink}
            target="_blank"
            rel="noreferrer"
            className="bg-fintech-orange hover:bg-fintech-orange-dark dark:bg-fintech-orange/80 dark:hover:bg-fintech-orange/90 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center gap-2 shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.633 4.654c-.035-.096-.087-.184-.153-.264a.901.901 0 0 0-.303-.214a1.025 1.025 0 0 0-.375-.077c-.172 0-.34.042-.489.123l-17.33 7.468a.752.752 0 0 0-.366.298a.79.79 0 0 0-.115.422c.005.152.054.298.14.42a.76.76 0 0 0 .352.266l4.146 1.39c.265.089.548.033.77-.153l7.921-6.587-6.476 7.068a.776.776 0 0 0-.188.81l1.925 6.382c.05.162.142.305.267.41a.76.76 0 0 0 .443.178.767.767 0 0 0 .453-.113.746.746 0 0 0 .3-.37l2.412-5.932 3.19 2.343c.118.086.25.144.392.168a.792.792 0 0 0 .419-.037.762.762 0 0 0 .334-.249.776.776 0 0 0 .153-.397l2.035-12.171a.787.787 0 0 0-.084-.467z"></path>
            </svg>
            {t('contact.instant.button')}
          </a>
        </div>
      </div>
    </div>
  );
}
