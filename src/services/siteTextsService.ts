import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';

export interface TextBlock {
  id: string;
  key: string;
  section: string;
  content: {
    en: string;
    ru: string;
  };
}

interface SiteTextsStore {
  texts: TextBlock[];
  isHydrated: boolean;
  setHydrated: (state: boolean) => void;
  addText: (text: TextBlock) => Promise<void>;
  updateText: (key: string, newText: TextBlock) => Promise<void>;
  deleteText: (key: string) => Promise<void>;
  getTextByKey: (key: string) => TextBlock | undefined;
  cleanAllTextsFromHtml: () => void;
  resetToInitial: () => void;
  syncWithDatabase: () => Promise<void>;
}

// Функция для очистки HTML-разметки
const stripHtml = (html: string): string => {
  if (!html || typeof html !== 'string') return '';
  // Создаем временный div для преобразования HTML в текст
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
};

// Функция для проверки, содержит ли строка HTML-теги
const containsHtmlTags = (str: string): boolean => {
  if (!str || typeof str !== 'string') return false;
  return /<\/?[a-z][\s\S]*>/i.test(str);
};

// Начальные тексты для демонстрации
const initialTexts: TextBlock[] = [
  {
    id: 'hero-title',
    key: 'hero.title',
    section: 'Home Page',
    content: {
      en: 'Financial Solutions for Your Business',
      ru: 'Финансовые решения для вашего бизнеса'
    }
  },
  {
    id: 'hero-subtitle',
    key: 'hero.subtitle',
    section: 'Home Page',
    content: {
      en: 'Open accounts and get licenses with ease',
      ru: 'Открывайте счета и получайте лицензии легко'
    }
  },
  {
    id: 'hero-company-tagline',
    key: 'hero.companyTagline',
    section: 'Home Page',
    content: {
      en: 'Your Trusted Financial Partner',
      ru: 'Ваш надежный финансовый партнер'
    }
  },
  {
    id: 'hero-category-fintech',
    key: 'hero.category.fintech',
    section: 'Home Page',
    content: {
      en: 'FinTech',
      ru: 'ФинТех'
    }
  },
  {
    id: 'hero-category-ecommerce',
    key: 'hero.category.ecommerce',
    section: 'Home Page',
    content: {
      en: 'E-commerce',
      ru: 'E-commerce'
    }
  },
  {
    id: 'hero-category-blockchain',
    key: 'hero.category.blockchain',
    section: 'Home Page',
    content: {
      en: 'Blockchain',
      ru: 'Блокчейн'
    }
  },
  {
    id: 'hero-category-startups',
    key: 'hero.category.startups',
    section: 'Home Page',
    content: {
      en: 'Startups',
      ru: 'Стартапы'
    }
  },
  {
    id: 'hero-category-neobanks',
    key: 'hero.category.neobanks',
    section: 'Home Page',
    content: {
      en: 'Neobanks',
      ru: 'Необанки'
    }
  },
  {
    id: 'hero-category-wallets',
    key: 'hero.category.wallets',
    section: 'Home Page',
    content: {
      en: 'Wallets',
      ru: 'Кошельки'
    }
  },
  {
    id: 'hero-category-gaming',
    key: 'hero.category.gaming',
    section: 'Home Page',
    content: {
      en: 'Gaming',
      ru: 'Гейминг'
    }
  },
  {
    id: 'hero-category-saas',
    key: 'hero.category.saas',
    section: 'Home Page',
    content: {
      en: 'SaaS',
      ru: 'SaaS'
    }
  },
  {
    id: 'hero-category-edtech',
    key: 'hero.category.edtech',
    section: 'Home Page',
    content: {
      en: 'EdTech',
      ru: 'EdTech'
    }
  },
  {
    id: 'hero-category-web3',
    key: 'hero.category.web3',
    section: 'Home Page',
    content: {
      en: 'Web3',
      ru: 'Web3'
    }
  },
  {
    id: 'hero-category-crypto',
    key: 'hero.category.crypto',
    section: 'Home Page',
    content: {
      en: 'Crypto',
      ru: 'Крипто'
    }
  },
  {
    id: 'hero-card-banking-title',
    key: 'hero.card.banking.title',
    section: 'Home Page',
    content: {
      en: 'Banking Solutions',
      ru: 'Банковские решения'
    }
  },
  {
    id: 'hero-card-banking-subtitle',
    key: 'hero.card.banking.subtitle',
    section: 'Home Page',
    content: {
      en: 'Open accounts worldwide',
      ru: 'Открытие счетов по всему миру'
    }
  },
  {
    id: 'hero-card-licenses-title',
    key: 'hero.card.licenses.title',
    section: 'Home Page',
    content: {
      en: 'Available Licenses',
      ru: 'Доступные лицензии'
    }
  },
  {
    id: 'hero-license-emi',
    key: 'hero.license.emi',
    section: 'Home Page',
    content: {
      en: 'EMI',
      ru: 'EMI'
    }
  },
  {
    id: 'hero-license-crypto',
    key: 'hero.license.crypto',
    section: 'Home Page',
    content: {
      en: 'Crypto',
      ru: 'Крипто'
    }
  },
  {
    id: 'hero-license-igaming',
    key: 'hero.license.igaming',
    section: 'Home Page',
    content: {
      en: 'iGaming',
      ru: 'iGaming'
    }
  },
  {
    id: 'hero-license-psp',
    key: 'hero.license.psp',
    section: 'Home Page',
    content: {
      en: 'PSP',
      ru: 'PSP'
    }
  },
  {
    id: 'hero-license-gambling',
    key: 'hero.license.gambling',
    section: 'Home Page',
    content: {
      en: 'Gambling',
      ru: 'Гемблинг'
    }
  },
  {
    id: 'hero-license-emoney',
    key: 'hero.license.emoney',
    section: 'Home Page',
    content: {
      en: 'E-money',
      ru: 'Электронные деньги'
    }
  },
  {
    id: 'hero-card-jurisdictions-title',
    key: 'hero.card.jurisdictions.title',
    section: 'Home Page',
    content: {
      en: 'Jurisdictions & Compliance',
      ru: 'Юрисдикции и комплаенс'
    }
  },
  {
    id: 'hero-jurisdiction-mga',
    key: 'hero.jurisdiction.mga',
    section: 'Home Page',
    content: {
      en: 'MGA',
      ru: 'MGA'
    }
  },
  {
    id: 'hero-jurisdiction-curacao',
    key: 'hero.jurisdiction.curacao',
    section: 'Home Page',
    content: {
      en: 'Curacao',
      ru: 'Кюрасао'
    }
  },
  {
    id: 'hero-jurisdiction-fca',
    key: 'hero.jurisdiction.fca',
    section: 'Home Page',
    content: {
      en: 'FCA',
      ru: 'FCA'
    }
  },
  {
    id: 'hero-jurisdiction-aml',
    key: 'hero.jurisdiction.aml',
    section: 'Home Page',
    content: {
      en: 'AML',
      ru: 'AML'
    }
  },
  {
    id: 'hero-jurisdiction-compliance',
    key: 'hero.jurisdiction.compliance',
    section: 'Home Page',
    content: {
      en: 'Compliance',
      ru: 'Комплаенс'
    }
  },
  {
    id: 'hero-stats-countries',
    key: 'hero.stats.countries',
    section: 'Home Page',
    content: {
      en: '50+ Countries',
      ru: '50+ Стран'
    }
  },
  {
    id: 'hero-stats-clients',
    key: 'hero.stats.clients',
    section: 'Home Page',
    content: {
      en: '200+ Clients',
      ru: '200+ Клиентов'
    }
  },
  {
    id: 'hero-stats-years',
    key: 'hero.stats.years',
    section: 'Home Page',
    content: {
      en: '10+ Years',
      ru: '10+ Лет'
    }
  },
  {
    id: 'cta-consultation',
    key: 'cta.consultation',
    section: 'Common',
    content: {
      en: 'Get Free Consultation',
      ru: 'Получить консультацию'
    }
  },
  {
    id: 'nav-about',
    key: 'nav.about',
    section: 'Navigation',
    content: {
      en: 'About Us',
      ru: 'О нас'
    }
  },
  {
    id: 'nav-services',
    key: 'nav.services',
    section: 'Navigation',
    content: {
      en: 'Services',
      ru: 'Услуги'
    }
  },
  {
    id: 'nav-how-it-works',
    key: 'nav.howItWorks',
    section: 'Navigation',
    content: {
      en: 'How It Works',
      ru: 'Как это работает'
    }
  },
  {
    id: 'nav-blog',
    key: 'nav.blog',
    section: 'Navigation',
    content: {
      en: 'Blog',
      ru: 'Блог'
    }
  },
  {
    id: 'nav-contact',
    key: 'nav.contact',
    section: 'Navigation',
    content: {
      en: 'Contact',
      ru: 'Контакты'
    }
  },
  {
    id: 'cta-get-started',
    key: 'cta.getStarted',
    section: 'Common',
    content: {
      en: 'Get Consultation',
      ru: 'Получить консультацию'
    }
  },
  {
    id: 'footer-links',
    key: 'footer.links',
    section: 'Footer',
    content: {
      en: 'Quick Links',
      ru: 'Быстрые ссылки'
    }
  },
  {
    id: 'footer-contact',
    key: 'footer.contact',
    section: 'Footer',
    content: {
      en: 'Contact Us',
      ru: 'Свяжитесь с нами'
    }
  },
  {
    id: 'footer-rights',
    key: 'footer.rights',
    section: 'Footer',
    content: {
      en: 'All rights reserved',
      ru: 'Все права защищены'
    }
  },
  {
    id: 'footer-privacy',
    key: 'footer.privacy',
    section: 'Footer',
    content: {
      en: 'Privacy Policy',
      ru: 'Политика конфиденциальности'
    }
  },
  {
    id: 'footer-terms',
    key: 'footer.terms',
    section: 'Footer',
    content: {
      en: 'Terms of Service',
      ru: 'Условия использования'
    }
  },
  {
    id: 'footer-back-to-top',
    key: 'footer.backToTop',
    section: 'Footer',
    content: {
      en: 'Back to Top',
      ru: 'Наверх'
    }
  },
  {
    id: 'footer-description',
    key: 'footer.description',
    section: 'Footer',
    content: {
      en: 'We provide business registration services, banking solutions, and licensing across multiple jurisdictions. Our team of experts helps businesses legally operate in international markets.',
      ru: 'Мы предоставляем услуги регистрации бизнеса, банковские решения и лицензирование в различных юрисдикциях. Наша команда экспертов помогает бизнесу легально работать на международных рынках.'
    }
  },
  {
    id: 'footer-services',
    key: 'footer.services',
    section: 'Footer',
    content: {
      en: 'Our Services',
      ru: 'Наши услуги'
    }
  },
  {
    id: 'about-title',
    key: 'about.title',
    section: 'About Us',
    content: {
      en: 'About Our Company',
      ru: 'О нашей компании'
    }
  },
  {
    id: 'about-description',
    key: 'about.description',
    section: 'About Us',
    content: {
      en: 'We help businesses navigate the complex world of international finance',
      ru: 'Мы помогаем бизнесу ориентироваться в сложном мире международных финансов'
    }
  },
  {
    id: 'services-title',
    key: 'services.title',
    section: 'Services',
    content: {
      en: 'Our Services',
      ru: 'Наши услуги'
    }
  },
  {
    id: 'contact-title',
    key: 'contact.title',
    section: 'Contact',
    content: {
      en: 'Get in Touch',
      ru: 'Свяжитесь с нами'
    }
  },
  {
    id: 'contact-subtitle',
    key: 'contact.subtitle',
    section: 'Contact',
    content: {
      en: 'Have questions? We\'re here to help you with any inquiries about our services',
      ru: 'Есть вопросы? Мы здесь, чтобы помочь вам с любыми запросами о наших услугах'
    }
  },
  {
    id: 'contact-email',
    key: 'contact.email',
    section: 'Contact',
    content: {
      en: 'Email',
      ru: 'Электронная почта'
    }
  },
  {
    id: 'contact-phone',
    key: 'contact.phone',
    section: 'Contact',
    content: {
      en: 'WhatsApp',
      ru: 'WhatsApp'
    }
  },
  {
    id: 'contact-telegram',
    key: 'contact.telegram',
    section: 'Contact',
    content: {
      en: 'Telegram',
      ru: 'Телеграм'
    }
  },
  {
    id: 'contact-form-title',
    key: 'contact.form.title',
    section: 'Contact',
    content: {
      en: 'Request a Consultation',
      ru: 'Запросить консультацию'
    }
  },
  {
    id: 'contact-form-name',
    key: 'contact.form.name',
    section: 'Contact',
    content: {
      en: 'Your Name',
      ru: 'Ваше имя'
    }
  },
  {
    id: 'contact-form-email',
    key: 'contact.form.email',
    section: 'Contact',
    content: {
      en: 'Your Email',
      ru: 'Ваша почта'
    }
  },
  {
    id: 'contact-form-phone',
    key: 'contact.form.phone',
    section: 'Contact',
    content: {
      en: 'Phone Number',
      ru: 'Номер телефона'
    }
  },
  {
    id: 'contact-form-service',
    key: 'contact.form.service',
    section: 'Contact',
    content: {
      en: 'Service of Interest',
      ru: 'Интересующая услуга'
    }
  },
  {
    id: 'contact-form-message',
    key: 'contact.form.message',
    section: 'Contact',
    content: {
      en: 'Your Message',
      ru: 'Ваше сообщение'
    }
  },
  {
    id: 'contact-form-select',
    key: 'contact.form.select',
    section: 'Contact',
    content: {
      en: 'Select a service',
      ru: 'Выберите услугу'
    }
  },
  {
    id: 'contact-form-submit',
    key: 'contact.form.submit',
    section: 'Contact',
    content: {
      en: 'Send Request',
      ru: 'Отправить запрос'
    }
  },
  {
    id: 'contact-form-sending',
    key: 'contact.form.sending',
    section: 'Contact',
    content: {
      en: 'Sending...',
      ru: 'Отправка...'
    }
  },
  {
    id: 'contact-service-registration',
    key: 'contact.service.registration',
    section: 'Contact',
    content: {
      en: 'Company Registration',
      ru: 'Регистрация компании'
    }
  },
  {
    id: 'contact-service-accounts',
    key: 'contact.service.accounts',
    section: 'Contact',
    content: {
      en: 'Bank Accounts',
      ru: 'Банковские счета'
    }
  },
  {
    id: 'contact-service-nominee',
    key: 'contact.service.nominee',
    section: 'Contact',
    content: {
      en: 'Nominee Services',
      ru: 'Номинальные услуги'
    }
  },
  {
    id: 'contact-service-licenses',
    key: 'contact.service.licenses',
    section: 'Contact',
    content: {
      en: 'Licensing',
      ru: 'Лицензирование'
    }
  },
  {
    id: 'contact-service-other',
    key: 'contact.service.other',
    section: 'Contact',
    content: {
      en: 'Other Services',
      ru: 'Другие услуги'
    }
  },
  {
    id: 'contact-instant-title',
    key: 'contact.instant.title',
    section: 'Contact',
    content: {
      en: 'Need Immediate Assistance?',
      ru: 'Нужна срочная помощь?'
    }
  },
  {
    id: 'contact-instant-subtitle',
    key: 'contact.instant.subtitle',
    section: 'Contact',
    content: {
      en: 'Get instant support through our Telegram channel. Our experts are ready to help you 24/7.',
      ru: 'Получите мгновенную поддержку через наш Telegram канал. Наши эксперты готовы помочь вам 24/7.'
    }
  },
  {
    id: 'contact-instant-button',
    key: 'contact.instant.button',
    section: 'Contact',
    content: {
      en: 'Chat on Telegram',
      ru: 'Чат в Telegram'
    }
  },
  {
    id: 'contact-our-socials',
    key: 'contact.ourSocials',
    section: 'Contact',
    content: {
      en: 'Our Contacts',
      ru: 'Наши контакты'
    }
  },
  {
    id: 'services-badge',
    key: 'services.badge',
    section: 'Services',
    content: {
      en: 'Our Services',
      ru: 'Наши услуги'
    }
  },
  {
    id: 'services-title',
    key: 'services.title',
    section: 'Services',
    content: {
      en: 'Comprehensive Financial Solutions',
      ru: 'Комплексные финансовые решения'
    }
  },
  {
    id: 'services-subtitle',
    key: 'services.subtitle',
    section: 'Services',
    content: {
      en: 'We provide a wide range of services to help your business succeed in the global financial market',
      ru: 'Мы предоставляем широкий спектр услуг для успеха вашего бизнеса на мировом финансовом рынке'
    }
  },
  {
    id: 'services-company-formation-title',
    key: 'services.company-formation.title',
    section: 'Services',
    content: {
      en: 'Company Formation',
      ru: 'Регистрация компаний'
    }
  },
  {
    id: 'services-company-formation-short',
    key: 'services.company-formation.short',
    section: 'Services',
    content: {
      en: 'Quick and efficient company registration in multiple jurisdictions',
      ru: 'Быстрая и эффективная регистрация компаний в различных юрисдикциях'
    }
  },
  {
    id: 'services-company-formation-details',
    key: 'services.company-formation.details',
    section: 'Services',
    content: {
      en: 'We help you establish your business presence globally with our comprehensive company formation services, handling all legal requirements and documentation.',
      ru: 'Мы помогаем вам создать глобальное присутствие вашего бизнеса с помощью наших комплексных услуг по регистрации компаний, обрабатывая все юридические требования и документацию.'
    }
  },
  {
    id: 'services-financial-licensing-title',
    key: 'services.financial-licensing.title',
    section: 'Services',
    content: {
      en: 'Financial Licensing',
      ru: 'Финансовое лицензирование'
    }
  },
  {
    id: 'services-financial-licensing-short',
    key: 'services.financial-licensing.short',
    section: 'Services',
    content: {
      en: 'Obtain necessary licenses for financial operations',
      ru: 'Получение необходимых лицензий для финансовых операций'
    }
  },
  {
    id: 'services-financial-licensing-details',
    key: 'services.financial-licensing.details',
    section: 'Services',
    content: {
      en: 'Navigate the complex world of financial regulations with our licensing services. We help you obtain and maintain all necessary permits and licenses.',
      ru: 'Ориентируйтесь в сложном мире финансовых правил с нашими услугами лицензирования. Мы помогаем получить и поддерживать все необходимые разрешения и лицензии.'
    }
  },
  {
    id: 'services-crypto-regulation-title',
    key: 'services.crypto-regulation.title',
    section: 'Services',
    content: {
      en: 'Crypto Regulation',
      ru: 'Регулирование криптовалют'
    }
  },
  {
    id: 'services-crypto-regulation-short',
    key: 'services.crypto-regulation.short',
    section: 'Services',
    content: {
      en: 'Regulatory compliance for cryptocurrency businesses',
      ru: 'Соответствие нормативным требованиям для криптовалютного бизнеса'
    }
  },
  {
    id: 'services-crypto-regulation-details',
    key: 'services.crypto-regulation.details',
    section: 'Services',
    content: {
      en: 'Stay compliant in the evolving cryptocurrency landscape with our specialized regulatory services for digital asset businesses.',
      ru: 'Оставайтесь в соответствии с развивающимся криптовалютным ландшафтом с нашими специализированными услугами регулирования для бизнеса цифровых активов.'
    }
  },
  {
    id: 'services-gambling-licensing-title',
    key: 'services.gambling-licensing.title',
    section: 'Services',
    content: {
      en: 'Gambling Licensing',
      ru: 'Лицензирование гемблинга'
    }
  },
  {
    id: 'services-gambling-licensing-short',
    key: 'services.gambling-licensing.short',
    section: 'Services',
    content: {
      en: 'Gaming and betting license acquisition',
      ru: 'Получение лицензий для игорного бизнеса'
    }
  },
  {
    id: 'services-gambling-licensing-details',
    key: 'services.gambling-licensing.details',
    section: 'Services',
    content: {
      en: 'Get your gaming operation licensed in major jurisdictions with our comprehensive gambling licensing services.',
      ru: 'Получите лицензию для вашего игорного бизнеса в основных юрисдикциях с нашими комплексными услугами лицензирования.'
    }
  },
  {
    id: 'services-payment-solutions-title',
    key: 'services.payment-solutions.title',
    section: 'Services',
    content: {
      en: 'Payment Solutions',
      ru: 'Платёжные решения'
    }
  },
  {
    id: 'services-payment-solutions-short',
    key: 'services.payment-solutions.short',
    section: 'Services',
    content: {
      en: 'Global payment processing solutions',
      ru: 'Глобальные решения для обработки платежей'
    }
  },
  {
    id: 'services-payment-solutions-details',
    key: 'services.payment-solutions.details',
    section: 'Services',
    content: {
      en: 'Implement secure and efficient payment processing solutions for your business with our comprehensive payment services.',
      ru: 'Внедрите безопасные и эффективные решения для обработки платежей для вашего бизнеса с нашими комплексными платежными услугами.'
    }
  },
  {
    id: 'services-fiat-crypto-title',
    key: 'services.fiat-crypto.title',
    section: 'Services',
    content: {
      en: 'Fiat & Crypto',
      ru: 'Фиат и крипто'
    }
  },
  {
    id: 'services-fiat-crypto-short',
    key: 'services.fiat-crypto.short',
    section: 'Services',
    content: {
      en: 'Integrated fiat and cryptocurrency solutions',
      ru: 'Интегрированные решения для фиатных и криптовалют'
    }
  },
  {
    id: 'services-fiat-crypto-details',
    key: 'services.fiat-crypto.details',
    section: 'Services',
    content: {
      en: 'Bridge the gap between traditional and digital finance with our integrated fiat and cryptocurrency solutions.',
      ru: 'Преодолейте разрыв между традиционными и цифровыми финансами с нашими интегрированными решениями для фиатных и криптовалют.'
    }
  },
  {
    id: 'services-tax-planning-title',
    key: 'services.tax-planning.title',
    section: 'Services',
    content: {
      en: 'Tax Planning',
      ru: 'Налоговое планирование'
    }
  },
  {
    id: 'services-tax-planning-short',
    key: 'services.tax-planning.short',
    section: 'Services',
    content: {
      en: 'Optimize your tax structure globally',
      ru: 'Оптимизация налоговой структуры в глобальном масштабе'
    }
  },
  {
    id: 'services-tax-planning-details',
    key: 'services.tax-planning.details',
    section: 'Services',
    content: {
      en: 'Maximize efficiency and minimize tax burden with our expert international tax planning services.',
      ru: 'Максимизируйте эффективность и минимизируйте налоговую нагрузку с нашими экспертными услугами международного налогового планирования.'
    }
  },
  {
    id: 'services-investment-title',
    key: 'services.investment.title',
    section: 'Services',
    content: {
      en: 'Investment Solutions',
      ru: 'Инвестиционные решения'
    }
  },
  {
    id: 'services-investment-short',
    key: 'services.investment.short',
    section: 'Services',
    content: {
      en: 'Strategic investment planning and management',
      ru: 'Стратегическое планирование и управление инвестициями'
    }
  },
  {
    id: 'services-investment-details',
    key: 'services.investment.details',
    section: 'Services',
    content: {
      en: 'Grow your wealth with our professional investment solutions and expert portfolio management.',
      ru: 'Приумножайте ваше богатство с нашими профессиональными инвестиционными решениями и экспертным управлением портфелем.'
    }
  },
  {
    id: 'services-nominee-title',
    key: 'services.nominee.title',
    section: 'Services',
    content: {
      en: 'Nominee Services',
      ru: 'Номинальные услуги'
    }
  },
  {
    id: 'services-nominee-short',
    key: 'services.nominee.short',
    section: 'Services',
    content: {
      en: 'Professional nominee director services',
      ru: 'Профессиональные услуги номинальных директоров'
    }
  },
  {
    id: 'services-nominee-details',
    key: 'services.nominee.details',
    section: 'Services',
    content: {
      en: 'Maintain privacy and compliance with our professional nominee director and shareholder services.',
      ru: 'Сохраняйте конфиденциальность и соответствие требованиям с нашими профессиональными услугами номинальных директоров и акционеров.'
    }
  },
  {
    id: 'cta-request',
    key: 'cta.request',
    section: 'Common',
    content: {
      en: 'Request Service',
      ru: 'Заказать услугу'
    }
  },
  {
    id: 'process-badge',
    key: 'process.badge',
    section: 'Process',
    content: {
      en: 'How It Works',
      ru: 'Как это работает'
    }
  },
  {
    id: 'process-title',
    key: 'process.title',
    section: 'Process',
    content: {
      en: 'Simple Process, Quick Results',
      ru: 'Простой процесс, быстрый результат'
    }
  },
  {
    id: 'process-subtitle',
    key: 'process.subtitle',
    section: 'Process',
    content: {
      en: 'Get your business up and running with our streamlined process',
      ru: 'Запустите свой бизнес с помощью нашего оптимизированного процесса'
    }
  },
  {
    id: 'process-step1',
    key: 'process.step1',
    section: 'Process',
    content: {
      en: 'Initial Consultation',
      ru: 'Первичная консультация'
    }
  },
  {
    id: 'process-step1-desc',
    key: 'process.step1.desc',
    section: 'Process',
    content: {
      en: 'Schedule a free consultation to discuss your business needs and goals',
      ru: 'Запланируйте бесплатную консультацию для обсуждения потребностей и целей вашего бизнеса'
    }
  },
  {
    id: 'process-step2',
    key: 'process.step2',
    section: 'Process',
    content: {
      en: 'Solution Development',
      ru: 'Разработка решения'
    }
  },
  {
    id: 'process-step2-desc',
    key: 'process.step2.desc',
    section: 'Process',
    content: {
      en: 'We create a tailored solution based on your specific requirements',
      ru: 'Мы создаем индивидуальное решение на основе ваших конкретных требований'
    }
  },
  {
    id: 'process-step3',
    key: 'process.step3',
    section: 'Process',
    content: {
      en: 'Implementation',
      ru: 'Реализация'
    }
  },
  {
    id: 'process-step3-desc',
    key: 'process.step3.desc',
    section: 'Process',
    content: {
      en: 'Quick and efficient implementation of the selected solution',
      ru: 'Быстрая и эффективная реализация выбранного решения'
    }
  }
];

export const useSiteTexts = create<SiteTextsStore>()(
  persist(
    (set, get) => ({
      texts: initialTexts,
      isHydrated: false,
      setHydrated: (state) => {
          console.log(`[siteTextsService] Setting isHydrated to: ${state}`);
          set({ isHydrated: state });
      },
      
      addText: async (text: TextBlock) => {
        try {
          const { error } = await supabase
            .from('site_texts')
            .insert({
              key: text.key,
              value_en: text.content.en,
              value_ru: text.content.ru
            })
          
          if (error) throw error
          
          set({ texts: [...get().texts, text] })
          console.log('Text added successfully')
        } catch (error) {
          console.error('Error adding text:', error)
          throw error
        }
      },
      
      updateText: async (key: string, newText: TextBlock) => {
        try {
          const { error } = await supabase
            .from('site_texts')
            .update({
              key: newText.key,
              value_en: newText.content.en,
              value_ru: newText.content.ru
            })
            .eq('key', key)
          
          if (error) throw error
          
          set({
            texts: get().texts.map(text => 
              text.key === key ? newText : text
            )
          })
          console.log('Text updated successfully')
        } catch (error) {
          console.error('Error updating text:', error)
          throw error
        }
      },
      
      deleteText: async (key: string) => {
        try {
          const { error } = await supabase
            .from('site_texts')
            .delete()
            .eq('key', key)
          
          if (error) throw error
          
          set({
            texts: get().texts.filter(text => text.key !== key)
          })
          console.log('Text deleted successfully')
        } catch (error) {
          console.error('Error deleting text:', error)
          throw error
        }
      },
      
      getTextByKey: (key: string) => {
        const state = get();
        const text = state.texts.find((text) => text.key === key);
        return text || initialTexts.find((text) => text.key === key);
      },
      
      // Новая функция для очистки всех текстов от HTML-тегов
      cleanAllTextsFromHtml: () => {
        set((state) => {
          // Проверяем, есть ли тексты с HTML-тегами
          const hasHtmlTags = state.texts.some(text => 
            containsHtmlTags(text.content.en) || containsHtmlTags(text.content.ru)
          );
          
          // Если нет текстов с HTML-тегами, не делаем изменений
          if (!hasHtmlTags) return state;
          
          // Очищаем все тексты от HTML-тегов
          const cleanedTexts = state.texts.map(text => ({
            ...text,
            content: {
              en: containsHtmlTags(text.content.en) ? stripHtml(text.content.en) : text.content.en,
              ru: containsHtmlTags(text.content.ru) ? stripHtml(text.content.ru) : text.content.ru
            }
          }));
          
          return { texts: cleanedTexts };
        });
      },
      
      // Новая функция для сброса текстов к начальным значениям
      resetToInitial: () => {
        // Проверяем, есть ли недостающие ключи
        const currentKeys = new Set(get().texts.map(text => text.key));
        const missingTexts = initialTexts.filter(text => !currentKeys.has(text.key));
        
        if (missingTexts.length > 0) {
          // Добавляем только недостающие тексты
          set((state) => ({
            texts: [...state.texts, ...missingTexts]
          }));
          console.log(`Added ${missingTexts.length} missing text keys:`, missingTexts.map(t => t.key).join(', '));
        } else {
          console.log('No missing text keys found');
        }
      },

      syncWithDatabase: async () => {
        console.log('[siteTextsService] syncWithDatabase called.'); // Log start
        try {
          const { data, error } = await supabase
            .from('site_texts')
            .select('*');
          
          console.log('[siteTextsService] syncWithDatabase fetch completed. Error:', error, 'Data received:', !!data);

          if (error) {
            console.error('Error fetching site_texts:', error);
            throw error; // Throw error to be caught below
          }
          
          if (data) {
            const transformedTexts: TextBlock[] = data.map(item => ({
              id: item.key, // Use item.key as the id
              key: item.key,
              section: item.section || 'default', // Use section from DB if exists, otherwise default
              content: {
                en: item.value_en,
                ru: item.value_ru
              }
            }));
            
            set({ texts: transformedTexts });
            console.log('[siteTextsService] Texts state updated from database.');
          } else {
            console.warn('[siteTextsService] No data received from site_texts, keeping current state.');
          }
          // Set hydrated ONLY after successful sync OR if no data was returned but no error occurred
          get().setHydrated(true); 
        } catch (error) {
          console.error('[siteTextsService] Error during syncWithDatabase, falling back to initialTexts and setting hydrated.', error);
          // If sync fails, keep using initial texts AND mark as hydrated
          set({ texts: initialTexts });
          get().setHydrated(true); 
        }
      }
    }),
    {
      name: 'site-texts-storage',
      storage: createJSONStorage(() => localStorage),
      // Simpler onRehydrateStorage: just trigger sync after rehydration is done
      onRehydrateStorage: () => (state) => {
        console.log('[siteTextsService] Rehydration process finished. Triggering sync.');
        // We don't set hydrated here anymore, syncWithDatabase will do it.
        // We also don't need access to `state` directly here if sync handles everything.
        useSiteTexts.getState().syncWithDatabase(); // Trigger sync using the store's state
      },
      // Removed onHydrationError and the complex logic from previous attempt
    }
  )
);

// Initial fetch on load (outside the store definition)
// This ensures sync runs once when the module is loaded, regardless of component mounts
console.log('[siteTextsService] Module loaded. Triggering initial sync...');
useSiteTexts.getState().syncWithDatabase();

export class SiteTextsService {
  static async getSiteTexts() {
    const { data, error } = await supabase
      .from('site_texts')
      .select('*');
    
    if (error) throw error;
    return data;
  }

  static async getSiteText(key: string) {
    const { data, error } = await supabase
      .from('site_texts')
      .select('*')
      .eq('key', key)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateSiteText(key: string, valueEn: string, valueRu: string) {
    const { data, error } = await supabase
      .from('site_texts')
      .upsert({
        key,
        value_en: valueEn,
        value_ru: valueRu
      });
    
    if (error) throw error;
    return data;
  }

  static async createSiteText(key: string, valueEn: string, valueRu: string) {
    const { data, error } = await supabase
      .from('site_texts')
      .insert({
        key,
        value_en: valueEn,
        value_ru: valueRu
      });
    
    if (error) throw error;
    return data;
  }

  static async deleteSiteText(key: string) {
    const { data, error } = await supabase
      .from('site_texts')
      .delete()
      .eq('key', key);
    
    if (error) throw error;
    return data;
  }
} 