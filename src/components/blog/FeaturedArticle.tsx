import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, User, Calendar, Clock } from 'lucide-react';
import { BlogPost } from '@/services/databaseService';

interface FeaturedArticleProps {
  post: BlogPost;
  language: string;
  getLocalizedContent: (post: BlogPost, fieldPrefix: 'title' | 'content' | 'excerpt' | 'category', language: string) => string;
  getButtonStyle: (colorScheme: string | null | undefined) => string;
  handlePostClick: (post: BlogPost) => void;
  getImageUrl: (imageUrl: string | null | undefined) => string;
}

export const FeaturedArticle: React.FC<FeaturedArticleProps> = ({
  post,
  language,
  getLocalizedContent,
  getButtonStyle,
  handlePostClick,
  getImageUrl
}) => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-display font-bold mb-8">
            {language === 'en' ? 'Featured Article' : 'Рекомендуемая Статья'}
          </h2>
          <div 
            className={`rounded-2xl overflow-hidden ${
              post.color_scheme === 'blue' 
                ? 'bg-fintech-blue' 
                : post.color_scheme === 'orange' 
                  ? 'bg-fintech-orange/80 dark:bg-gradient-to-br dark:from-blue-900/40 dark:via-fintech-orange/30 dark:to-blue-950/60 dark:backdrop-blur-sm dark:border dark:border-white/5' 
                  : 'bg-gray-900'
            } text-white cursor-pointer hover:shadow-xl transition-shadow duration-300`}
            onClick={() => handlePostClick(post)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="relative">
                <div className="aspect-video bg-gray-200 dark:bg-gray-800 relative">
                  <img 
                    src={getImageUrl(post.image_url)} 
                    alt={getLocalizedContent(post, 'title', language)} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-white/20 backdrop-blur-sm mb-4">
                    {getLocalizedContent(post, 'category', language)}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display font-bold mb-4 text-white/90">
                    {getLocalizedContent(post, 'title', language)}
                  </h3>
                  <p className="text-white/80 mb-6">
                    {getLocalizedContent(post, 'excerpt', language)}
                  </p>
                </div>
                <div>
                  <div className="flex items-center mb-6 text-sm text-white/70">
                    <User className="h-4 w-4 mr-1" />
                    <span className="mr-4">{post.author}</span>
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="mr-4">{new Date(post.created_at).toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US')}</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{post.reading_time}</span>
                  </div>
                  <Button className={`${getButtonStyle(post.color_scheme)} shadow-lg hover:shadow-xl transition-shadow duration-300`}>
                    {language === 'en' ? 'Read Article' : 'Читать Статью'} <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
