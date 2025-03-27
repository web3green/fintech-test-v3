
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const [animating, setAnimating] = useState(false);
  
  // Более надежный механизм переключения языка
  const toggleLanguage = () => {
    if (animating) return; // Предотвращаем двойные клики
    
    setAnimating(true);
    
    const newLanguage = language === 'en' ? 'ru' : 'en';
    console.log(`🌍 Переключение языка: ${language} -> ${newLanguage}`);
    
    // Сначала обновим localStorage напрямую для обеспечения синхронизации
    try {
      localStorage.setItem('language', newLanguage);
    } catch (e) {
      console.warn('Ошибка при сохранении языка в localStorage:', e);
    }
    
    // Затем вызовем setLanguage для обновления контекста
    setLanguage(newLanguage);
    
    // Добавим также атрибуты к HTML для гарантии стилей
    document.documentElement.setAttribute('lang', newLanguage);
    document.documentElement.setAttribute('data-language', newLanguage);
    
    // Вызовем события для обновления компонентов
    window.dispatchEvent(new CustomEvent('language:changed', { detail: { language: newLanguage } }));
    
    // Принудительное обновление стилей
    document.documentElement.style.opacity = '0.99';
    setTimeout(() => {
      document.documentElement.style.opacity = '1';
      setAnimating(false);
    }, 100);
  };
  
  // Синхронизация с localStorage при монтировании
  useEffect(() => {
    try {
      const storedLang = localStorage.getItem('language');
      if (storedLang && storedLang !== language && (storedLang === 'en' || storedLang === 'ru')) {
        console.log(`🌍 LanguageToggle: обнаружено несоответствие языка. Storage: ${storedLang}, Context: ${language}`);
        setLanguage(storedLang as 'en' | 'ru');
      }
    } catch (e) {
      console.warn('Ошибка при чтении языка из localStorage:', e);
    }
  }, []);
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleLanguage}
      disabled={animating}
      className="flex items-center gap-2 transition-all duration-300"
      data-language={language}
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-medium">
        {language === 'en' ? 'EN' : 'RU'}
      </span>
      
      {/* Скрытый элемент для принудительного обновления */}
      <span className="language-update-trigger" key={`lang-trigger-${Date.now()}`}></span>
    </Button>
  );
}
