
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
  
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4",
        isScrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-display font-bold text-fintech-blue dark:text-fintech-blue-light">
            Fintech<span className="text-fintech-orange">Assist</span>
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors duration-200">
            Главная
          </Link>
          <Link to="/about" className="text-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors duration-200">
            О нас
          </Link>
          <Link to="/services" className="text-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors duration-200">
            Услуги
          </Link>
          <Link to="/blog" className="text-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors duration-200">
            Блог
          </Link>
          <Link to="/contact" className="text-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors duration-200">
            Контакты
          </Link>
        </nav>
        
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <LanguageToggle />
          
          <div className="hidden md:block">
            <Button className="bg-fintech-blue hover:bg-fintech-blue-dark text-white button-glow">
              Оставить заявку
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-background/95 dark:bg-background/95 backdrop-blur-sm z-40 pt-20 animate-fade-in">
          <nav className="container mx-auto px-4 flex flex-col space-y-6 py-6">
            <Link 
              to="/" 
              className="text-xl font-medium text-center py-3"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Главная
            </Link>
            <Link 
              to="/about" 
              className="text-xl font-medium text-center py-3"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              О нас
            </Link>
            <Link 
              to="/services" 
              className="text-xl font-medium text-center py-3"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Услуги
            </Link>
            <Link 
              to="/blog" 
              className="text-xl font-medium text-center py-3"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Блог
            </Link>
            <Link 
              to="/contact" 
              className="text-xl font-medium text-center py-3"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Контакты
            </Link>
            <Button 
              className="mt-4 bg-fintech-blue hover:bg-fintech-blue-dark text-white button-glow w-full"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Оставить заявку
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
