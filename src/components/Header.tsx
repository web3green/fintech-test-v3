
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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4",
        isScrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="relative inline-flex items-center">
          <Logo withGlow={!isScrolled} showText={false} />
          <span className="ml-2 font-display font-bold text-xl">
            <span className="text-fintech-blue dark:text-fintech-blue-light">Fin</span>
            <span className="text-fintech-orange">Tech</span>
            <span className="text-red-500 font-bold">-</span>
            <span className="text-foreground">assist</span>
          </span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <NavigationMenu className="hidden sm:flex">
            <NavigationMenuList className="flex items-center space-x-1">
              <NavigationMenuItem>
                <NavigationMenuLink 
                  onClick={() => scrollToSection('about')}
                  className={navigationMenuTriggerStyle()}
                >
                  {t('nav.about')}
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink 
                  onClick={() => scrollToSection('services')}
                  className={navigationMenuTriggerStyle()}
                >
                  {t('nav.services')}
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink 
                  onClick={() => scrollToSection('how-it-works')}
                  className={navigationMenuTriggerStyle()}
                >
                  {t('nav.howItWorks')}
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink 
                  onClick={() => scrollToSection('contact')}
                  className={navigationMenuTriggerStyle()}
                >
                  {t('nav.contact')}
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <LanguageToggle />
            
            <Button 
              className="bg-fintech-blue hover:bg-fintech-blue-dark text-white button-glow hidden sm:flex"
              onClick={() => scrollToSection('contact')}
            >
              {t('cta.getStarted')}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation - Simple row of links */}
      <div className="sm:hidden overflow-x-auto mt-2 pb-2">
        <div className="container mx-auto px-4 flex space-x-4 justify-between whitespace-nowrap">
          <button 
            onClick={() => scrollToSection('about')}
            className="px-3 py-1 text-sm text-foreground"
          >
            {t('nav.about')}
          </button>
          <button 
            onClick={() => scrollToSection('services')}
            className="px-3 py-1 text-sm text-foreground"
          >
            {t('nav.services')}
          </button>
          <button 
            onClick={() => scrollToSection('how-it-works')}
            className="px-3 py-1 text-sm text-foreground"
          >
            {t('nav.howItWorks')}
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className="px-3 py-1 text-sm text-foreground"
          >
            {t('nav.contact')}
          </button>
        </div>
      </div>
    </header>
  );
}
