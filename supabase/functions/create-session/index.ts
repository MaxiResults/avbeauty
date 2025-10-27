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
    const { leadId, canal = "site", origem = "chat" } = await req.json();
    if (!leadId) return new Response(JSON.stringify({ error: "leadId is required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const SUPABASE_URL = Deno.env.get("EXT_SUPABASE_URL") ?? Deno.env.get("SUPABASE_URL");
    const SERVICE_KEY = Deno.env.get("EXT_SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SERVICE_KEY) throw new Error("Backend not configured");

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    const { data, error } = await supabase
      .from("Conversas_sessao")
      .insert({ lead_id: leadId, canal, origem })
      .select()
      .maybeSingle();

    if (error || !data) {
      console.error("create-session error:", error);
      return new Response(JSON.stringify({ error: error?.message || "Insert failed" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const sessionId = (data as any).id ?? (data as any).ID;
    return new Response(JSON.stringify({ sessionId, session: data }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("create-session error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});