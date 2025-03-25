
import { Link } from 'react-router-dom';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  withGlow?: boolean;
  showText?: boolean;
}

export function Logo({ className, withGlow = true, showText = true }: LogoProps) {
  // Используем абсолютный путь к изображению
  const logoPath = "/lovable-uploads/8f51558f-dcfd-4921-b6e4-112532ad0723.png";
  const absoluteLogoUrl = `https://test.mcaweb.xyz${logoPath}`;
  
  return (
    <Link to="/" className={cn("relative inline-flex items-center", className)}>
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
        <span className="ml-2 font-display font-bold text-xl">
          <span className="text-red-500">Fin</span>
          <span className="text-fintech-blue dark:text-fintech-blue-light">Tech</span>
          <span className="text-fintech-orange">Assist</span>
        </span>
      )}
    </Link>
  );
}
