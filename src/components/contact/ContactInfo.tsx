import { Mail, Phone, Send, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { TextBlock, useSiteTexts } from '@/services/siteTextsService';

export function ContactInfo() {
  const { t, language } = useLanguage();
  const { getTextByKey } = useSiteTexts();

  const email = getTextByKey('contact.email')?.content[language] || 'info@fintech-assist.com';
  const primaryPhone = getTextByKey('contact.phone.primary')?.content[language] || '+44 7450 574905';
  const telegramUsername = getTextByKey('contact.telegram.username')?.content[language] || '@fintech_assist';
  const address = getTextByKey('contact.address')?.content[language] || 'London, United Kingdom';

  return (
    <div className="bg-gradient-to-br from-fintech-blue to-fintech-blue-dark p-8 md:p-12 flex flex-col justify-between">
      <div className="mt-12">
        <h3 className="text-xl font-display font-semibold mb-4 text-white">{t('contact.ourSocials')}</h3>
        <div className="flex flex-col space-y-6">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
              <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{t('contact.email')}</h3>
              <a href={`mailto:${email}`} className="text-white hover:text-blue-100 transition-colors">
                {email}
              </a>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
              <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{t('contact.phone')}</h3>
              <a href={`https://wa.me/${primaryPhone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-white hover:text-green-100 transition-colors">
                {primaryPhone}
              </a>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center">
              <Send className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{t('contact.telegram')}</h3>
              <a href={`https://t.me/${telegramUsername.replace('@','')}`} target="_blank" rel="noopener noreferrer" className="text-white hover:text-sky-100 transition-colors">
                {telegramUsername}
              </a>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{t('contact.address.label', 'Address')}</h3>
              <p className="text-white">
                {address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
