/**
 * Модуль для отладки и диагностики приложения
 */

import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_BUCKET, LOGOS_FOLDER, DEFAULT_LOGO_FILE } from "./storageUtils";

// Проверка версий переменных окружения
export const logEnvironmentVariables = () => {
  console.log({
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || 'Не определено',
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Определено' : 'Не определено',
    VITE_SUPABASE_STORAGE_URL: import.meta.env.VITE_SUPABASE_STORAGE_URL || 'Не определено',
    VITE_SUPABASE_STORAGE_REGION: import.meta.env.VITE_SUPABASE_STORAGE_REGION || 'Не определено',
    VITE_SUPABASE_STORAGE_ACCESS_KEY: import.meta.env.VITE_SUPABASE_STORAGE_ACCESS_KEY ? 'Определено' : 'Не определено',
  });
  
  return {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || 'Не определено',
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Определено' : 'Не определено',
    VITE_SUPABASE_STORAGE_URL: import.meta.env.VITE_SUPABASE_STORAGE_URL || 'Не определено',
    VITE_SUPABASE_STORAGE_REGION: import.meta.env.VITE_SUPABASE_STORAGE_REGION || 'Не определено',
    VITE_SUPABASE_STORAGE_ACCESS_KEY: import.meta.env.VITE_SUPABASE_STORAGE_ACCESS_KEY ? 'Определено' : 'Не определено',
  };
};

// Тестирование подключения к Supabase Storage напрямую через fetch
export const testFetchStorage = async () => {
  try {
    const storageUrl = import.meta.env.VITE_SUPABASE_STORAGE_URL;
    if (!storageUrl) {
      return { 
        success: false, 
        error: 'URL хранилища не определен в переменных окружения' 
      };
    }
    
    // Проверяем основной URL хранилища
    console.log(`Проверка доступа к хранилищу по URL: ${storageUrl}`);
    const storageResponse = await fetch(storageUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    const responseData = {
      status: storageResponse.status,
      statusText: storageResponse.statusText,
      headers: Object.fromEntries([...storageResponse.headers.entries()]),
    };
    
    console.log('Ответ от хранилища:', responseData);
    
    // Проверяем доступ к конкретному бакету
    try {
      const bucketUrl = `${storageUrl}/bucket/assets`;
      console.log(`Проверка доступа к бакету: ${bucketUrl}`);
      const bucketResponse = await fetch(bucketUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      const bucketResponseData = {
        status: bucketResponse.status,
        statusText: bucketResponse.statusText,
        headers: Object.fromEntries([...bucketResponse.headers.entries()]),
      };
      
      console.log('Ответ от бакета:', bucketResponseData);
      
      return { 
        success: true, 
        storageResponse: responseData,
        bucketResponse: bucketResponseData
      };
    } catch (bucketError) {
      console.error('Ошибка при проверке бакета:', bucketError);
      return { 
        success: false, 
        storageResponse: responseData,
        bucketError: bucketError instanceof Error ? bucketError.message : String(bucketError)
      };
    }
  } catch (error) {
    console.error('Ошибка при проверке хранилища:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
};

// Тестирование подключения к Supabase Storage через официальный клиент
export const testSupabaseStorage = async () => {
  try {
    const results: Record<string, any> = {};
    
    // Проверяем инициализацию клиента
    if (!supabase) {
      return { 
        success: false, 
        error: 'Клиент Supabase не инициализирован' 
      };
    }
    
    results.clientInitialized = true;
    
    // Получаем список бакетов
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Ошибка при получении списка бакетов:', bucketsError);
      return { 
        success: false, 
        error: bucketsError.message,
        clientInitialized: true 
      };
    }
    
    results.buckets = buckets.map(b => b.name);
    console.log('Доступные бакеты:', results.buckets);
    
    // Проверяем существование бакета assets
    const assetsBucketExists = buckets.some(b => b.name === 'assets');
    results.assetsBucketExists = assetsBucketExists;
    
    if (!assetsBucketExists) {
      console.warn('Бакет assets не существует');
      return { 
        success: false, 
        ...results,
        error: 'Бакет assets не существует'
      };
    }
    
    // Проверяем наличие папки logos в бакете assets
    const { data: folders, error: foldersError } = await supabase.storage
      .from('assets')
      .list();
    
    if (foldersError) {
      console.error('Ошибка при получении списка папок:', foldersError);
      return { 
        success: false, 
        ...results,
        error: foldersError.message 
      };
    }
    
    const logosExists = folders.some(f => f.name === 'logos');
    results.logosExists = logosExists;
    results.folders = folders.map(f => f.name);
    
    console.log('Содержимое бакета assets:', results.folders);
    
    if (!logosExists) {
      console.warn('Папка logos не существует в бакете assets');
      return { 
        success: false, 
        ...results,
        error: 'Папка logos не существует в бакете assets'
      };
    }
    
    // Проверяем наличие файла logo.svg в папке logos
    const { data: logoFiles, error: logoFilesError } = await supabase.storage
      .from('assets')
      .list('logos');
    
    if (logoFilesError) {
      console.error('Ошибка при получении списка файлов в папке logos:', logoFilesError);
      return { 
        success: false, 
        ...results,
        error: logoFilesError.message 
      };
    }
    
    const logoExists = logoFiles.some(f => f.name === 'logo.svg');
    results.logoExists = logoExists;
    results.logoFiles = logoFiles.map(f => f.name);
    
    console.log('Содержимое папки logos:', results.logoFiles);
    
    if (!logoExists) {
      console.warn('Файл logo.svg не существует в папке logos');
      return { 
        success: false, 
        ...results,
        error: 'Файл logo.svg не существует в папке logos'
      };
    }
    
    // Получаем публичный URL логотипа
    const logoUrl = supabase.storage
      .from('assets')
      .getPublicUrl('logos/logo.svg').data.publicUrl;
    
    results.logoUrl = logoUrl;
    console.log('Публичный URL логотипа:', logoUrl);
    
    // Проверяем доступность логотипа по публичному URL
    try {
      const logoResponse = await fetch(logoUrl, {
        method: 'HEAD',
      });
      
      results.logoAccessible = logoResponse.ok;
      results.logoStatus = logoResponse.status;
      
      console.log('Статус доступа к логотипу:', results.logoStatus);
      
      if (!logoResponse.ok) {
        console.warn(`Логотип недоступен по URL (Статус: ${logoResponse.status})`);
        return { 
          success: false, 
          ...results,
          error: `Логотип недоступен по URL (Статус: ${logoResponse.status})`
        };
      }
    } catch (logoError) {
      console.error('Ошибка при проверке доступности логотипа:', logoError);
      return { 
        success: false, 
        ...results,
        error: logoError instanceof Error ? logoError.message : String(logoError)
      };
    }
    
    return { 
      success: true, 
      ...results
    };
  } catch (error) {
    console.error('Ошибка при проверке хранилища Supabase:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
};

export const testSupabaseConnection = async () => {
  try {
    // Проверка RPC вызова
    const { data, error } = await supabase.rpc('hello_world');
    
    if (error) {
      return {
        success: false,
        error: error.message
      };
    }
    
    // Проверяем таблицу настроек
    const { data: settingsData, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .limit(1);
      
    if (settingsError) {
      return {
        success: false,
        rpcSuccess: true,
        error: settingsError.message
      };
    }
    
    return {
      success: true,
      rpcResponse: data,
      settingsAvailable: settingsData && settingsData.length > 0,
      settings: settingsData
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

// Создаем объект с диагностическими функциями для глобального доступа
export const debugUtils = {
  logEnvironmentVariables,
  testFetchStorage,
  testSupabaseStorage,
  testSupabaseConnection
};

// Делаем утилиты доступными в консоли браузера
declare global {
  interface Window {
    debugUtils: typeof debugUtils;
  }
}

if (typeof window !== 'undefined') {
  window.debugUtils = debugUtils;
}

export default debugUtils; 