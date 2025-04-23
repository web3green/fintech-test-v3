import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLogoUrl } from '@/utils/logoManager';
// import { FALLBACK_SVG_LOGO } from '@/constants/assets';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  showText?: boolean;
  showSlogan?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  width = 40,
  height = 40,
  className = '',
  showText = true,
  showSlogan = true,
}) => {
  const { language } = useLanguage();

  // Получаем актуальный логотип
  const logoSrc = getLogoUrl().relative;
  
  // Слоганы для разных языков
  const slogan = language === 'en' 
    ? "Get Licensed, Get Ready, Go Steady" 
    : "Бизнес растёт — FinTechAssist всё учтёт";
  
  return (
    <Link to="/" className={`relative inline-flex flex-col items-start ${className}`}>
      <div className="flex items-center">
        <div className="relative">
          <img
            src={logoSrc}
            alt={"Логотип компании"}
            style={{ width: `${width}px`, height: `${height}px`, objectFit: 'contain' }}
            className="object-contain"
          />
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
};

export default Logo;
