-- Add cliente_id to Conversas_sessao and Conversas_Historico
-- Ensures numeric type with default 2 and not null
ALTER TABLE public."Conversas_sessao"
ADD COLUMN IF NOT EXISTS cliente_id smallint NOT NULL DEFAULT 2;

ALTER TABLE public."Conversas_Historico"
ADD COLUMN IF NOT EXISTS cliente_id smallint NOT NULL DEFAULT 2;