-- Создаем таблицу для текстов сайта
CREATE TABLE IF NOT EXISTS public.site_texts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    section TEXT,
    value_en TEXT NOT NULL,
    value_ru TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Добавляем комментарии к таблице и столбцам (опционально, но полезно)
COMMENT ON TABLE public.site_texts IS 'Хранилище текстовых блоков для сайта';
COMMENT ON COLUMN public.site_texts.key IS 'Уникальный ключ текстового блока (например, hero.title)';
COMMENT ON COLUMN public.site_texts.section IS 'Раздел сайта, к которому относится текст (для группировки в админке)';
COMMENT ON COLUMN public.site_texts.value_en IS 'Текст на английском языке';
COMMENT ON COLUMN public.site_texts.value_ru IS 'Текст на русском языке';

-- Включаем Row Level Security (если планируется использовать)
ALTER TABLE public.site_texts ENABLE ROW LEVEL SECURITY;

-- Политики RLS (примеры, можно настроить по необходимости)
-- Позволяем всем читать тексты
CREATE POLICY "Allow public read access" ON public.site_texts FOR SELECT USING (true);
-- Позволяем аутентифицированным пользователям (например, админам) изменять тексты
CREATE POLICY "Allow authenticated users to modify" ON public.site_texts FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Триггер для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.site_texts
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Добавляем начальные тексты сайта
INSERT INTO public.site_texts (key, section, value_en, value_ru) VALUES
('hero.title', 'Home Page', 'Financial Solutions for Your Business', 'Финансовые решения для вашего бизнеса'),
('hero.subtitle', 'Home Page', 'Open accounts and get licenses with ease', 'Открывайте счета и получайте лицензии легко'),
('hero.companyTagline', 'Home Page', 'Your Trusted Financial Partner', 'Ваш надежный финансовый партнер'),
('hero.category.fintech', 'Home Page', 'FinTech', 'ФинТех'),
('hero.category.ecommerce', 'Home Page', 'E-commerce', 'E-commerce'),
('hero.category.blockchain', 'Home Page', 'Blockchain', 'Блокчейн'),
('hero.category.startups', 'Home Page', 'Startups', 'Стартапы'),
('hero.category.neobanks', 'Home Page', 'Neobanks', 'Необанки'),
('hero.category.wallets', 'Home Page', 'Wallets', 'Кошельки'),
('hero.category.gaming', 'Home Page', 'Gaming', 'Гейминг'),
('hero.category.saas', 'Home Page', 'SaaS', 'SaaS'),
('hero.category.edtech', 'Home Page', 'EdTech', 'EdTech'),
('hero.category.web3', 'Home Page', 'Web3', 'Web3'),
('hero.category.crypto', 'Home Page', 'Crypto', 'Крипто'),
('hero.card.banking.title', 'Home Page', 'Banking Solutions', 'Банковские решения'),
('hero.card.banking.subtitle', 'Home Page', 'Open accounts worldwide', 'Открытие счетов по всему миру'),
('hero.card.licenses.title', 'Home Page', 'Available Licenses', 'Доступные лицензии'),
('hero.license.emi', 'Home Page', 'EMI', 'EMI'),
('hero.license.crypto', 'Home Page', 'Crypto', 'Крипто'),
('hero.license.igaming', 'Home Page', 'iGaming', 'iGaming'),
('hero.license.psp', 'Home Page', 'PSP', 'PSP'),
('hero.license.gambling', 'Home Page', 'Gambling', 'Гемблинг'),
('hero.license.emoney', 'Home Page', 'E-money', 'Электронные деньги'),
('hero.card.jurisdictions.title', 'Home Page', 'Jurisdictions & Compliance', 'Юрисдикции и комплаенс'),
('hero.jurisdiction.mga', 'Home Page', 'MGA', 'MGA'),
('hero.jurisdiction.curacao', 'Home Page', 'Curacao', 'Кюрасао'),
('hero.jurisdiction.fca', 'Home Page', 'FCA', 'FCA'),
('hero.jurisdiction.aml', 'Home Page', 'AML', 'AML'),
('hero.jurisdiction.compliance', 'Home Page', 'Compliance', 'Комплаенс'),
('hero.stats.countries', 'Home Page', '50+ Countries', '50+ Стран'),
('hero.stats.clients', 'Home Page', '200+ Clients', '200+ Клиентов'),
('hero.stats.years', 'Home Page', '10+ Years', '10+ Лет'),
('cta.consultation', 'Common', 'Get Free Consultation', 'Получить консультацию'),
('nav.about', 'Navigation', 'About Us', 'О нас'),
('nav.services', 'Navigation', 'Services', 'Услуги'),
('nav.howItWorks', 'Navigation', 'How It Works', 'Как это работает'),
('nav.blog', 'Navigation', 'Blog', 'Блог'),
('nav.contact', 'Navigation', 'Contact', 'Контакты'),
('cta.getStarted', 'Common', 'Get Consultation', 'Получить консультацию'),
('footer.links', 'Footer', 'Quick Links', 'Быстрые ссылки'),
('footer.contact', 'Footer', 'Contact Us', 'Свяжитесь с нами'),
('footer.rights', 'Footer', 'All rights reserved', 'Все права защищены'),
('footer.privacy', 'Footer', 'Privacy Policy', 'Политика конфиденциальности'),
('footer.terms', 'Footer', 'Terms of Service', 'Условия использования'),
('footer.backToTop', 'Footer', 'Back to Top', 'Наверх'),
('footer.description', 'Footer', 'We provide business registration services, banking solutions, and licensing across multiple jurisdictions. Our team of experts helps businesses legally operate in international markets.', 'Мы предоставляем услуги регистрации бизнеса, банковские решения и лицензирование в различных юрисдикциях. Наша команда экспертов помогает бизнесу легально работать на международных рынках.'),
('footer.services', 'Footer', 'Our Services', 'Наши услуги'),
('about.title', 'About Us', 'About Our Company', 'О нашей компании'),
('about.description', 'About Us', 'We help businesses navigate the complex world of international finance', 'Мы помогаем бизнесу ориентироваться в сложном мире международных финансов'),
('services.title', 'Services', 'Our Services', 'Наши услуги'),
('contact.title', 'Contact', 'Get in Touch', 'Свяжитесь с нами'),
('contact.subtitle', 'Contact', 'Have questions? We''re here to help you with any inquiries about our services', 'Есть вопросы? Мы здесь, чтобы помочь вам с любыми запросами о наших услугах'),
('contact.email', 'Contact', 'Email', 'Электронная почта'),
('contact.phone', 'Contact', 'WhatsApp', 'WhatsApp'),
('contact.telegram', 'Contact', 'Telegram', 'Телеграм'),
('contact.form.title', 'Contact', 'Request a Consultation', 'Запросить консультацию'),
('contact.form.name', 'Contact', 'Your Name', 'Ваше имя'),
('contact.form.email', 'Contact', 'Your Email', 'Ваша почта'),
('contact.form.phone', 'Contact', 'Phone Number', 'Номер телефона'),
('contact.form.service', 'Contact', 'Service of Interest', 'Интересующая услуга'),
('contact.form.message', 'Contact', 'Your Message', 'Ваше сообщение'),
('contact.form.select', 'Contact', 'Select a service', 'Выберите услугу'),
('contact.form.submit', 'Contact', 'Send Request', 'Отправить запрос'),
('contact.form.sending', 'Contact', 'Sending...', 'Отправка...'),
('contact.service.registration', 'Contact', 'Company Registration', 'Регистрация компании'),
('contact.service.accounts', 'Contact', 'Bank Accounts', 'Банковские счета'),
('contact.service.nominee', 'Contact', 'Nominee Services', 'Номинальные услуги'),
('contact.service.licenses', 'Contact', 'Licensing', 'Лицензирование'),
('contact.service.other', 'Contact', 'Other Services', 'Другие услуги'),
('contact.instant.title', 'Contact', 'Need Immediate Assistance?', 'Нужна срочная помощь?'),
('contact.instant.subtitle', 'Contact', 'Get instant support through our Telegram channel. Our experts are ready to help you 24/7.', 'Получите мгновенную поддержку через наш Telegram канал. Наши эксперты готовы помочь вам 24/7.'),
('contact.instant.button', 'Contact', 'Chat on Telegram', 'Чат в Telegram'),
('contact.ourSocials', 'Contact', 'Our Contacts', 'Наши контакты'),
('services.badge', 'Services', 'Our Services', 'Наши услуги'),
('services.title', 'Services', 'Comprehensive Financial Solutions', 'Комплексные финансовые решения'),
('services.subtitle', 'Services', 'We provide a wide range of services to help your business succeed in the global financial market', 'Мы предоставляем широкий спектр услуг для успеха вашего бизнеса на мировом финансовом рынке'),
('services.company-formation.title', 'Services', 'Company Formation', 'Регистрация компаний'),
('services.company-formation.short', 'Services', 'Quick and efficient company registration in multiple jurisdictions', 'Быстрая и эффективная регистрация компаний в различных юрисдикциях'),
('services.company-formation.details', 'Services', 'We help you establish your business presence globally with our comprehensive company formation services, handling all legal requirements and documentation.', 'Мы помогаем вам создать глобальное присутствие вашего бизнеса с помощью наших комплексных услуг по регистрации компаний, обрабатывая все юридические требования и документацию.'),
('services.financial-licensing.title', 'Services', 'Financial Licensing', 'Финансовое лицензирование'),
('services.financial-licensing.short', 'Services', 'Obtain necessary licenses for financial operations', 'Получение необходимых лицензий для финансовых операций'),
('services.financial-licensing.details', 'Services', 'Navigate the complex world of financial regulations with our licensing services. We help you obtain and maintain all necessary permits and licenses.', 'Ориентируйтесь в сложном мире финансовых правил с нашими услугами лицензирования. Мы помогаем получить и поддерживать все необходимые разрешения и лицензии.'),
('services.crypto-regulation.title', 'Services', 'Crypto Regulation', 'Регулирование криптовалют'),
('services.crypto-regulation.short', 'Services', 'Regulatory compliance for cryptocurrency businesses', 'Соответствие нормативным требованиям для криптовалютного бизнеса'),
('services.crypto-regulation.details', 'Services', 'Stay compliant in the evolving cryptocurrency landscape with our specialized regulatory services for digital asset businesses.', 'Оставайтесь в соответствии с развивающимся криптовалютным ландшафтом с нашими специализированными услугами регулирования для бизнеса цифровых активов.'),
('services.gambling-licensing.title', 'Services', 'Gambling Licensing', 'Лицензирование гемблинга'),
('services.gambling-licensing.short', 'Services', 'Gaming and betting license acquisition', 'Получение лицензий для игорного бизнеса'),
('services.gambling-licensing.details', 'Services', 'Get your gaming operation licensed in major jurisdictions with our comprehensive gambling licensing services.', 'Получите лицензию для вашего игорного бизнеса в основных юрисдикциях с нашими комплексными услугами лицензирования.'),
('services.payment-solutions.title', 'Services', 'Payment Solutions', 'Платёжные решения'),
('services.payment-solutions.short', 'Services', 'Global payment processing solutions', 'Глобальные решения для обработки платежей'),
('services.payment-solutions.details', 'Services', 'Implement secure and efficient payment processing solutions for your business with our comprehensive payment services.', 'Внедрите безопасные и эффективные решения для обработки платежей для вашего бизнеса с нашими комплексными платежными услугами.'),
('services.fiat-crypto.title', 'Services', 'Fiat & Crypto', 'Фиат и крипто'),
('services.fiat-crypto.short', 'Services', 'Integrated fiat and cryptocurrency solutions', 'Интегрированные решения для фиатных и криптовалют'),
('services.fiat-crypto.details', 'Services', 'Bridge the gap between traditional and digital finance with our integrated fiat and cryptocurrency solutions.', 'Преодолейте разрыв между традиционными и цифровыми финансами с нашими интегрированными решениями для фиатных и криптовалют.'),
('services.tax-planning.title', 'Services', 'Tax Planning', 'Налоговое планирование'),
('services.tax-planning.short', 'Services', 'Optimize your tax structure globally', 'Оптимизация налоговой структуры в глобальном масштабе'),
('services.tax-planning.details', 'Services', 'Maximize efficiency and minimize tax burden with our expert international tax planning services.', 'Максимизируйте эффективность и минимизируйте налоговую нагрузку с нашими экспертными услугами международного налогового планирования.'),
('services.investment.title', 'Services', 'Investment Solutions', 'Инвестиционные решения'),
('services.investment.short', 'Services', 'Strategic investment planning and management', 'Стратегическое планирование и управление инвестициями'),
('services.investment.details', 'Services', 'Grow your wealth with our professional investment solutions and expert portfolio management.', 'Приумножайте ваше богатство с нашими профессиональными инвестиционными решениями и экспертным управлением портфелем.'),
('services.nominee.title', 'Services', 'Nominee Services', 'Номинальные услуги'),
('services.nominee.short', 'Services', 'Professional nominee director services', 'Профессиональные услуги номинальных директоров'),
('services.nominee.details', 'Services', 'Maintain privacy and compliance with our professional nominee director and shareholder services.', 'Сохраняйте конфиденциальность и соответствие требованиям с нашими профессиональными услугами номинальных директоров и акционеров.'),
('cta.request', 'Common', 'Request Service', 'Заказать услугу'),
('process.badge', 'Process', 'How It Works', 'Как это работает'),
('process.title', 'Process', 'Simple Process, Quick Results', 'Простой процесс, быстрый результат'),
('process.subtitle', 'Process', 'Get your business up and running with our streamlined process', 'Запустите свой бизнес с помощью нашего оптимизированного процесса'),
('process.step1', 'Process', 'Initial Consultation', 'Первичная консультация'),
('process.step1.desc', 'Process', 'Schedule a free consultation to discuss your business needs and goals', 'Запланируйте бесплатную консультацию для обсуждения потребностей и целей вашего бизнеса'),
('process.step2', 'Process', 'Solution Development', 'Разработка решения'),
('process.step2.desc', 'Process', 'We create a tailored solution based on your specific requirements', 'Мы создаем индивидуальное решение на основе ваших конкретных требований'),
('process.step3', 'Process', 'Implementation', 'Реализация'),
('process.step3.desc', 'Process', 'Quick and efficient implementation of the selected solution', 'Быстрая и эффективная реализация выбранного решения')
ON CONFLICT (key) DO NOTHING; -- Добавляем это, чтобы избежать ошибок, если какие-то ключи уже существуют