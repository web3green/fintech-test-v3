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

    const { error: uploadError } = await supabase.storage
      .from('assets')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('assets')
      .getPublicUrl(filePath);

    return publicUrl;
  }
}; 