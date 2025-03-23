
import { Link } from 'react-router-dom';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  withGlow?: boolean;
  showText?: boolean;
}

export function Logo({ className, withGlow = true, showText = true }: LogoProps) {
  return (
    <Link to="/" className={cn("relative inline-flex items-center", className)}>
      <div className="relative">
        <img 
          src="/lovable-uploads/8f51558f-dcfd-4921-b6e4-112532ad0723.png" 
          alt="Fintech-Assist Logo" 
          className="h-10 w-auto"
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
          <span className="text-fintech-blue dark:text-fintech-blue-light">Fin</span>
          <span className="text-fintech-orange">Tech</span>
          <span className="text-red-500 font-bold">-</span>
          <span className="text-foreground">assist</span>
        </span>
      )}
    </Link>
  );
}
