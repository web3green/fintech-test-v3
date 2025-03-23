
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useLanguage } from '@/contexts/LanguageContext';
import { Logo } from '@/components/Logo';

export function Header() {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-2",
        isScrolled ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-1">
        <div className="flex items-center justify-between space-x-2">
          {/* Logo and company name */}
          <Logo withGlow={!isScrolled} showText={true} className="h-8 w-auto flex-shrink-0" />
          
          {/* Unified Navigation - All on one row for all screen sizes */}
          <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
            <button 
              onClick={() => scrollToSection('about')}
              className="px-2 py-1 text-sm font-medium text-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors whitespace-nowrap"
            >
              {t('nav.about')}
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="px-2 py-1 text-sm font-medium text-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors whitespace-nowrap"
            >
              {t('nav.services')}
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="px-2 py-1 text-sm font-medium text-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors whitespace-nowrap"
            >
              {t('nav.howItWorks')}
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="px-2 py-1 text-sm font-medium text-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors whitespace-nowrap"
            >
              {t('nav.contact')}
            </button>
          </div>
          
          {/* Right side buttons with minimal spacing */}
          <div className="flex items-center space-x-1 flex-shrink-0">
            <ThemeToggle />
            <LanguageToggle />
            
            <Button 
              className="bg-fintech-blue hover:bg-fintech-blue-dark text-white text-sm px-3 py-1 h-8"
              onClick={() => scrollToSection('contact')}
            >
              {t('cta.getStarted')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
