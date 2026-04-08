
ALTER TABLE public.aircrafts ADD COLUMN ac_type text NOT NULL DEFAULT '';
ALTER TABLE public.aircrafts ALTER COLUMN status SET DEFAULT 'Passenger';
