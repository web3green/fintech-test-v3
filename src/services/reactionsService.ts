import { supabase } from '@/integrations/supabase/client';

/**
 * Добавляет или удаляет реакцию пользователя на статью
 * @param postId - ID статьи
 * @param reactionType - Тип реакции ('like', 'dislike', 'useful')
 * @param userId - ID пользователя (опционально)
 * @returns Объект с результатом операции
 */
export async function toggleReaction(
  postId: string,
  reactionType: string,
  userId: string | null = null
) {
  try {
    // Генерируем уникальный идентификатор для анонимных пользователей, если userId не предоставлен
    const anonymousId = userId || localStorage.getItem('anonymous_user_id') || 
                        `anon_${Math.random().toString(36).substring(2, 15)}`;
    
    // Сохраняем ID анонимного пользователя в localStorage
    if (!userId && !localStorage.getItem('anonymous_user_id')) {
      localStorage.setItem('anonymous_user_id', anonymousId);
    }
    
    // Проверяем, существует ли уже такая реакция от этого пользователя
    const { data: existingReactions, error: fetchError } = await supabase
      .from('blog_post_reactions')
      .select('*')
      .eq('blog_post_id', postId)
      .eq('reaction_type', reactionType)
      .eq('user_id', userId || anonymousId);
    
    if (fetchError) {
      throw fetchError;
    }
    
    // Если реакция уже существует, удаляем её
    if (existingReactions && existingReactions.length > 0) {
      const { error: deleteError } = await supabase
        .from('blog_post_reactions')
        .delete()
        .eq('id', existingReactions[0].id);
      
      if (deleteError) {
        throw deleteError;
      }
      
      return { success: true, action: 'removed', reactionType };
    } 
    // Иначе добавляем новую реакцию
    else {
      const { error: insertError } = await supabase
        .from('blog_post_reactions')
        .insert({
          blog_post_id: postId,
          reaction_type: reactionType,
          user_id: userId || anonymousId,
          created_at: new Date().toISOString()
        });
      
      if (insertError) {
        throw insertError;
      }
      
      return { success: true, action: 'added', reactionType };
    }
  } catch (error) {
    // Improved error logging
    console.error('Error toggling reaction:', JSON.stringify(error, null, 2));
    return { 
      success: false, 
      // Return more detailed error if possible
      error: error instanceof Error ? error.message : (typeof error === 'object' && error !== null && 'message' in error ? String(error.message) : 'Unknown error'),
      reactionType 
    };
  }
}

/**
 * Получает количество реакций для статьи
 * @param postId - ID статьи
 * @returns Объект с количеством каждого типа реакций
 */
export async function getReactionCounts(postId: string) {
  try {
    const { data, error } = await supabase
      .from('blog_post_reactions')
      .select('reaction_type')
      .eq('blog_post_id', postId);
    
    if (error) {
      throw error;
    }
    
    const counts = {
      like: 0,
      dislike: 0,
      useful: 0
    };
    
    if (data) {
      data.forEach(reaction => {
        // Увеличиваем счетчик для соответствующего типа реакции
        if (reaction.reaction_type in counts) {
          counts[reaction.reaction_type as keyof typeof counts]++;
        }
      });
    }
    
    return { success: true, counts };
  } catch (error) {
    console.error('Error fetching reaction counts:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      counts: { like: 0, dislike: 0, useful: 0 } 
    };
  }
}

/**
 * Проверяет, поставил ли пользователь реакцию на статью
 * @param postId - ID статьи
 * @param userId - ID пользователя (опционально)
 * @returns Объект с информацией о реакциях пользователя
 */
export async function getUserReactions(postId: string, userId: string | null = null) {
  try {
    const anonymousId = userId || localStorage.getItem('anonymous_user_id');
    
    // Если нет ID пользователя или анонимного ID, значит реакций нет
    if (!anonymousId) {
      return { 
        success: true, 
        reactions: { like: false, dislike: false, useful: false } 
      };
    }
    
    const { data, error } = await supabase
      .from('blog_post_reactions')
      .select('reaction_type')
      .eq('blog_post_id', postId)
      .eq('user_id', anonymousId);
    
    if (error) {
      throw error;
    }
    
    const userReactions = {
      like: false,
      dislike: false,
      useful: false
    };
    
    if (data) {
      data.forEach(reaction => {
        if (reaction.reaction_type in userReactions) {
          userReactions[reaction.reaction_type as keyof typeof userReactions] = true;
        }
      });
    }
    
    return { success: true, reactions: userReactions };
  } catch (error) {
    console.error('Error fetching user reactions:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      reactions: { like: false, dislike: false, useful: false } 
    };
  }
} 