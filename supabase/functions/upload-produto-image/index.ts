// Edge function: upload-produto-image
// Faz upload de imagens no bucket 'produtos' usando credenciais de serviço

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = 'https://sunccjukvrximjiqzdkm.supabase.co';
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!serviceKey) {
      return new Response(
        JSON.stringify({ error: "Backend misconfigured: missing SUPABASE_SERVICE_ROLE_KEY" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return new Response(JSON.stringify({ error: "Use multipart/form-data with a 'file' field" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const pathPrefix = String(formData.get("pathPrefix") || "2/2"); // padrão atual

    if (!file) {
      return new Response(JSON.stringify({ error: "Campo 'file' é obrigatório" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Sanitiza o nome e cria nome único com timestamp
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${Date.now()}_${sanitizedName}`;
    const filePath = `${pathPrefix}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("produtos")
      // @ts-ignore - Deno File é compatível
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || "application/octet-stream",
      });

    if (uploadError) {
      return new Response(JSON.stringify({ error: uploadError.message }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const { data: urlData } = supabase.storage.from("produtos").getPublicUrl(filePath);

    return new Response(
      JSON.stringify({ publicUrl: urlData.publicUrl, path: filePath }),
      { status: 200, headers: corsHeaders }
    );
  } catch (e) {
    console.error("upload-produto-image error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : String(e) }),
      { status: 500, headers: corsHeaders }
    );
  }
});