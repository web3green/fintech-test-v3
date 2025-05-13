-- Миграция для исправления прав доступа к таблице social_links и добавления начальных социальных ссылок

-- Полностью отключаем RLS для таблицы
ALTER TABLE social_links DISABLE ROW LEVEL SECURITY;

-- Предоставляем все права на таблицу social_links для всех ролей
GRANT ALL ON TABLE social_links TO authenticated;
GRANT ALL ON TABLE social_links TO anon;
GRANT ALL ON TABLE social_links TO service_role;

-- Проверяем существование таблицы и создаем, если не существует
CREATE TABLE IF NOT EXISTS social_links (
    platform TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    icon_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Добавляем триггер для автоматического обновления updated_at
DROP TRIGGER IF EXISTS update_social_links_timestamp ON social_links;
CREATE TRIGGER update_social_links_timestamp
BEFORE UPDATE ON social_links
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Добавляем/обновляем образцы социальных ссылок
INSERT INTO social_links (platform, url, icon_name)
VALUES 
  ('facebook', 'https://facebook.com/fintech', 'facebook'),
  ('twitter', 'https://twitter.com/fintech', 'twitter'),
  ('instagram', 'https://instagram.com/fintech', 'instagram'),
  ('telegram', 'https://t.me/fintech', 'telegram'),
  ('linkedin', 'https://linkedin.com/company/fintech', 'linkedin')
ON CONFLICT (platform) 
DO UPDATE SET 
  updated_at = NOW();

-- Выводим текущее состояние таблицы
SELECT * FROM social_links; 