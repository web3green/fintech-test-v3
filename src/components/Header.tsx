
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
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
        isScrolled 
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        <div className="flex items-center justify-between">
          {/* Logo and company name */}
          <Logo withGlow={!isScrolled} showText={true} className="h-8 w-auto flex-shrink-0" />
          
          {/* Navigation items with balanced spacing */}
          <div className="flex-1 flex items-center justify-center max-w-2xl mx-auto overflow-x-auto scrollbar-hide">
            <nav className="flex space-x-6 md:space-x-8">
              <button 
                onClick={() => scrollToSection('about')}
                className="px-1 py-1 text-sm font-medium text-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors whitespace-nowrap relative group"
              >
                {t('nav.about')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-fintech-blue dark:bg-fintech-blue-light transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="px-1 py-1 text-sm font-medium text-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors whitespace-nowrap relative group"
              >
                {t('nav.services')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-fintech-blue dark:bg-fintech-blue-light transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="px-1 py-1 text-sm font-medium text-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors whitespace-nowrap relative group"
              >
                {t('nav.howItWorks')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-fintech-blue dark:bg-fintech-blue-light transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="px-1 py-1 text-sm font-medium text-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors whitespace-nowrap relative group"
              >
                {t('nav.contact')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-fintech-blue dark:bg-fintech-blue-light transition-all duration-300 group-hover:w-full"></span>
              </button>
            </nav>
          </div>
          
          {/* Right side controls with improved spacing */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <ThemeToggle />
            <LanguageToggle />
            
            <Button 
              className="bg-fintech-blue hover:bg-fintech-blue-dark text-white text-sm px-4 py-1 h-9 ml-1 rounded-md shadow-sm hover:shadow-md transition-all"
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
