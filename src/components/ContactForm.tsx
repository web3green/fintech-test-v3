
import { ContactBanner } from './contact/ContactBanner';
import { ContactCard } from './contact/ContactCard';

export function ContactForm() {
  // Telegram link
  const telegramLink = "https://t.me/fintech_assist";

  return (
    <section id="contact" className="section-padding bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900 contact-form-section">
      <div className="container mx-auto px-4">
        <ContactBanner telegramLink={telegramLink} />
        <ContactCard />
      </div>
    </section>
  );
}
