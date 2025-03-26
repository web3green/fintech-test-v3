
import { useLanguage } from '@/contexts/LanguageContext';
import { ContactCard } from './contact/ContactCard';

export function ContactForm() {
  const { t } = useLanguage();
  // Telegram link
  const telegramLink = "https://t.me/fintech_assist";

  return (
    <section id="contact" className="section-padding bg-blue-500 contact-form-section">
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {t('contact.title')}
        </h2>
        <p className="text-xl text-white mb-12 max-w-3xl">
          {t('contact.subtitle')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-white font-medium mb-1">{t('contact.email')}</h3>
              <a href="mailto:info@fintech-assist.com" className="text-white hover:text-blue-100 transition-colors">
                info@fintech-assist.com
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-white font-medium mb-1">{t('contact.phone')}</h3>
              <a href="tel:+447450574905" className="text-white hover:text-blue-100 transition-colors">
                +44 7450 574905
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M12 20.5a8.5 8.5 0 1 1 0-17 8.5 8.5 0 0 1 0 17Z"></path>
                <path d="m8.95 12.37 1.1 3.19a.5.5 0 0 0 .85.13l1.67-1.96a.5.5 0 0 1 .67-.06l3.13 2.3a.5.5 0 0 0 .79-.4L18.5 7.96a.5.5 0 0 0-.67-.59L7.76 11.29a.5.5 0 0 0 .05.94l1.14.14Z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-white font-medium mb-1">{t('contact.telegram')}</h3>
              <a href={telegramLink} target="_blank" rel="noreferrer" className="text-white hover:text-blue-100 transition-colors">
                @fintech_assist
              </a>
            </div>
          </div>
        </div>
        
        <ContactCard />
      </div>
    </section>
  );
}
