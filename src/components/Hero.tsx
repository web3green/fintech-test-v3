
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-24 pb-16 md:pb-24 lg:pb-32 overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-[400px] -right-[400px] w-[800px] h-[800px] rounded-full bg-fintech-blue/10 blur-3xl" />
        <div className="absolute -bottom-[400px] -left-[400px] w-[800px] h-[800px] rounded-full bg-fintech-orange/10 blur-3xl" />
      </div>
      
      <div className="container relative z-10 mx-auto px-4 pt-12 md:pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-fintech-blue/10 text-fintech-blue dark:bg-fintech-blue/20 dark:text-fintech-blue-light mb-6 animate-fade-down">
              <span className="flex h-2 w-2 rounded-full bg-fintech-blue mr-2"></span>
              Финансовые решения для бизнеса
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight font-display mb-6 animate-fade-down animate-delay-100">
              <span className="text-gradient">Fintech-Assist:</span> Ваш партнер в мире финансовых решений
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0 animate-fade-down animate-delay-200">
              Открытие компаний, счетов и лицензий под ключ. Мы помогаем предпринимателям реализовать их финансовые цели.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-down animate-delay-300">
              <Button size="lg" className="bg-fintech-blue hover:bg-fintech-blue-dark text-white button-glow w-full sm:w-auto">
                Оставить заявку
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Наши услуги
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 animate-fade-down animate-delay-400">
              <div className="flex flex-col items-center lg:items-start">
                <p className="text-3xl font-bold text-fintech-blue dark:text-fintech-blue-light">500+</p>
                <p className="text-sm text-muted-foreground">Клиентов</p>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <p className="text-3xl font-bold text-fintech-blue dark:text-fintech-blue-light">50+</p>
                <p className="text-sm text-muted-foreground">Стран</p>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <p className="text-3xl font-bold text-fintech-blue dark:text-fintech-blue-light">98%</p>
                <p className="text-sm text-muted-foreground">Успешных кейсов</p>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/80 dark:to-black/20 z-10"></div>
            <div className="relative z-0 rounded-xl overflow-hidden shadow-2xl animate-float">
              <div className="aspect-[4/3] bg-gradient-to-br from-fintech-blue/90 to-fintech-blue-dark rounded-xl">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="glass-card rounded-xl p-6 w-4/5 mx-auto shadow-lg transform rotate-3 animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="h-10 w-10 rounded-full bg-fintech-orange flex items-center justify-center text-white font-bold text-sm">FA</div>
                        <div className="text-sm font-medium">FintechAssist</div>
                      </div>
                      <div className="text-xs opacity-60">Лицензия №12345</div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="w-full h-4 bg-gray-200/30 rounded"></div>
                      <div className="w-2/3 h-4 bg-gray-200/30 rounded"></div>
                      <div className="w-3/4 h-4 bg-gray-200/30 rounded"></div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-xs opacity-60">Компания</div>
                        <div className="mt-1 font-medium">OceanTrade Ltd</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs opacity-60">Юрисдикция</div>
                        <div className="mt-1 font-medium">Сингапур</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-4 right-4 glass-card rounded-lg p-4 w-2/3 shadow-lg transform -rotate-6 animate-fade-in animate-delay-500">
                  <div className="text-sm font-medium mb-2">Открытие счета</div>
                  <div className="flex justify-between items-center">
                    <div className="h-2 w-16 bg-gray-200/30 rounded"></div>
                    <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-fintech-orange rounded-full animate-float animate-delay-700"></div>
            <div className="absolute top-4 right-4 w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-lg animate-float animate-delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
