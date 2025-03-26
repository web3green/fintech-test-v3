
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Определяем константы для логотипа
const LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA/0lEQVR42mNkGGDAOOqAUQeMOmDUAaMO4D4AH2egFQAAgL7gNAOwAICvBzx+/Jjl4cOH8p8/f2YihJmZmbmYmJg3CQkJP6Fyn6H0F3Fxca+QkJCvKSkpX+Pi4r7/hYI/f/68//Tp09OJiYmvO39sEdZVNzU7evToWxkZme8gR/z8+fPPnz9/fv/69evv79+//0HB/4H4HxD/B+E/UP5/EP0fCYP4/xkYGBmA8v+A4vA4AMXRTwYsBuAK/FetWnVm7969x48cOXLi8ePHN27evHnj1q1bd+7cuXMPiO/CcBbQ9OfPn79y48aNG1euXLly+fLly5cuXbpw/vz5M2fOnDlNU1sAB1+QqgkWAlsAAAAASUVORK5CYII=';
const LOGO_URL = 'https://preview--fintech-simplicity.lovable.app/lovable-uploads/3655bf6b-6880-47b7-b1f7-9129d0f48bc0.png';

export function FooterLogo() {
  const { t } = useLanguage();
  const [key, setKey] = useState(0);
  const [logoSrc, setLogoSrc] = useState(LOGO_BASE64);
  
  // Force re-render occasionally to ensure logo loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setKey(prev => prev + 1);
      // Регулярно обновляем изображение для предотвращения кэширования неправильного логотипа
      setLogoSrc(`${LOGO_URL}?t=${Date.now()}`);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  
  // Обработчик ошибок для изображения
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("Error loading footer logo, trying backup URL");
    const element = e.target as HTMLImageElement;
    
    // При ошибке загрузки пробуем другой источник
    if (element.src.includes(LOGO_URL)) {
      element.src = LOGO_BASE64;
    } else if (!element.src.includes(LOGO_BASE64)) {
      element.src = LOGO_URL;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <img 
          key={`footer-logo-${key}`}
          src={logoSrc} 
          alt="FinTechAssist Logo" 
          className="h-8 w-auto mr-2"
          onError={handleImageError}
        />
        <h3 className="text-2xl font-display font-bold text-foreground dark:text-foreground">
          FinTechAssist
        </h3>
      </div>
      <p className="text-muted-foreground max-w-xs">
        {t('footer.description')}
      </p>
    </div>
  );
}
