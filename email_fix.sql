-- Создаем функцию для безопасного добавления email
-- Создаем вспомогательную функцию exec_sql для запуска произвольного SQL
CREATE OR REPLACE FUNCTION public.exec_sql(sql_query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql_query;
END;
$$;

-- Предоставляем доступ к функции
GRANT EXECUTE ON FUNCTION public.exec_sql TO authenticated;

-- Удаляем существующие записи, если они есть
DELETE FROM notification_emails WHERE email IN ('info@fintech-assist.com', 'greg@fintech-assist.com', 'alex@fintech-assist.com');
