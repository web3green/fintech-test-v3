import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Clock, Tag, ThumbsUp, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getReactionCounts } from '@/services/reactionsService';

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
  const [reactionCounts, setReactionCounts] = useState({ like: 0, useful: 0, dislike: 0 });
  
  useEffect(() => {
    // Загружаем количество реакций, если у статьи есть ID
    if (post && post.id) {
      const loadReactionCounts = async () => {
        try {
          const { counts } = await getReactionCounts(post.id);
          setReactionCounts(counts);
        } catch (error) {
          console.error('Error loading reaction counts:', error);
        }
      };
      
      loadReactionCounts();
    }
  }, [post]);
  
  const imageUrl = getImageUrl(post.image);
  const colorStyle = renderPostColor(post.colorScheme);
  
  return (
    <Card 
      className="h-full overflow-hidden group hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={() => handlePostClick(post)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={getLocalizedContent(post.title)} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className={`absolute bottom-0 left-0 right-0 h-1 ${colorStyle}`}></div>
      </div>
      
      <CardContent className="p-5">
        <div className="mb-2 flex items-center">
          <Badge variant="outline" className={`text-xs capitalize mr-2 ${colorStyle.split(' ')[0].replace('bg-', 'text-')}`}>
            {getLocalizedContent(post.category)}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {post.readingTime}
          </span>
        </div>
        
        <h3 className="text-lg font-medium mb-2 line-clamp-2 group-hover:text-fintech-blue transition-colors">
          {getLocalizedContent(post.title)}
        </h3>
        
        <p className="text-muted-foreground mb-4 text-sm line-clamp-3">
          {getLocalizedContent(post.excerpt)}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center space-x-2">
            {reactionCounts.like > 0 && (
              <Badge variant="outline" className="flex items-center gap-1 px-2">
                <ThumbsUp className="h-3 w-3 text-green-500" />
                <span>{reactionCounts.like}</span>
              </Badge>
            )}
            {reactionCounts.useful > 0 && (
              <Badge variant="outline" className="flex items-center gap-1 px-2">
                <Star className="h-3 w-3 text-blue-500" />
                <span>{reactionCounts.useful}</span>
              </Badge>
            )}
          </div>
          
          <Button variant="ghost" size="sm" className="p-0 h-auto">
            <span className="text-sm font-medium">
              {language === 'en' ? 'Read more' : 'Читать далее'}
            </span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
