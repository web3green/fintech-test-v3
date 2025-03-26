
import { MapPin, Globe, Landmark, Mail, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function ContactInfo() {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-br from-fintech-blue to-fintech-blue-dark p-8 md:p-12 flex flex-col justify-between">
      <div>
        <h2 className="text-3xl font-display font-bold mb-8 text-white">{t('contact.getInTouch')}</h2>
        
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="bg-white/10 p-3 rounded-full">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-display font-semibold mb-1 text-white">Global</h3>
              <p className="text-white">{t('contact.global')}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-white/10 p-3 rounded-full">
              <Landmark className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-display font-semibold mb-1 text-white">Jurisdictions</h3>
              <p className="text-white">{t('contact.jurisdictions')}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-white/10 p-3 rounded-full">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-display font-semibold mb-1 text-white">Licenses</h3>
              <p className="text-white">{t('contact.licenses')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-display font-semibold mb-4 text-white">{t('contact.ourSocials')}</h3>
        <div className="flex flex-col space-y-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-full">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1 text-white">Электронная почта</h3>
              <a href="mailto:info@fintech-assist.com" className="text-white hover:text-blue-100 transition-colors">
                info@fintech-assist.com
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-full">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1 text-white">Телефон</h3>
              <a href="tel:+447450574905" className="text-white hover:text-blue-100 transition-colors">
                +44 7450 574905
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brand-telegram text-white">
                <path d="M12 20.5a8.5 8.5 0 1 1 0-17 8.5 8.5 0 0 1 0 17Z"></path>
                <path d="m8.95 12.37 1.1 3.19a.5.5 0 0 0 .85.13l1.67-1.96a.5.5 0 0 1 .67-.06l3.13 2.3a.5.5 0 0 0 .79-.4L18.5 7.96a.5.5 0 0 0-.67-.59L7.76 11.29a.5.5 0 0 0 .05.94l1.14.14Z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1 text-white">Телеграм</h3>
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
