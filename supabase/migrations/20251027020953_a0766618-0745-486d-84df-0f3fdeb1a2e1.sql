-- Add thread_id column to store OpenAI thread for conversation continuity
ALTER TABLE "Conversas_sessao" 
ADD COLUMN IF NOT EXISTS thread_id TEXT;