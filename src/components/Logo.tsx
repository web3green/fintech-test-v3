
import { Link } from 'react-router-dom';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { cn } from '@/lib/utils';
import { getLogoUrl } from '@/utils/metaTagManager';
import { useLanguage } from '@/contexts/LanguageContext';

interface LogoProps {
  className?: string;
  withGlow?: boolean;
  showText?: boolean;
  showSlogan?: boolean;
}

export function Logo({ className, withGlow = true, showText = true, showSlogan = false }: LogoProps) {
  const { relative: logoPath, absolute: absoluteLogoUrl } = getLogoUrl();
  const { language } = useLanguage();
  
  // Слоганы для разных языков
  const slogan = language === 'en' 
    ? "Get Licensed, Get Ready, Go Steady" 
    : "Бизнес растёт — Fintech Assist всё учтёт";
  
  return (
    <Link to="/" className={cn("relative inline-flex flex-col items-start", className)}>
      <div className="flex items-center">
        <div className="relative">
          <img 
            src={logoPath}
            alt="FinTechAssist Logo" 
            className="h-10 w-auto"
            onError={(e) => {
              console.error("Error loading logo from relative path, trying absolute URL");
              (e.target as HTMLImageElement).src = absoluteLogoUrl;
            }}
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
