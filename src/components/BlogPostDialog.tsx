import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, User, Clock, ThumbsUp, ThumbsDown, Star, X } from 'lucide-react';
import { toast } from 'sonner';
import { getLocalizedContent } from '@/services/blogService';
import { BlogPost } from '@/services/databaseService';
import { toggleReaction, getReactionCounts, getUserReactions } from '@/services/reactionsService';
import { Badge } from '@/components/ui/badge';

interface BlogPostDialogProps {
  post: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BlogPostDialog = ({ post, isOpen, onClose }: BlogPostDialogProps) => {
  const { language } = useLanguage();
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [reactionCounts, setReactionCounts] = useState({ like: 0, dislike: 0, useful: 0 });
  const [isLoading, setIsLoading] = useState(false);

  // Загружаем реакции при открытии диалога
  useEffect(() => {
    if (isOpen && post && post.id) {
      loadReactions();
    }
  }, [isOpen, post]);

  // Функция для загрузки реакций и установки начального состояния
  const loadReactions = async () => {
    if (!post || !post.id) return;

    try {
      // Получаем количество реакций
      const { counts } = await getReactionCounts(post.id);
      setReactionCounts(counts);
      
      // Получаем реакции текущего пользователя
      const { reactions } = await getUserReactions(post.id);
      
      // Устанавливаем выбранную реакцию
      if (reactions.like) setSelectedReaction('like');
      else if (reactions.dislike) setSelectedReaction('dislike');
      else if (reactions.useful) setSelectedReaction('useful');
      else setSelectedReaction(null);
    } catch (error) {
      console.error('Error loading reactions:', error);
    }
  };

  // Function to handle user reactions
  const handleReaction = async (reactionType: string) => {
    if (!post || !post.id) return;
    
    setIsLoading(true);
    try {
      const result = await toggleReaction(post.id, reactionType);
      
      if (result.success) {
        if (result.action === 'removed') {
          setSelectedReaction(null);
          // Уменьшаем счетчик
          setReactionCounts(prev => ({
            ...prev,
            [reactionType]: Math.max(0, prev[reactionType as keyof typeof prev] - 1)
          }));
          toast(`${language === 'en' ? 'Reaction removed' : 'Реакция удалена'}`);
        } else {
          // Если была другая реакция, сначала уменьшаем ее счетчик
          if (selectedReaction && selectedReaction !== reactionType) {
            setReactionCounts(prev => ({
              ...prev,
              [selectedReaction]: Math.max(0, prev[selectedReaction as keyof typeof prev] - 1)
            }));
          }
          
          setSelectedReaction(reactionType);
          // Увеличиваем счетчик
          setReactionCounts(prev => ({
            ...prev,
            [reactionType]: prev[reactionType as keyof typeof prev] + 1
          }));
          
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
      } else {
        toast.error(language === 'en' 
          ? `Failed to save reaction: ${result.error}` 
          : `Не удалось сохранить реакцию: ${result.error}`);
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
      toast.error(language === 'en' 
        ? 'An error occurred while saving your reaction' 
        : 'Произошла ошибка при сохранении вашей реакции');
    } finally {
      setIsLoading(false);
    }
  };

  if (!post) return null;

  // Use image_url and provide a fallback
  const postImage = post.image_url && post.image_url.startsWith('http') 
    ? post.image_url 
    : 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80';

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <DialogTitle className="sr-only">{getLocalizedContent(post, 'title', language)}</DialogTitle>
        <div className="relative h-16 sm:h-24 md:h-32 overflow-hidden">
          <img 
            src={postImage} 
            alt={getLocalizedContent(post, 'title', language)} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-4 sm:p-6">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-white/20 backdrop-blur-sm mb-2 sm:mb-4">
                {getLocalizedContent(post, 'category', language)}
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white">
                {getLocalizedContent(post, 'title', language)}
              </h2>
            </div>
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
        
        <DialogHeader className="px-4 sm:px-6 pt-4 pb-0">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{new Date(post.created_at).toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US')}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{post.reading_time}</span>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="p-4 sm:p-6 max-h-[calc(90vh-180px)]">
          <div className="space-y-4">
            <p className="text-lg font-medium">
              {getLocalizedContent(post, 'excerpt', language)}
            </p>
            
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: getLocalizedContent(post, 'content', language) }} />
            </div>
            
            <div className="pt-6 border-t">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium">
                  {language === 'en' ? 'Share your thoughts about this article:' : 'Поделитесь своим мнением об этой статье:'}
                </h4>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="flex items-center gap-1.5 px-2.5 py-1">
                    <ThumbsUp className="h-3.5 w-3.5 text-green-500" />
                    <span>{reactionCounts.like}</span>
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1.5 px-2.5 py-1">
                    <ThumbsDown className="h-3.5 w-3.5 text-red-500" />
                    <span>{reactionCounts.dislike}</span>
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1.5 px-2.5 py-1">
                    <Star className="h-3.5 w-3.5 text-blue-500" />
                    <span>{reactionCounts.useful}</span>
                  </Badge>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant={selectedReaction === 'like' ? 'default' : 'outline'} 
                  size="sm"
                  className={selectedReaction === 'like' ? 'bg-green-500 hover:bg-green-600' : ''}
                  onClick={() => handleReaction('like')}
                  disabled={isLoading}
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Interesting' : 'Интересно'}
                </Button>
                <Button 
                  variant={selectedReaction === 'dislike' ? 'default' : 'outline'} 
                  size="sm"
                  className={selectedReaction === 'dislike' ? 'bg-red-500 hover:bg-red-600' : ''}
                  onClick={() => handleReaction('dislike')}
                  disabled={isLoading}
                >
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Not Interesting' : 'Не интересно'}
                </Button>
                <Button 
                  variant={selectedReaction === 'useful' ? 'default' : 'outline'} 
                  size="sm"
                  className={selectedReaction === 'useful' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                  onClick={() => handleReaction('useful')}
                  disabled={isLoading}
                >
                  <Star className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Very Useful' : 'Очень полезно'}
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
