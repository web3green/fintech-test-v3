
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Send, Mail, Phone, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function ContactForm() {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  
  // Replace with your actual Make webhook URL
  const MAKE_WEBHOOK_URL = "https://hook.eu1.make.com/yourwebhookendpoint";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (value: string) => {
    setFormData(prev => ({ ...prev, service: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Send data to Make webhook
      const response = await fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
          source: window.location.href
        }),
        mode: 'no-cors' // Use no-cors mode since webhook may not support CORS
      });
      
      console.log('Form submitted to Make webhook:', formData);
      toast.success(t('contact.success'));
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred while submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Telegram link - replace with your actual Telegram username or link
  const telegramLink = "https://t.me/fintech_assist";

  return (
    <section id="contact" className="section-padding bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900 contact-form-section">
      <div className="container mx-auto px-4">
        {/* Instant Contact Banner */}
        <div className="mb-10 animate-fade-up">
          <div className="bg-fintech-blue rounded-xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-fintech-blue to-transparent opacity-80"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-fintech-orange/20 rounded-full mix-blend-overlay filter blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-display font-bold mb-2">{t('contact.instant.title')}</h3>
                <p className="text-white/80 max-w-lg">
                  {t('contact.instant.subtitle')}
                </p>
              </div>
              
              <a 
                href={telegramLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 bg-white text-fintech-blue font-medium px-6 py-3 rounded-full hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <MessageCircle className="h-5 w-5" />
                <span>{t('contact.instant.button')}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden max-w-5xl mx-auto shadow-xl animate-fade-up">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-12 bg-fintech-blue text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-fintech-orange rounded-full mix-blend-overlay filter blur-3xl"></div>
              </div>
              
              <div className="relative z-10">
                <h2 className="text-3xl font-display font-bold mb-6">{t('contact.title')}</h2>
                <p className="mb-8 text-white/80">
                  {t('contact.subtitle')}
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="rounded-full bg-white/20 p-2 mr-4">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{t('contact.email')}</h3>
                      <p className="text-white/80">info@fintech-assist.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="rounded-full bg-white/20 p-2 mr-4">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{t('contact.phone')}</h3>
                      <p className="text-white/80">+44 7450 574905</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="rounded-full bg-white/20 p-2 mr-4">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{t('contact.telegram')}</h3>
                      <p className="text-white/80">@fintech_assist</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8 md:p-12">
              <h3 className="text-2xl font-display font-bold mb-6">{t('contact.form.title')}</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('contact.form.name')}</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="John Doe" 
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">{t('contact.form.email')}</Label>
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
                  <Label htmlFor="phone">{t('contact.form.phone')}</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    placeholder="+44 7123 456789" 
                    required
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="service">{t('contact.form.service')}</Label>
                  <Select value={formData.service} onValueChange={handleServiceChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('contact.form.select')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="company_registration">{t('contact.service.registration')}</SelectItem>
                      <SelectItem value="bank_account">{t('contact.service.accounts')}</SelectItem>
                      <SelectItem value="nominee_service">{t('contact.service.nominee')}</SelectItem>
                      <SelectItem value="license">{t('contact.service.licenses')}</SelectItem>
                      <SelectItem value="other">{t('contact.service.other')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">{t('contact.form.message')}</Label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    rows={4} 
                    placeholder="Tell us more about your request..."
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
                      {t('contact.form.sending')}
                    </>
                  ) : (
                    <>{t('contact.form.submit')}</>
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
