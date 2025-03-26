
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Logo } from '@/components/Logo';
import { Facebook, Instagram, Linkedin, X } from 'lucide-react';

export function Header() {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [socialLinks, setSocialLinks] = useState<Array<{ id: number; platform: string; url: string; icon: string }>>([]);
  
  useEffect(() => {
    // Get social links from localStorage if available
    const storedLinks = localStorage.getItem('socialLinks');
    if (storedLinks) {
      setSocialLinks(JSON.parse(storedLinks));
    }
  }, []);
  
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
  
  // Function to render the appropriate icon
  const renderSocialIcon = (icon: string) => {
    switch (icon.toLowerCase()) {
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      case 'twitter':
        return <X className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      case 'telegram':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M18.384,22.779c0.322,0.228 0.737,0.285 1.107,0.145c0.37,-0.141 0.642,-0.457 0.724,-0.84c0.869,-4.084 2.977,-14.421 3.768,-18.136c0.06,-0.28 -0.04,-0.571 -0.26,-0.758c-0.22,-0.187 -0.525,-0.241 -0.797,-0.14c-4.193,1.552 -17.106,6.397 -22.384,8.35c-0.335,0.124 -0.553,0.446 -0.542,0.799c0.012,0.354 0.25,0.661 0.593,0.764c2.367,0.708 5.474,1.693 5.474,1.693c0,0 1.452,4.385 2.209,6.615c0.095,0.28 0.314,0.5 0.603,0.576c0.288,0.075 0.596,-0.004 0.811,-0.207c1.216,-1.148 3.096,-2.923 3.096,-2.923c0,0 3.572,2.619 5.598,4.062Zm-11.01,-8.677l1.679,5.538l0.373,-3.507c0,0 6.487,-5.851 10.185,-9.186c0.108,-0.098 0.123,-0.262 0.033,-0.377c-0.089,-0.115 -0.253,-0.142 -0.376,-0.064c-4.286,2.737 -11.894,7.596 -11.894,7.596Z" />
          </svg>
        );
      default:
        return <X className="h-4 w-4" />;
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
                onClick={() => scrollToSection('blog')}
                className="px-1 py-1 text-sm font-medium text-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors whitespace-nowrap relative group"
              >
                {t('nav.blog')}
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
          
          {/* Social media icons */}
          <div className="flex items-center gap-2 mr-2">
            {socialLinks.map((link) => (
              <a 
                key={link.id}
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors"
                aria-label={link.platform}
              >
                {renderSocialIcon(link.icon)}
              </a>
            ))}
          </div>
          
          {/* Right side controls with improved spacing */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <ThemeToggle />
            <LanguageToggle />
            
            <Button 
              className="bg-fintech-orange hover:bg-fintech-orange-light text-white text-sm px-4 py-1 h-9 ml-1 rounded-md shadow-sm hover:shadow-md transition-all"
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
