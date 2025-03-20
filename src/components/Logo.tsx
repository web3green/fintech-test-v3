
import { Link } from 'react-router-dom';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  withGlow?: boolean;
}

export function Logo({ className, withGlow = true }: LogoProps) {
  return (
    <Link to="/" className={cn("relative inline-block", className)}>
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
    </Link>
  );
}
