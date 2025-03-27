
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
    'cta.getStarted': 'Consultation',
    'cta.consultation': 'Consultation',
    'cta.request': 'Submit Request',
    
    // Hero
    'hero.title': 'Global Financial Solutions for Your Business Without Borders',
    'hero.subtitle': 'Business Registration, Bank Accounts and Licenses Turnkey Solutions',
    'hero.cta': 'Get Started',
    'hero.stats.countries': '15+ Countries',
    'hero.stats.clients': '500+ Clients',
    'hero.stats.years': '9+ Years',
    'hero.companyName': 'FinTechAssist',
    'hero.companyTagline': 'Global Financial Solutions',
    
    // Hero Categories
    'hero.category.fintech': 'Fintech',
    'hero.category.ecommerce': 'E-commerce',
    'hero.category.blockchain': 'Blockchain',
    'hero.category.startups': 'Startups',
    'hero.category.neobanks': 'Neobanks',
    'hero.category.wallets': 'Digital Wallets',
    'hero.category.gaming': 'Gaming',
    'hero.category.saas': 'SaaS',
    'hero.category.edtech': 'EdTech',
    
    // Hero Cards
    'hero.card.banking.title': 'Banking',
    'hero.card.banking.subtitle': 'Accounts Worldwide',
    'hero.card.licenses.title': 'Licenses',
    'hero.card.jurisdictions.title': 'Global Jurisdictions',
    
    // Hero Licenses
    'hero.license.emi': 'EMI',
    'hero.license.crypto': 'Crypto',
    'hero.license.igaming': 'iGaming',
    'hero.license.psp': 'PSP',
    'hero.license.gambling': 'Gambling',
    'hero.license.emoney': 'E-Money',
    
    // Hero Jurisdictions
    'hero.jurisdiction.mga': 'MGA',
    'hero.jurisdiction.curacao': 'Curaçao',
    'hero.jurisdiction.fca': 'FCA',
    'hero.jurisdiction.aml': 'AML5',
    'hero.jurisdiction.compliance': 'Casino Compliance',
    
    // About
    'about.title': 'Your Trusted Partner in Global Finance',
    'about.description': 'A reliable partner in international financial consulting. We help clients open companies and bank accounts in various jurisdictions, provide nominee services and solutions for cross-border operations with minimal prepayment.',
    
    // Services
    'services.badge': 'Our Services',
    'services.title': 'Financial Solutions for Your Business',
    'services.subtitle': 'We offer a complete range of services to help your business grow globally',
    
    'services.company-formation.title': 'International Company Formation',
    'services.company-formation.short': 'Company registration in various jurisdictions (UAE, Singapore, Hong Kong, Europe)',
    'services.company-formation.details': 'Professional assistance in registering companies in various jurisdictions, including high-risk industries (gambling, betting, crypto projects including OTC transactions). We offer individual selection of the optimal jurisdiction for your business tasks, taking into account tax advantages and regulatory features.',
    
    'services.financial-licensing.title': 'Financial Licensing',
    'services.financial-licensing.short': 'Obtaining fintech licenses (EMI, PSP, payment licenses)',
    'services.financial-licensing.details': 'Full support in obtaining EMI, VASP, SEMI and other licenses. Assistance in forming the necessary package of documents, including creating a business plan, describing compliance procedures, opening correspondent safeguarding and other accounts, in full compliance with local regulators. Advice on regulatory requirements.',
    
    'services.crypto-regulation.title': 'Cryptocurrency Regulation',
    'services.crypto-regulation.short': 'Crypto exchange and trading platform licensing, VASP registration',
    'services.crypto-regulation.details': 'Obtaining crypto licenses. Selection of the optimal jurisdiction, preparation of documentation, development of internal policies and procedures in accordance with regulatory requirements. Support in opening various accounts.',
    
    'services.gambling-licensing.title': 'Gambling Licensing',
    'services.gambling-licensing.short': 'Online casino and bookmaker licenses in various jurisdictions',
    'services.gambling-licensing.details': 'Complete support for obtaining gambling and betting licenses in various jurisdictions. We help navigate complex regulatory requirements and ensure compliance with all local laws for gaming operations.',
    
    'services.payment-solutions.title': 'International Payment Solutions',
    'services.payment-solutions.short': 'Corporate account opening abroad and merchant account setup',
    'services.payment-solutions.details': 'Comprehensive support for the process of opening accounts in banks and EMIs. Preparation of all necessary documentation, consultation on financial institution standards and assistance in passing financial monitoring procedures. We work with a wide network of international banks and payment systems.',
    
    'services.fiat-crypto.title': 'FIAT-CRYPTO-FIAT Exchange',
    'services.fiat-crypto.short': 'Secure exchange operations between fiat currencies and cryptocurrencies',
    'services.fiat-crypto.details': 'Organization of safe and confidential exchange operations between fiat currencies and cryptocurrencies. We provide competitive exchange rates and minimum transaction times in compliance with all necessary AML/KYC procedures through licensed crypto exchangers.',
    
    'services.tax-planning.title': 'Accounting Services and Audit',
    'services.tax-planning.short': 'Professional accounting and financial reporting preparation',
    'services.tax-planning.details': 'Professional accounting and financial reporting preparation. Conducting audits and consulting on tax optimization issues in accordance with international standards.',
    
    'services.investment.title': 'Company Restructuring',
    'services.investment.short': 'Business restructuring strategies development and implementation',
    'services.investment.details': 'Development and implementation of business restructuring strategies to improve operational efficiency, optimize taxation and comply with new regulatory requirements. Individual approach to each client, taking into account the specifics of the business.',
    
    'services.nominee.title': 'Nominee Service',
    'services.nominee.short': 'Professional directors and shareholders for your company',
    'services.nominee.details': 'Providing professional directors and shareholders for your company, providing legal representation and business management while maintaining the confidentiality of the real owner. All services are provided in strict accordance with international legal standards.',
    
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
    'contact.title': 'We\'re Ready to Help You',
    'contact.subtitle': 'We\'re ready to provide a consultation - you can contact us directly or submit a request and we\'ll get in touch with you.',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.telegram': 'Telegram',
    'contact.ourSocials': 'Get in Touch',
    'contact.instant.title': 'Need Immediate Consultation?',
    'contact.instant.subtitle': 'Connect with our company manager directly through Telegram for immediate assistance with your questions.',
    'contact.instant.button': 'Message on Telegram',
    'contact.form.title': 'Submit Request',
    'contact.form.name': 'Your Name',
    'contact.form.email': 'Email',
    'contact.form.phone': 'Phone',
    'contact.form.service': 'Service of Interest',
    'contact.form.message': 'Comment',
    'contact.form.submit': 'Submit Request',
    'contact.form.sending': 'Sending...',
    'contact.form.select': 'Select a service',
    'contact.form.namePlaceholder': 'Your name',
    'contact.form.emailPlaceholder': 'Your email',
    'contact.form.messagePlaceholder': 'Your message',
    'contact.service.registration': 'Company Registration',
    'contact.service.accounts': 'Bank Account Opening',
    'contact.service.nominee': 'Nominee Service',
    'contact.service.licenses': 'Financial Licenses',
    'contact.service.other': 'Other',
    'contact.success': 'Request successfully sent! We will contact you soon.',
    'contact.error': 'Error sending message. Please try again.',
    
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
    'cta.getStarted': 'Консультация',
    'cta.consultation': 'Консультация',
    'cta.request': 'Оставить заявку',
    
    // Hero
    'hero.title': 'Глобальные финансовые решения для вашего бизнеса без границ',
    'hero.subtitle': 'Открытие компаний, счетов и лицензий под ключ',
    'hero.cta': 'Начать',
    'hero.stats.countries': '15+ Стран',
    'hero.stats.clients': '500+ Клиентов',
    'hero.stats.years': '9+ Лет',
    'hero.companyName': 'ФинТехАссист',
    'hero.companyTagline': 'Глобальные финансовые решения',
    
    // Hero Categories
    'hero.category.fintech': 'Финтех',
    'hero.category.ecommerce': 'Э-коммерция',
    'hero.category.blockchain': 'Блокчейн',
    'hero.category.startups': 'Стартапы',
    'hero.category.neobanks': 'Необанки',
    'hero.category.wallets': 'Цифровые кошельки',
    'hero.category.gaming': 'Гейминг',
    'hero.category.saas': 'SaaS',
    'hero.category.edtech': 'ЭдТех',
    
    // Hero Cards
    'hero.card.banking.title': 'Банкинг',
    'hero.card.banking.subtitle': 'Счета по всему миру',
    'hero.card.licenses.title': 'Лицензии',
    'hero.card.jurisdictions.title': 'Глобальные юрисдикции',
    
    // Hero Licenses
    'hero.license.emi': 'EMI',
    'hero.license.crypto': 'Крипто',
    'hero.license.igaming': 'iGaming',
    'hero.license.psp': 'PSP',
    'hero.license.gambling': 'Гемблинг',
    'hero.license.emoney': 'Э-Мани',
    
    // Hero Jurisdictions
    'hero.jurisdiction.mga': 'MGA',
    'hero.jurisdiction.curacao': 'Кюрасао',
    'hero.jurisdiction.fca': 'FCA',
    'hero.jurisdiction.aml': 'AML5',
    'hero.jurisdiction.compliance': 'Казино Комплаенс',
    
    // About
    'about.title': 'Ваш надежный партнер в мире финансов',
    'about.description': 'Надежный партнер в мире международного финансового консалтинга. Мы помогаем клиентам открывать компании и банковские счета в различных юрисдикциях, предоставляем номинальный сервис и решения для трансграничных операций с минимальной предоплатой.',
    
    // Services
    'services.badge': 'Наши услуги',
    'services.title': 'Финансовые решения для вашего бизнеса',
    'services.subtitle': 'Мы предлагаем полный комплекс услуг для развития вашего бизнеса по всему миру',
    
    'services.company-formation.title': 'Открытие компаний',
    'services.company-formation.short': 'Регистрация компаний в различных юрисдикциях (ОАЭ, Сингапур, Гонконг, Европа)',
    'services.company-formation.details': 'Профессиональное содействие в регистрации компаний в различных юрисдикциях, включая высокорисковые индустрии (гемблинг, беттинг, криптопроекты включая OTC сделки). Предлагаем индивидуальный подбор оптимальной юрисдикции под ваши бизнес-задачи, с учетом налоговых преимуществ и особенностей регулирования.',
    
    'services.financial-licensing.title': 'Лицензирование EMI',
    'services.financial-licensing.short': 'Получение финтех-лицензий (EMI, PSP, платежные лицензии)',
    'services.financial-licensing.details': 'Полное сопровождение процесса получения лицензий EMI, VASP, SEMI и других. Сопровождение в формировании необходимого пакета документов,в том числе в создании бизнес-плана, описании compliance процедур, открытие корреспондентских safeguarding и других счетов, в полном соответствии локальных регуляторов. Консультации по соблюдению регуляторных требований.',
    
    'services.crypto-regulation.title': 'Крипто-лицензирование',
    'services.crypto-regulation.short': 'Лицензирование криптобирж и торговых платформ, регистрация VASP',
    'services.crypto-regulation.details': 'Получение крипто лицензий. Подбор оптимальной юрисдикции, подготовка документации, разработка внутренних политик и процедур в соответствии с требованиями регуляторов. Сопровождение в открытии различных счетов.',
    
    'services.gambling-licensing.title': 'Лицензирование гемблинга',
    'services.gambling-licensing.short': 'Лицензии для онлайн-казино и букмекеров в различных юрисдикциях',
    'services.gambling-licensing.details': 'Полное сопровождение получения лицензий для гемблинга и беттинга в различных юрисдикциях. Мы помогаем ориентироваться в сложных нормативных требованиях и обеспечиваем соответствие всем местным законам для игровых операций.',
    
    'services.payment-solutions.title': 'Открытие счетов',
    'services.payment-solutions.short': 'Открытие корпоративных счетов за рубежом и настройка мерчант-аккаунтов',
    'services.payment-solutions.details': 'Комплексное сопровождение процесса открытия счетов в банках и EMI. Подготовка всей необходимой документации, консультирование по стандартам финансовых учреждений и помощь в прохождении процедур финансового мониторинга. Работаем с широкой сетью международных банков и платежных систем.',
    
    'services.fiat-crypto.title': 'Обмен FIAT-CRYPTO-FIAT',
    'services.fiat-crypto.short': 'Безопасные обменные операции между фиатными валютами и криптовалютами',
    'services.fiat-crypto.details': 'Организация безопасных и конфиденциальных обменных операций между фиатными валютами и криптовалютами. Предоставляем конкурентные курсы обмена и минимальные сроки проведения транзакций с соблюдением всех необходимых процедур AML/KYC через лицензированные криптообменники.',
    
    'services.tax-planning.title': 'Бухгалтерское обслуживание и аудит',
    'services.tax-planning.short': 'Профессиональное ведение бухгалтерского учета и подготовка финансовой отчетности',
    'services.tax-planning.details': 'Профессиональное ведение бухгалтерского учета и подготовка финансовой отчетности. Проведение аудита и консультирование по вопросам оптимизации налогообложения в соответствии с международными стандартами.',
    
    'services.investment.title': 'Реструктуризация компаний',
    'services.investment.short': 'Разработка и реализация стратегий реструктуризации бизнеса',
    'services.investment.details': 'Разработка и реализация стратегий реструктуризации бизнеса для повышения операционной эффективности, оптимизации налогообложения и соответствия новым регуляторным требованиям. Индивидуальный подход к каждому клиенту с учетом специфики бизнеса.',
    
    'services.nominee.title': 'Номинальный сервис',
    'services.nominee.short': 'Профессиональные директора и акционеры для вашей компании',
    'services.nominee.details': 'Предоставление профессиональных директоров и акционеров для вашей компании, обеспечивающих юридическое представительство и управление бизнесом при сохранении конфиденциальности реального владельца. Все услуги оказываются в строгом соответствии с международными правовыми нормами.',
    
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
    'contact.title': 'Мы готовы помочь вам',
    'contact.subtitle': 'Мы готовы вас проконсультировать - вы можете связаться с нами напрямую или оставить заявку на консультацию.',
    'contact.email': 'Электронная почта',
    'contact.phone': 'Телефон',
    'contact.telegram': 'Телеграм',
    'contact.ourSocials': 'Связаться с нами',
    'contact.instant.title': 'Нужна консультация прямо сейчас?',
    'contact.instant.subtitle': 'Свяжитесь с менеджером компании напрямую через Телеграм для получения немедленной помощи по вашим вопросам.',
    'contact.instant.button': 'Написать в Телеграм',
    'contact.form.title': 'Оставить заявку',
    'contact.form.name': 'Ваше имя',
    'contact.form.email': 'Электронная почта',
    'contact.form.phone': 'Телефон',
    'contact.form.service': 'Интересующая услуга',
    'contact.form.message': 'Комментарий',
    'contact.form.submit': 'Отправить заявку',
    'contact.form.sending': 'Отправка...',
    'contact.form.select': 'Выберите услугу',
    'contact.form.namePlaceholder': 'Ваше имя',
    'contact.form.emailPlaceholder': 'Ваша электронная почта',
    'contact.form.messagePlaceholder': 'Ваше сообщение',
    'contact.service.registration': 'Регистрация компаний',
    'contact.service.accounts': 'Открытие счетов',
    'contact.service.nominee': 'Номинальный сервис',
    'contact.service.licenses': 'Финансовые лицензии',
    'contact.service.other': 'Другое',
    'contact.success': 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
    'contact.error': 'Ошибка отправки сообщения. Пожалуйста, попробуйте еще раз.',
    
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
    
    // Создать пользовательское событие для обновления страницы при смене языка
    const event = new CustomEvent('language:changed', { detail: { language } });
    window.dispatchEvent(event);
    
    // Также принудительно обновить стили и скрипты при смене языка
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      if (link instanceof HTMLLinkElement && link.href) {
        const url = new URL(link.href);
        url.searchParams.set('_lang', language);
        url.searchParams.set('_t', Date.now().toString());
        link.href = url.toString();
      }
    });
    
    // Обеспечить правильное отображение контента
    document.documentElement.setAttribute('lang', language);
    document.documentElement.style.opacity = '0.99';
    setTimeout(() => {
      document.documentElement.style.opacity = '1';
    }, 10);
    
    console.log('🌍 Язык изменен на:', language);
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
