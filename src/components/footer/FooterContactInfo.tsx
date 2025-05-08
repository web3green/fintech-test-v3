import { Mail, Phone, MessageSquare, Send } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface FooterContactInfoProps {
  // scrollToSection: (sectionId: string) => void; // Removed prop
}

export function FooterContactInfo({ /* scrollToSection */ }: FooterContactInfoProps) {
  const { t, language, isLoading } = useLanguage();

  const email = t('contact.email.address', 'info@fintech-assist.com');
  const whatsappPhone = t('contact.phone.primary', '');
  const telegramUsernameRaw = t('contact.telegram.username', '');
  const telegramUsername = telegramUsernameRaw.startsWith('@') ? telegramUsernameRaw.substring(1) : telegramUsernameRaw;
  const secondaryPhone = t('contact.phone.secondary', '');
  const isSecondaryPhoneVisible = t('contact.phone.secondary.visible', 'true').toLowerCase() === 'true';

  const whatsappLink = whatsappPhone ? `https://wa.me/${whatsappPhone.replace(/\D/g, '')}` : '#';
  const telegramLink = telegramUsername ? `https://t.me/${telegramUsername}` : '#';
  const secondaryPhoneLink = secondaryPhone ? `tel:${secondaryPhone.replace(/\D/g, '')}` : '#';

  if (isLoading) {
    return <div className="animate-pulse h-40 bg-muted/50 rounded-md"></div>;
  }

  return (
    <div>
      <h3 className="font-display font-bold text-lg mb-4 flex items-center">
        <Phone className="h-4 w-4 mr-2 text-fintech-orange dark:text-fintech-orange/80" />
        {t('footer.contact')}
      </h3>
      <ul className="space-y-2">
        {isSecondaryPhoneVisible && secondaryPhone && (
        <li>
            <a
              href={secondaryPhoneLink}
              className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue/80 transition-colors flex items-center"
            >
              <Phone className="h-3.5 w-3.5 mr-1.5 text-fintech-orange/70 dark:text-fintech-orange/60 flex-shrink-0" />
              <span className="text-sm break-all">{secondaryPhone}</span>
            </a>
          </li>
        )}
        <li>
          <a
            href={`mailto:${email}`}
            className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue/80 transition-colors flex items-center"
          >
            <Mail className="h-3.5 w-3.5 mr-1.5 text-fintech-orange/70 dark:text-fintech-orange/60 flex-shrink-0" />
            <span className="text-sm break-all">{email}</span>
          </a>
        </li>
        {whatsappPhone && (
        <li>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue/80 transition-colors flex items-center"
            >
              <MessageSquare className="h-3.5 w-3.5 mr-1.5 text-fintech-orange/70 dark:text-fintech-orange/60 flex-shrink-0" />
              <span className="text-sm">WhatsApp</span>
            </a>
          </li>
        )}
        {telegramUsername && (
          <li>
            <a
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue/80 transition-colors flex items-center"
            >
              <Send className="h-3.5 w-3.5 mr-1.5 text-fintech-orange/70 dark:text-fintech-orange/60 flex-shrink-0" />
              <span className="text-sm">Telegram</span>
          </a>
        </li>
        )}
        <li>
          <a href="#contact" className="text-fintech-blue dark:text-fintech-blue/80 font-medium flex items-center hover:underline">
            <ChevronRight className="h-3.5 w-3.5" />
            <span>{t('footer.contact.link', 'Contact Us')}</span>
          </a>
        </li>
      </ul>
    </div>
  );
}
