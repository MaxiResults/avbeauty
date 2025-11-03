// Supabase Edge Function: submit-lead-site
// Inserts a lead into the EXTERNAL database table `Leads_Site` using Service Role
// Uses EXT_SUPABASE_URL and EXT_SUPABASE_SERVICE_ROLE_KEY secrets

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LeadPayload {
  site_url: string
  lead_nome: string
  lead_telefone: string
  lead_email: string
  lead_interest: string
  lead_obs?: string | null
  cliente_id?: number
  empresa_id?: number
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { site_url, lead_nome, lead_telefone, lead_email, lead_interest, lead_obs, cliente_id, empresa_id }: LeadPayload = await req.json()

    if (!lead_nome || !lead_email || !lead_telefone) {
      return new Response(
        JSON.stringify({ error: 'Campos obrigatórios faltando' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Normalize phone: only digits and ensure starts with 55
    const onlyDigits = (s: string) => s.replace(/\D/g, '')
    let telefone = onlyDigits(lead_telefone || '')
    if (!telefone.startsWith('55')) telefone = '55' + telefone

    const EXT_SUPABASE_URL = Deno.env.get('EXT_SUPABASE_URL')
    const EXT_SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('EXT_SUPABASE_SERVICE_ROLE_KEY')

    if (!EXT_SUPABASE_URL || !EXT_SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(
        JSON.stringify({ error: 'Secrets externos não configurados' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Service role client bypasses RLS on external project
    const supabase = createClient(EXT_SUPABASE_URL, EXT_SUPABASE_SERVICE_ROLE_KEY)

    const payload = {
      Site_URL: site_url,
      Lead_Nome: lead_nome,
      Lead_Telefone: telefone,
      Lead_Email: lead_email,
      Lead_Interesse: lead_interest,
      Lead_Obs: lead_obs ?? null,
      Form_Webhook: null,
      Campanha_ID: null,
      CP_1: null,
      CP_2: null,
      CP_3: null,
      Lead_Status: 'novo',
      Cliente_ID: cliente_id ?? 3,
      empresa_id: empresa_id ?? 3,
    }

    const { data, error } = await supabase
      .from('Leads_Site')
      .insert(payload)
      .select()
      .single()

    if (error) {
      console.error('submit-lead-site insert error:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ data }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (e) {
    console.error('submit-lead-site exception:', e)
    return new Response(
      JSON.stringify({ error: 'Erro inesperado' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
