
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Clock, Tag } from 'lucide-react';

interface BlogPostCardProps {
  post: any;
  getLocalizedContent: (content: any) => string;
  handlePostClick: (post: any) => void;
  renderPostColor: (colorScheme: string) => string;
  getImageUrl: (imageUrl: string) => string;
  language: string;
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({
  post,
  getLocalizedContent,
  handlePostClick,
  renderPostColor,
  getImageUrl,
  language
}) => {
  return (
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
          {post.tags.slice(0, 3).map((tag: string, index: number) => (
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
  );
};
