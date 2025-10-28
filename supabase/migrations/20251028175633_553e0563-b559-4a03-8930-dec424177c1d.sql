-- Corrigir função para ter search_path definido
DROP FUNCTION IF EXISTS public.update_campanhas_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION public.update_campanhas_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.Updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Recriar trigger
DROP TRIGGER IF EXISTS trigger_update_campanhas_updated_at ON public.campanhas;

CREATE TRIGGER trigger_update_campanhas_updated_at
BEFORE UPDATE ON public.campanhas
FOR EACH ROW
EXECUTE FUNCTION public.update_campanhas_updated_at();