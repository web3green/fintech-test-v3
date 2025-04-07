import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { processContactForm } from '@/utils/contactApi';

interface FormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export function ContactFormFields() {
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Process the form submission using the utility function
      await processContactForm({
        name: formData.name,
        email: formData.email,
        message: `Phone: ${formData.phone}\nService: ${formData.service}\nMessage: ${formData.message}`,
      });
      
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
      toast.error(language === 'en' ? 'Error sending message. Please try again.' : 'Ошибка отправки сообщения. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 md:p-12 md:w-2/3">
      <h3 className="text-2xl font-bold text-white mb-6">{t('contact.form.title')}</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white/90 dark:text-white/80">{t('contact.form.name')}</Label>
            <Input 
              id="name" 
              name="name" 
              placeholder={language === 'en' ? 'Your name' : 'Ваше имя'}
              required
              value={formData.name}
              onChange={handleChange}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-fintech-orange/80 dark:focus-visible:ring-fintech-orange/60 dark:bg-white/5 dark:border-white/10"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/90 dark:text-white/80">{t('contact.form.email')}</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder={language === 'en' ? 'Your email' : 'Ваша электронная почта'}
              required
              value={formData.email}
              onChange={handleChange}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-fintech-orange/80 dark:focus-visible:ring-fintech-orange/60 dark:bg-white/5 dark:border-white/10"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white/90 dark:text-white/80">{t('contact.form.phone')}</Label>
            <Input 
              id="phone" 
              name="phone" 
              placeholder="+44 7123 456789" 
              required
              value={formData.phone}
              onChange={handleChange}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-fintech-orange/80 dark:focus-visible:ring-fintech-orange/60 dark:bg-white/5 dark:border-white/10"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="service" className="text-white/90 dark:text-white/80">{t('contact.form.service')}</Label>
            <Select value={formData.service} onValueChange={handleServiceChange}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white focus:ring-fintech-orange/80 dark:focus:ring-fintech-orange/60 dark:bg-white/5 dark:border-white/10">
                <SelectValue placeholder={t('contact.form.select')} />
              </SelectTrigger>
              <SelectContent className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-white/20 dark:border-white/10">
                <SelectItem value="company_registration" className="text-gray-900 dark:text-white/90 hover:bg-fintech-orange/10 dark:hover:bg-fintech-orange/20">{t('contact.service.registration')}</SelectItem>
                <SelectItem value="bank_account" className="text-gray-900 dark:text-white/90 hover:bg-fintech-orange/10 dark:hover:bg-fintech-orange/20">{t('contact.service.accounts')}</SelectItem>
                <SelectItem value="nominee_service" className="text-gray-900 dark:text-white/90 hover:bg-fintech-orange/10 dark:hover:bg-fintech-orange/20">{t('contact.service.nominee')}</SelectItem>
                <SelectItem value="license" className="text-gray-900 dark:text-white/90 hover:bg-fintech-orange/10 dark:hover:bg-fintech-orange/20">{t('contact.service.licenses')}</SelectItem>
                <SelectItem value="other" className="text-gray-900 dark:text-white/90 hover:bg-fintech-orange/10 dark:hover:bg-fintech-orange/20">{t('contact.service.other')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="message" className="text-white/90 dark:text-white/80">{t('contact.form.message')}</Label>
          <Textarea 
            id="message" 
            name="message" 
            rows={4} 
            placeholder={language === 'en' ? 'Your message' : 'Ваше сообщение'}
            value={formData.message}
            onChange={handleChange}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-fintech-orange/80 dark:focus-visible:ring-fintech-orange/60 dark:bg-white/5 dark:border-white/10"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-fintech-orange hover:bg-fintech-orange-dark dark:bg-fintech-orange/80 dark:hover:bg-fintech-orange/90 text-white button-glow dark:shadow-fintech-orange/20"
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
  );
}
