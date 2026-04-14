
ALTER TABLE public.dispatch_assignments
  ADD COLUMN review_status text NOT NULL DEFAULT 'Draft',
  ADD COLUMN review_comment text NOT NULL DEFAULT '',
  ADD COLUMN reviewed_by text NOT NULL DEFAULT '',
  ADD COLUMN reviewed_at timestamp with time zone DEFAULT NULL,
  ADD COLUMN irregularity_id uuid REFERENCES public.irregularity_reports(id) ON DELETE SET NULL DEFAULT NULL;
