import { Mail, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function ContactInfo() {
  const { t, language } = useLanguage();

  return (
    <div className="bg-gradient-to-br from-fintech-blue to-fintech-blue-dark p-8 md:p-12 flex flex-col justify-between">
      <div className="mt-12">
        <h3 className="text-xl font-display font-semibold mb-4 text-white">{t('contact.ourSocials')}</h3>
        <div className="flex flex-col space-y-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-full">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1 text-white">{language === 'en' ? 'Email' : 'Электронная почта'}</h3>
              <a href="mailto:info@fintech-assist.com" className="text-white hover:text-blue-100 transition-colors">
                info@fintech-assist.com
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white">
                <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"></path>
                <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1 text-white">{t('contact.phone')}</h3>
              <a href="https://wa.me/447450574905" className="text-white hover:text-blue-100 transition-colors">
                +44 7450 574905
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white">
                <path d="M21.633 4.654c-.035-.096-.087-.184-.153-.264a.901.901 0 0 0-.303-.214 1.025 1.025 0 0 0-.375-.077c-.172 0-.34.042-.489.123l-17.33 7.468a.752.752 0 0 0-.366.298.79.79 0 0 0-.115.422c.005.152.054.298.14.42a.76.76 0 0 0 .352.266l4.146 1.39c.265.089.548.033.77-.153l7.921-6.587-6.476 7.068a.776.776 0 0 0-.188.81l1.925 6.382c.05.162.142.305.267.41a.76.76 0 0 0 .443.178.767.767 0 0 0 .453-.113.746.746 0 0 0 .3-.37l2.412-5.932 3.19 2.343c.118.086.25.144.392.168a.792.792 0 0 0 .419-.037.762.762 0 0 0 .334-.249.776.776 0 0 0 .153-.397l2.035-12.171a.787.787 0 0 0-.084-.467z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1 text-white">{language === 'en' ? 'Telegram' : 'Телеграм'}</h3>
              <a href="https://t.me/fintech_assist" target="_blank" rel="noreferrer" className="text-white hover:text-blue-100 transition-colors">
                @fintech_assist
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
