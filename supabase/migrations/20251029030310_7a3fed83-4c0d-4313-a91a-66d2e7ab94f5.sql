-- Rename inconsistent columns to definitive names (idempotent)
DO $$
BEGIN
  -- controla_estoque
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'produtos' AND column_name = 'controlar_estoque'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'produtos' AND column_name = 'controla_estoque'
  ) THEN
    EXECUTE 'ALTER TABLE public.produtos RENAME COLUMN controlar_estoque TO controla_estoque';
  END IF;

  -- imagem_galeria
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'produtos' AND column_name = 'galeria_imagens'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'produtos' AND column_name = 'imagem_galeria'
  ) THEN
    EXECUTE 'ALTER TABLE public.produtos RENAME COLUMN galeria_imagens TO imagem_galeria';
  END IF;
END $$;

-- Refresh updated_at trigger function if needed (no-op if already exists)
CREATE OR REPLACE FUNCTION public.update_produtos_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;