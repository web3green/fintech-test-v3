
export const blogPosts = [
  {
    id: 1,
    title: {
      en: 'Guide to Offshore Company Registration in 2025',
      ru: 'Руководство по регистрации оффшорных компаний в 2025 году'
    },
    excerpt: {
      en: 'Learn about the benefits, procedures, and considerations for registering an offshore company in today\'s global business environment.',
      ru: 'Узнайте о преимуществах, процедурах и особенностях регистрации оффшорной компании в современной глобальной бизнес-среде.'
    },
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop',
    author: 'Alex Morgan',
    date: 'January 15, 2025',
    category: {
      en: 'Company Registration',
      ru: 'Регистрация компаний'
    },
    readingTime: '8 min',
    tags: ['offshore', 'company registration', 'international business', 'tax optimization'],
    featured: true,
    colorScheme: 'blue' as 'blue' // explicitly type as the union type
  },
  {
    id: 2,
    title: {
      en: 'Banking Options for International Businesses',
      ru: 'Банковские решения для международного бизнеса'
    },
    excerpt: {
      en: 'Explore the best banking solutions for international businesses, from traditional banks to modern fintech platforms.',
      ru: 'Исследуйте лучшие банковские решения для международного бизнеса, от традиционных банков до современных финтех-платформ.'
    },
    image: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?ixlib=rb-4.0.3&auto=format&fit=crop',
    author: 'Sarah Johnson',
    date: 'February 22, 2025',
    category: {
      en: 'Banking',
      ru: 'Банковские услуги'
    },
    readingTime: '6 min',
    tags: ['international banking', 'business accounts', 'fintech', 'payment solutions'],
    colorScheme: 'orange' as 'orange' // explicitly type as the union type
  },
  {
    id: 3,
    title: {
      en: 'Understanding Nominee Services for Your Business',
      ru: 'Понимание номинального сервиса для вашего бизнеса'
    },
    excerpt: {
      en: 'A comprehensive guide to nominee services, including benefits, risks, and regulatory considerations.',
      ru: 'Комплексное руководство по номинальным услугам, включая преимущества, риски и нормативные соображения.'
    },
    image: 'https://images.unsplash.com/photo-1664575599736-c5197c684172?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    author: 'Michael Chen',
    date: 'March 10, 2025',
    category: {
      en: 'Nominee Services',
      ru: 'Номинальный сервис'
    },
    readingTime: '10 min',
    tags: ['nominee directors', 'nominee shareholders', 'business confidentiality', 'legal representation'],
    colorScheme: 'dark' as 'dark' // explicitly type as the union type
  },
  {
    id: 4,
    title: {
      en: 'The Complete Guide to Financial Licensing',
      ru: 'Полное руководство по финансовому лицензированию'
    },
    excerpt: {
      en: 'Everything you need to know about obtaining financial licenses in different jurisdictions around the world.',
      ru: 'Все, что вам нужно знать о получении финансовых лицензий в различных юрисдикциях по всему миру.'
    },
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop',
    author: 'Emma Williams',
    date: 'April 5, 2025',
    category: {
      en: 'Licensing',
      ru: 'Лицензирование'
    },
    readingTime: '12 min',
    tags: ['financial licenses', 'EMI license', 'regulatory compliance', 'financial institutions'],
    colorScheme: 'blue' as 'blue' // explicitly type as the union type
  },
  {
    id: 5,
    title: {
      en: 'Tax Optimization Strategies for Global Businesses',
      ru: 'Стратегии налоговой оптимизации для глобального бизнеса'
    },
    excerpt: {
      en: 'Legal and effective strategies to optimize your tax structure when operating internationally.',
      ru: 'Законные и эффективные стратегии оптимизации налоговой структуры при ведении международного бизнеса.'
    },
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop',
    author: 'David Brown',
    date: 'May 12, 2025',
    category: {
      en: 'Taxation',
      ru: 'Налогообложение'
    },
    readingTime: '9 min',
    tags: ['tax optimization', 'international taxation', 'tax planning', 'corporate structure'],
    colorScheme: 'orange' as 'orange' // explicitly type as the union type
  },
  {
    id: 6,
    title: {
      en: 'Emerging Fintech Trends in 2025',
      ru: 'Новые тенденции финтеха в 2025 году'
    },
    excerpt: {
      en: 'Explore the latest financial technology trends that are reshaping the global business landscape.',
      ru: 'Изучите последние тенденции финансовых технологий, которые меняют глобальный бизнес-ландшафт.'
    },
    image: 'https://images.unsplash.com/photo-1618044733300-9472054094ee?ixlib=rb-4.0.3&auto=format&fit=crop',
    author: 'Jessica Lee',
    date: 'June 18, 2025',
    category: {
      en: 'Fintech',
      ru: 'Финтех'
    },
    readingTime: '7 min',
    tags: ['fintech', 'digital payments', 'blockchain', 'cryptocurrency'],
    colorScheme: 'dark' as 'dark' // explicitly type as the union type
  },
  {
    id: 7,
    title: {
      en: 'Cryptocurrency Exchange Regulations Worldwide',
      ru: 'Регулирование криптовалютных бирж по всему миру'
    },
    excerpt: {
      en: 'A comprehensive overview of cryptocurrency exchange regulations across different jurisdictions.',
      ru: 'Комплексный обзор регулирования криптовалютных бирж в различных юрисдикциях.'
    },
    image: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?ixlib=rb-4.0.3&auto=format&fit=crop',
    author: 'Robert Zhang',
    date: 'July 5, 2025',
    category: {
      en: 'Crypto Licensing',
      ru: 'Крипто-лицензирование'
    },
    readingTime: '11 min',
    tags: ['cryptocurrency', 'crypto exchange', 'regulations', 'compliance', 'bitcoin'],
    colorScheme: 'blue' as 'blue' // explicitly type as the union type
  },
  {
    id: 8,
    title: {
      en: 'Corporate Restructuring: When and How to Do It Right',
      ru: 'Корпоративная реструктуризация: когда и как делать это правильно'
    },
    excerpt: {
      en: 'Learn about the strategic approaches to corporate restructuring that maximize efficiency and minimize risks.',
      ru: 'Узнайте о стратегических подходах к корпоративной реструктуризации, которые максимизируют эффективность и минимизируют риски.'
    },
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop',
    author: 'Thomas Wilson',
    date: 'August 15, 2025',
    category: {
      en: 'Corporate Restructuring',
      ru: 'Корпоративная реструктуризация'
    },
    readingTime: '10 min',
    tags: ['corporate restructuring', 'business optimization', 'reorganization', 'mergers and acquisitions'],
    colorScheme: 'orange' as 'orange' // explicitly type as the union type
  }
];
