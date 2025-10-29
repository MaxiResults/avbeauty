import { createClient } from '@supabase/supabase-js';

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

  // Insert directly into Leads_Site table with PascalCase columns
  const { data: insertData, error } = await supabase
    .from('Leads_Site')
    .insert({
      Site_URL: data.site_url,
      Form_Name: 'Agende sua avaliação',
      Lead_Nome: data.lead_nome,
      Lead_Telefone: telefone,
      Lead_Email: data.lead_email,
      Lead_Interesse: data.lead_interest,
      Lead_Obs: data.lead_obs ?? null,
      Form_Webhook: null,
      Campanha_ID: null,
      CP_1: null,
      CP_2: null,
      CP_3: null,
      Lead_Status: 'novo',
      Cliente_ID: 2,
      empresa_id: 2,
    })
    .select()
    .single();

  if (error) throw new Error(error.message || 'Falha ao criar lead');
  return insertData;
}
