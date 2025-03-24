import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AboutSection() {
  const { t } = useLanguage();
  
  const features = [
    {
      title: t('about.feature1.title'),
      description: t('about.feature1.description'),
    },
    {
      title: t('about.feature2.title'),
      description: t('about.feature2.description'),
    },
    {
      title: t('about.feature3.title'),
      description: t('about.feature3.description'),
    },
  ];
  
  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center space-x-4">
              <div className="h-10 w-1 bg-fintech-blue"></div>
              <h2 className="text-2xl md:text-3xl font-display font-bold">
                <span className="text-red-500">Fin</span>
                <span className="text-fintech-blue dark:text-fintech-blue-light">Tech</span>
                <span className="text-fintech-orange">Assist</span>
              </h2>
            </div>
            
            <p className="mt-6 text-muted-foreground">
              {t('about.description')}
            </p>
            
            <ul className="mt-8 space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <div className="mr-3 text-fintech-blue dark:text-fintech-blue-light">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="mt-10">
              <Link to="/services">
                <Button className="bg-fintech-orange hover:bg-fintech-orange-light text-white transition-all duration-300">
                  {t('about.learnMore')}
                </Button>
              </Link>
            </div>
          </div>
          
          <div>
            <img
              src="/images/about-image.webp"
              alt={t('about.imageAlt')}
              className="rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
