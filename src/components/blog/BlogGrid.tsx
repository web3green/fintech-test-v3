
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
import { BlogCard, BlogPost } from './BlogCard';

interface BlogGridProps {
  posts: BlogPost[];
  language: string;
  searchQuery: string;
  getLocalizedContent: (content: any) => string;
  getImageUrl: (imageUrl: string) => string;
  handlePostClick: (post: BlogPost) => void;
}

export const BlogGrid = ({ 
  posts, 
  language, 
  searchQuery, 
  getLocalizedContent, 
  getImageUrl, 
  handlePostClick 
}: BlogGridProps) => {
  
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
                  <BlogCard
                    key={post.id}
                    post={post}
                    language={language}
                    onClick={(post) => handlePostClick(post)}
                    getLocalizedContent={getLocalizedContent}
                    getImageUrl={getImageUrl}
                    showTags={true}
                  />
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
