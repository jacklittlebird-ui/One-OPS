CREATE UNIQUE INDEX idx_flight_schedules_no_duplicates
ON public.flight_schedules (flight_no, route, arrival_date, departure_date, clearance_type)
WHERE arrival_date IS NOT NULL AND departure_date IS NOT NULL;