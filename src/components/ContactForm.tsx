
import { useLanguage } from '@/contexts/LanguageContext';

export function ContactForm() {
  const { t } = useLanguage();
  
  return (
    <section id="contact" className="section-padding bg-blue-500 contact-form-section relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-up">
            {t('contact.title')}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: '100ms' }}>
            {t('contact.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-up" style={{ animationDelay: '200ms' }}>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 flex flex-col items-center text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <div className="bg-blue-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Электронная почта</h3>
            <p className="text-white/80 mb-4">Напишите нам на почту для получения консультации</p>
            <a href="mailto:info@fintech-assist.com" className="text-white font-medium hover:text-blue-100 transition-colors">
              info@fintech-assist.com
            </a>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 flex flex-col items-center text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <div className="bg-blue-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Телефон</h3>
            <p className="text-white/80 mb-4">Позвоните нам для быстрой консультации по вашему вопросу</p>
            <a href="tel:+447450574905" className="text-white font-medium hover:text-blue-100 transition-colors">
              +44 7450 574905
            </a>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 flex flex-col items-center text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <div className="bg-blue-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M12 20.5a8.5 8.5 0 1 1 0-17 8.5 8.5 0 0 1 0 17Z"></path>
                <path d="m8.95 12.37 1.1 3.19a.5.5 0 0 0 .85.13l1.67-1.96a.5.5 0 0 1 .67-.06l3.13 2.3a.5.5 0 0 0 .79-.4L18.5 7.96a.5.5 0 0 0-.67-.59L7.76 11.29a.5.5 0 0 0 .05.94l1.14.14Z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Телеграм</h3>
            <p className="text-white/80 mb-4">Напишите нам в Телеграм для оперативного решения вопросов</p>
            <a href="https://t.me/fintech_assist" target="_blank" rel="noreferrer" className="text-white font-medium hover:text-blue-100 transition-colors">
              @fintech_assist
            </a>
          </div>
        </div>
        
        <div className="mt-12 text-center animate-fade-up" style={{ animationDelay: '300ms' }}>
          <div className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 border border-white/20">
            <p className="text-white text-sm">Готовы начать сотрудничество? Выберите удобный способ связи</p>
          </div>
        </div>
      </div>
    </section>
  );
}
