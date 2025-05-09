import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from '@/contexts/LanguageContext';

interface PrivacyPolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrivacyPolicyDialog({ open, onOpenChange }: PrivacyPolicyDialogProps) {
  const { language } = useLanguage();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">
            {language === 'en' ? 'Privacy Policy' : 'Политика конфиденциальности'}
          </DialogTitle>
          <DialogDescription>
            {language === 'en' ? 'Last updated: February 2025' : 'Последнее обновление: Февраль 2025'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-left">
          {language === 'en' ? (
            <>
              <p>At FinTechAssist, we take your privacy seriously. This Privacy Policy describes how we collect, use, and share your personal information when you use our services.</p>
              
              <h3 className="text-lg font-semibold mt-6">Information We Collect</h3>
              <p>We collect information you provide directly to us, such as when you create an account, fill out a form, or communicate with us. This may include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Contact information (name, email address, phone number)</li>
                <li>Business information (company name, registration details)</li>
                <li>Financial information necessary for our services</li>
                <li>Communications you send to us</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-6">How We Use Your Information</h3>
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Send you technical notices, updates, and administrative messages</li>
                <li>Comply with legal obligations</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-6">Information Sharing</h3>
              <p>We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Service providers who perform services on our behalf</li>
                <li>Professional advisors, such as lawyers and accountants</li>
                <li>Regulatory authorities when required by law</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-6">Data Security</h3>
              <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, disclosure, alteration, and destruction.</p>
              
              <h3 className="text-lg font-semibold mt-6">Your Rights</h3>
              <p>Depending on your location, you may have rights regarding your personal information, including the right to access, correct, delete, or restrict the processing of your data.</p>
              
              <h3 className="text-lg font-semibold mt-6">Contact Us</h3>
              <p>If you have any questions about this Privacy Policy, please contact us at info@fintech-assist.com.</p>
            </>
          ) : (
            <>
              <p>В FinTechAssist мы серьезно относимся к вашей конфиденциальности. Эта Политика конфиденциальности описывает, как мы собираем, используем и делимся вашей личной информацией при использовании наших услуг.</p>
              
              <h3 className="text-lg font-semibold mt-6">Информация, которую мы собираем</h3>
              <p>Мы собираем информацию, которую вы предоставляете нам напрямую, например, при создании учетной записи, заполнении формы или общении с нами. Это может включать:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Контактная информация (имя, адрес электронной почты, номер телефона)</li>
                <li>Бизнес-информация (название компании, регистрационные данные)</li>
                <li>Финансовая информация, необходимая для наших услуг</li>
                <li>Сообщения, которые вы отправляете нам</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-6">Как мы используем вашу информацию</h3>
              <p>Мы используем вашу информацию для:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Предоставления, поддержки и улучшения наших услуг</li>
                <li>Обработки транзакций и отправки связанной информации</li>
                <li>Ответа на ваши комментарии, вопросы и запросы</li>
                <li>Отправки технических уведомлений, обновлений и административных сообщений</li>
                <li>Соблюдения юридических обязательств</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-6">Обмен информацией</h3>
              <p>Мы можем делиться вашей информацией с:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Поставщиками услуг, которые выполняют услуги от нашего имени</li>
                <li>Профессиональными консультантами, такими как юристы и бухгалтеры</li>
                <li>Регулирующими органами, когда этого требует закон</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-6">Безопасность данных</h3>
              <p>Мы внедряем соответствующие технические и организационные меры для защиты вашей личной информации от несанкционированного доступа, раскрытия, изменения и уничтожения.</p>
              
              <h3 className="text-lg font-semibold mt-6">Ваши права</h3>
              <p>В зависимости от вашего местоположения, у вас могут быть права в отношении вашей личной информации, включая право на доступ, исправление, удаление или ограничение обработки ваших данных.</p>
              
              <h3 className="text-lg font-semibold mt-6">Свяжитесь с нами</h3>
              <p>Если у вас есть какие-либо вопросы об этой Политике конфиденциальности, пожалуйста, свяжитесь с нами по адресу info@fintech-assist.com.</p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Добавляем экспорт по умолчанию
export default PrivacyPolicyDialog;
