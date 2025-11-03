import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { formatInTimeZone } from "https://esm.sh/date-fns-tz@3.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { sessionId, remetente, mensagem, tipo_mensagem = "texto", origem = "site" } = await req.json();
    if (!sessionId || !remetente || !mensagem) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const EXT_SUPABASE_URL = "https://sunccjukvrximjiqzdkm.supabase.co";
    const EXT_SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("EXT_SUPABASE_SERVICE_ROLE_KEY");
    
    if (!EXT_SUPABASE_SERVICE_ROLE_KEY) {
      console.error("EXT_SUPABASE_SERVICE_ROLE_KEY not configured");
      return new Response(JSON.stringify({ error: "Backend secrets not configured" }), { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    const supabase = createClient(EXT_SUPABASE_URL, EXT_SUPABASE_SERVICE_ROLE_KEY);

    // Create timestamp in São Paulo timezone
    const saoPauloTimestamp = formatInTimeZone(new Date(), 'America/Sao_Paulo', "yyyy-MM-dd'T'HH:mm:ssXXX");

    const { data, error } = await supabase
      .from("Conversas_Historico")
      .insert({ 
        sessao_id: sessionId, 
        remetente, 
        tipo_mensagem, 
        mensagem, 
        origem,
        Cliente_ID: 3,
        Empresa_ID: 3,
        data_envio: saoPauloTimestamp 
      })
      .select()
      .maybeSingle();

    if (error || !data) {
      console.error("save-message error:", error);
      return new Response(JSON.stringify({ error: error?.message || "Insert failed" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ ok: true, message: data }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("save-message error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
