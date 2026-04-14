
-- Add new columns to contracts table
ALTER TABLE public.contracts 
ADD COLUMN IF NOT EXISTS service_scope text NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS default_team_size text NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS base_flat_fee numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS overtime_rate numeric NOT NULL DEFAULT 0;

-- Create contract_service_rates table
CREATE TABLE public.contract_service_rates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id uuid NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  service_type text NOT NULL DEFAULT '',
  rate numeric NOT NULL DEFAULT 0,
  staff_count integer NOT NULL DEFAULT 0,
  duration_hours numeric NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.contract_service_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read contract_service_rates" ON public.contract_service_rates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert contract_service_rates" ON public.contract_service_rates FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update contract_service_rates" ON public.contract_service_rates FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin can delete contract_service_rates" ON public.contract_service_rates FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- Create irregularity_reports table
CREATE TABLE public.irregularity_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id text NOT NULL DEFAULT '',
  flight_no text NOT NULL DEFAULT '',
  airline text NOT NULL DEFAULT '',
  station text NOT NULL DEFAULT 'CAI',
  incident_date date NOT NULL DEFAULT CURRENT_DATE,
  severity text NOT NULL DEFAULT 'Low',
  category text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Open',
  description text NOT NULL DEFAULT '',
  reported_by text NOT NULL DEFAULT '',
  assigned_to text NOT NULL DEFAULT '',
  resolution text NOT NULL DEFAULT '',
  resolved_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.irregularity_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read irregularity_reports" ON public.irregularity_reports FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert irregularity_reports" ON public.irregularity_reports FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update irregularity_reports" ON public.irregularity_reports FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin can delete irregularity_reports" ON public.irregularity_reports FOR DELETE TO authenticated USING (is_admin(auth.uid()));

CREATE TRIGGER update_irregularity_reports_updated_at
BEFORE UPDATE ON public.irregularity_reports
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
