import { useLanguage } from '@/contexts/LanguageContext';
import { ContactBanner } from './contact/ContactBanner';
import { ContactFormFields } from './contact/ContactFormFields';

export function ContactForm() {
  const { t, language } = useLanguage();
  
  return (
    <section id="contact" className="section-padding bg-blue-500 contact-form-section relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-fintech-orange/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-fintech-orange/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-up">
            {t('contact.title')}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: '100ms' }}>
            {t('contact.subtitle')}
          </p>
        </div>
        
        {/* Telegram Contact Banner */}
        <ContactBanner telegramLink="https://t.me/fintech_assist" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-up" style={{ animationDelay: '200ms' }}>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 flex flex-col items-center text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <div className="bg-gradient-to-r from-fintech-blue to-fintech-blue-light p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M21.633 4.654c-.035-.096-.087-.184-.153-.264a.901.901 0 0 0-.303-.214a1.025 1.025 0 0 0-.375-.077c-.172 0-.34.042-.489.123l-17.33 7.468a.752.752 0 0 0-.366.298.79.79 0 0 0-.115.422c.005.152.054.298.14.42a.76.76 0 0 0 .352.266l4.146 1.39c.265.089.548.033.77-.153l7.921-6.587-6.476 7.068a.776.776 0 0 0-.188.81l1.925 6.382c.05.162.142.305.267.41a.76.76 0 0 0 .443.178.767.767 0 0 0 .453-.113.746.746 0 0 0 .3-.37l2.412-5.932 3.19 2.343c.118.086.25.144.392.168a.792.792 0 0 0 .419-.037.762.762 0 0 0 .334-.249.776.776 0 0 0 .153-.397l2.035-12.171a.787.787 0 0 0-.084-.467z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">{t('contact.telegram')}</h3>
            <p className="text-white/80 mb-4">
              {language === 'en' ? 'Message us on Telegram for prompt resolution of issues' : 'Напишите нам в Телеграм для оперативного решения вопросов'}
            </p>
            <a href="https://t.me/fintech_assist" target="_blank" rel="noreferrer" className="text-white font-medium hover:text-fintech-orange-light transition-colors">
              @fintech_assist
            </a>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 flex flex-col items-center text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <div className="bg-gradient-to-r from-green-500 to-emerald-400 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"></path>
                <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">{t('contact.phone')}</h3>
            <p className="text-white/80 mb-4">
              {language === 'en' ? 'Contact us via WhatsApp for quick assistance' : 'Свяжитесь с нами через WhatsApp для быстрой помощи'}
            </p>
            <a href="https://wa.me/447450574905" className="text-white font-medium hover:text-fintech-orange-light transition-colors">
              +44 7450 574905
            </a>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 flex flex-col items-center text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <div className="bg-gradient-to-r from-fintech-orange to-orange-400 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">{t('contact.email')}</h3>
            <p className="text-white/80 mb-4">
              {language === 'en' ? 'Write to us for a consultation' : 'Напишите нам на почту для получения консультации'}
            </p>
            <a href="mailto:info@fintech-assist.com" className="text-white font-medium hover:text-fintech-orange-light transition-colors">
              info@fintech-assist.com
            </a>
          </div>
        </div>
        
        <div className="mt-12 text-center animate-fade-up" style={{ animationDelay: '300ms' }}>
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-white/10 to-fintech-orange/10 backdrop-blur-sm rounded-full px-6 py-2 border border-white/20">
            <p className="text-white text-sm">
              {language === 'en' ? 'Ready to start working together? Choose a convenient way to contact us' : 'Готовы начать сотрудничество? Выберите удобный способ связи'}
            </p>
          </div>
        </div>

        {/* Consultation Request Form */}
        <div className="mt-16 animate-fade-up" style={{ animationDelay: '400ms' }}>
          <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 shadow-xl">
            <div className="flex flex-col md:flex-row">
              {/* Contact form */}
              <ContactFormFields />
              
              {/* Contact Info */}
              <div className="md:w-1/3 bg-gradient-to-tr from-fintech-orange to-fintech-blue-light backdrop-blur-sm p-8 flex flex-col justify-center shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B00] to-fintech-blue-light opacity-100"></div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute top-0 right-0 w-full h-full bg-[url('/images/noise.png')] opacity-5 mix-blend-overlay"></div>
                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-fintech-blue-light to-transparent opacity-40"></div>
                <div className="relative z-10">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {language === 'en' ? 'Get a personal consultation' : 'Получите персональную консультацию'}
                    </h3>
                    <p className="text-white/95">
                      {language === 'en' 
                        ? 'Fill out the form and our specialists will contact you shortly to discuss your request.'
                        : 'Заполните форму, и наши специалисты свяжутся с вами в ближайшее время для обсуждения вашего запроса.'}
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full shadow-md border border-white/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <path d="M12 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2Z"></path>
                          <path d="M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8Z"></path>
                        </svg>
                      </div>
                      <p className="text-white text-sm">
                        {language === 'en' ? 'London, United Kingdom' : 'Лондон, Великобритания'}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full shadow-md border border-white/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                        </svg>
                      </div>
                      <a href="mailto:info@fintech-assist.com" className="text-white text-sm hover:text-white/80">info@fintech-assist.com</a>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full shadow-md border border-white/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                      </div>
                      <a href="tel:+447450574905" className="text-white text-sm hover:text-white/80">+44 7450 574905</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
