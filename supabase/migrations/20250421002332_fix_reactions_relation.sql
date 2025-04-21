-- Удаляем старый внешний ключ к таблице articles
ALTER TABLE public.article_reactions
DROP CONSTRAINT IF EXISTS article_reactions_article_id_fkey;

-- Переименовываем таблицу
ALTER TABLE public.article_reactions
RENAME TO blog_post_reactions;

-- Переименовываем колонку article_id в blog_post_id
ALTER TABLE public.blog_post_reactions
RENAME COLUMN article_id TO blog_post_id;

-- Добавляем новый внешний ключ к таблице blog_posts
-- Postgres должен автоматически обновить существующие индексы и ограничения при переименовании
-- Поэтому просто добавляем новый внешний ключ
ALTER TABLE public.blog_post_reactions
ADD CONSTRAINT blog_post_reactions_blog_post_id_fkey
FOREIGN KEY (blog_post_id) REFERENCES public.blog_posts(id) ON DELETE CASCADE;

-- Обновляем комментарии (опционально)
COMMENT ON TABLE public.blog_post_reactions IS 'Таблица для хранения реакций пользователей на посты блога';
COMMENT ON COLUMN public.blog_post_reactions.blog_post_id IS 'ID поста блога, на который оставлена реакция';
