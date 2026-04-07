
-- Step 1: Drop foreign key from clearances that references the old flight_schedules
ALTER TABLE public.clearances DROP CONSTRAINT IF EXISTS clearances_flight_schedule_id_fkey;

-- Step 2: Drop the old empty flight_schedules table
DROP TABLE IF EXISTS public.flight_schedules;

-- Step 3: Rename clearances to flight_schedules
ALTER TABLE public.clearances RENAME TO flight_schedules;

-- Step 4: Rename foreign key constraint for airline_id
ALTER TABLE public.flight_schedules RENAME CONSTRAINT clearances_airline_id_fkey TO flight_schedules_airline_id_fkey;

-- Step 5: Rename RLS policies
ALTER POLICY "Admin can delete clearances" ON public.flight_schedules RENAME TO "Admin can delete flight_schedules";
ALTER POLICY "Authenticated can insert clearances" ON public.flight_schedules RENAME TO "Authenticated can insert flight_schedules";
ALTER POLICY "Authenticated can read clearances" ON public.flight_schedules RENAME TO "Authenticated can read flight_schedules";
ALTER POLICY "Authenticated can update clearances" ON public.flight_schedules RENAME TO "Authenticated can update flight_schedules";

-- Step 6: Drop the now-orphaned flight_schedule_id column (it referenced the old table)
ALTER TABLE public.flight_schedules DROP COLUMN IF EXISTS flight_schedule_id;

-- Step 7: Drop the old flight_status enum if it exists (was for the old flight_schedules table)
DROP TYPE IF EXISTS public.flight_status;
