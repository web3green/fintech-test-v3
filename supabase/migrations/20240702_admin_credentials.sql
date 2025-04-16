-- Создание таблицы для хранения учетных данных администратора
CREATE TABLE IF NOT EXISTS public.admin_credentials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создаем индексы для оптимизации запросов
CREATE INDEX IF NOT EXISTS admin_credentials_username_idx ON public.admin_credentials(username);

-- Настраиваем Row Level Security (RLS) для таблицы
ALTER TABLE public.admin_credentials ENABLE ROW LEVEL SECURITY;

-- Политики безопасности
-- Администратор может читать свои данные
CREATE POLICY "Admin can read own credentials" 
ON public.admin_credentials FOR SELECT 
TO authenticated 
USING (auth.uid()::text = 'admin');

-- Администратор может обновлять свои данные
CREATE POLICY "Admin can update own credentials" 
ON public.admin_credentials FOR UPDATE 
TO authenticated 
USING (auth.uid()::text = 'admin');

-- Добавляем начальную запись для администратора (пароль: password)
INSERT INTO public.admin_credentials (username, password) 
VALUES ('admin', 'password')
ON CONFLICT (username) DO NOTHING;

-- Функция для обновления временной метки updated_at при изменении записи
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер, который вызывает функцию при обновлении записи
CREATE TRIGGER update_admin_credentials_updated_at
BEFORE UPDATE ON public.admin_credentials
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Комментарий к таблице
COMMENT ON TABLE public.admin_credentials IS 'Таблица для хранения учетных данных администратора'; 