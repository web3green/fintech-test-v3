
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.howItWorks': 'How It Works',
    'nav.services': 'Services',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'cta.getStarted': 'Get Started',
    'cta.request': 'Submit Request',
    
    // Hero
    'hero.title': 'Fintech-Assist: Your Partner in Financial Solutions',
    'hero.subtitle': 'Business Registration, Bank Accounts and Licenses Turnkey Solutions',
    'hero.cta': 'Get Started',
    
    // Services
    'services.badge': 'Our Services',
    'services.title': 'Financial Solutions for Your Business',
    'services.subtitle': 'We offer a complete range of services to help your business grow globally',
    'services.registration': 'Company Registration',
    'services.registration.desc': 'Quick and professional registration of companies in various jurisdictions',
    'services.accounts': 'Bank Account Opening',
    'services.accounts.desc': 'Opening personal and business accounts in reliable banks worldwide',
    'services.nominee': 'Nominee Service',
    'services.nominee.desc': 'Legal nominee service for secure business operations',
    'services.licenses': 'Financial Licenses',
    'services.licenses.desc': 'Help with obtaining licenses for various financial activities',
    
    // Process
    'process.badge': 'How It Works',
    'process.title': 'Simple Path to a Successful Solution',
    'process.subtitle': 'We have made the process as simple and straightforward as possible. Just three steps separate you from achieving your goals.',
    'process.step1': 'Submit Request',
    'process.step1.desc': 'Fill out the form on the website or contact us in any convenient way.',
    'process.step2': 'Document Preparation',
    'process.step2.desc': 'Our specialists will prepare the necessary documents and advise on all issues.',
    'process.step3': 'Get Your Solution',
    'process.step3.desc': 'We will perform all necessary actions and provide you with a ready-made turnkey solution.',
    
    // Contact Form
    'contact.title': 'Ready to Get Started?',
    'contact.subtitle': 'Leave a request and our specialist will contact you for a consultation on your issue.',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.form.title': 'Submit Request',
    'contact.form.name': 'Your Name',
    'contact.form.email': 'Email',
    'contact.form.phone': 'Phone',
    'contact.form.service': 'Service of Interest',
    'contact.form.message': 'Comment',
    'contact.form.submit': 'Submit Request',
    'contact.form.sending': 'Sending...',
    'contact.form.select': 'Select a service',
    'contact.service.registration': 'Company Registration',
    'contact.service.accounts': 'Bank Account Opening',
    'contact.service.nominee': 'Nominee Service',
    'contact.service.licenses': 'Financial Licenses',
    'contact.service.other': 'Other',
    'contact.success': 'Request successfully sent! We will contact you soon.',
    
    // Footer
    'footer.description': 'Your reliable partner in the world of financial solutions. We help companies and entrepreneurs develop their business.',
    'footer.links': 'Links',
    'footer.services': 'Services',
    'footer.contact': 'Contact',
    'footer.rights': 'All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Use',
  },
  ru: {
    // Header
    'nav.home': 'Главная',
    'nav.about': 'О нас',
    'nav.howItWorks': 'Как это работает',
    'nav.services': 'Услуги',
    'nav.blog': 'Блог',
    'nav.contact': 'Контакты',
    'cta.getStarted': 'Начать',
    'cta.request': 'Оставить заявку',
    
    // Hero
    'hero.title': 'Fintech-Assist: Ваш партнер в мире финансовых решений',
    'hero.subtitle': 'Открытие компаний, счетов и лицензий под ключ',
    'hero.cta': 'Начать',
    
    // Services
    'services.badge': 'Наши услуги',
    'services.title': 'Финансовые решения для вашего бизнеса',
    'services.subtitle': 'Мы предлагаем полный комплекс услуг для развития вашего бизнеса по всему миру',
    'services.registration': 'Регистрация компаний',
    'services.registration.desc': 'Быстрая и профессиональная регистрация компаний в различных юрисдикциях',
    'services.accounts': 'Открытие счетов',
    'services.accounts.desc': 'Открытие личных и бизнес-счетов в надежных банках по всему миру',
    'services.nominee': 'Номинальный сервис',
    'services.nominee.desc': 'Легальный номинальный сервис для безопасного ведения бизнеса',
    'services.licenses': 'Финансовые лицензии',
    'services.licenses.desc': 'Помощь в получении лицензий для различных финансовых деятельностей',
    
    // Process
    'process.badge': 'Как это работает',
    'process.title': 'Простой путь к успешному решению',
    'process.subtitle': 'Мы сделали процесс максимально простым и понятным. Всего три шага отделяют вас от реализации ваших целей.',
    'process.step1': 'Оставьте заявку',
    'process.step1.desc': 'Заполните форму на сайте или свяжитесь с нами любым удобным способом.',
    'process.step2': 'Подготовка документов',
    'process.step2.desc': 'Наши специалисты подготовят необходимые документы и проконсультируют по всем вопросам.',
    'process.step3': 'Получите готовое решение',
    'process.step3.desc': 'Мы выполним все необходимые действия и предоставим вам готовое решение под ключ.',
    
    // Contact Form
    'contact.title': 'Готовы начать?',
    'contact.subtitle': 'Оставьте заявку, и наш специалист свяжется с вами для консультации по вашему вопросу.',
    'contact.email': 'Электронная почта',
    'contact.phone': 'Телефон',
    'contact.form.title': 'Оставить заявку',
    'contact.form.name': 'Ваше имя',
    'contact.form.email': 'Электронная почта',
    'contact.form.phone': 'Телефон',
    'contact.form.service': 'Интересующая услуга',
    'contact.form.message': 'Комментарий',
    'contact.form.submit': 'Отправить заявку',
    'contact.form.sending': 'Отправка...',
    'contact.form.select': 'Выберите услугу',
    'contact.service.registration': 'Регистрация компаний',
    'contact.service.accounts': 'Открытие счетов',
    'contact.service.nominee': 'Номинальный сервис',
    'contact.service.licenses': 'Финансовые лицензии',
    'contact.service.other': 'Другое',
    'contact.success': 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
    
    // Footer
    'footer.description': 'Ваш надежный партнер в мире финансовых решений. Мы помогаем компаниям и предпринимателям развивать бизнес.',
    'footer.links': 'Ссылки',
    'footer.services': 'Услуги',
    'footer.contact': 'Контакты',
    'footer.rights': 'Все права защищены.',
    'footer.privacy': 'Политика конфиденциальности',
    'footer.terms': 'Условия использования',
  }
};

export const LanguageContext = createContext<LanguageContextType>({
  language: 'ru',
  setLanguage: () => {},
  t: () => '',
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage || 'ru';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
