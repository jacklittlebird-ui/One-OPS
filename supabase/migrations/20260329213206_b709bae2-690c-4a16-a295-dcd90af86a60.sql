
-- Create airport_charges table to replace localStorage storage
CREATE TABLE public.airport_charges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_name TEXT NOT NULL DEFAULT '',
  mtow TEXT NOT NULL DEFAULT '',
  landing_day NUMERIC NOT NULL DEFAULT 0,
  landing_night NUMERIC NOT NULL DEFAULT 0,
  parking_day NUMERIC NOT NULL DEFAULT 0,
  parking_night NUMERIC NOT NULL DEFAULT 0,
  housing NUMERIC NOT NULL DEFAULT 0,
  air_navigation NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.airport_charges ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access
CREATE POLICY "Authenticated users can view airport_charges" ON public.airport_charges FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert airport_charges" ON public.airport_charges FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update airport_charges" ON public.airport_charges FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete airport_charges" ON public.airport_charges FOR DELETE TO authenticated USING (true);
