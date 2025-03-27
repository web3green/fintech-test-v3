
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const [animating, setAnimating] = useState(false);
  
  // Усовершенствованный механизм переключения языка
  const toggleLanguage = () => {
    if (animating) return; // Предотвращаем двойные клики
    
    setAnimating(true);
    
    const newLanguage = language === 'en' ? 'ru' : 'en';
    console.log(`🌍 Переключение языка: ${language} -> ${newLanguage}`);
    
    // Сначала обновим localStorage напрямую для обеспечения синхронизации
    try {
      localStorage.setItem('language', newLanguage);
      // Также добавим временную метку для гарантии обновления при следующей загрузке
      localStorage.setItem('language_updated', Date.now().toString());
    } catch (e) {
      console.warn('Ошибка при сохранении языка в localStorage:', e);
    }
    
    // Затем вызовем setLanguage для обновления контекста
    setLanguage(newLanguage);
    
    // Добавим также атрибуты к HTML для гарантии стилей
    document.documentElement.setAttribute('lang', newLanguage);
    document.documentElement.setAttribute('data-language', newLanguage);
    
    // Вызовем события для обновления компонентов
    window.dispatchEvent(new CustomEvent('language:changed', { 
      detail: { language: newLanguage, timestamp: Date.now() } 
    }));
    
    // Агрессивное обновление кэша стилей
    document.querySelectorAll('link[rel="stylesheet"]').forEach(linkEl => {
      if (linkEl instanceof HTMLLinkElement && linkEl.href) {
        const url = new URL(linkEl.href);
        url.searchParams.set('_lang', `${newLanguage}_${Date.now()}`);
        
        // Создаем новый элемент стиля для принудительной перезагрузки
        const newLink = document.createElement('link');
        newLink.rel = 'stylesheet';
        newLink.href = url.toString();
        newLink.onload = () => {
          try {
            // После загрузки нового стиля удаляем старый
            linkEl.remove();
          } catch (e) {
            console.warn('Не удалось удалить старый стиль:', e);
          }
        };
        document.head.appendChild(newLink);
      }
    });
    
    // Показываем небольшое уведомление о смене языка
    toast({
      title: newLanguage === 'ru' ? "Язык изменен на Русский" : "Language changed to English",
      duration: 2000,
    });
    
    // Принудительное обновление стилей и всех компонентов
    document.documentElement.style.opacity = '0.99';
    setTimeout(() => {
      document.documentElement.style.opacity = '1';
      
      // Создаем временный стиль для принудительного обновления
      const forceStyle = document.createElement('style');
      forceStyle.textContent = `
        [data-language="${newLanguage}"] * {
          animation: lang-update 1ms;
        }
        @keyframes lang-update {
          from { opacity: 0.99; }
          to { opacity: 1; }
        }
      `;
      document.head.appendChild(forceStyle);
      
      // Принудительно обновляем все компоненты с атрибутом data-language
      document.querySelectorAll('[data-language]').forEach(el => {
        el.setAttribute('data-language-change', Date.now().toString());
      });
      
      // Распространяем событие смены языка глубже в DOM
      document.querySelectorAll('.force-update-on-language-change').forEach(el => {
        // Создадим временный DOM-элемент для триггера перерисовки
        const trigger = document.createElement('span');
        trigger.className = 'language-update-trigger';
        trigger.style.display = 'none';
        trigger.dataset.timestamp = Date.now().toString();
        
        // Добавим и затем удалим для гарантированного перерендера
        el.appendChild(trigger);
        setTimeout(() => trigger.remove(), 100);
        
        // Также обновим любые ключи компонентов если есть
        if (el.hasAttribute('key')) {
          el.setAttribute('key', `${el.getAttribute('key')}-${Date.now()}`);
        }
      });
      
      // Удаляем временный стиль через секунду
      setTimeout(() => {
        forceStyle.remove();
        setAnimating(false);
        
        // Дополнительная проверка после окончания анимации для гарантии обновления
        if (document.documentElement.getAttribute('lang') !== newLanguage) {
          console.warn('Обнаружено несоответствие языков после анимации, исправляем...');
          document.documentElement.setAttribute('lang', newLanguage);
          document.documentElement.setAttribute('data-language', newLanguage);
        }
        
        // Запускаем дополнительный обход DOM для поиска неактуализированных элементов
        document.querySelectorAll('[data-i18n]').forEach(el => {
          el.setAttribute('data-i18n-updated', Date.now().toString());
        });
        
        // Запускаем глобальное событие для обновления любых компонентов,
        // которые могут слушать его для обновления своего содержимого
        window.dispatchEvent(new Event('forceRender'));
        
      }, 1000);
    }, 100);
  };
  
  // Синхронизация с localStorage при монтировании и фокусе окна
  useEffect(() => {
    const syncLanguage = () => {
      try {
        const storedLang = localStorage.getItem('language');
        if (storedLang && storedLang !== language && (storedLang === 'en' || storedLang === 'ru')) {
          console.log(`🌍 LanguageToggle: обнаружено несоответствие языка. Storage: ${storedLang}, Context: ${language}`);
          setLanguage(storedLang as 'en' | 'ru');
          
          // Убедимся, что HTML также имеет правильные атрибуты
          if (document.documentElement.getAttribute('lang') !== storedLang) {
            document.documentElement.setAttribute('lang', storedLang);
            document.documentElement.setAttribute('data-language', storedLang);
          }
        }
      } catch (e) {
        console.warn('Ошибка при чтении языка из localStorage:', e);
      }
    };

    // Синхронизация при монтировании
    syncLanguage();
    
    // Добавляем слушатель для синхронизации при возвращении фокуса на страницу
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Страница стала видимой - проверяем язык');
        syncLanguage();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Также добавим проверку через несколько секунд после монтирования
    // для устранения проблем асинхронной загрузки
    const timeoutId = setTimeout(syncLanguage, 2000);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(timeoutId);
    };
  }, [language, setLanguage]);
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleLanguage}
      disabled={animating}
      className="flex items-center gap-2 transition-all duration-300"
      data-language={language}
      aria-label={language === 'en' ? "Switch to Russian" : "Переключить на английский"}
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-medium">
        {language === 'en' ? 'EN' : 'RU'}
      </span>
      
      {/* Используем ключ на основе timestamp для принудительного обновления */}
      <span className="language-update-trigger sr-only" key={`lang-trigger-${Date.now()}`}>
        {language}
      </span>
    </Button>
  );
}
