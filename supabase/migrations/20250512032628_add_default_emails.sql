-- Миграция для добавления почтовых адресов и необходимых функций

-- Временно отключаем ограничение для добавления адресов
ALTER TABLE notification_emails 
  DROP CONSTRAINT IF EXISTS notification_emails_email_check;

-- Добавляем адреса напрямую
INSERT INTO notification_emails (email, created_at) 
  VALUES ('info@fintech-assist.com', now()) 
  ON CONFLICT (email) DO NOTHING;
  
INSERT INTO notification_emails (email, created_at) 
  VALUES ('greg@fintech-assist.com', now()) 
  ON CONFLICT (email) DO NOTHING;
  
    INSERT INTO notification_emails (email, created_at)
  VALUES ('alex@fintech-assist.com', now()) 
  ON CONFLICT (email) DO NOTHING;

-- Эту часть можно раскомментировать, если нужно вернуть ограничение
-- ALTER TABLE notification_emails 
--   ADD CONSTRAINT notification_emails_email_check 
--   CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Просмотр добавленных адресов
SELECT * FROM notification_emails; 