
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, ChevronRight } from 'lucide-react';

interface BlogCardProps {
  post: any;
  colorScheme: string;
  language: string;
  onClick: (post: any, e: React.MouseEvent) => void;
  getLocalizedContent: (content: any) => string;
  getImageUrl: (url: string) => string;
}

export const BlogCard = ({ 
  post, 
  colorScheme, 
  language, 
  onClick, 
  getLocalizedContent,
  getImageUrl 
}: BlogCardProps) => {
  const renderPostColor = (scheme: string) => {
    switch (scheme) {
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
    <Card 
      className={`overflow-hidden border-0 shadow-md hover-scale transition-all duration-300 cursor-pointer ${renderPostColor(colorScheme)}`}
      onClick={(e) => onClick(post, e)}
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
  );
};
