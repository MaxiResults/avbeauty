
-- Migration: 20251027004051
-- Create required tables for leads and chat sessions/messages
-- Enable extension for UUID generation
create extension if not exists pgcrypto;

-- Leads table used by create-lead function
create table if not exists public."Leads_Cadastro" (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null,
  telefone text not null,
  canal_origem text,
  origem_url text,
  status text,
  observacoes text,
  interesse text,
  created_at timestamptz not null default now()
);

-- Sessions table used by create-session function
create table if not exists public."Conversas_sessao" (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public."Leads_Cadastro"(id) on delete cascade,
  canal text,
  origem text,
  created_at timestamptz not null default now()
);
create index if not exists idx_conversas_sessao_lead on public."Conversas_sessao"(lead_id);

-- Messages history table used by save-message function
create table if not exists public."Conversas_Historico" (
  id uuid primary key default gen_random_uuid(),
  sessao_id uuid not null references public."Conversas_sessao"(id) on delete cascade,
  remetente text not null,
  tipo_mensagem text,
  mensagem text not null,
  origem text,
  data_envio timestamptz not null default now()
);
create index if not exists idx_conversas_historico_sessao on public."Conversas_Historico"(sessao_id);

-- Enable RLS (service role used in functions will bypass RLS)
alter table public."Leads_Cadastro" enable row level security;
alter table public."Conversas_sessao" enable row level security;
alter table public."Conversas_Historico" enable row level security;

-- Migration: 20251027014819
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

-- Migration: 20251027020950
-- Add thread_id column to store OpenAI thread for conversation continuity
ALTER TABLE "Conversas_sessao" 
ADD COLUMN IF NOT EXISTS thread_id TEXT;

-- Migration: 20251027025413
-- Add cliente_id to Conversas_sessao and Conversas_Historico
-- Ensures numeric type with default 2 and not null
ALTER TABLE public."Conversas_sessao"
ADD COLUMN IF NOT EXISTS cliente_id smallint NOT NULL DEFAULT 2;

ALTER TABLE public."Conversas_Historico"
ADD COLUMN IF NOT EXISTS cliente_id smallint NOT NULL DEFAULT 2;

-- Migration: 20251028175247
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

-- Migration: 20251028175631
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

-- Migration: 20251028194910
-- Criar bucket para imagens de produtos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'produtos',
  'produtos',
  true,
  2097152, -- 2MB em bytes
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Criar políticas de acesso ao bucket produtos
CREATE POLICY "Permitir leitura pública de imagens de produtos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'produtos');

CREATE POLICY "Permitir upload de imagens de produtos autenticados"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'produtos' AND
  (storage.foldername(name))[1] = '2' AND
  (storage.foldername(name))[2] = '2'
);

CREATE POLICY "Permitir atualização de imagens de produtos autenticados"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'produtos' AND
  (storage.foldername(name))[1] = '2' AND
  (storage.foldername(name))[2] = '2'
);

CREATE POLICY "Permitir exclusão de imagens de produtos autenticados"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'produtos' AND
  (storage.foldername(name))[1] = '2' AND
  (storage.foldername(name))[2] = '2'
);

-- Migration: 20251028202526
-- Criar tabela de produtos
CREATE TABLE IF NOT EXISTS public.produtos (
  ID SERIAL PRIMARY KEY,
  Cliente_ID SMALLINT NOT NULL DEFAULT 2,
  Empresa_ID SMALLINT NOT NULL DEFAULT 2,
  Nome TEXT NOT NULL,
  Slug TEXT NOT NULL UNIQUE,
  Descricao_Curta TEXT,
  Descricao_Completa TEXT,
  Categoria TEXT,
  Preco_Padrao NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  Preco_Promocional NUMERIC(10,2),
  Desconto_Percentual NUMERIC(5,2),
  Imagem_Principal TEXT,
  Galeria_Imagens TEXT[],
  Status TEXT NOT NULL DEFAULT 'ativo',
  Controlar_Estoque BOOLEAN DEFAULT false,
  Vagas_Disponiveis INTEGER,
  Vagas_Vendidas INTEGER DEFAULT 0,
  Ordem_Exibicao INTEGER DEFAULT 0,
  Meta_Title TEXT,
  Meta_Description TEXT,
  Created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  Updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;

-- Criar policies para produtos
CREATE POLICY "Produtos visíveis publicamente" 
ON public.produtos 
FOR SELECT 
USING (Status = 'ativo' AND Cliente_ID = 2 AND Empresa_ID = 2);

CREATE POLICY "Usuários autenticados podem criar produtos" 
ON public.produtos 
FOR INSERT 
WITH CHECK (Cliente_ID = 2 AND Empresa_ID = 2);

CREATE POLICY "Usuários autenticados podem atualizar produtos" 
ON public.produtos 
FOR UPDATE 
USING (Cliente_ID = 2 AND Empresa_ID = 2);

CREATE POLICY "Usuários autenticados podem deletar produtos" 
ON public.produtos 
FOR DELETE 
USING (Cliente_ID = 2 AND Empresa_ID = 2);

-- Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_produtos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.Updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Criar trigger para produtos
CREATE TRIGGER update_produtos_updated_at
BEFORE UPDATE ON public.produtos
FOR EACH ROW
EXECUTE FUNCTION public.update_produtos_updated_at();

-- Criar trigger para campanhas (estava faltando)
CREATE TRIGGER update_campanhas_updated_at_trigger
BEFORE UPDATE ON public.campanhas
FOR EACH ROW
EXECUTE FUNCTION public.update_campanhas_updated_at();

-- Criar policies para o bucket de storage produtos
CREATE POLICY "Imagens de produtos são públicas" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'produtos');

CREATE POLICY "Usuários autenticados podem fazer upload de produtos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'produtos');

CREATE POLICY "Usuários autenticados podem atualizar imagens de produtos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'produtos');

CREATE POLICY "Usuários autenticados podem deletar imagens de produtos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'produtos');

-- Migration: 20251028203335
-- Corrigir função para usar nome correto da coluna (minúsculo)
CREATE OR REPLACE FUNCTION public.update_campanhas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Corrigir função de produtos também
CREATE OR REPLACE FUNCTION public.update_produtos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Migration: 20251028204147
-- Remover todas as policies antigas do storage produtos
DROP POLICY IF EXISTS "Imagens de produtos são públicas" ON storage.objects;
DROP POLICY IF EXISTS "Permitir atualização de imagens de produtos autenticados" ON storage.objects;
DROP POLICY IF EXISTS "Permitir exclusão de imagens de produtos autenticados" ON storage.objects;
DROP POLICY IF EXISTS "Permitir leitura pública de imagens de produtos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir upload de imagens de produtos autenticados" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar imagens de produtos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar imagens de produtos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem fazer upload de produtos" ON storage.objects;

-- Criar policies corretas e sem conflito
-- 1. Leitura pública (qualquer um pode ver as imagens)
CREATE POLICY "Leitura pública de produtos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'produtos');

-- 2. Upload apenas autenticado com path 2/2
CREATE POLICY "Upload autenticado de produtos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'produtos' 
  AND (storage.foldername(name))[1] = '2'
  AND (storage.foldername(name))[2] = '2'
);

-- 3. Update apenas autenticado com path 2/2
CREATE POLICY "Update autenticado de produtos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'produtos'
  AND (storage.foldername(name))[1] = '2'
  AND (storage.foldername(name))[2] = '2'
);

-- 4. Delete apenas autenticado com path 2/2
CREATE POLICY "Delete autenticado de produtos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'produtos'
  AND (storage.foldername(name))[1] = '2'
  AND (storage.foldername(name))[2] = '2'
);

-- Migration: 20251028212506
-- Políticas RLS para o bucket 'produtos' no storage
-- Permitir leitura pública das imagens
CREATE POLICY "Imagens de produtos são publicamente acessíveis"
ON storage.objects FOR SELECT
USING (bucket_id = 'produtos');

-- Permitir upload para usuários autenticados
CREATE POLICY "Usuários autenticados podem fazer upload de produtos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'produtos' 
  AND auth.role() = 'authenticated'
);

-- Permitir atualização para usuários autenticados
CREATE POLICY "Usuários autenticados podem atualizar imagens de produtos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'produtos' 
  AND auth.role() = 'authenticated'
);

-- Permitir deleção para usuários autenticados
CREATE POLICY "Usuários autenticados podem deletar imagens de produtos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'produtos' 
  AND auth.role() = 'authenticated'
);

-- Migration: 20251028233233
-- Force PostgREST schema cache reload
DO $$ BEGIN
  PERFORM pg_notify('pgrst', 'reload schema');
EXCEPTION WHEN OTHERS THEN
  -- ignore if extension not available
  NULL;
END $$;

-- Migration: 20251029030308
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

-- Migration: 20251029030717
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

-- Migration: 20251029031050
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

-- Migration: 20251029040802
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

-- Migration: 20251029041028
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
