
import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { BlogCard } from './BlogCard';

interface LoadMoreButtonProps {
  isOpen: boolean;
  language: string;
  additionalPosts: any[];
  getLocalizedContent: (content: any) => string;
  getImageUrl: (url: string) => string;
  handlePostClick: (post: any, e: React.MouseEvent) => void;
}

export const LoadMoreButton = ({
  isOpen,
  language,
  additionalPosts,
  getLocalizedContent,
  getImageUrl,
  handlePostClick
}: LoadMoreButtonProps) => {
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={(open) => isOpen = open}
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
          {additionalPosts.map(post => (
            <BlogCard
              key={post.id}
              post={post}
              colorScheme={post.colorScheme}
              language={language}
              onClick={handlePostClick}
              getLocalizedContent={getLocalizedContent}
              getImageUrl={getImageUrl}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
