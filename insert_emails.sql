-- SQL скрипт для прямой вставки email адресов
INSERT INTO notification_emails (email, created_at) VALUES ('info@fintech-assist.com', now()) ON CONFLICT (email) DO NOTHING;
INSERT INTO notification_emails (email, created_at) VALUES ('greg@fintech-assist.com', now()) ON CONFLICT (email) DO NOTHING;
INSERT INTO notification_emails (email, created_at) VALUES ('alex@fintech-assist.com', now()) ON CONFLICT (email) DO NOTHING;
