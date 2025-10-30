import { createClient } from '@supabase/supabase-js';
import { supabase as cloud } from '@/integrations/supabase/client';

const supabaseUrl = 'https://sunccjukvrximjiqzdkm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1bmNjanVrdnJ4aW1qaXF6ZGttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNzMyODUsImV4cCI6MjA3NDg0OTI4NX0.Xt68Jol4GQ-GeL7g4z_wmm6ui81BIpTNJmNO7WhR_7E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Edge functions base URL para o banco externo
export const SUPABASE_FUNCTIONS_URL = 'https://sunccjukvrximjiqzdkm.supabase.co/functions/v1';
export const SUPABASE_ANON_KEY = supabaseAnonKey;

export interface LeadData {
  site_url: string;
  lead_nome: string;
  lead_telefone: string;
  lead_email: string;
  lead_interest: string;
  lead_obs?: string;
}

export async function submitLead(data: LeadData) {
  // Normalize phone to only digits and ensure starts with 55
  const onlyDigits = (s: string) => s.replace(/\D/g, '');
  let telefone = onlyDigits(data.lead_telefone || '');
  if (!telefone.startsWith('55')) telefone = '55' + telefone;

  // Delegate to backend function that writes to external DB with service role
  const { data: result, error } = await cloud.functions.invoke('submit-lead-site', {
    body: {
      site_url: data.site_url,
      lead_nome: data.lead_nome,
      lead_telefone: telefone,
      lead_email: data.lead_email,
      lead_interest: data.lead_interest,
      lead_obs: data.lead_obs ?? null,
    },
  });

  if (error) throw new Error(error.message || 'Falha ao criar lead');
  return result;
}
