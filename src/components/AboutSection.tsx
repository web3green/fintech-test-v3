import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
export function AboutSection() {
  const {
    t
  } = useLanguage();
  return <section id="about" className="section-padding">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              <div className="aspect-[4/3] bg-gradient-to-br from-fintech-blue/90 to-fintech-blue-dark rounded-xl">
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="glass-card rounded-xl p-6 w-full mx-auto shadow-lg">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-fintech-orange flex items-center justify-center text-white font-bold text-sm">FA</div>
                        <div>
                          <div className="text-lg font-medium text-white">
                            <span className="text-red-500">Fin</span><span className="text-fintech-blue-light">Tech</span><span className="text-fintech-orange">Assist</span>
                          </div>
                          <div className="text-xs text-white/70">Your global fintech partner</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="w-full h-4 bg-white/20 rounded"></div>
                        <div className="w-2/3 h-4 bg-white/20 rounded"></div>
                        <div className="w-3/4 h-4 bg-white/20 rounded"></div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="text-center">
                          <div className="text-xs text-white/70">Founded</div>
                          <div className="mt-1 font-medium text-white">2015</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-white/70">Team</div>
                          <div className="mt-1 font-medium text-white">10+ experts</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-fintech-blue/10 text-fintech-blue dark:bg-fintech-blue/20 dark:text-fintech-blue-light mb-4">
              <span className="flex h-2 w-2 rounded-full bg-fintech-blue mr-2"></span>
              {t('nav.about')}
            </div>
            
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              {t('about.title')}
            </h2>
            
            <p className="text-muted-foreground mb-6">
              {t('about.description')}
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <div className="text-2xl font-bold text-fintech-blue dark:text-fintech-blue-light">50+</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <div className="text-2xl font-bold text-fintech-orange">500+</div>
                <div className="text-sm text-muted-foreground">Clients</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <div className="text-2xl font-bold text-fintech-blue dark:text-fintech-blue-light">98%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <div className="text-2xl font-bold text-fintech-orange">7+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
            </div>
            
            <Button variant="outline" className="group" onClick={() => {
            const servicesElement = document.getElementById('services');
            if (servicesElement) {
              servicesElement.scrollIntoView({
                behavior: 'smooth'
              });
            }
          }}>
              Explore Our Services
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>;
}