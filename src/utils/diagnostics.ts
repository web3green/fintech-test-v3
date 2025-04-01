import { checkSupabaseConnection, supabase } from '@/integrations/supabase/client';
import { DEFAULT_BUCKET } from './storageUtils';

// Определяем константы, которые были импортированы из отсутствующего файла
const BUCKET_NAME = DEFAULT_BUCKET;
const LOGO_FOLDER = 'logos';
const DEFAULT_LOGO_NAME = 'logo.svg';

// Объект диагностики, который будет доступен в глобальной области через window
export const DiagnosticsUtil = {
  // Быстрая проверка Supabase без блокировки
  async quickCheck() {
    console.log('Быстрая проверка Supabase...');
    try {
      // Создаем таймаут, чтобы ограничить время проверки
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: Проверка Supabase превысила лимит в 3 секунды')), 3000);
      });
      
      // Проверяем подключение с таймаутом
      const checkPromise = checkSupabaseConnection();
      const result = await Promise.race([checkPromise, timeoutPromise]);
      
      console.log('Результат быстрой проверки:', result);
      
      // Если подключение успешно, проверяем логотип
      if (result.connected) {
        try {
          // Проверяем наличие логотипа
          const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .list(LOGO_FOLDER, { limit: 1 });
          
          if (error) {
            console.warn('Ошибка при проверке логотипа:', error);
            return { ...result, logoChecked: true, logoError: error.message };
          }
          
          const logoExists = data?.some(file => file.name === DEFAULT_LOGO_NAME);
          return { ...result, logoChecked: true, logoExists };
        } catch (logoError) {
          console.error('Ошибка при проверке логотипа:', logoError);
          return { ...result, logoChecked: true, logoError: logoError.message };
        }
      }
      
      return result;
    } catch (error) {
      console.error('Ошибка быстрой проверки:', error);
      return { connected: false, error: error.message };
    }
  },
};

// Делаем DiagnosticsUtil доступным глобально
if (typeof window !== 'undefined') {
  (window as any).DiagnosticsUtil = DiagnosticsUtil;
}
