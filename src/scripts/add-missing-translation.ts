import { databaseService } from '@/services/databaseService';

// Функция для добавления или обновления перевода
async function addMissingTranslation() {
  try {
    // Добавляем перевод для "Contact Us" -> "Свяжитесь с нами"
    await databaseService.upsertSiteText(
      'footer.contact.link',  // ключ
      'Contact Us',           // английский текст
      'Свяжитесь с нами',     // русский текст
      'Footer'                // секция (опционально)
    );
    
    console.log('✅ Перевод для "Contact Us" успешно добавлен!');
    
    // Проверка, что перевод добавлен
    const text = await databaseService.getSiteText('footer.contact.link');
    console.log('Проверка перевода:', text);
  } catch (error) {
    console.error('❌ Ошибка при добавлении перевода:', error);
  }
}

// Вызываем функцию
addMissingTranslation();

// Примечание: Этот скрипт следует выполнить один раз.
// Для выполнения можно использовать:
// 1. Временный компонент React, который вызывает эту функцию при монтировании
// 2. Консоль браузера, скопировав основную функцию
// 3. Запуск через Node.js, если настроен доступ к Supabase
