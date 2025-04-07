import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, User, Calendar, Clock } from 'lucide-react';

interface FeaturedArticleProps {
  post: any;
  language: string;
  getLocalizedContent: (content: any) => string;
  getButtonStyle: (colorScheme: string) => string;
  handlePostClick: (post: any) => void;
  getImageUrl: (imageUrl: string) => string;
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
            className={`rounded-2xl overflow-hidden bg-${post.colorScheme === 'blue' ? 'fintech-blue' : post.colorScheme === 'orange' ? 'fintech-orange/80 dark:bg-fintech-orange/70' : 'gray-900'} text-white cursor-pointer hover:shadow-xl transition-shadow duration-300`}
            onClick={() => handlePostClick(post)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="relative">
                <div className="aspect-video bg-gray-200 dark:bg-gray-800 relative">
                  <img 
                    src={getImageUrl(post.image)} 
                    alt={getLocalizedContent(post.title)} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-white/20 backdrop-blur-sm mb-4">
                    {getLocalizedContent(post.category)}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">
                    {getLocalizedContent(post.title)}
                  </h3>
                  <p className="text-white/80 mb-6">
                    {getLocalizedContent(post.excerpt)}
                  </p>
                </div>
                <div>
                  <div className="flex items-center mb-6 text-sm text-white/70">
                    <User className="h-4 w-4 mr-1" />
                    <span className="mr-4">{post.author}</span>
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="mr-4">{post.date}</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{post.readingTime}</span>
                  </div>
                  <Button className={`${getButtonStyle(post.colorScheme)} shadow-lg`}>
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
