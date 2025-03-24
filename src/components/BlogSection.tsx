import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, User, ArrowRight, Clock, Tag, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { BlogPostDialog } from './BlogPostDialog';
import { BlogSearchBar } from './blog/BlogSearchBar';

interface BlogSectionProps {
  expandedView?: boolean;
}

export const BlogSection = ({ expandedView = false }: BlogSectionProps) => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = expandedView ? 9 : 6;

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
        ru: 'Комплексное руковод��тво по номинальным услугам, включая преимущества, риски и нормативные соображения.'
      },
      image: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?ixlib=rb-4.0.3&auto=format&fit=crop',
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
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop',
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
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop',
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
      image: 'https://images.unsplash.com/photo-1618044733300-9472054094ee?ixlib=rb-4.0.3&auto=format&fit=crop',
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
        ru: 'Комплексный обзор регулирования криптовалютн��х бирж в различных юрисдикциях.'
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
      image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop',
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

  const handlePostClick = (post, e) => {
    e.stopPropagation();
    setSelectedPost(post);
    setIsDialogOpen(true);
  };

  const filteredPosts = posts.filter(post => {
    const titleMatch = getLocalizedContent(post.title).toLowerCase().includes(searchQuery.toLowerCase());
    const excerptMatch = getLocalizedContent(post.excerpt).toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch = categoryFilter === 'all' || getLocalizedContent(post.category).toLowerCase() === categoryFilter.toLowerCase();
    return (titleMatch || excerptMatch) && categoryMatch;
  });

  const categories = ['all', ...new Set(posts.map(post => getLocalizedContent(post.category).toLowerCase()))];

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter]);

  const getImageUrl = (imageUrl) => {
    if (imageUrl && imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop';
  };

  return (
    <section id="blog" className={`py-20 bg-white dark:bg-gray-900 ${expandedView ? 'min-h-screen' : ''}`}>
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            {language === 'en' ? 'Latest Insights & Resources' : 'Последние аналитические материалы'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Stay informed with our latest articles on international business, finance, and regulatory updates' 
              : 'Будьте в курсе последних статей о международном бизнесе, финансах и нормативных изменениях'}
          </p>
        </div>

        <BlogSearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          categories={categories}
          language={language}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {(expandedView ? currentPosts : filteredPosts.slice(0, 6)).map(post => (
            <Card 
              key={post.id} 
              className={`overflow-hidden border-0 shadow-md hover-scale transition-all duration-300 cursor-pointer ${renderPostColor(post.colorScheme)}`}
              onClick={(e) => handlePostClick(post, e)}
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

        {expandedView && filteredPosts.length > postsPerPage && (
          <Pagination className="my-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink 
                    isActive={currentPage === index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        {!expandedView && filteredPosts.length > 6 && (
          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="w-full space-y-8"
          >
            <div className="flex justify-center">
              <CollapsibleTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 border-dashed"
                >
                  {isOpen ? (
                    <>
                      {language === 'en' ? 'Show Less' : 'Показать меньше'}
                      <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      {language === 'en' ? 'Load More Articles' : 'Загрузить больше статей'}
                      <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.slice(6).map(post => (
                  <Card 
                    key={post.id} 
                    className={`overflow-hidden border-0 shadow-md hover-scale transition-all duration-300 cursor-pointer ${renderPostColor(post.colorScheme)}`}
                    onClick={(e) => handlePostClick(post, e)}
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
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
      
      <BlogPostDialog 
        post={selectedPost}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </section>
  );
};
