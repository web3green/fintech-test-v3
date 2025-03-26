import { useLanguage } from '@/contexts/LanguageContext';
import { ContactCard } from './contact/ContactCard';
export function ContactForm() {
  const {
    t
  } = useLanguage();
  // Telegram link
  const telegramLink = "https://t.me/fintech_assist";
  return <section id="contact" className="section-padding bg-blue-500 contact-form-section">
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {t('contact.title')}
        </h2>
        <p className="text-xl text-white mb-12 max-w-3xl">
          {t('contact.subtitle')}
        </p>
        
        
        
        <ContactCard />
      </div>
    </section>;
}