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
    // Usar variáveis do ambiente integrado
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceKey) {
      console.error("❌ Variáveis não configuradas:", { supabaseUrl: !!supabaseUrl, serviceKey: !!serviceKey });
      return new Response(
        JSON.stringify({ error: "Backend misconfigured: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    const contentType = req.headers.get("content-type") || "";
    
    // Aceita tanto multipart/form-data direto quanto application/json do supabase.functions.invoke
    let file: File | null = null;
    let pathPrefix = "2/2";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      file = formData.get("file") as File | null;
      pathPrefix = String(formData.get("pathPrefix") || "2/2");
    } else if (contentType.includes("application/json")) {
      // Quando chamado via supabase.functions.invoke, o body pode vir como JSON
      const body = await req.json();
      if (body.file) {
        // Reconstrói o arquivo a partir do JSON
        const base64Data = body.file.data || body.file;
        const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        file = new File([binaryData], body.file.name || 'upload.jpg', { type: body.file.type || 'image/jpeg' });
      }
      pathPrefix = body.pathPrefix || "2/2";
    } else {
      // Tenta ler como FormData de qualquer forma
      try {
        const formData = await req.formData();
        file = formData.get("file") as File | null;
        pathPrefix = String(formData.get("pathPrefix") || "2/2");
      } catch (e) {
        console.error("❌ Erro ao processar corpo da requisição:", e);
        return new Response(JSON.stringify({ error: "Formato de requisição inválido" }), {
          status: 400,
          headers: corsHeaders,
        });
      }
    }

    if (!file) {
      return new Response(JSON.stringify({ error: "Campo 'file' é obrigatório" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    console.log("📁 Arquivo recebido:", { name: file.name, type: file.type, size: file.size });

    // Sanitiza o nome e cria nome único com timestamp
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${Date.now()}_${sanitizedName}`;
    const filePath = `${pathPrefix}/${fileName}`;

    console.log("📤 Fazendo upload para:", filePath);

    const { error: uploadError } = await supabase.storage
      .from("produtos")
      // @ts-ignore - Deno File é compatível
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || "application/octet-stream",
      });

    if (uploadError) {
      console.error("❌ Erro no upload:", uploadError);
      return new Response(JSON.stringify({ error: uploadError.message }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const { data: urlData } = supabase.storage.from("produtos").getPublicUrl(filePath);
    
    console.log("✅ Upload concluído:", urlData.publicUrl);

    return new Response(
      JSON.stringify({ publicUrl: urlData.publicUrl, path: filePath }),
      { status: 200, headers: corsHeaders }
    );
  } catch (e) {
    console.error("❌ upload-produto-image error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : String(e) }),
      { status: 500, headers: corsHeaders }
    );
  }
});