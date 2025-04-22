import { databaseService, BlogPost } from './databaseService';
import { supabase } from '../lib/supabase'; // Corrected import path

export const blogService = {
  getPosts: databaseService.getPosts,
  getPost: databaseService.getPost,
  createPost: databaseService.createPost,
  updatePost: databaseService.updatePost,
  deletePost: databaseService.deletePost,
  uploadImage: databaseService.uploadImage,
};

export type { BlogPost };

export const getLocalizedContent = (post: BlogPost | null | undefined, fieldPrefix: 'title' | 'content' | 'excerpt' | 'category', language: string): string => {
  if (!post) return ''; // Handle null or undefined post

  const fieldEn = `${fieldPrefix}_en` as keyof BlogPost;
  const fieldRu = `${fieldPrefix}_ru` as keyof BlogPost;
  
  // Special handling for category which might not have _en/_ru fields if we keep it simple
  if (fieldPrefix === 'category') {
      // If category is simple string, return it directly. 
      // If you decide to store category localized in DB later, adjust this.
      return String(post.category || ''); 
  }

  const valueEn = String(post[fieldEn] || '');
  const valueRu = String(post[fieldRu] || '');

  if (language === 'ru' && valueRu) {
    return valueRu;
  }
  return valueEn; // Default to English or if Russian is missing
};

export const renderPostColor = (colorScheme: string | null | undefined) => {
  if (colorScheme === 'blue') {
    return 'bg-fintech-blue text-white';
  } else if (colorScheme === 'orange') {
    return 'bg-fintech-orange/80 text-white dark:bg-gradient-to-br dark:from-blue-900/40 dark:via-fintech-orange/30 dark:to-blue-950/60 dark:backdrop-blur-sm dark:border dark:border-white/5';
  } else if (colorScheme === 'graphite') {
    return 'bg-gray-700 text-white dark:bg-gray-800';
  } else {
    return 'bg-white text-gray-900 dark:bg-gray-800 dark:text-white';
  }
};

export const getButtonStyle = (colorScheme: string) => {
  switch (colorScheme) {
    case 'blue':
      return 'bg-white text-fintech-blue hover:bg-gray-100';
    case 'orange':
      return 'bg-white text-fintech-orange/80 dark:text-fintech-orange/70 hover:bg-gray-100';
    case 'graphite':
      return 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700';
    default:
      return 'bg-fintech-blue text-white hover:bg-fintech-blue-dark';
  }
};

export const getImageUrl = (imageUrl: string) => {
  if (imageUrl && imageUrl.startsWith('http')) {
    return imageUrl;
  }
  return 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop';
};

/**
 * Fetches distinct category names from the blog posts table.
 * @returns {Promise<string[]>} A promise that resolves to an array of unique category strings.
 */
export const getDistinctCategories = async (): Promise<string[]> => {
  console.log('[getDistinctCategories] Fetching distinct categories (simplified query)...');
  try {
    // Simplified query: Select all categories and filter client-side
    const { data, error } = await supabase
      .from('blog_posts')
      .select('category');
      // Removed: .neq('category', '') 
      // Removed: .is('category', 'not.null');

    if (error) {
      console.error('[getDistinctCategories] Error fetching categories:', error);
      throw error;
    }

    if (data) {
      // Use Set to get unique values, filter out null/empty/undefined client-side
      const distinctCategories = [...new Set(data.map(item => item.category).filter(Boolean))] as string[];
      console.log('[getDistinctCategories] Found categories:', distinctCategories);
      return distinctCategories.sort(); // Return sorted categories
    } else {
      console.log('[getDistinctCategories] No data returned.');
      return [];
    }
  } catch (err) {
    console.error('[getDistinctCategories] Unexpected error:', err);
    return []; // Return empty array on error for safety
  }
};
