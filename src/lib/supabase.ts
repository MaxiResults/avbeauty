import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sunccjukvrximjiqzdkm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1bmNjanVrdnJ4aW1qaXF6ZGttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNzMyODUsImV4cCI6MjA3NDg0OTI4NX0.Xt68Jol4GQ-GeL7g4z_wmm6ui81BIpTNJmNO7WhR_7E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const LOVABLE_FUNCTIONS_BASE = 'https://prjylrbuvfgbirpgkeza.functions.supabase.co/functions/v1';
const LOVABLE_ANON = 'VRoaXO9doXjPXoYYfcmPRXQJbP7K-TmZsB6IIVV4DS4';

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

  const resp = await fetch(`${LOVABLE_FUNCTIONS_BASE}/create-lead`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LOVABLE_ANON}`,
    },
    body: JSON.stringify({
      nome: data.lead_nome,
      email: data.lead_email,
      telefone,
      canal_origem: 'site',
      origem_url: data.site_url,
      status: 'novo',
      observacoes: data.lead_obs ?? null,
      interesse: data.lead_interest,
    }),
  });

  const json = await resp.json();
  if (!resp.ok) throw new Error(json?.error || 'Falha ao criar lead');
  return json;
}
