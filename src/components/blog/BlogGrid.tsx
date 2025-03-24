
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { Clock, ChevronRight, Tag } from 'lucide-react';

interface BlogGridProps {
  posts: any[];
  language: string;
  searchQuery: string;
  getLocalizedContent: (content: any) => string;
  getImageUrl: (imageUrl: string) => string;
  handlePostClick: (post: any) => void;
}

export const BlogGrid = ({ 
  posts, 
  language, 
  searchQuery, 
  getLocalizedContent, 
  getImageUrl, 
  handlePostClick 
}: BlogGridProps) => {
  
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

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-display font-bold mb-8">
            {searchQuery 
              ? (language === 'en' ? 'Search Results' : 'Результаты Поиска') 
              : (language === 'en' ? 'Latest Articles' : 'Последние Статьи')}
          </h2>
          
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">
                {language === 'en' 
                  ? `No articles found for "${searchQuery}"` 
                  : `Статьи не найдены по запросу "${searchQuery}"`}
              </p>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
              >
                {language === 'en' ? 'Clear Search' : 'Очистить Поиск'}
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map(post => (
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
            </>
          )}
        </div>
      </div>
    </section>
  );
};
