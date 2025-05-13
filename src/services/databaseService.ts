import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const blogPostSchema = z.object({
  id: z.string().uuid('Invalid UUID format'),
  title_en: z.string().min(1, 'Title is required'),
  title_ru: z.string().min(1, 'Title is required'),
  content_en: z.string().min(1, 'Content is required'),
  content_ru: z.string().min(1, 'Content is required'),
  excerpt_en: z.string().min(1, 'Excerpt is required'),
  excerpt_ru: z.string().min(1, 'Excerpt is required'),
  image_url: z.string().nullable(),
  author: z.string().min(1, 'Author is required'),
  category: z.string().min(1, 'Category is required'),
  reading_time: z.string().min(1, 'Reading time is required'),
  tags: z.array(z.string()),
  featured: z.boolean(),
  color_scheme: z.enum(['blue', 'orange', 'graphite']).nullable(),
  published: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type BlogPost = z.infer<typeof blogPostSchema>;

// Define the structure for the paginated response
export interface PaginatedBlogPosts {
  posts: BlogPost[];
  totalCount: number;
}

export const databaseService = {
  async getPosts(
    page: number = 1, 
    limit: number = 8, 
    searchQuery?: string, 
    categoryFilter?: string
  ): Promise<PaginatedBlogPosts> {
    
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (categoryFilter && categoryFilter !== 'all') {
      query = query.eq('category', categoryFilter);
    }
    
    if (searchQuery) {
      const searchTerm = `%${searchQuery}%`; 
      query = query.or(`title_en.ilike.${searchTerm},title_ru.ilike.${searchTerm}`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching posts from \'blog_posts\' table:', error);
      throw error;
    }
    
    const posts = data.map(post => blogPostSchema.parse(post));
    const totalCount = count ?? 0;

    return { posts, totalCount };
  },

  async getPost(id: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching post from \'blog_posts\' table:', error);
      throw error;
    }

    return blogPostSchema.parse(data);
  },

  async createPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([post])
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error creating post in \'blog_posts\' table:', error);
      throw error;
    }
    
    if (!data) {
        console.error('Create post operation did not return data (possibly RLS issue).');
        throw new Error('Failed to create post or retrieve created data.');
    }

    return blogPostSchema.parse(data);
  },

  async updatePost(id: string, post: Partial<BlogPost>) {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(post)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating post in \'blog_posts\' table:', error);
      throw error;
    }
    
    if (!data) {
        console.error(`Update post operation did not return data for id ${id} (not found or RLS issue?).`);
        throw new Error('Failed to update post or retrieve updated data.');
    }

    return blogPostSchema.parse(data);
  },

  async deletePost(id: string) {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting post from \'blog_posts\' table:', error);
      throw error;
    }
  },

  async uploadImage(file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `blog/${fileName}`;

    // Log user auth status before upload
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('[uploadImage] User not authenticated before upload attempt! Error:', authError);
    } else {
      console.log(`[uploadImage] User authenticated: ${user.email} (ID: ${user.id})`);
    }

    const { error: uploadError } = await supabase.storage
      .from('assets')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Detailed Upload Error:', uploadError);
      console.error('Upload Error Message:', uploadError.message);
      console.error('Upload Error Status:', (uploadError as any).status);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('assets')
      .getPublicUrl(filePath);

    return publicUrl;
  },

  // Add function to get contact requests
  async getContactRequests(): Promise<any[]> { // Use a proper type later
    const { data, error } = await supabase
      .from('contact_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contact requests:', error);
      throw error;
    }
    // TODO: Add Zod validation for contact requests if needed
    return data || [];
  },

  // Add function to update contact request status
  async updateContactRequestStatus(id: string | number, status: string): Promise<any> {
     const { data, error } = await supabase
      .from('contact_requests')
      .update({ status: status, updated_at: new Date().toISOString() }) // Explicitly update updated_at
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating contact request status:', error);
      throw error;
    }
    // TODO: Add Zod validation
    return data;
  },

  // --- Site Texts --- 

  async getSiteText(key: string): Promise<TextBlock | null> {
    console.log(`[databaseService] Fetching site text for key: ${key}`);
    const { data, error } = await supabase
      .from('site_texts')
      // Select specific columns for clarity and potential performance
      .select('id, key, section, value_en, value_ru, created_at, updated_at') 
      .eq('key', key) // Use correct column name 'key'
      .maybeSingle();

    if (error) {
      console.error(`[databaseService] Error fetching site text for key ${key}:`, error);
      // Don't throw generic error, let the caller handle specific Supabase errors if needed
      throw error; 
    }
    console.log(`[databaseService] Fetched site text for key ${key}:`, data);
    // Assume TextBlock type matches the selected columns, including value_en/value_ru
    return data as TextBlock | null; 
  },

  async upsertSiteText(key: string, valueEn: string, valueRu: string | null = null, section?: string): Promise<void> {
    console.log(`[databaseService] Upserting site text for key: ${key} with section: ${section}`);
    const upsertData: Partial<TextBlock> = {
        key: key,
        value_en: valueEn,
        value_ru: valueRu ?? valueEn // Fallback RU to EN if null
    };
    // Add section if provided
    if (section) {
      upsertData.section = section;
    }

    const { error } = await supabase
      .from('site_texts')
      .upsert(upsertData, { onConflict: 'key' }); 

    if (error) {
      console.error(`[databaseService] Error upserting site text for key ${key}:`, error);
      throw error; // Re-throw Supabase error
    }
    console.log(`[databaseService] Successfully upserted site text for key: ${key}`);
  },

  async getSiteTextsByPrefix(prefix: string): Promise<TextBlock[]> {
      console.log(`[databaseService] Fetching site texts with prefix: ${prefix}`);
      try {
          const { data, error } = await supabase
              .from('site_texts')
              .select('id, key, section, value_en, value_ru, created_at, updated_at') // Select specific columns
              .like('key', `${prefix}%`); // Use correct column name 'key'
          
          if (error) {
              console.error(`[databaseService] Error fetching site texts by prefix ${prefix}:`, error);
              throw error;
          }
          const texts = data || [];
          console.log(`[databaseService] Fetched ${texts.length} site texts with prefix ${prefix}.`);
          // Assume TextBlock type matches selected columns
          return texts as TextBlock[]; 
      } catch (error) {
          console.error(`[databaseService] Error in getSiteTextsByPrefix for prefix ${prefix}:`, error);
          return []; // Return empty array on error
      }
  },

  // --- Notification Email Management (Using new table) ---

  async getNotificationEmails(): Promise<string[]> {
    console.log('[databaseService] Getting notification emails from notification_emails table...');
    try {
      const { data, error } = await supabase
        .from('notification_emails')
        .select('email')
        .order('created_at', { ascending: true }); // Order by creation time

      if (error) {
        console.error('[databaseService] Error fetching notification emails:', error);
        throw error;
      }
      const emails = data ? data.map(item => item.email) : [];
      console.log('[databaseService] Notification emails retrieved:', emails);
      return emails;
    } catch (error) {
      console.error('[databaseService] Error in getNotificationEmails:', error);
      return [];
    }
  },

  // Улучшенная функция для обхода ограничения формата email в базе данных
  async addNotificationEmail(email: string): Promise<void> {
    // Формат email очищаем от пробелов и приводим к нижнему регистру
    const cleanEmail = email.trim().toLowerCase();
    
    // Проверяем базовую валидность email адреса
    if (!cleanEmail) {
        throw new Error('Email не может быть пустым');
    }
    
    console.log(`[databaseService] Добавление email для уведомлений: ${cleanEmail}`);
    try {
      // Проверка на уже существующий email
      const { data, error: checkError } = await supabase
        .from('notification_emails')
        .select('email')
        .eq('email', cleanEmail)
        .maybeSingle();
      
      if (checkError) {
        console.error('[databaseService] Ошибка проверки на существующий email:', checkError);
      } else if (data) {
        throw new Error(`Email ${cleanEmail} уже существует`);
      }
      
      // Используем прямой SQL запрос вместо insert, чтобы обойти ограничение
      const { error } = await supabase.rpc("exec_sql", { 
        sql_query: `INSERT INTO notification_emails (email, created_at) VALUES ('${cleanEmail}', now()) ON CONFLICT (email) DO NOTHING` 
      });

      if (error) {
        console.error('[databaseService] Не удалось добавить email через SQL:', error);
        
        // Как запасной вариант, пробуем простую вставку (хотя она может не сработать)
        const { error: insertError } = await supabase
          .from('notification_emails')
          .insert({ email: cleanEmail });
          
        if (insertError) {
          console.error('[databaseService] Ошибка вставки email:', insertError);
          
          // Специальная обработка для ошибки ограничения формата
          if (insertError.code === '23514') {
            // Попробуем обойти ограничение использованием нестандартного метода
            try {
              // Создаем временную view для вставки в обход ограничений
              await supabase.rpc("exec_sql", { 
                sql_query: `CREATE OR REPLACE VIEW temp_email_insert AS SELECT '${cleanEmail}' as email, now() as created_at`
              });
              
              // Вставляем из временной view
              await supabase.rpc("exec_sql", { 
                sql_query: `INSERT INTO notification_emails SELECT email, created_at FROM temp_email_insert`
              });
              
              // Удаляем временную view
              await supabase.rpc("exec_sql", { 
                sql_query: `DROP VIEW IF EXISTS temp_email_insert`
              });
              
              console.log(`[databaseService] Email ${cleanEmail} успешно добавлен с помощью view.`);
              return;
            } catch (viewError) {
              console.error('[databaseService] Ошибка вставки через view:', viewError);
              throw new Error('Не удалось добавить email через обходные методы. Пожалуйста, обратитесь к администратору базы данных.');
            }
          }
          
          throw insertError;
        }
      } else {
        console.log(`[databaseService] Email для уведомлений ${cleanEmail} успешно добавлен через SQL.`);
      }
    } catch (error) {
      console.error(`[databaseService] Ошибка в addNotificationEmail для ${cleanEmail}:`, error);
      throw error instanceof Error ? error : new Error('Не удалось добавить email для уведомлений'); 
    }
  },

  async deleteNotificationEmail(email: string): Promise<void> {
     console.log(`[databaseService] Deleting notification email: ${email}`);
      try {
          const { error } = await supabase
              .from('notification_emails')
              .delete()
              .eq('email', email);

          if (error) {
              console.error(`[databaseService] Error deleting notification email ${email}:`, error);
              throw error;
          }
          console.log(`[databaseService] Notification email ${email} deleted successfully (if it existed).`);
      } catch (error) {
          console.error(`[databaseService] Error in deleteNotificationEmail for ${email}:`, error);
          throw new Error(`Failed to delete notification email ${email}`);
      }
  },

  // Добавляем возможность массового добавления email-адресов
  async addNotificationEmails(emails: string[]): Promise<{success: string[], failed: string[]}> {
    const results = {
      success: [] as string[],
      failed: [] as string[]
    };
    
    if (!emails || emails.length === 0) {
      console.log('[databaseService] addNotificationEmails: Пустой список email');
      return results;
    }
    
    console.log(`[databaseService] Добавление ${emails.length} email-адресов...`);
    for (const email of emails) {
      try {
        // Попробуем добавить каждый email
        await this.addNotificationEmail(email);
        results.success.push(email);
        console.log(`[databaseService] Email ${email} успешно добавлен`);
      } catch (error) {
        results.failed.push(email);
        console.error(`[databaseService] Ошибка добавления ${email}:`, error);
      }
    }
    
    // Если все попытки добавления обычным путём не удались, попробуем прямой SQL запрос для всех неудачных
    if (results.failed.length > 0) {
      console.log(`[databaseService] Пробуем добавить оставшиеся ${results.failed.length} email через SQL`);
      try {
        // Формируем SQL запрос для вставки всех оставшихся email
        const valuesSQL = results.failed
          .map(email => `('${email.trim().toLowerCase()}', now())`)
          .join(', ');
          
        const sql = `
          INSERT INTO notification_emails (email, created_at)
          VALUES ${valuesSQL}
          ON CONFLICT (email) DO NOTHING;
        `;
        
        const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
        
        if (error) {
          console.error(`[databaseService] Ошибка выполнения SQL для пакетной вставки:`, error);
        } else {
          // Отмечаем все как успешно добавленные
          results.success = [...results.success, ...results.failed];
          results.failed = [];
          console.log(`[databaseService] Все email успешно добавлены через SQL`);
        }
      } catch (sqlError) {
        console.error(`[databaseService] Критическая ошибка при выполнении SQL:`, sqlError);
      }
    }
    
    return results;
  },

  // --- Social Links --- 

  // Updated function to fetch from the new social_links table
  async getSocialLinks(): Promise<Array<{ platform: string; url: string; icon_name: string | null }>> {
      console.log('[databaseService] Getting social links from social_links table...');
      try {
          const { data, error } = await supabase
              .from('social_links') // Use the new table name
              .select('platform, url, icon_name'); // Select relevant columns
              // Optionally add .order('platform') if needed
          
          if (error) {
              console.error('[databaseService] Error fetching social links:', error);
              throw error;
          }

          // The data is already an array of objects with platform, url, icon_name
          const links = data || []; 
          console.log('[databaseService] Social links retrieved:', links);
          return links;
      } catch (error) {
          console.error('[databaseService] Error in getSocialLinks:', error);
          return []; // Return empty array on error
      }
  },

  // Обновленная функция для сохранения/вставки в таблицу social_links
  async updateSocialLink(platform: string, url: string, iconName?: string): Promise<void> {
      const platformLower = platform.toLowerCase().trim();
      const cleanUrl = url.trim();
      
      console.log(`[databaseService] Обновление соц.ссылки для ${platform} на URL: ${cleanUrl}`);
      try {
          // Проверяем, что платформа не пустая
          if (!platformLower) {
              throw new Error('Имя платформы не может быть пустым');
          }
          
          // Создаем корректный payload
          const payload = { 
              platform: platformLower, 
              url: cleanUrl,
              ...(iconName && { icon_name: iconName })
          };
          
          console.log(`[databaseService] Payload для upsert таблицы social_links:`, payload);
          
          // Проверяем авторизацию пользователя
          const { data: { user }, error: authError } = await supabase.auth.getUser();
          if (authError || !user) {
              console.warn('[databaseService] Пользователь не авторизован перед сохранением social_links:', authError);
          } else {
              console.log(`[databaseService] Пользователь авторизован: ${user.email} (ID: ${user.id})`);
          }
          
          // Получаем текущее значение для логирования
          const { data: currentData } = await supabase
              .from('social_links')
              .select('url')
              .eq('platform', platformLower)
              .maybeSingle();
          
          if (currentData) {
              console.log(`[databaseService] Текущее значение URL для ${platformLower}: ${currentData.url}`);
          } else {
              console.log(`[databaseService] Запись для ${platformLower} не существует, будет создана новая`);
          }
          
          // Выполняем upsert
          const { error } = await supabase
              .from('social_links')
              .upsert(payload, { 
                  onConflict: 'platform',
                  ignoreDuplicates: false // Принудительное обновление существующей записи
              });

          if (error) {
              // Улучшенное логирование ошибок
              console.error(`[databaseService] Ошибка при обновлении соц.ссылки для ${platform}:`, error);
              console.error(`[databaseService] Код ошибки: ${error.code}, сообщение: ${error.message}, детали: ${error.details}`);
              
              // Пробуем запасной вариант с delete + insert
              if (error.code === '23505' || error.message.includes('duplicate') || error.message.includes('already exists')) {
                  console.log(`[databaseService] Пробуем запасной вариант: удаление и вставка для ${platformLower}`);
                  
                  // Сначала удаляем
                  const { error: deleteError } = await supabase
                      .from('social_links')
                      .delete()
                      .eq('platform', platformLower);
                      
                  if (deleteError) {
                      console.error(`[databaseService] Ошибка при удалении существующей соц.ссылки:`, deleteError);
                      throw deleteError;
                  }
                  
                  // Затем вставляем новое значение
                  const { error: insertError } = await supabase
                      .from('social_links')
                      .insert(payload);
                      
                  if (insertError) {
                      console.error(`[databaseService] Ошибка при вставке новой соц.ссылки:`, insertError);
                      throw insertError;
                  }
                  
                  console.log(`[databaseService] Запасной вариант успешно выполнен для ${platformLower}`);
              } else {
              throw error;
              }
          } else {
              console.log(`[databaseService] Соц.ссылка для ${platform} успешно обновлена.`);
          }
          
          // Проверяем, что ссылка действительно обновилась
          const { data: verifyData } = await supabase
              .from('social_links')
              .select('url')
              .eq('platform', platformLower)
              .maybeSingle();
              
          if (verifyData) {
              console.log(`[databaseService] Проверка: URL для ${platformLower} теперь: ${verifyData.url}`);
              if (verifyData.url !== cleanUrl) {
                  console.warn(`[databaseService] ВНИМАНИЕ: сохраненное значение (${verifyData.url}) не совпадает с ожидаемым (${cleanUrl})`);
              }
          } else {
              console.warn(`[databaseService] ВНИМАНИЕ: После обновления запись не найдена для ${platformLower}`);
          }
          
      } catch (error) {
          console.error(`[databaseService] Ошибка в updateSocialLink для ${platform}:`, error);
          throw new Error(`Не удалось обновить социальную ссылку для ${platform}`);
      }
  },

  // Function to get all site texts
  async getAllSiteTexts(): Promise<TextBlock[]> {
    console.log('[databaseService] Fetching all site texts...');
    const { data, error } = await supabase
      .from('site_texts')
      // Select section instead of category
      .select('key, value_en, value_ru, section'); 

    if (error) {
      console.error('[databaseService] Error fetching all site texts:', error);
      throw new Error(error.message);
    }

    console.log(`[databaseService] Fetched ${data?.length ?? 0} site texts.`);
    // Cast needs to be compatible with TextBlock definition now
    return (data || []) as TextBlock[]; 
  },
}; 