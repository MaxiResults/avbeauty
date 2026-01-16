import { createClient } from '@supabase/supabase-js';
import { APP_CLIENTE_ID, APP_EMPRESA_ID } from '@/config/app.config';

// Use external Supabase database credentials
const supabaseUrl = 'https://sunccjukvrximjiqzdkm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1bmNjanVrdnJ4aW1qaXF6ZGttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNzMyODUsImV4cCI6MjA3NDg0OTI4NX0.Xt68Jol4GQ-GeL7g4z_wmm6ui81BIpTNJmNO7WhR_7E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface LeadData {
  site_url: string;
  lead_nome: string;
  lead_telefone: string;
  lead_email: string;
  lead_interest: string;
  lead_obs?: string;
  cliente_id?: number;
  empresa_id?: number;
}

export async function submitLead(data: LeadData) {
  // Normalize phone to only digits and ensure starts with 55
  const onlyDigits = (s: string) => s.replace(/\D/g, '');
  let telefone = onlyDigits(data.lead_telefone || '');
  if (!telefone.startsWith('55')) telefone = '55' + telefone;

  // Invoke backend function in the EXTERNAL database
  const { data: result, error } = await supabase.functions.invoke('submit-lead-site', {
    body: {
      site_url: data.site_url,
      lead_nome: data.lead_nome,
      lead_telefone: telefone,
      lead_email: data.lead_email,
      lead_interest: data.lead_interest,
      lead_obs: data.lead_obs ?? null,
      cliente_id: data.cliente_id ?? APP_CLIENTE_ID,
      empresa_id: data.empresa_id ?? APP_EMPRESA_ID,
    },
  });

  if (error) throw new Error(error.message || 'Falha ao criar lead');
  return result;
}

