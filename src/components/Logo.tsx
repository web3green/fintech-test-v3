
import { Link } from 'react-router-dom';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { cn } from '@/lib/utils';
import { getLogoUrl } from '@/utils/metaTagManager';

interface LogoProps {
  className?: string;
  withGlow?: boolean;
  showText?: boolean;
}

export function Logo({ className, withGlow = true, showText = true }: LogoProps) {
  // Instead of using the image from metaTagManager, we'll create an SVG logo with the middle element in orange
  
  return (
    <Link to="/" className={cn("relative inline-flex items-center", className)}>
      <div className="relative">
        <svg width="40" height="40" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Bottom blue element */}
          <path d="M110 90H80C69 90 60 99 60 110V140C60 151 69 160 80 160H110C121 160 130 151 130 140V110C130 99 121 90 110 90Z" fill="#2563EB" />
          <path d="M110 100H80C74.5 100 70 104.5 70 110V140C70 145.5 74.5 150 80 150H110C115.5 150 120 145.5 120 140V110C120 104.5 115.5 100 110 100Z" fill="white" />
          
          {/* Middle orange element (changed from original color to #F97316) */}
          <path d="M80 45H50C39 45 30 54 30 65V95C30 106 39 115 50 115H80C91 115 100 106 100 95V65C100 54 91 45 80 45Z" fill="#F97316" />
          <path d="M80 55H50C44.5 55 40 59.5 40 65V95C40 100.5 44.5 105 50 105H80C85.5 105 90 100.5 90 95V65C90 59.5 85.5 55 80 55Z" fill="white" />
          
          {/* Top red element */}
          <path d="M140 0H110C99 0 90 9 90 20V50C90 61 99 70 110 70H140C151 70 160 61 160 50V20C160 9 151 0 140 0Z" fill="#EF4444" />
          <path d="M140 10H110C104.5 10 100 14.5 100 20V50C100 55.5 104.5 60 110 60H140C145.5 60 150 55.5 150 50V20C150 14.5 145.5 10 140 10Z" fill="white" />
        </svg>
        
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
        <span className="ml-2 font-display font-bold text-xl text-foreground dark:text-foreground">
          FinTechAssist
        </span>
      )}
    </Link>
  );
}
