
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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3",
        isScrolled ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo and company name in one line */}
          <div className="flex items-center space-x-2">
            <Logo withGlow={!isScrolled} showText={false} className="h-10 w-auto" />
            <span className="font-display font-bold text-xl whitespace-nowrap">
              <span className="text-fintech-blue dark:text-fintech-blue-light">Fin</span>
              <span className="text-fintech-orange">Tech</span>
              <span className="text-red-500 font-bold">-</span>
              <span className="text-foreground">assist</span>
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="flex items-center space-x-6">
              <NavigationMenuItem>
                <NavigationMenuLink 
                  onClick={() => scrollToSection('about')}
                  className={cn(navigationMenuTriggerStyle(), "text-base font-medium")}
                >
                  {t('nav.about')}
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink 
                  onClick={() => scrollToSection('services')}
                  className={cn(navigationMenuTriggerStyle(), "text-base font-medium")}
                >
                  {t('nav.services')}
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink 
                  onClick={() => scrollToSection('how-it-works')}
                  className={cn(navigationMenuTriggerStyle(), "text-base font-medium")}
                >
                  {t('nav.howItWorks')}
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink 
                  onClick={() => scrollToSection('contact')}
                  className={cn(navigationMenuTriggerStyle(), "text-base font-medium")}
                >
                  {t('nav.contact')}
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          {/* Right side buttons with increased spacing */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <LanguageToggle />
            
            <Button 
              className="bg-fintech-blue hover:bg-fintech-blue-dark text-white button-glow hidden md:flex text-base font-medium px-6"
              onClick={() => scrollToSection('contact')}
            >
              {t('cta.getStarted')}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation - Improved scrollable row with better spacing and text size */}
      <div className="md:hidden overflow-x-auto mt-3">
        <div className="container mx-auto px-2 flex space-x-6 justify-between whitespace-nowrap">
          <button 
            onClick={() => scrollToSection('about')}
            className="px-3 py-2 text-base font-medium text-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors"
          >
            {t('nav.about')}
          </button>
          <button 
            onClick={() => scrollToSection('services')}
            className="px-3 py-2 text-base font-medium text-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors"
          >
            {t('nav.services')}
          </button>
          <button 
            onClick={() => scrollToSection('how-it-works')}
            className="px-3 py-2 text-base font-medium text-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors"
          >
            {t('nav.howItWorks')}
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className="px-3 py-2 text-base font-medium text-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors"
          >
            {t('nav.contact')}
          </button>
        </div>
      </div>
    </header>
  );
}
