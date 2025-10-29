-- Corrigir função com search_path seguro
DROP TRIGGER IF EXISTS trigger_update_leads_teaser_updated_at ON public.Leads_Cadastro_Teaser;
DROP FUNCTION IF EXISTS update_leads_teaser_updated_at();

CREATE OR REPLACE FUNCTION update_leads_teaser_updated_at()
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

CREATE TRIGGER trigger_update_leads_teaser_updated_at
BEFORE UPDATE ON public.Leads_Cadastro_Teaser
FOR EACH ROW
EXECUTE FUNCTION update_leads_teaser_updated_at();