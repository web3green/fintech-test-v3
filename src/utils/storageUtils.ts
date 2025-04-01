/**
 * Утилиты для работы с S3 хранилищем Supabase
 * Удалена функциональность для работы с логотипом
 */

import { supabase } from '@/integrations/supabase/client';

// Константы для работы с хранилищем
export const DEFAULT_BUCKET = 'assets';
export const BLOG_FOLDER = 'blog';
export const ARTICLES_FOLDER = 'articles';

/**
 * Проверяет доступ к хранилищу Supabase
 * @returns Результат проверки с информацией о доступе
 */
export async function checkStorageAccess() {
  console.log('Проверка доступа к хранилищу Supabase...');
  
  try {
    // 1. Проверяем доступ к списку бакетов
    console.log('1. Проверка доступа к списку бакетов...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Ошибка доступа к списку бакетов:', bucketsError);
      return { 
        success: false, 
        error: bucketsError.message,
        step: 'list_buckets'
      };
    }
    
    console.log('Список бакетов получен:', buckets?.length || 0, 'бакетов');
    
    // 2. Проверяем наличие бакета assets
    console.log('2. Проверка наличия бакета assets...');
    const assetsBucket = buckets?.find(b => b.name === DEFAULT_BUCKET);
    
    if (!assetsBucket) {
      console.warn(`Бакет ${DEFAULT_BUCKET} не найден, пробуем создать...`);
      
      // Пробуем создать бакет
      const { data: newBucket, error: createError } = await supabase.storage.createBucket(DEFAULT_BUCKET, {
        public: true,
        fileSizeLimit: 5 * 1024 * 1024 // 5 MB
      });
      
      if (createError) {
        console.error('Ошибка создания бакета:', createError);
        return { 
          success: false, 
          error: createError.message,
          step: 'create_bucket'
        };
      }
      
      console.log('Бакет успешно создан:', newBucket);
    } else {
      console.log(`Бакет ${DEFAULT_BUCKET} существует`);
    }
    
    // 3. Проверяем доступ к содержимому бакета
    console.log('3. Проверка доступа к содержимому бакета...');
    const { data: files, error: listError } = await supabase.storage
      .from(DEFAULT_BUCKET)
      .list();
    
    if (listError) {
      console.error('Ошибка доступа к содержимому бакета:', listError);
      return { 
        success: false, 
        error: listError.message,
        step: 'list_files'
      };
    }
    
    console.log('Содержимое бакета получено:', files?.length || 0, 'файлов/папок');
    
    // Успешный результат проверки
    return {
      success: true,
      message: 'Доступ к хранилищу проверен'
    };
    
  } catch (error) {
    console.error('Непредвиденная ошибка при проверке хранилища:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка',
      step: 'unknown'
    };
  }
}

/**
 * Получает публичные URL для файлов в хранилище Supabase
 * @param path Путь к файлу или папке
 * @returns URL файла или null в случае ошибки
 */
export async function getPublicUrl(path: string): Promise<string | null> {
  try {
    const { data } = supabase.storage
      .from(DEFAULT_BUCKET)
      .getPublicUrl(path);
    
    return data?.publicUrl || null;
  } catch (error) {
    console.error('Ошибка получения публичного URL:', error);
    return null;
  }
}

/**
 * Загружает файл в хранилище Supabase
 * @param folder Папка для загрузки
 * @param file Файл для загрузки
 * @param fileName Опциональное имя файла, если не указано, используется имя из file
 * @returns Результат загрузки
 */
export async function uploadFile(folder: string, file: File, fileName?: string): Promise<{
  success: boolean;
  publicUrl?: string;
  error?: string;
}> {
  try {
    const uploadPath = `${folder}/${fileName || file.name}`;
    
    const { data, error } = await supabase.storage
      .from(DEFAULT_BUCKET)
      .upload(uploadPath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error('Ошибка загрузки файла:', error);
      return {
        success: false,
        error: error.message
      };
    }
    
    // Получаем публичный URL
    const { data: urlData } = supabase.storage
      .from(DEFAULT_BUCKET)
      .getPublicUrl(data.path);
    
    return {
      success: true,
      publicUrl: urlData.publicUrl
    };
  } catch (error) {
    console.error('Непредвиденная ошибка при загрузке файла:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    };
  }
} 