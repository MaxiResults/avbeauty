import { createClient } from '@supabase/supabase-js';

// Use current project's Lovable Cloud credentials from environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

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

  // Invoke backend function in this same project to write to EXTERNAL DB
  const { data: result, error } = await supabase.functions.invoke('submit-lead-site', {
    body: {
      site_url: data.site_url,
      lead_nome: data.lead_nome,
      lead_telefone: telefone,
      lead_email: data.lead_email,
      lead_interest: data.lead_interest,
      lead_obs: data.lead_obs ?? null,
      cliente_id: data.cliente_id,
      empresa_id: data.empresa_id,
    },
  });

  if (error) throw new Error(error.message || 'Falha ao criar lead');
  return result;
}

