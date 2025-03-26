
import { Mail, Phone, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function ContactInfo() {
  const { t } = useLanguage();

  return (
    <div className="p-8 md:p-12 bg-fintech-blue text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-fintech-orange rounded-full mix-blend-overlay filter blur-3xl"></div>
      </div>
      
      <div className="relative z-10">
        <h2 className="text-3xl font-display font-bold mb-6">{t('contact.title')}</h2>
        <p className="mb-8 text-white/80">
          {t('contact.subtitle')}
        </p>
        
        <div className="space-y-6">
          <div className="flex items-center">
            <div className="rounded-full bg-white/20 p-2 mr-4">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">{t('contact.email')}</h3>
              <p className="text-white/80">info@fintech-assist.com</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="rounded-full bg-white/20 p-2 mr-4">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">{t('contact.phone')}</h3>
              <p className="text-white/80">+44 7450 574905</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="rounded-full bg-white/20 p-2 mr-4">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">{t('contact.telegram')}</h3>
              <p className="text-white/80">@fintech_assist</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
