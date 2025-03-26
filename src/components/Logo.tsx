
import { Link } from 'react-router-dom';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';

// Определяем константы для логотипа
const LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA/0lEQVR42mNkGGDAOOqAUQeMOmDUAaMO4D4AH2egFQAAgL7gNAOwAICvBzx+/Jjl4cOH8p8/f2YihJmZmbmYmJg3CQkJP6Fyn6H0F3Fxca+QkJCvKSkpX+Pi4r7/hYI/f/68//Tp09OJiYmvO39sEdZVNzU7evToWxkZme8gR/z8+fPPnz9/fv/69evv79+//0HB/4H4HxD/B+E/UP5/EP0fCYP4/xkYGBmA8v+A4vA4AMXRTwYsBuAK/FetWnVm7969x48cOXLi8ePHN27evHnj1q1bd+7cuXMPiO/CcBbQ9OfPn79y48aNG1euXLly+fLly5cuXbpw/vz5M2fOnDlNU1sAB1+QqgkWAlsAAAAASUVORK5CYII=';
const LOGO_URL = 'https://preview--fintech-simplicity.lovable.app/lovable-uploads/3655bf6b-6880-47b7-b1f7-9129d0f48bc0.png';

interface LogoProps {
  className?: string;
  withGlow?: boolean;
  showText?: boolean;
  showSlogan?: boolean;
}

export function Logo({ className, withGlow = true, showText = true, showSlogan = false }: LogoProps) {
  const { language } = useLanguage();
  const [key, setKey] = useState(0);
  const [imageSrc, setImageSrc] = useState(LOGO_BASE64);
  
  // Force re-render occasionally to ensure logo loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setKey(prev => prev + 1);
      // Регулярно обновляем изображение, чтобы предотвратить кэширование неправильного логотипа
      setImageSrc(`${LOGO_URL}?t=${Date.now()}`);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  
  // Слоганы для разных языков
  const slogan = language === 'en' 
    ? "Get Licensed, Get Ready, Go Steady" 
    : "Бизнес растёт — FinTechAssist всё учтёт";
  
  // Обработчик ошибок для изображения
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("Error loading logo, trying backup source");
    const element = e.target as HTMLImageElement;
    
    // При ошибке загрузки пробуем другой источник
    if (element.src !== LOGO_URL) {
      element.src = LOGO_URL;
    } else if (element.src !== LOGO_BASE64) {
      element.src = LOGO_BASE64;
    }
  };
  
  return (
    <Link to="/" className={cn("relative inline-flex flex-col items-start", className)}>
      <div className="flex items-center">
        <div className="relative">
          <img 
            key={`logo-${key}`}
            src={imageSrc}
            alt="FinTechAssist Logo" 
            className="h-10 w-auto"
            onError={handleImageError}
          />
          {withGlow && (
            <div className="absolute inset-0">
              <GlowingEffect 
                blur={2} 
                spread={30} 
                glow={true} 
                disabled={false} 
                inactiveZone={0.4}
                proximity={60}
              />
            </div>
          )}
        </div>
        {showText && (
          <div className="ml-2 flex flex-col">
            <span className="font-display font-bold text-xl leading-tight text-foreground dark:text-foreground">
              FinTechAssist
            </span>
            {showSlogan && (
              <span className="text-xs text-muted-foreground mt-0.5 leading-none">
                {slogan}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
