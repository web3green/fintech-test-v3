-- Создание таблицы для хранения реакций пользователей на статьи
CREATE TABLE IF NOT EXISTS public.article_reactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'dislike', 'useful')),
  user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Уникальное ограничение, чтобы пользователь мог оставить только одну реакцию каждого типа на статью
  UNIQUE(article_id, reaction_type, user_id)
);

-- Создаем индексы для оптимизации запросов
CREATE INDEX IF NOT EXISTS article_reactions_article_id_idx ON public.article_reactions(article_id);
CREATE INDEX IF NOT EXISTS article_reactions_user_id_idx ON public.article_reactions(user_id);

-- Настраиваем Row Level Security (RLS) для таблицы
ALTER TABLE public.article_reactions ENABLE ROW LEVEL SECURITY;

-- Политики безопасности
-- Любой может читать реакции
CREATE POLICY "Anyone can read reactions" 
ON public.article_reactions FOR SELECT 
USING (true);

-- Любой аутентифицированный пользователь может добавлять свои реакции
CREATE POLICY "Users can add their reactions" 
ON public.article_reactions FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid()::text = user_id);

-- Анонимные пользователи тоже могут добавлять реакции (с их уникальным идентификатором)
CREATE POLICY "Anonymous users can add reactions" 
ON public.article_reactions FOR INSERT 
TO anon 
WITH CHECK (user_id LIKE 'anon_%');

-- Пользователи могут удалять только свои реакции
CREATE POLICY "Users can delete their own reactions" 
ON public.article_reactions FOR DELETE 
USING (auth.uid()::text = user_id OR user_id LIKE 'anon_%');

-- Комментарий к таблице
COMMENT ON TABLE public.article_reactions IS 'Таблица для хранения реакций пользователей на статьи блога'; 