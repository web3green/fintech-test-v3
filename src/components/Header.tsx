import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Logo } from '@/components/Logo';
import { Menu, X } from 'lucide-react';

export function Header() {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
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
  
  useEffect(() => {
    // Закрываем меню при клике вне его области
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    
    // Фиксируем body при открытом мобильном меню
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.body.style.overflow = '';
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);
  
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false); // Close mobile menu after clicking
    }
  };
  
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-2 md:py-3",
        isScrolled 
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-6 md:px-8 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Logo and company name with slogan */}
          <div className="flex-shrink-0">
            <Logo 
              withGlow={!isScrolled} 
              showText={true} 
              showSlogan={true} 
              className="h-10 w-auto" 
              width={45}
              height={45}
            />
          </div>
          
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors focus:outline-none focus:ring-2 focus:ring-fintech-blue/40 focus:ring-opacity-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
          >
            <div className="relative w-6 h-6">
              <span 
                className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'rotate-45 top-3' : 'top-1.5'}`}
              ></span>
              <span 
                className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'} top-3`}
              ></span>
              <span 
                className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${mobileMenuOpen ? '-rotate-45 top-3' : 'top-4.5'}`}
              ></span>
            </div>
          </button>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <nav className="flex space-x-3 lg:space-x-5 items-center overflow-x-auto scrollbar-hide">
              <button 
                onClick={() => scrollToSection('about')}
                className="px-3 py-2 text-sm font-medium text-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light rounded-md transition-colors"
              >
                {t('nav.about')}
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="px-3 py-2 text-sm font-medium text-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light rounded-md transition-colors"
              >
                {t('nav.services')}
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="px-3 py-2 text-sm font-medium text-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light rounded-md transition-colors"
              >
                {t('nav.howItWorks')}
              </button>
              <button 
                onClick={() => scrollToSection('blog')}
                className="px-3 py-2 text-sm font-medium text-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light rounded-md transition-colors"
              >
                {t('nav.blog')}
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="px-3 py-2 text-sm font-medium text-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light rounded-md transition-colors"
              >
                {t('nav.contact')}
              </button>
            </nav>
          </div>
          
          {/* Right side controls with improved spacing */}
          <div className="hidden md:flex items-center space-x-2 md:space-x-3 ml-4 md:ml-6">
            <ThemeToggle />
            <LanguageToggle />
            <Button 
              className="bg-fintech-orange hover:bg-fintech-orange-light text-white ml-2 px-4 py-2 rounded-md shadow-sm hover:shadow-md transition-all"
              onClick={() => scrollToSection('contact')}
            >
              {t('cta.getStarted')}
            </Button>
          </div>
        </div>
        
        {/* Mobile menu, show/hide based on menu state */}
        <div 
          ref={menuRef}
          className={`md:hidden mt-3 py-3 px-4 bg-white/95 dark:bg-gray-900/95 rounded-md shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out border border-gray-200 dark:border-gray-800 ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
        >
          <nav className="flex flex-col space-y-3">
            <button 
              onClick={() => scrollToSection('about')}
              className="px-3 py-2 text-sm font-medium text-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors flex items-center"
            >
              <span className="w-1.5 h-1.5 bg-fintech-blue rounded-full mr-2"></span>
              {t('nav.about')}
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="px-3 py-2 text-sm font-medium text-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors flex items-center"
            >
              <span className="w-1.5 h-1.5 bg-fintech-blue rounded-full mr-2"></span>
              {t('nav.services')}
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="px-3 py-2 text-sm font-medium text-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors flex items-center"
            >
              <span className="w-1.5 h-1.5 bg-fintech-blue rounded-full mr-2"></span>
              {t('nav.howItWorks')}
            </button>
            <button 
              onClick={() => scrollToSection('blog')}
              className="px-3 py-2 text-sm font-medium text-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors flex items-center"
            >
              <span className="w-1.5 h-1.5 bg-fintech-blue rounded-full mr-2"></span>
              {t('nav.blog')}
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="px-3 py-2 text-sm font-medium text-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors flex items-center"
            >
              <span className="w-1.5 h-1.5 bg-fintech-blue rounded-full mr-2"></span>
              {t('nav.contact')}
            </button>
            
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-3">
                <ThemeToggle />
                <LanguageToggle />
              </div>
              <Button 
                className="bg-fintech-orange hover:bg-fintech-orange-light text-white text-sm px-4 py-1 h-9 rounded-md shadow-sm hover:shadow-md transition-all"
                onClick={() => scrollToSection('contact')}
              >
                {t('cta.getStarted')}
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
