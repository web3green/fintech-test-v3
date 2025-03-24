
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { BlogPostHeader } from './blog/BlogPostHeader';
import { BlogPostImage } from './blog/BlogPostImage';
import { BlogPostContent } from './blog/BlogPostContent';
import { BlogPostReactions } from './blog/BlogPostReactions';
import { getLocalizedContent, getImageUrl } from '@/utils/blogUtils';

interface BlogPostDialogProps {
  post: any;
  isOpen: boolean;
  onClose: () => void;
}

export const BlogPostDialog = ({ post, isOpen, onClose }: BlogPostDialogProps) => {
  const { language } = useLanguage();
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

  // Function to handle user reactions
  const handleReaction = (reactionType: string) => {
    if (selectedReaction === reactionType) {
      setSelectedReaction(null);
      toast(`${language === 'en' ? 'Reaction removed' : 'Реакция удалена'}`);
    } else {
      setSelectedReaction(reactionType);
      
      let message = '';
      if (language === 'en') {
        if (reactionType === 'like') message = 'You found this article interesting';
        if (reactionType === 'dislike') message = 'You found this article not interesting';
        if (reactionType === 'useful') message = 'You found this article very useful';
      } else {
        if (reactionType === 'like') message = 'Вам показалось это интересным';
        if (reactionType === 'dislike') message = 'Вам показалось это неинтересным';
        if (reactionType === 'useful') message = 'Вы нашли это очень полезным';
      }
      
      toast(message);
    }
  };

  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <DialogTitle className="sr-only">{getLocalizedContent(post.title, language)}</DialogTitle>
        
        <BlogPostImage 
          post={post} 
          getLocalizedContent={(content) => getLocalizedContent(content, language)} 
          getImageUrl={getImageUrl}
          onClose={onClose}
          language={language}
        />
        
        <DialogHeader className="px-4 sm:px-6 pt-4 pb-0">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <BlogPostHeader 
              post={post} 
              getLocalizedContent={(content) => getLocalizedContent(content, language)} 
            />
          </div>
        </DialogHeader>
        
        <ScrollArea className="p-4 sm:p-6 max-h-[calc(90vh-180px)]">
          <BlogPostContent 
            language={language} 
            post={post}
            getLocalizedContent={(content) => getLocalizedContent(content, language)}
          />
          
          <BlogPostReactions 
            language={language} 
            selectedReaction={selectedReaction} 
            handleReaction={handleReaction} 
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
