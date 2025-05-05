-- supabase/migrations/20250504140000_add_hero_keys.sql

-- Add keys for Hero section jurisdictions (up to 12)
INSERT INTO public.site_texts (key, value_en, value_ru) VALUES
('hero.jurisdiction.1', 'UK', 'UK'),
('hero.jurisdiction.2', 'Europe', 'Европа'),
('hero.jurisdiction.3', 'Asia', 'Азия'),
('hero.jurisdiction.4', 'America', 'Америка'),
('hero.jurisdiction.5', 'Offshores', 'Офшоры'),
('hero.jurisdiction.6', '', ''),
('hero.jurisdiction.7', '', ''),
('hero.jurisdiction.8', '', ''),
('hero.jurisdiction.9', '', ''),
('hero.jurisdiction.10', '', ''),
('hero.jurisdiction.11', '', ''),
('hero.jurisdiction.12', '', '')
ON CONFLICT (key) DO NOTHING; -- Avoid errors if keys somehow already exist

-- Add keys for Hero section licenses (up to 8)
INSERT INTO public.site_texts (key, value_en, value_ru) VALUES
('hero.license.1', 'EMI', 'EMI'),
('hero.license.2', 'MSB', 'MSB'),
('hero.license.3', 'Crypto', 'Крипто'),
('hero.license.4', 'PSP', 'PSP'),
('hero.license.5', 'Gambling', 'Гемблинг'),
('hero.license.6', 'E-money', 'Эл. деньги'),
('hero.license.7', '', ''),
('hero.license.8', '', '')
ON CONFLICT (key) DO NOTHING; -- Avoid errors if keys somehow already exist 