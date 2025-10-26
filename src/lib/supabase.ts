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
  const { data: result, error } = await supabase
    .from('Leads_Site')
    .insert([data]);

  if (error) {
    throw error;
  }

  return result;
}
