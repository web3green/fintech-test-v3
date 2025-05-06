-- supabase/migrations/20250504150000_add_contact_requests_insert_policy.sql

-- Enable RLS if it's not already (though screenshot shows it is)
-- alter table public.contact_requests enable row level security;

-- Drop policy first if it potentially exists with the same name, to avoid error
DROP POLICY IF EXISTS "Allow public insert access" ON public.contact_requests;

-- Create the policy allowing anyone to insert into contact_requests
CREATE POLICY "Allow public insert access"
ON public.contact_requests
FOR INSERT
WITH CHECK (true); 