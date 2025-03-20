
import { Building, CreditCard, Shield, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

const services = [
  {
    id: 1,
    title: 'Регистрация компаний',
    description: 'Открытие компаний в различных юрисдикциях с учетом специфики вашего бизнеса и налоговых требований.',
    icon: Building,
    color: 'bg-blue-50 dark:bg-blue-950',
    iconColor: 'text-fintech-blue dark:text-fintech-blue-light',
  },
  {
    id: 2,
    title: 'Открытие счетов',
    description: 'Помощь в открытии корпоративных счетов в международных банках с оптимальными условиями обслуживания.',
    icon: CreditCard,
    color: 'bg-orange-50 dark:bg-orange-950',
    iconColor: 'text-fintech-orange dark:text-fintech-orange-light',
  },
  {
    id: 3,
    title: 'Номинальный сервис',
    description: 'Предоставление номинальных директоров и акционеров для вашей компании с соблюдением всех юридических норм.',
    icon: Shield,
    color: 'bg-emerald-50 dark:bg-emerald-950',
    iconColor: 'text-emerald-500',
  },
  {
    id: 4,
    title: 'Финансовые лицензии',
    description: 'Получение лицензий на финансовую деятельность, включая платежные решения и криптовалютные операции.',
    icon: Award,
    color: 'bg-purple-50 dark:bg-purple-950',
    iconColor: 'text-purple-500',
  },
];

export function ServicesSection() {
  return (
    <section className="section-padding bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-fintech-blue/10 text-fintech-blue dark:bg-fintech-blue/20 dark:text-fintech-blue-light mb-4">
            <span className="flex h-2 w-2 rounded-full bg-fintech-blue mr-2"></span>
            О сервисе
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Комплексные финансовые решения для вашего бизнеса
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Мы предлагаем широкий спектр услуг, направленных на развитие и оптимизацию вашего бизнеса в международном контексте.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className="glass-card rounded-xl p-8 transition-transform duration-300 hover:translate-y-[-8px] animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`${service.color} rounded-full p-4 inline-flex items-center justify-center mb-5`}>
                <service.icon className={`h-6 w-6 ${service.iconColor}`} />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">{service.title}</h3>
              <p className="text-muted-foreground mb-6">{service.description}</p>
              <Button variant="ghost" className="p-0 h-auto text-fintech-blue hover:text-fintech-blue-dark dark:text-fintech-blue-light flex items-center gap-2 group">
                Подробнее
                <span className="transition-transform duration-300 transform group-hover:translate-x-1">→</span>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
