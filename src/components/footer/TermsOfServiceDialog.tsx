
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from '@/contexts/LanguageContext';

interface TermsOfServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TermsOfServiceDialog({ open, onOpenChange }: TermsOfServiceDialogProps) {
  const { language } = useLanguage();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">
            {language === 'en' ? 'Terms of Service' : 'Условия использования'}
          </DialogTitle>
          <DialogDescription>
            {language === 'en' ? 'Last updated: June 2023' : 'Последнее обновление: Июнь 2023'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-left">
          {language === 'en' ? (
            <>
              <p>Welcome to FinTechAssist. By accessing or using our services, you agree to be bound by these Terms of Service.</p>
              
              <h3 className="text-lg font-semibold mt-6">Our Services</h3>
              <p>FinTechAssist provides financial technology consulting and licensing services to businesses worldwide. We offer company formation, financial licensing, payment solutions, cryptocurrency regulation guidance, and tax planning services.</p>
              
              <h3 className="text-lg font-semibold mt-6">Client Responsibilities</h3>
              <p>When using our services, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the confidentiality of any account information</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Use our services only for lawful purposes</li>
                <li>Pay all fees and charges incurred through your use of our services</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-6">Intellectual Property</h3>
              <p>All content, features, and functionality of our services, including text, graphics, logos, and software, are owned by FinTechAssist and are protected by international copyright, trademark, and other intellectual property laws.</p>
              
              <h3 className="text-lg font-semibold mt-6">Limitation of Liability</h3>
              <p>To the maximum extent permitted by law, FinTechAssist shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from your use of our services.</p>
              
              <h3 className="text-lg font-semibold mt-6">Governing Law</h3>
              <p>These Terms shall be governed and construed in accordance with the laws of the United Kingdom, without regard to its conflict of law provisions.</p>
              
              <h3 className="text-lg font-semibold mt-6">Changes to Terms</h3>
              <p>We reserve the right to modify these Terms at any time. We will provide notice of significant changes by posting the updated Terms on our website. Your continued use of our services after such modifications will constitute your acknowledgment of the modified Terms.</p>
              
              <h3 className="text-lg font-semibold mt-6">Contact Us</h3>
              <p>If you have any questions about these Terms, please contact us at info@fintech-assist.com.</p>
            </>
          ) : (
            <>
              <p>Добро пожаловать в FinTechAssist. Получая доступ к нашим услугам или используя их, вы соглашаетесь соблюдать настоящие Условия использования.</p>
              
              <h3 className="text-lg font-semibold mt-6">Наши услуги</h3>
              <p>FinTechAssist предоставляет услуги консультирования в области финансовых технологий и лицензирования для компаний по всему миру. Мы предлагаем услуги по формированию компаний, финансовому лицензированию, платежным решениям, руководству по регулированию криптовалют и налоговому планированию.</p>
              
              <h3 className="text-lg font-semibold mt-6">Обязанности клиента</h3>
              <p>При использовании наших услуг вы соглашаетесь:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Предоставлять точную и полную информацию</li>
                <li>Сохранять конфиденциальность любой информации об учетной записи</li>
                <li>Соблюдать все применимые законы и правила</li>
                <li>Использовать наши услуги только в законных целях</li>
                <li>Оплачивать все сборы и платежи, понесенные при использовании наших услуг</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-6">Интеллектуальная собственность</h3>
              <p>Весь контент, функции и функциональность наших услуг, включая текст, графику, логотипы и программное обеспечение, принадлежат FinTechAssist и защищены международными законами об авторском праве, товарных знаках и другими законами об интеллектуальной собственности.</p>
              
              <h3 className="text-lg font-semibold mt-6">Ограничение ответственности</h3>
              <p>В максимальной степени, разрешенной законом, FinTechAssist не несет ответственности за любые косвенные, случайные, особые, последующие или штрафные убытки, или любую потерю прибыли или доходов, понесенных прямо или косвенно, или любую потерю данных, использования, репутации или других нематериальных убытков, возникающих в результате использования вами наших услуг.</p>
              
              <h3 className="text-lg font-semibold mt-6">Применимое право</h3>
              <p>Настоящие Условия регулируются и толкуются в соответствии с законодательством Великобритании, без учета его положений о конфликте законов.</p>
              
              <h3 className="text-lg font-semibold mt-6">Изменения в условиях</h3>
              <p>Мы оставляем за собой право изменять эти Условия в любое время. Мы уведомим о существенных изменениях, разместив обновленные Условия на нашем веб-сайте. Продолжение использования вами наших услуг после таких изменений будет означать ваше признание измененных Условий.</p>
              
              <h3 className="text-lg font-semibold mt-6">Свяжитесь с нами</h3>
              <p>Если у вас есть какие-либо вопросы об этих Условиях, пожалуйста, свяжитесь с нами по адресу info@fintech-assist.com.</p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
