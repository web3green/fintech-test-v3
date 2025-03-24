import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Search, Calendar, User, ArrowRight, Clock, Tag, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BlogPostDialog } from '@/components/BlogPostDialog';

export default function Blog() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const posts = [
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
      colorScheme: 'blue' // blue theme
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
      colorScheme: 'orange' // orange theme
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
      image: 'https://images.unsplash.com/photo-1664575599736-c5197c684172',
      author: 'Michael Chen',
      date: 'March 10, 2025',
      category: {
        en: 'Nominee Services',
        ru: 'Номинальный сервис'
      },
      readingTime: '10 min',
      tags: ['nominee directors', 'nominee shareholders', 'business confidentiality', 'legal representation'],
      colorScheme: 'dark' // black/white theme
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
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85',
      author: 'Emma Williams',
      date: 'April 5, 2025',
      category: {
        en: 'Licensing',
        ru: 'Лицензирование'
      },
      readingTime: '12 min',
      tags: ['financial licenses', 'EMI license', 'regulatory compliance', 'financial institutions'],
      colorScheme: 'blue' // blue theme
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
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f',
      author: 'David Brown',
      date: 'May 12, 2025',
      category: {
        en: 'Taxation',
        ru: 'Налогообложение'
      },
      readingTime: '9 min',
      tags: ['tax optimization', 'international taxation', 'tax planning', 'corporate structure'],
      colorScheme: 'orange' // orange theme
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
      image: 'https://images.unsplash.com/photo-1618044733300-9472054094ee',
      author: 'Jessica Lee',
      date: 'June 18, 2025',
      category: {
        en: 'Fintech',
        ru: 'Финтех'
      },
      readingTime: '7 min',
      tags: ['fintech', 'digital payments', 'blockchain', 'cryptocurrency'],
      colorScheme: 'dark' // black/white theme
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
      image: 'https://images.unsplash.com/photo-1516245834210-c4c142787335',
      author: 'Robert Zhang',
      date: 'July 5, 2025',
      category: {
        en: 'Crypto Licensing',
        ru: 'Крипто-лицензирование'
      },
      readingTime: '11 min',
      tags: ['cryptocurrency', 'crypto exchange', 'regulations', 'compliance', 'bitcoin'],
      colorScheme: 'blue' // blue theme
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
      image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984',
      author: 'Thomas Wilson',
      date: 'August 15, 2025',
      category: {
        en: 'Corporate Restructuring',
        ru: 'Корпоративная реструктуризация'
      },
      readingTime: '10 min',
      tags: ['corporate restructuring', 'business optimization', 'reorganization', 'mergers and acquisitions'],
      colorScheme: 'orange' // orange theme
    }
  ];

  const getLocalizedContent = (content) => {
    if (typeof content === 'object') {
      return content[language] || content.en;
    }
    return content;
  };

  const filteredPosts = posts.filter(post => 
    getLocalizedContent(post.title).toLowerCase().includes(searchQuery.toLowerCase()) ||
    getLocalizedContent(post.category).toLowerCase().includes(searchQuery.toLowerCase()) ||
    getLocalizedContent(post.excerpt).toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const featuredPost = posts.find(post => post.featured);
  const regularPosts = posts.filter(post => !post.featured);

  const renderPostColor = (colorScheme) => {
    switch (colorScheme) {
      case 'blue':
        return 'bg-fintech-blue text-white';
      case 'orange':
        return 'bg-fintech-orange text-white';
      case 'dark':
        return 'bg-gray-900 text-white dark:bg-black';
      default:
        return 'bg-white text-gray-900 dark:bg-gray-800 dark:text-white';
    }
  };

  const getButtonStyle = (colorScheme) => {
    switch (colorScheme) {
      case 'blue':
        return 'bg-white text-fintech-blue hover:bg-gray-100';
      case 'orange':
        return 'bg-white text-fintech-orange hover:bg-gray-100';
      case 'dark':
        return 'bg-fintech-orange text-white hover:bg-fintech-orange-light';
      default:
        return 'bg-fintech-blue text-white hover:bg-fintech-blue-dark';
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setIsDialogOpen(true);
  };

  const getImageUrl = (imageUrl) => {
    if (imageUrl && imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-8 md:px-12 lg:px-16">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
                {language === 'en' ? 'Our Blog' : 'Наш Блог'}
              </h1>
              <p className="text-xl text-muted-foreground">
                {language === 'en' 
                  ? 'Insights, guides, and updates on international business and finance' 
                  : 'Аналитика, руководства и обновления о международном бизнесе и финансах'}
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-8 md:px-12 lg:px-16">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder={language === 'en' ? "Search articles..." : "Поиск статей..."}
                  className="pl-10 pr-4 py-2 rounded-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {featuredPost && searchQuery === '' && (
          <section className="py-12">
            <div className="container mx-auto px-8 md:px-12 lg:px-16">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-display font-bold mb-8">
                  {language === 'en' ? 'Featured Article' : 'Рекомендуемая Статья'}
                </h2>
                <div 
                  className={`rounded-2xl overflow-hidden ${renderPostColor(featuredPost.colorScheme)} cursor-pointer hover:shadow-xl transition-shadow duration-300`}
                  onClick={() => handlePostClick(featuredPost)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <div className="relative">
                      <div className="aspect-video bg-gray-200 dark:bg-gray-800 relative">
                        <img 
                          src={getImageUrl(featuredPost.image)} 
                          alt={getLocalizedContent(featuredPost.title)} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="p-8 md:p-12 flex flex-col justify-between">
                      <div>
                        <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-white/20 backdrop-blur-sm mb-4">
                          {getLocalizedContent(featuredPost.category)}
                        </div>
                        <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">
                          {getLocalizedContent(featuredPost.title)}
                        </h3>
                        <p className="text-white/80 mb-6">
                          {getLocalizedContent(featuredPost.excerpt)}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center mb-6 text-sm text-white/70">
                          <User className="h-4 w-4 mr-1" />
                          <span className="mr-4">{featuredPost.author}</span>
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className="mr-4">{featuredPost.date}</span>
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{featuredPost.readingTime}</span>
                        </div>
                        <Button className={`${getButtonStyle(featuredPost.colorScheme)} shadow-lg`}>
                          {language === 'en' ? 'Read Article' : 'Читать Статью'} <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-8 md:px-12 lg:px-16">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-display font-bold mb-8">
                {searchQuery 
                  ? (language === 'en' ? 'Search Results' : 'Результаты Поиска') 
                  : (language === 'en' ? 'Latest Articles' : 'Последние Статьи')}
              </h2>
              
              {filteredPosts.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-xl text-muted-foreground mb-4">
                    {language === 'en' 
                      ? `No articles found for "${searchQuery}"` 
                      : `Статьи не найдены по запросу "${searchQuery}"`}
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setSearchQuery('')}
                  >
                    {language === 'en' ? 'Clear Search' : 'Очистить Поиск'}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(searchQuery === '' ? regularPosts : filteredPosts).map(post => (
                    <Card 
                      key={post.id} 
                      className={`overflow-hidden border-0 shadow-md hover-scale transition-all duration-300 cursor-pointer ${renderPostColor(post.colorScheme)}`}
                      onClick={() => handlePostClick(post)}
                    >
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={getImageUrl(post.image)} 
                          alt={getLocalizedContent(post.title)} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-white/20 backdrop-blur-sm mb-4">
                          {getLocalizedContent(post.category)}
                        </div>
                        <h3 className="text-xl font-display font-bold mb-3">{getLocalizedContent(post.title)}</h3>
                        <p className="mb-6 opacity-80 line-clamp-2">
                          {getLocalizedContent(post.excerpt)}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="text-xs opacity-70 flex items-center">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm opacity-70">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{post.readingTime}</span>
                          </div>
                          <Button variant="ghost" size="sm" className="opacity-90 hover:opacity-100 group">
                            {language === 'en' ? 'Read More' : 'Подробнее'}
                            <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              {filteredPosts.length > 0 && (
                <div className="mt-12">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive>1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">2</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-8 md:px-12 lg:px-16">
            <div className="max-w-4xl mx-auto bg-fintech-blue text-white dark:bg-fintech-blue-dark rounded-2xl p-8 md:p-12 shadow-lg relative overflow-hidden">
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-fintech-blue-dark/20"></div>
                <GlowingEffect 
                  blur={10} 
                  spread={40} 
                  glow={true} 
                  disabled={false} 
                  inactiveZone={0.2}
                  proximity={100}
                />
              </div>
              <div className="relative z-10 text-center">
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
                  {language === 'en' ? 'Stay Updated' : 'Будьте в курсе'}
                </h2>
                <p className="text-white/80 mb-8 max-w-2xl mx-auto">
                  {language === 'en' 
                    ? 'Subscribe to our newsletter to receive the latest insights and updates on international business and finance.' 
                    : 'Подпишитесь на нашу рассылку, чтобы получать последние аналитические данные и обновления о международном бизнесе и финансах.'}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <Input 
                    type="email" 
                    placeholder={language === 'en' ? "Your email address" : "Ваш email адрес"} 
                    className="w-full sm:w-64 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                  <Button className="bg-white text-fintech-blue hover:bg-gray-100 w-full sm:w-auto">
                    {language === 'en' ? 'Subscribe' : 'Подписаться'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      
      <BlogPostDialog 
        post={selectedPost}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}
