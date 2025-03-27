
import { ChevronDown, ChevronUp } from 'lucide-react';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { ServiceItem } from './types';

interface ServiceCardProps {
  service: ServiceItem;
  isOpen: boolean;
  onToggle: () => void;
}

export function ServiceCard({ service, isOpen, onToggle }: ServiceCardProps) {
  const { t } = useLanguage();
  
  return (
    <motion.div
      layout
      className="animate-fade-up"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3,
        layout: { duration: 0.3, type: "spring" }
      }}
    >
      <Collapsible 
        open={isOpen}
        onOpenChange={onToggle}
        className={`h-full transition-all duration-300 ${isOpen ? 'z-10 relative' : ''}`}
      >
        <Card 
          className={`relative h-full transition-all duration-300 border ${service.borderColor} hover:shadow-lg ${isOpen ? 'shadow-md' : ''}`}
        >
          <CollapsibleTrigger className="w-full text-left">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className={`${service.color} rounded-full p-3 inline-flex items-center justify-center mb-3 w-10 h-10`}>
                  <service.icon className={`h-5 w-5 ${service.iconColor}`} />
                </div>
                <div className="ml-auto">
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-display font-bold mb-2 line-clamp-2">{service.title}</h3>
              <p className="text-muted-foreground text-sm mb-0">{service.description}</p>
            </CardContent>
          </CollapsibleTrigger>

          <AnimatePresence>
            {isOpen && (
              <CollapsibleContent forceMount>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-5 pb-4 pt-0 border-t border-border/30 mt-1"
                >
                  <p className="text-sm text-foreground/90 mb-4">{service.details}</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={`text-xs w-full ${service.iconColor} border-${service.iconColor}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Scroll to contact form
                      const contactSection = document.getElementById('contact');
                      if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    {t('cta.request')}
                  </Button>
                </motion.div>
              </CollapsibleContent>
            )}
          </AnimatePresence>
        </Card>
      </Collapsible>
    </motion.div>
  );
}
