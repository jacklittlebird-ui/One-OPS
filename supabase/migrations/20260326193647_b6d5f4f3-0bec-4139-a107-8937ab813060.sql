
-- Add SGHA-compliant fields to contracts table (industry best practices)
ALTER TABLE public.contracts
  ADD COLUMN IF NOT EXISTS contract_type text NOT NULL DEFAULT 'SGHA',
  ADD COLUMN IF NOT EXISTS contact_person text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS contact_email text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS payment_terms text NOT NULL DEFAULT 'Net 30',
  ADD COLUMN IF NOT EXISTS billing_frequency text NOT NULL DEFAULT 'Monthly',
  ADD COLUMN IF NOT EXISTS sgha_ref text NOT NULL DEFAULT '';
