-- Проверяем структуру таблицы contact_requests
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'contact_requests';

-- Проверяем структуру таблицы notification_emails
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'notification_emails';

-- Проверяем триггеры на таблице contact_requests
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'public' 
AND event_object_table = 'contact_requests';

-- Проверяем функции, которые могут отправлять уведомления
SELECT routine_name, routine_type, routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
AND (routine_definition ILIKE '%notification%' OR routine_name ILIKE '%notify%' OR routine_name ILIKE '%email%')
AND routine_type = 'FUNCTION';

-- Просмотр последних 5 записей contact_requests
SELECT * FROM contact_requests ORDER BY created_at DESC LIMIT 5;

-- Просмотр всех email-адресов для уведомлений
SELECT * FROM notification_emails; 