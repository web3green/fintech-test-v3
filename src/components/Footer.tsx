
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-display font-bold text-fintech-blue dark:text-fintech-blue-light">
              Fintech<span className="text-fintech-orange">Assist</span>
            </h3>
            <p className="text-muted-foreground max-w-xs">
              Ваш надежный партнер в мире финансовых решений. Мы помогаем компаниям и предпринимателям развивать бизнес.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-500 hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Ссылки</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                  О нас
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                  Услуги
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                  Блог
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Услуги</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                  Регистрация компаний
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                  Открытие счетов
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                  Номинальный сервис
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                  Финансовые лицензии
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Контакты</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-fintech-blue dark:text-fintech-blue-light flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  Москва, ул. Финансовая, 123
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-fintech-blue dark:text-fintech-blue-light flex-shrink-0" />
                <a href="tel:+71234567890" className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                  +7 (123) 456-78-90
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-fintech-blue dark:text-fintech-blue-light flex-shrink-0" />
                <a href="mailto:info@fintech-assist.com" className="text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                  info@fintech-assist.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © {currentYear} FintechAssist. Все права защищены.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                Политика конфиденциальности
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-fintech-blue dark:hover:text-fintech-blue-light transition-colors">
                Условия использования
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
