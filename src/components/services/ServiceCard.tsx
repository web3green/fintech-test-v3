
import { ChevronDown, ChevronUp, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';

export interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  details: string;
  icon: LucideIcon;
  color: string;
  iconColor: string;
  borderColor: string;
  isOpen: boolean;
  toggleService: (id: string) => void;
  index: number;
}

export function ServiceCard({
  id,
  title,
  description,
  details,
  icon: Icon,
  color,
  iconColor,
  borderColor,
  isOpen,
  toggleService,
  index
}: ServiceCardProps) {
  const { t } = useLanguage();
  
  return (
    <Collapsible 
      key={id}
      open={isOpen}
      onOpenChange={() => toggleService(id)}
      className="animate-fade-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <Card 
        className={`relative h-full transition-all duration-300 border ${borderColor} hover:shadow-lg ${isOpen ? 'shadow-md' : ''}`}
      >
        <CollapsibleTrigger className="w-full text-left">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className={`${color} rounded-full p-3 inline-flex items-center justify-center mb-3 w-10 h-10`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
              <div className="ml-auto">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
            <h3 className="text-base sm:text-lg font-display font-bold mb-2 line-clamp-2">{title}</h3>
            <p className="text-muted-foreground text-sm mb-0">{description}</p>
          </CardContent>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-5 pb-4 pt-0 border-t border-border/30 mt-1">
            <p className="text-sm text-foreground/90 mb-4">{details}</p>
            <Button 
              variant="outline" 
              size="sm"
              className={`text-xs w-full ${iconColor} border-${iconColor}`}
              onClick={(e) => {
                e.stopPropagation();
                // Instead of navigation, we can scroll to contact form
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              {t('cta.request')}
            </Button>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
