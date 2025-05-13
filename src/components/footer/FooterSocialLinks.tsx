import { Facebook, X, Instagram, Linkedin, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { databaseService } from '@/services/databaseService';

// Interface should align with what we display (platform might not be needed)
interface DisplaySocialLink {
  url: string;
  iconName: string | null; // icon_name from DB
  platform: string; // Keep platform for aria-label
}

export function FooterSocialLinks() {
  const [displayLinks, setDisplayLinks] = useState<DisplaySocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Запускаем загрузку при монтировании и с интервалом обновления
  useEffect(() => {
    console.log('[FooterSocialLinks] Компонент запущен, загружаем социальные ссылки...');
    loadSocialLinks();
    
    // Добавляем интервал обновления каждые 10 секунд для автоматической проверки новых ссылок
    const interval = setInterval(() => {
      console.log('[FooterSocialLinks] Обновляем социальные ссылки...');
      loadSocialLinks();
    }, 10000);
    
    // Очищаем интервал при размонтировании
    return () => clearInterval(interval);
  }, []);
  
  const loadSocialLinks = async () => {
      if (isLoading && displayLinks.length > 0) {
        // Не запускаем повторную загрузку, если уже загружаем и ссылки есть
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
          console.log('[FooterSocialLinks] Запрос к базе данных для получения социальных ссылок...');
          // Fetches array: [{ platform: 'facebook', url: '...', icon_name: 'facebook' }, ...]
          const fetchedDbLinks = await databaseService.getSocialLinks(); 
          console.log('[FooterSocialLinks] Получены данные из базы:', fetchedDbLinks);
          
          // Filter out links without a URL and map to display structure
          const linksToDisplay = fetchedDbLinks
              .filter(link => link.url && link.url.trim() !== '') // Only include links that have a non-empty URL
              .map(link => ({
                  url: link.url,
                  iconName: link.icon_name,
                  platform: link.platform // Pass platform name for accessibility
              }));
          
          console.log('[FooterSocialLinks] Отфильтрованные ссылки для отображения:', linksToDisplay);
          setDisplayLinks(linksToDisplay);
      } catch (error) {
          console.error("[FooterSocialLinks] Ошибка загрузки социальных ссылок:", error);
          setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
          // Не сбрасываем существующие ссылки, чтобы не нарушать отображение
      } finally {
          setIsLoading(false);
      }
  };
  
  // Render function remains largely the same, uses iconName
  const renderSocialIcon = (iconName: string | null) => {
    if (!iconName) return <X className="h-5 w-5" />; // Default icon if name is missing
    
    switch (iconName.toLowerCase()) {
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'twitter':
        return <X className="h-5 w-5" />;
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5" />;
      case 'telegram':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M18.384,22.779c0.322,0.228 0.737,0.285 1.107,0.145c0.37,-0.141 0.642,-0.457 0.724,-0.84c0.869,-4.084 2.977,-14.421 3.768,-18.136c0.06,-0.28 -0.04,-0.571 -0.26,-0.758c-0.22,-0.187 -0.525,-0.241 -0.797,-0.14c-4.193,1.552 -17.106,6.397 -22.384,8.35c-0.335,0.124 -0.553,0.446 -0.542,0.799c0.012,0.354 0.25,0.661 0.593,0.764c2.367,0.708 5.474,1.693 5.474,1.693c0,0 1.452,4.385 2.209,6.615c0.095,0.28 0.314,0.5 0.603,0.576c0.288,0.075 0.596,-0.004 0.811,-0.207c1.216,-1.148 3.096,-2.923 3.096,-2.923c0,0 3.572,2.619 5.598,4.062Zm-11.01,-8.677l1.679,5.538l0.373,-3.507c0,0 6.487,-5.851 10.185,-9.186c0.108,-0.098 0.123,-0.262 0.033,-0.377c-0.089,-0.115 -0.253,-0.142 -0.376,-0.064c-4.286,2.737 -11.894,7.596 -11.894,7.596Z" />
          </svg>
        );
      default:
        return <X className="h-5 w-5" />;
    }
  };

  // Если при повторной загрузке возникла ошибка, но есть отображаемые ссылки - продолжаем их показывать
  if (isLoading && displayLinks.length === 0) {
      return (
          <div className="flex space-x-4 h-8 items-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
      );
  }
  
  if (displayLinks.length === 0) {
      // Если есть ошибка, но нет ссылок, можно добавить скрытый элемент с сообщением для отладки
      if (error) {
        return <div className="hidden">{error}</div>;
      }
      return null;
  }

  return (
    <div className="flex space-x-4">
      {displayLinks.map((link) => (
        <a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`FinTechAssist on ${link.platform}`}
          className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800/60 hover:bg-fintech-orange/10 dark:hover:bg-fintech-orange/20 flex items-center justify-center transition-colors text-fintech-orange dark:text-fintech-orange/80"
        >
          {renderSocialIcon(link.iconName)}
        </a>
      ))}
    </div>
  );
}
