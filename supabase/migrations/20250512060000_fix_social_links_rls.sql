-- Миграция для исправления прав доступа к таблице social_links

-- Включаем/отключаем RLS для таблицы
ALTER TABLE social_links DISABLE ROW LEVEL SECURITY;

-- Удаляем существующие политики, если они есть
DROP POLICY IF EXISTS "Allow read access for all users" ON social_links;
DROP POLICY IF EXISTS "Allow authenticated insert access" ON social_links;
DROP POLICY IF EXISTS "Allow authenticated update access" ON social_links;
DROP POLICY IF EXISTS "Allow authenticated delete access" ON social_links;

-- Создаем новые политики с правильными правами
CREATE POLICY "Allow read access for all users" 
  ON social_links FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "Allow authenticated insert access" 
  ON social_links FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update access" 
  ON social_links FOR UPDATE 
  TO authenticated 
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete access" 
  ON social_links FOR DELETE 
  TO authenticated 
  USING (true);

-- Повторно включаем RLS
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

-- Добавляем права для аутентифицированных пользователей
GRANT ALL ON social_links TO authenticated;
GRANT ALL ON social_links TO service_role;
GRANT ALL ON social_links TO anon;

-- Проверка текущих ссылок
SELECT * FROM social_links; 