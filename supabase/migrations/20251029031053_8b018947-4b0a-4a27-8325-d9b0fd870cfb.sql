-- CORREÇÃO DEFINITIVA: Dropar TODOS os triggers antigos e recriar corretamente

-- ========== PRODUTOS ==========
-- Dropar todos os triggers possíveis (antigos e novos)
DROP TRIGGER IF EXISTS update_produtos_updated_at ON public.produtos;
DROP TRIGGER IF EXISTS update_produtos_updated_at_trigger ON public.produtos;
DROP TRIGGER IF EXISTS trigger_update_produtos_updated_at ON public.produtos;

-- Recriar função com nome correto minúsculo
CREATE OR REPLACE FUNCTION public.update_produtos_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Criar trigger único e correto
CREATE TRIGGER update_produtos_updated_at_trigger
  BEFORE UPDATE ON public.produtos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_produtos_updated_at();

-- ========== CAMPANHAS ==========
-- Dropar todos os triggers possíveis
DROP TRIGGER IF EXISTS update_campanhas_updated_at ON public.campanhas;
DROP TRIGGER IF EXISTS update_campanhas_updated_at_trigger ON public.campanhas;
DROP TRIGGER IF EXISTS trigger_update_campanhas_updated_at ON public.campanhas;

-- Recriar função com nome correto minúsculo
CREATE OR REPLACE FUNCTION public.update_campanhas_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Criar trigger único e correto
CREATE TRIGGER update_campanhas_updated_at_trigger
  BEFORE UPDATE ON public.campanhas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_campanhas_updated_at();