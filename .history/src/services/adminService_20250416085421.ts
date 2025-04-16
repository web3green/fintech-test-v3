import { supabase } from '@/integrations/supabase/client';

/**
 * Аутентификация администратора
 * @param username - Имя пользователя
 * @param password - Пароль
 * @returns Объект с результатом операции
 */
export async function authenticateAdmin(username: string, password: string) {
  try {
    // Получение учетных данных из базы
    const { data, error } = await supabase
      .from('admin_credentials')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error) {
      throw error;
    }
    
    // Проверка пароля
    if (!data || data.password !== password) {
      return { success: false, error: 'Invalid credentials' };
    }
    
    // Обновляем дату последнего входа
    const { error: updateError } = await supabase
      .from('admin_credentials')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.id);
    
    if (updateError) {
      console.error('Error updating last login date:', updateError);
    }
    
    return { 
      success: true, 
      data: {
        id: data.id,
        username: data.username,
        lastLogin: data.last_login
      }
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Получение учетных данных администратора
 * @returns Объект с учетными данными
 */
export async function getAdminCredentials() {
  try {
    const { data, error } = await supabase
      .from('admin_credentials')
      .select('id, username, last_login, created_at, updated_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      throw error;
    }
    
    return { 
      success: true, 
      data: {
        id: data.id,
        username: data.username,
        lastLogin: data.last_login,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
    };
  } catch (error) {
    console.error('Error fetching admin credentials:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Обновление пароля администратора
 * @param adminId - ID администратора
 * @param currentPassword - Текущий пароль
 * @param newPassword - Новый пароль
 * @returns Объект с результатом операции
 */
export async function updateAdminPassword(
  adminId: string, 
  currentPassword: string, 
  newPassword: string
) {
  try {
    // Проверяем текущий пароль
    const { data, error } = await supabase
      .from('admin_credentials')
      .select('password')
      .eq('id', adminId)
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!data || data.password !== currentPassword) {
      return { success: false, error: 'Current password is incorrect' };
    }
    
    // Обновляем пароль
    const { error: updateError } = await supabase
      .from('admin_credentials')
      .update({ password: newPassword })
      .eq('id', adminId);
    
    if (updateError) {
      throw updateError;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating admin password:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 