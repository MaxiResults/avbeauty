-- Fix trigger function - PostgreSQL column names are case sensitive
DROP TRIGGER IF EXISTS update_produtos_updated_at_trigger ON public.produtos;

CREATE OR REPLACE FUNCTION public.update_produtos_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate trigger
CREATE TRIGGER update_produtos_updated_at_trigger
  BEFORE UPDATE ON public.produtos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_produtos_updated_at();