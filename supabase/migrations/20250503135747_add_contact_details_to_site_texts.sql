INSERT INTO public.site_texts (key, section, value_en, value_ru)
VALUES
  ('contact.phone.primary', 'contacts', '+44 7450 574905', '+44 7450 574905'),
  ('contact.phone.secondary', 'contacts', '+44 204 577 24 90', '+44 204 577 24 90'),
  ('contact.email', 'contacts', 'info@fintech-assist.com', 'info@fintech-assist.com'),
  ('contact.address', 'contacts', 'London, United Kingdom', 'Лондон, Великобритания')
ON CONFLICT (key) DO NOTHING; -- Prevents errors if keys already exist
