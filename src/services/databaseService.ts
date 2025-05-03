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
      .single();

    if (error) {
      console.error('Error creating post in \'blog_posts\' table:', error);
      throw error;
    }

    return blogPostSchema.parse(data);
  },

  async updatePost(id: string, post: Partial<BlogPost>) {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(post)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating post in \'blog_posts\' table:', error);
      throw error;
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

  async addNotificationEmail(email: string): Promise<void> {
    if (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
        throw new Error('Invalid email format');
    }
    console.log(`[databaseService] Adding notification email: ${email}`);
    try {
      const { error } = await supabase
        .from('notification_emails')
        .insert({ email: email });

      if (error) {
        if (error.code === '23505') {
           console.warn(`[databaseService] Email already exists: ${email}`);
           throw new Error(`Email ${email} already exists.`);
        } else {
          console.error('[databaseService] Error adding notification email:', error);
          throw error; 
        }
      }
      console.log(`[databaseService] Notification email ${email} added successfully.`);
    } catch (error) {
      console.error(`[databaseService] Error in addNotificationEmail for ${email}:`, error);
      throw error instanceof Error ? error : new Error('Failed to add notification email'); 
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

  // Updated function to update/insert into the new social_links table
  async updateSocialLink(platform: string, url: string, iconName?: string): Promise<void> {
      const platformLower = platform.toLowerCase();
      console.log(`[databaseService] Upserting social link for ${platform} to url: ${url}`);
      try {
          const { error } = await supabase
              .from('social_links') // Use the new table name
              .upsert(
                  { 
                      platform: platformLower, // Ensure platform is stored consistently (e.g., lowercase)
                      url: url,
                      // Only include icon_name if provided, otherwise let it be null/default
                      ...(iconName && { icon_name: iconName }) 
                  },
                  {
                      onConflict: 'platform', // If platform exists, update it
                      // Removed ignoreDuplicates: false as upsert handles conflict resolution explicitly
                  }
              );

          if (error) {
              console.error(`[databaseService] Error upserting social link for ${platform}:`, error);
              throw error;
          }
          console.log(`[databaseService] Social link for ${platform} upserted successfully.`);
      } catch (error) {
          console.error(`[databaseService] Error in updateSocialLink for ${platform}:`, error);
          throw new Error(`Failed to update social link for ${platform}`);
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