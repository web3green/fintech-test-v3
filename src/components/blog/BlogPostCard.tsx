import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Clock, Tag, ThumbsUp, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getReactionCounts } from '@/services/reactionsService';
import { BlogPost } from '@/services/databaseService';

interface BlogPostCardProps {
  post: BlogPost;
  getLocalizedContent: (post: BlogPost, fieldPrefix: 'title' | 'content' | 'excerpt' | 'category', language: string) => string;
  handlePostClick: (post: BlogPost) => void;
  renderPostColor: (colorScheme: string | null | undefined) => string;
  getImageUrl: (imageUrl: string | null | undefined) => string;
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  useEffect(() => {
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
  
  const imageUrl = getImageUrl(post.image_url);
  const colorStyle = renderPostColor(post.color_scheme);
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };
  
  return (
    <Card 
      className="h-full overflow-hidden group hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col"
      onClick={() => handlePostClick(post)}
    >
      <div className="relative h-48 overflow-hidden">
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg group-hover:opacity-90 transition-opacity duration-300">
          <img 
            src={imageUrl} 
            alt={getLocalizedContent(post, 'title', language)} 
            className={`object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500 ease-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} 
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
          />
          {!imageLoaded && !imageError && (
            <div className={`absolute bottom-0 left-0 right-0 h-1 ${colorStyle}`}></div>
          )}
        </div>
      </div>
      
      <CardContent className="p-5 flex flex-col flex-grow">
        <div className="mb-2 flex items-center">
          <Badge 
            variant="outline" 
            className={`text-xs capitalize mr-2 ${colorStyle}`} 
          >
            {getLocalizedContent(post, 'category', language)}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {post.reading_time}
          </span>
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2 line-clamp-2 group-hover:text-fintech-blue transition-colors">
            {getLocalizedContent(post, 'title', language)}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-3">
            {getLocalizedContent(post, 'excerpt', language)}
          </p>
        </div>
        
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
