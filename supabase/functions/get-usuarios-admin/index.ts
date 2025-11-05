import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("EXT_SUPABASE_URL");
    const serviceKey = Deno.env.get("EXT_SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceKey) {
      return new Response(
        JSON.stringify({ error: "Backend misconfigured: missing EXT_SUPABASE_URL or EXT_SUPABASE_SERVICE_ROLE_KEY" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    const { data, error } = await supabase
      .from("usuarios")
      .select("id, nome, email, role, ativo, created_at")
      .eq("cliente_id", 3)
      .eq("empresa_id", 3)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("get-usuarios-admin error:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ usuarios: data ?? [] }), { status: 200, headers: corsHeaders });
  } catch (e) {
    console.error("get-usuarios-admin exception:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : String(e) }),
      { status: 500, headers: corsHeaders }
    );
  }
});
