import { createClient } from '@supabase/supabase-js';

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
}

export async function submitLead(data: LeadData) {
  const onlyDigits = (s: string) => s.replace(/\D/g, '');
  const normalizePhoneToE164BR = (s: string) => {
    let d = onlyDigits(s || '');
    if (!d.startsWith('55')) d = '55' + d;
    return d;
  };

  const telefone = normalizePhoneToE164BR(data.lead_telefone);

  // Tenta inserir no Leads_Cadastro (estrutura mais comum)
  let { data: result, error } = await supabase
    .from('Leads_Cadastro')
    .insert([
      {
        nome: data.lead_nome,
        email: data.lead_email,
        telefone,
        canal_origem: 'site',
        origem_url: data.site_url,
        status: 'novo',
        observacoes: data.lead_obs ?? null,
        interesse: data.lead_interest,
        cliente_id: 2,
      }
    ])
    .select();

  if (error) {
    // Fallback: usa a tabela Leads_Site com o payload original
    const fallback = await supabase
      .from('Leads_Site')
      .insert([{ ...data, lead_telefone: telefone }])
      .select();
    if (fallback.error) throw fallback.error;
    return fallback.data;
  }

  return result;
}
