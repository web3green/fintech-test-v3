
import { MapPin, Globe, Landmark } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function ContactInfo() {
  const { t } = useLanguage();

  const contactItems = [
    {
      icon: MapPin,
      title: "Global",
      description: t('contact.global'),
    },
    {
      icon: Landmark,
      title: "Jurisdictions",
      description: t('contact.jurisdictions'),
    },
    {
      icon: Globe,
      title: "Licenses",
      description: t('contact.licenses'),
    },
  ];

  return (
    <div className="bg-gradient-to-br from-fintech-blue to-fintech-blue-dark text-white p-8 md:p-12 flex flex-col justify-between">
      <div>
        <h2 className="text-3xl font-display font-bold mb-8">{t('contact.getInTouch')}</h2>
        
        <div className="space-y-8">
          {contactItems.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="bg-white/10 p-3 rounded-full">
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-1 text-black">{item.title}</h3>
                <p className="text-white">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-display font-semibold mb-4">{t('contact.ourSocials')}</h3>
        <div className="flex items-center space-x-4">
          <a 
            href="https://t.me/fintech_assist" 
            target="_blank" 
            rel="noreferrer" 
            className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brand-telegram">
              <path d="M12 20.5a8.5 8.5 0 1 1 0-17 8.5 8.5 0 0 1 0 17Z"></path>
              <path d="m8.95 12.37 1.1 3.19a.5.5 0 0 0 .85.13l1.67-1.96a.5.5 0 0 1 .67-.06l3.13 2.3a.5.5 0 0 0 .79-.4L18.5 7.96a.5.5 0 0 0-.67-.59L7.76 11.29a.5.5 0 0 0 .05.94l1.14.14Z"></path>
            </svg>
          </a>
          <a 
            href="mailto:info@fintech-assist.com" 
            className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail">
              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
