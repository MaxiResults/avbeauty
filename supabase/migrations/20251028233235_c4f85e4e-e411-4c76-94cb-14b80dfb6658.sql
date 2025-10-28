-- Force PostgREST schema cache reload
DO $$ BEGIN
  PERFORM pg_notify('pgrst', 'reload schema');
EXCEPTION WHEN OTHERS THEN
  -- ignore if extension not available
  NULL;
END $$;