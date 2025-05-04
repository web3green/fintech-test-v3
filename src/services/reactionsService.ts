import { supabase } from '@/integrations/supabase/client';

/**
 * Добавляет или удаляет реакцию пользователя на статью
 * @param postId - ID статьи
 * @param reactionType - Тип реакции ('like', 'dislike', 'useful')
 * @returns Объект с результатом операции
 */
export async function toggleReaction(
  postId: string,
  reactionType: string
  // Убираем userId из аргументов, будем получать его сами
) {
  try {
    // 1. Получаем текущую сессию и пользователя
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Error getting session:', sessionError);
      throw new Error('Could not get user session');
    }

    // 2. Определяем user_id для запроса
    // Если сессия есть, используем user.id (это будет либо UUID админа, либо anon ID)
    // Если сессии нет (очень маловероятно, но на всякий случай), запрещаем операцию
    const currentUserId = session?.user?.id;

    if (!currentUserId) {
      console.error('No user ID found in session.');
      // Можно показать пользователю сообщение, что нужно войти или обновить страницу
      throw new Error('User not identified. Cannot toggle reaction.');
    }

    console.log(`[toggleReaction] Current User ID: ${currentUserId}, Post ID: ${postId}, Reaction: ${reactionType}`); // Логирование для отладки

    // 3. Проверяем существующую реакцию с актуальным ID
    const { data: existingReaction, error: fetchError } = await supabase
      .from('blog_post_reactions')
      .select('id') // Достаточно получить id для удаления
      .eq('blog_post_id', postId)
      .eq('user_id', currentUserId) // Используем актуальный ID
      .eq('reaction_type', reactionType)
      .maybeSingle(); // Ожидаем одну строку или null

    if (fetchError) {
      console.error('[toggleReaction] Error fetching existing reaction:', fetchError);
      throw fetchError;
    }

    // 4. Удаляем или добавляем реакцию
    if (existingReaction) {
      // Реакция существует, удаляем её
      console.log(`[toggleReaction] Reaction exists (ID: ${existingReaction.id}), removing...`);
      const { error: deleteError } = await supabase
        .from('blog_post_reactions')
        .delete()
        .eq('id', existingReaction.id); // Удаляем по ID найденной реакции

      if (deleteError) {
        console.error('[toggleReaction] Error deleting reaction:', deleteError);
        // Проверяем, не RLS ли это ошибка
        if (deleteError.code === '42501') {
           console.error('[toggleReaction] RLS policy violation on DELETE.');
        }
        throw deleteError;
      }

      console.log(`[toggleReaction] Reaction removed successfully.`);
      return { success: true, action: 'removed', reactionType };
    } else {
      // Реакции нет, добавляем новую
      console.log(`[toggleReaction] Reaction does not exist, adding...`);
      const { error: insertError } = await supabase
        .from('blog_post_reactions')
        .insert({
          blog_post_id: postId,
          reaction_type: reactionType,
          user_id: currentUserId, // Используем актуальный ID
          // created_at устанавливается базой данных по умолчанию
        });

      if (insertError) {
        console.error('[toggleReaction] Error inserting reaction:', insertError);
         // Проверяем, не RLS ли это ошибка (хотя мы ее уже видели)
         if (insertError.code === '42501') {
          console.error('[toggleReaction] RLS policy violation on INSERT. Check if user_id matches policy check.');
       }
        throw insertError;
      }
      console.log(`[toggleReaction] Reaction added successfully.`);
      return { success: true, action: 'added', reactionType };
    }
  } catch (error: any) {
    // Улучшенное логирование ошибок
    console.error(`[toggleReaction] Failed for Post ID: ${postId}, Reaction: ${reactionType}. Error:`, error);
    return {
      success: false,
      error: error.message || 'Unknown error toggling reaction',
      code: error.code, // Добавляем код ошибки для диагностики
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
 * @returns Объект с информацией о реакциях пользователя
 */
export async function getUserReactions(postId: string /* Убираем userId: string | null = null */) {
  try {
    // Получаем текущую сессию
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('[getUserReactions] Error getting session:', sessionError);
      // Если сессии нет, считаем, что реакций нет
      return { success: true, reactions: { like: false, dislike: false, useful: false } };
    }

    const currentUserId = session?.user?.id;

    // Если нет ID пользователя (сессия есть, но user.id пустой - маловероятно), считаем, что реакций нет
    if (!currentUserId) {
       console.warn('[getUserReactions] No user ID found in session, returning no reactions.');
      return { success: true, reactions: { like: false, dislike: false, useful: false } };
    }

    console.log(`[getUserReactions] Checking reactions for User ID: ${currentUserId}, Post ID: ${postId}`);

    const { data, error } = await supabase
      .from('blog_post_reactions')
      .select('reaction_type')
      .eq('blog_post_id', postId)
      .eq('user_id', currentUserId); // Используем актуальный ID
    
    if (error) {
      console.error('[getUserReactions] Error fetching user reactions from DB:', error);
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
    
    console.log(`[getUserReactions] Found reactions:`, userReactions);
    return { success: true, reactions: userReactions };
  } catch (error: any) {
    console.error('[getUserReactions] Failed to get user reactions:', error);
    return { 
      success: false, 
      error: error.message || 'Unknown error fetching user reactions',
      reactions: { like: false, dislike: false, useful: false } 
    };
  }
} 