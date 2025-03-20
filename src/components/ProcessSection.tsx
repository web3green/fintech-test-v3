
import { ClipboardCheck, FileText, CheckCircle } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Оставьте заявку',
    description: 'Заполните форму на сайте или свяжитесь с нами любым удобным способом.',
    icon: ClipboardCheck,
  },
  {
    id: 2,
    title: 'Подготовка документов',
    description: 'Наши специалисты подготовят необходимые документы и проконсультируют по всем вопросам.',
    icon: FileText,
  },
  {
    id: 3,
    title: 'Получите готовое решение',
    description: 'Мы выполним все необходимые действия и предоставим вам готовое решение под ключ.',
    icon: CheckCircle,
  },
];

export function ProcessSection() {
  return (
    <section className="section-padding">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-fintech-blue/10 text-fintech-blue dark:bg-fintech-blue/20 dark:text-fintech-blue-light mb-4">
            <span className="flex h-2 w-2 rounded-full bg-fintech-blue mr-2"></span>
            Как это работает
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Простой путь к успешному решению
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Мы сделали процесс максимально простым и понятным. Всего три шага отделяют вас от реализации ваших целей.
          </p>
        </div>
        
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-[calc(16.66%-0.5rem)] right-[calc(16.66%-0.5rem)] h-0.5 bg-gray-200 dark:bg-gray-800 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className="relative flex flex-col items-center text-center animate-fade-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative z-10 glass-card rounded-full p-6 mb-6 shadow-lg hover-scale">
                  <div className="rounded-full bg-fintech-blue dark:bg-fintech-blue p-3">
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 -translate-y
                
                -1/2 w-8 h-8 rounded-full bg-white dark:bg-gray-900 border-2 border-fintech-blue dark:border-fintech-blue flex items-center justify-center text-sm font-bold text-fintech-blue dark:text-fintech-blue z-10">
                  {step.id}
                </div>
                <h3 className="text-xl font-display font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
