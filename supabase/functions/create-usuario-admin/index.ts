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
        JSON.stringify({ error: "Backend misconfigured" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey);
    const body = await req.json();

    const { nome, email, senha_hash, role } = body;

    if (!nome || !email || !senha_hash || !role) {
      return new Response(
        JSON.stringify({ error: "Campos obrigatórios ausentes" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const { data, error } = await supabase
      .from("usuarios")
      .insert({
        cliente_id: 3,
        empresa_id: 3,
        nome,
        email,
        senha_hash,
        role,
        ativo: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("create-usuario-admin error:", error);
      return new Response(
        JSON.stringify({ error: error.message, code: error.code }),
        { status: 500, headers: corsHeaders }
      );
    }

    return new Response(JSON.stringify({ usuario: data }), { status: 200, headers: corsHeaders });
  } catch (e) {
    console.error("create-usuario-admin exception:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : String(e) }),
      { status: 500, headers: corsHeaders }
    );
  }
});
