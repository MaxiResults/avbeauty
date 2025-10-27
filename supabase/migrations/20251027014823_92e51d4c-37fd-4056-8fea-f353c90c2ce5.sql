-- Add cliente_id column to Leads_Cadastro with default 2
ALTER TABLE public."Leads_Cadastro"
ADD COLUMN IF NOT EXISTS cliente_id SMALLINT NOT NULL DEFAULT 2;

-- Ensure created_at exists and keeps default to now(); do not modify if present
-- If the column does not exist, create it with default now()
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'Leads_Cadastro' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE public."Leads_Cadastro"
    ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT now();
  END IF;
END $$;