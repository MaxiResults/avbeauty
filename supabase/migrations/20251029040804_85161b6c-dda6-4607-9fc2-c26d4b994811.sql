-- Criar tabela para leads do teaser da Black Friday
CREATE TABLE IF NOT EXISTS public.Leads_Cadastro_Teaser (
  ID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  Cliente_ID INT2 NOT NULL DEFAULT 2,
  Empresa_ID INT2 NOT NULL DEFAULT 2,
  Campanha_ID INT2,
  Nome TEXT NOT NULL,
  Telefone TEXT NOT NULL,
  Email TEXT NOT NULL,
  Link_Exclusivo TEXT UNIQUE NOT NULL,
  Status TEXT DEFAULT 'cadastrado',
  Data_Primeiro_Acesso TIMESTAMPTZ,
  Numero_Acessos INT DEFAULT 0,
  IP_Cadastro TEXT,
  Created_at TIMESTAMPTZ DEFAULT NOW(),
  Updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_leads_teaser_link ON public.Leads_Cadastro_Teaser(Link_Exclusivo);
CREATE INDEX IF NOT EXISTS idx_leads_teaser_email ON public.Leads_Cadastro_Teaser(Email);
CREATE INDEX IF NOT EXISTS idx_leads_teaser_cliente ON public.Leads_Cadastro_Teaser(Cliente_ID, Empresa_ID);

-- Habilitar RLS
ALTER TABLE public.Leads_Cadastro_Teaser ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção pública (cadastro)
CREATE POLICY "Permitir cadastro público" 
ON public.Leads_Cadastro_Teaser 
FOR INSERT 
TO public
WITH CHECK ((Cliente_ID = 2) AND (Empresa_ID = 2));

-- Política para permitir atualização de acesso com o link
CREATE POLICY "Permitir atualização de acesso" 
ON public.Leads_Cadastro_Teaser 
FOR UPDATE 
TO public
USING ((Cliente_ID = 2) AND (Empresa_ID = 2))
WITH CHECK ((Cliente_ID = 2) AND (Empresa_ID = 2));

-- Política para leitura com link exclusivo
CREATE POLICY "Permitir leitura com link" 
ON public.Leads_Cadastro_Teaser 
FOR SELECT 
TO public
USING ((Cliente_ID = 2) AND (Empresa_ID = 2));

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_leads_teaser_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.Updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_leads_teaser_updated_at
BEFORE UPDATE ON public.Leads_Cadastro_Teaser
FOR EACH ROW
EXECUTE FUNCTION update_leads_teaser_updated_at();