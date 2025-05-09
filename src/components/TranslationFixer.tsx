import { useEffect } from 'react';
import { databaseService } from '@/services/databaseService';

export function TranslationFixer() {
  useEffect(() => {
    async function fixTranslation() {
      try {
        // Добавляем перевод для "Contact Us" -> "Свяжитесь с нами"
        await databaseService.upsertSiteText(
          'footer.contact.link',
          'Contact Us',
          'Свяжитесь с нами',
          'Footer'
        );
        
        console.log('✅ Перевод для "Contact Us" успешно добавлен!');
        
        // Проверка, что перевод добавлен
        const text = await databaseService.getSiteText('footer.contact.link');
        console.log('Проверка перевода:', text);
        
        // Сохраняем в localStorage, что перевод был добавлен
        localStorage.setItem('translationFixed', 'true');
      } catch (error) {
        console.error('❌ Ошибка при добавлении перевода:', error);
      }
    }
    
    // Проверяем, нужно ли выполнять добавление перевода
    const translationFixed = localStorage.getItem('translationFixed');
    if (translationFixed !== 'true') {
      fixTranslation();
    }
  }, []);
  
  // Компонент ничего не рендерит
  return null;
} 