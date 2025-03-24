
import React from 'react';
import { ThumbsUp, ThumbsDown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlogPostReactionsProps {
  language: string;
  selectedReaction: string | null;
  handleReaction: (reactionType: string) => void;
}

export const BlogPostReactions = ({ 
  language, 
  selectedReaction, 
  handleReaction 
}: BlogPostReactionsProps) => {
  return (
    <div className="pt-6 border-t">
      <h4 className="text-lg font-medium mb-4">
        {language === 'en' ? 'Share your thoughts about this article:' : 'Поделитесь своим мнением об этой статье:'}
      </h4>
      <div className="flex flex-wrap gap-3">
        <Button 
          variant={selectedReaction === 'like' ? 'default' : 'outline'} 
          size="sm"
          className={selectedReaction === 'like' ? 'bg-green-500 hover:bg-green-600' : ''}
          onClick={() => handleReaction('like')}
        >
          <ThumbsUp className="h-4 w-4 mr-2" />
          {language === 'en' ? 'Interesting' : 'Интересно'}
        </Button>
        <Button 
          variant={selectedReaction === 'dislike' ? 'default' : 'outline'} 
          size="sm"
          className={selectedReaction === 'dislike' ? 'bg-red-500 hover:bg-red-600' : ''}
          onClick={() => handleReaction('dislike')}
        >
          <ThumbsDown className="h-4 w-4 mr-2" />
          {language === 'en' ? 'Not Interesting' : 'Не интересно'}
        </Button>
        <Button 
          variant={selectedReaction === 'useful' ? 'default' : 'outline'} 
          size="sm"
          className={selectedReaction === 'useful' ? 'bg-blue-500 hover:bg-blue-600' : ''}
          onClick={() => handleReaction('useful')}
        >
          <Star className="h-4 w-4 mr-2" />
          {language === 'en' ? 'Very Useful' : 'Очень полезно'}
        </Button>
      </div>
    </div>
  );
};
