
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Send } from 'lucide-react';

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (value: string) => {
    setFormData(prev => ({ ...prev, service: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      toast.success('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: '',
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <section className="section-padding bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="glass-card rounded-2xl overflow-hidden max-w-5xl mx-auto shadow-xl animate-fade-up">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-12 bg-fintech-blue text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-fintech-orange rounded-full mix-blend-overlay filter blur-3xl"></div>
              </div>
              
              <div className="relative z-10">
                <h2 className="text-3xl font-display font-bold mb-6">Готовы начать?</h2>
                <p className="mb-8 text-white/80">
                  Оставьте заявку, и наш специалист свяжется с вами для консультации по вашему вопросу.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="rounded-full bg-white/20 p-2 mr-4">
                      <Send className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Электронная почта</h3>
                      <p className="text-white/80">info@fintech-assist.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="rounded-full bg-white/20 p-2 mr-4">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Телефон</h3>
                      <p className="text-white/80">+7 (123) 456-78-90</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="rounded-full bg-white/20 p-2 mr-4">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Адрес</h3>
                      <p className="text-white/80">Москва, ул. Финансовая, 123</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8 md:p-12">
              <h3 className="text-2xl font-display font-bold mb-6">Оставить заявку</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Ваше имя</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="Иван Иванов" 
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Электронная почта</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    placeholder="+7 (___) ___-__-__" 
                    required
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="service">Интересующая услуга</Label>
                  <Select value={formData.service} onValueChange={handleServiceChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите услугу" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="company_registration">Регистрация компаний</SelectItem>
                      <SelectItem value="bank_account">Открытие счетов</SelectItem>
                      <SelectItem value="nominee_service">Номинальный сервис</SelectItem>
                      <SelectItem value="license">Финансовые лицензии</SelectItem>
                      <SelectItem value="other">Другое</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Комментарий</Label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    rows={4} 
                    placeholder="Расскажите больше о вашем запросе..."
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-fintech-blue hover:bg-fintech-blue-dark text-white button-glow"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Отправка...
                    </>
                  ) : (
                    <>Отправить заявку</>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
