-- supabase/migrations/20250504153000_grant_insert_to_anon_on_contact_requests.sql

-- Grant INSERT privilege on the contact_requests table to the anon role.
-- This is necessary for the public contact form to work, even with a permissive RLS policy.
GRANT INSERT ON TABLE public.contact_requests TO anon; 