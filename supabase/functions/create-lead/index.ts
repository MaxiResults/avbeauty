import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { nome, email, telefone, canal_origem = "site", origem_url = "", status = "novo", observacoes = null, interesse = null } = body ?? {};

    if (!nome || !email || !telefone) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const SUPABASE_URL = Deno.env.get("EXT_SUPABASE_URL") ?? Deno.env.get("SUPABASE_URL");
    const SERVICE_KEY = Deno.env.get("EXT_SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SERVICE_KEY) throw new Error("Backend not configured");

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    // Try mapping to user's external table schema first (PascalCase columns)
    const payloadUpper = {
      Site_URL: origem_url ?? "",
      Form_Name: "Agende sua avaliação",
      Lead_Nome: nome,
      Lead_Telefone: telefone,
      Lead_Email: email,
      Lead_Interesse: interesse ?? null,
      Lead_Obs: observacoes ?? null,
      Form_Webhook: null,
      Campanha_ID: null,
      CP_1: null,
      CP_2: null,
      CP_3: null,
      Lead_Status: status ?? "novo",
      Cliente_ID: 2,
    } as const;

    // Attempt 1: Insert into Leads_Cadastro with PascalCase columns
    let { data, error } = await supabase
      .from("Leads_Cadastro")
      .insert(payloadUpper as any)
      .select()
      .maybeSingle();

    if (error || !data) {
      // Attempt 2: Some projects use table name Leads_Site
      const res2 = await supabase
        .from("Leads_Site")
        .insert(payloadUpper as any)
        .select()
        .maybeSingle();
      data = res2.data;
      error = res2.error;
    }

    if (error || !data) {
      // Attempt 3: Fallback to previous lowercase column schema
      const res3 = await supabase
        .from("Leads_Cadastro")
        .insert({ nome, email, telefone, canal_origem, origem_url, status, observacoes, interesse })
        .select()
        .maybeSingle();
      data = res3.data;
      error = res3.error;
    }

    if (error || !data) {
      console.error("create-lead insert error:", error);
      return new Response(JSON.stringify({ error: error?.message || "Insert failed" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const leadId = (data as any).id ?? (data as any).ID;
    return new Response(JSON.stringify({ leadId, lead: data }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("create-lead error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});