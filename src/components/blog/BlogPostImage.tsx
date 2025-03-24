
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlogPostImageProps {
  post: any;
  getLocalizedContent: (content: any) => string;
  getImageUrl: (imageUrl: string) => string;
  onClose: () => void;
  language: string;
}

export const BlogPostImage = ({ 
  post, 
  getLocalizedContent, 
  getImageUrl, 
  onClose, 
  language 
}: BlogPostImageProps) => {
  if (!post) return null;

  const postImage = getImageUrl(post.image);

  return (
    <div className="relative h-16 sm:h-24 md:h-32 overflow-hidden">
      <img 
        src={postImage} 
        alt={getLocalizedContent(post.title)} 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
        <div className="p-4 sm:p-6">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-white/20 backdrop-blur-sm mb-2 sm:mb-4">
            {getLocalizedContent(post.category)}
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white">
            {getLocalizedContent(post.title)}
          </h2>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute right-4 top-4 rounded-full bg-black/20 backdrop-blur-sm text-white z-10 hover:bg-black/40"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">{language === 'en' ? 'Close' : 'Закрыть'}</span>
      </Button>
    </div>
  );
};
