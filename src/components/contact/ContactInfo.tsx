
import { Mail, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function ContactInfo() {
  const { t } = useLanguage();
  const telegramLink = "https://t.me/fintech_assist";

  return (
    <div className="bg-blue-500 p-8 md:p-12 flex flex-col justify-between">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
        contact.ourSocials
      </h2>
      
      <div className="space-y-8">
        <div className="flex items-center gap-6">
          <div className="bg-blue-400/30 p-4 rounded-full h-16 w-16 flex items-center justify-center">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-medium mb-1 text-white">Электронная почта</h3>
            <a href="mailto:info@fintech-assist.com" className="text-white text-2xl hover:text-blue-100 transition-colors">
              info@fintech-assist.com
            </a>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="bg-blue-400/30 p-4 rounded-full h-16 w-16 flex items-center justify-center">
            <Phone className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-medium mb-1 text-white">Телефон</h3>
            <a href="tel:+447450574905" className="text-white text-2xl hover:text-blue-100 transition-colors">
              +44 7450 574905
            </a>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="bg-blue-400/30 p-4 rounded-full h-16 w-16 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M12 20.5a8.5 8.5 0 1 1 0-17 8.5 8.5 0 0 1 0 17Z"></path>
              <path d="m8.95 12.37 1.1 3.19a.5.5 0 0 0 .85.13l1.67-1.96a.5.5 0 0 1 .67-.06l3.13 2.3a.5.5 0 0 0 .79-.4L18.5 7.96a.5.5 0 0 0-.67-.59L7.76 11.29a.5.5 0 0 0 .05.94l1.14.14Z"></path>
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-medium mb-1 text-white">Телеграм</h3>
            <a href={telegramLink} target="_blank" rel="noreferrer" className="text-white text-2xl hover:text-blue-100 transition-colors">
              @fintech_assist
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
