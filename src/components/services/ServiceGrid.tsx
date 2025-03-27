
import { useState } from 'react';
import { ServiceCard } from './ServiceCard';
import { ServiceItem } from './types';

interface ServiceGridProps {
  services: ServiceItem[];
}

export function ServiceGrid({ services }: ServiceGridProps) {
  const [openService, setOpenService] = useState<string | null>(null);

  const toggleService = (id: string) => {
    setOpenService(prev => prev === id ? null : id);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {services.map((service, index) => (
        <ServiceCard 
          key={service.id}
          service={service}
          isOpen={openService === service.id}
          onToggle={() => toggleService(service.id)}
        />
      ))}
    </div>
  );
}
