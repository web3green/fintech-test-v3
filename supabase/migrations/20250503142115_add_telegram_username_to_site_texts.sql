INSERT INTO public.site_texts (key, section, value_en, value_ru)
VALUES
  ('contact.telegram.username', 'contacts', '@fintech_assist', '@fintech_assist')
ON CONFLICT (key) DO NOTHING;
