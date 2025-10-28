-- Criar tabela de campanhas
CREATE TABLE IF NOT EXISTS public.campanhas (
  ID SERIAL PRIMARY KEY,
  Cliente_ID SMALLINT NOT NULL DEFAULT 2,
  Empresa_ID SMALLINT NOT NULL DEFAULT 2,
  Nome_campanha TEXT NOT NULL,
  Slug TEXT NOT NULL UNIQUE,
  Campanha_Status TEXT NOT NULL DEFAULT 'Agendada' CHECK (Campanha_Status IN ('Ativo', 'Suspensa', 'Cancelada', 'Concluída', 'Agendada')),
  Campanha_Tipo TEXT,
  Descricao TEXT,
  Data_Inicio TIMESTAMPTZ NOT NULL,
  Data_Fim TIMESTAMPTZ NOT NULL,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  canal_principal TEXT,
  plataforma_ads TEXT,
  Investimento_total NUMERIC(10,2) DEFAULT 0.00,
  url_principal TEXT NOT NULL,
  publico_alvo TEXT,
  Criado_Por TEXT,
  Created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  Updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  Ativo BOOLEAN NOT NULL DEFAULT TRUE
);

-- Criar índices para melhor performance
CREATE INDEX idx_campanhas_cliente_empresa ON public.campanhas(Cliente_ID, Empresa_ID);
CREATE INDEX idx_campanhas_status ON public.campanhas(Campanha_Status);
CREATE INDEX idx_campanhas_slug ON public.campanhas(Slug);
CREATE INDEX idx_campanhas_ativo ON public.campanhas(Ativo);

-- Criar função para atualizar Updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_campanhas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.Updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar Updated_at
CREATE TRIGGER trigger_update_campanhas_updated_at
BEFORE UPDATE ON public.campanhas
FOR EACH ROW
EXECUTE FUNCTION public.update_campanhas_updated_at();

-- Habilitar RLS
ALTER TABLE public.campanhas ENABLE ROW LEVEL SECURITY;

-- Criar política para usuários autenticados poderem ler campanhas
CREATE POLICY "Usuários autenticados podem ver campanhas"
ON public.campanhas
FOR SELECT
TO authenticated
USING (Cliente_ID = 2 AND Empresa_ID = 2);

-- Criar política para usuários autenticados poderem inserir campanhas
CREATE POLICY "Usuários autenticados podem criar campanhas"
ON public.campanhas
FOR INSERT
TO authenticated
WITH CHECK (Cliente_ID = 2 AND Empresa_ID = 2);

-- Criar política para usuários autenticados poderem atualizar campanhas
CREATE POLICY "Usuários autenticados podem atualizar campanhas"
ON public.campanhas
FOR UPDATE
TO authenticated
USING (Cliente_ID = 2 AND Empresa_ID = 2);

-- Criar política para usuários autenticados poderem deletar campanhas (soft delete)
CREATE POLICY "Usuários autenticados podem deletar campanhas"
ON public.campanhas
FOR DELETE
TO authenticated
USING (Cliente_ID = 2 AND Empresa_ID = 2);