import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const [webhookUrl, setWebhookUrl] = useState<string | null>(null);

  // Загружаем URL вебхука из localStorage при монтировании компонента
  useEffect(() => {
    const storedWebhookUrl = localStorage.getItem('webhookUrl');
    setWebhookUrl(storedWebhookUrl);
  }, []);

  // Получаем email адреса для уведомлений
  const emailAddresses = ['info@fintech-assist.com', 'greg@fintech-assist.com', 'alex@fintech-assist.com'];
  // Используем первый email для FormSubmit, остальные добавляем в CC
  const primaryEmail = emailAddresses[0];
  const ccEmails = emailAddresses.slice(1).join(',');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (value: string) => {
    setFormData(prev => ({ ...prev, service: value }));
  };

  // Функция для отправки данных на вебхук
  const triggerWebhook = async (formData: FormData) => {
    if (!webhookUrl) return;
    
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors", // Обработка проблем с CORS
        body: JSON.stringify({
          event: "new_contact_request",
          request: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            service: formData.service,
            message: formData.message,
            created_at: new Date().toISOString()
          },
          timestamp: new Date().toISOString()
        }),
      });
      console.log('Webhook triggered successfully');
    } catch (error) {
      console.error('Error triggering webhook:', error);
    }
  };

  // Обработчик отправки формы - вызывается перед отправкой через FormSubmit
  const handleSubmit = (e: React.FormEvent) => {
    // Не предотвращаем стандартную отправку формы (это делает FormSubmit)
    // Но если есть вебхук, отправляем данные и туда
    if (webhookUrl) {
      triggerWebhook(formData);
    }
  };

  return (
    <div className="p-8 md:p-12 md:w-2/3">
      <h3 className="text-2xl font-bold text-white mb-6">{t('contact.form.title')}</h3>
      <form 
        action={`https://formsubmit.co/${primaryEmail}`} 
        method="POST" 
        className="space-y-6"
        onSubmit={handleSubmit}
      >
        {/* FormSubmit скрытые поля для настройки */}
        <input type="hidden" name="_subject" value={language === 'en' ? "New Contact Form Submission" : "Новая заявка с сайта"} />
        <input type="hidden" name="_template" value="table" />
        <input type="hidden" name="_cc" value={ccEmails} />
        <input type="hidden" name="_next" value={window.location.origin + "?thankyou=true"} />
        <input type="hidden" name="_captcha" value="true" />
        <input type="hidden" name="_autoresponse" value={language === 'en' 
          ? "Thank you for contacting FinTech Assist. We have received your inquiry and will get back to you shortly." 
          : "Спасибо за обращение в FinTech Assist. Мы получили вашу заявку и скоро свяжемся с вами."} />
        
        {/* Передаем webhook URL если он настроен */}
        {webhookUrl && <input type="hidden" name="_webhook" value={webhookUrl} />}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white/90 dark:text-white/80">{t('contact.form.name')}</Label>
            <Input 
              id="name" 
              name="name" 
              autoComplete="name"
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
              autoComplete="email"
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
              type="tel"
              autoComplete="tel"
              placeholder="+44 7123 456789" 
              value={formData.phone}
              onChange={handleChange}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-fintech-orange/80 dark:focus-visible:ring-fintech-orange/60 dark:bg-white/5 dark:border-white/10"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="service" className="text-white/90 dark:text-white/80">{t('contact.form.service')}</Label>
            <Select name="service" value={formData.service} onValueChange={handleServiceChange}>
              <SelectTrigger 
                id="service" 
                className="bg-white/10 border-white/20 text-white focus:ring-fintech-orange/80 dark:focus:ring-fintech-orange/60 dark:bg-white/5 dark:border-white/10"
              >
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
            {/* Скрытое поле для отправки значения Select через FormSubmit */}
            <input type="hidden" name="service" value={formData.service} />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="message" className="text-white/90 dark:text-white/80">{t('contact.form.message')}</Label>
          <Textarea 
            id="message" 
            name="message" 
            rows={4} 
            autoComplete="off"
            placeholder={language === 'en' ? 'Your message' : 'Ваше сообщение'}
            value={formData.message}
            onChange={handleChange}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-fintech-orange/80 dark:focus-visible:ring-fintech-orange/60 dark:bg-white/5 dark:border-white/10"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-fintech-orange hover:bg-fintech-orange-dark dark:bg-fintech-orange/80 dark:hover:bg-fintech-orange/90 text-white button-glow dark:shadow-fintech-orange/20"
        >
          {t('contact.form.submit')}
        </Button>
      </form>
    </div>
  );
}
