import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { BlogPostCard } from './BlogPostCard';
import { BlogPost } from '@/services/databaseService';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  const sectionRef = useRef<HTMLDivElement>(null);

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
        </div>
      </div>
    </section>
  );
};
