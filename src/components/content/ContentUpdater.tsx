
import { useCallback } from 'react';
import { VisibilityHandler } from '../handlers/VisibilityHandler';
import { StorageChangeHandler } from '../handlers/StorageChangeHandler';

interface ContentUpdaterProps {
  language: string;
  setForceUpdate: (prevState: number) => number;
}

export const ContentUpdater: React.FC<ContentUpdaterProps> = ({ language, setForceUpdate }) => {
  const handleVisibilityChange = useCallback(() => {
    console.log('Страница стала видимой - обновляем контент');
    // Проверка языка
    const storedLang = localStorage.getItem('language');
    const currentLangAttr = document.documentElement.getAttribute('lang');
    
    if (storedLang && storedLang !== currentLangAttr) {
      console.log('Обнаружено несоответствие языков при возвращении на страницу:', 
                 { stored: storedLang, current: currentLangAttr });
                 
      // Принудительное обновление страницы при несоответствии
      window.location.reload();
    } else {
      // Иначе просто обновляем компоненты
      setForceUpdate(prev => prev + 1);
    }
  }, [setForceUpdate]);

  const handleStorageChange = useCallback((key: string, newValue: string | null) => {
    if (key === 'language' && newValue) {
      console.log('Изменение языка обнаружено через localStorage:', newValue);
      
      // Проверить текущий язык контекста
      const htmlLang = document.documentElement.getAttribute('lang');
      if (htmlLang !== newValue) {
        console.log('Обнаружено несоответствие языков из localStorage:', 
                   { new: newValue, current: htmlLang });
        
        // Принудительное обновление страницы
        window.location.reload();
      }
    }
  }, []);

  return (
    <>
      <VisibilityHandler onVisibilityChange={handleVisibilityChange} />
      <StorageChangeHandler onStorageChange={handleStorageChange} />
    </>
  );
};
