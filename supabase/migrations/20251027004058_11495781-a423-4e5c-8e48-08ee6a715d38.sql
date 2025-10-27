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