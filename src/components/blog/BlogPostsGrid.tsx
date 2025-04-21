import React from 'react';
import { Button } from '@/components/ui/button';
import { BlogPostCard } from './BlogPostCard';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { BlogPost } from '@/services/databaseService';

interface BlogPostsGridProps {
  searchQuery: string;
  categoryFilter: string;
  currentPosts: BlogPost[];
  filteredPosts: BlogPost[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  getLocalizedContent: (post: BlogPost, fieldPrefix: 'title' | 'content' | 'excerpt' | 'category', language: string) => string;
  handlePostClick: (post: BlogPost) => void;
  renderPostColor: (colorScheme: string | null | undefined) => string;
  getImageUrl: (imageUrl: string | null | undefined) => string;
  language: string;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string) => void;
}

export const BlogPostsGrid: React.FC<BlogPostsGridProps> = ({
  searchQuery,
  categoryFilter,
  currentPosts,
  filteredPosts,
  currentPage,
  setCurrentPage,
  totalPages,
  getLocalizedContent,
  handlePostClick,
  renderPostColor,
  getImageUrl,
  language,
  setSearchQuery,
  setCategoryFilter
}) => {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-display font-bold mb-8">
            {searchQuery || categoryFilter !== 'all'
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
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                }}
              >
                {language === 'en' ? 'Clear Search' : 'Очистить Поиск'}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPosts.map(post => (
                <BlogPostCard
                  key={post.id}
                  post={post}
                  getLocalizedContent={getLocalizedContent}
                  handlePostClick={handlePostClick}
                  renderPostColor={renderPostColor}
                  getImageUrl={getImageUrl}
                  language={language}
                />
              ))}
            </div>
          )}
          
          {filteredPosts.length > 0 && totalPages > 1 && (
            <div className="mt-12">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} 
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink 
                        isActive={currentPage === index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className="cursor-pointer"
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
