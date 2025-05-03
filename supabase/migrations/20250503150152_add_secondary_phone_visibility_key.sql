INSERT INTO public.site_texts (key, section, value_en, value_ru)
VALUES
  ('contact.phone.secondary.visible', 'contacts', 'true', 'true')
ON CONFLICT (key) DO NOTHING;
