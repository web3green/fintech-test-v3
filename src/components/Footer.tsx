
import { useLanguage } from '@/contexts/LanguageContext';
import { FooterLogo } from './footer/FooterLogo';
import { FooterSocialLinks } from './footer/FooterSocialLinks';
import { FooterNavLinks } from './footer/FooterNavLinks';
import { FooterServiceLinks } from './footer/FooterServiceLinks';
import { FooterContactInfo } from './footer/FooterContactInfo';
import { FooterCopyright } from './footer/FooterCopyright';
import { getMainServices } from './footer/footerServicesData';

export function Footer() {
  const { t } = useLanguage();
  const mainServices = getMainServices(t);
  
  // Function to scroll to a section
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
        {/* Top section with logo and description */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-4 lg:col-span-1 space-y-6">
            <FooterLogo />
            <FooterSocialLinks />
          </div>
          
          <div className="md:col-span-4 lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {/* Navigation Links */}
              <FooterNavLinks scrollToSection={scrollToSection} />
              
              {/* Services Links */}
              <FooterServiceLinks 
                scrollToSection={scrollToSection} 
                mainServices={mainServices} 
              />
              
              {/* Contact Information */}
              <FooterContactInfo scrollToSection={scrollToSection} />
            </div>
          </div>
        </div>
        
        {/* Footer bottom with copyright and legal links */}
        <FooterCopyright scrollToTop={scrollToTop} />
      </div>
    </footer>
  );
}
