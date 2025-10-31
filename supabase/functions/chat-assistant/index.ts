import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { message, sessionId, leadName, leadEmail, leadPhone, threadId: existingThreadId } = await req.json();
    console.log("Recebida mensagem:", message, "Sessão:", sessionId, "Thread existente:", existingThreadId);

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const OPENAI_ASSISTANT_ID = Deno.env.get("OPENAI_ASSISTANT_ID");
    const SUPABASE_URL = Deno.env.get("EXT_SUPABASE_URL") ?? Deno.env.get("SUPABASE_URL");
    const SERVICE_KEY = Deno.env.get("EXT_SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY não configurado");
    }

    if (!OPENAI_ASSISTANT_ID) {
      throw new Error("OPENAI_ASSISTANT_ID não configurado. Por favor configure o ID do seu Assistant da OpenAI");
    }

    console.log("Usando Assistant ID:", OPENAI_ASSISTANT_ID);

    let threadId = existingThreadId;

    // Criar thread apenas se não existir
    if (!threadId) {
      const threadResponse = await fetch("https://api.openai.com/v1/threads", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
          "OpenAI-Beta": "assistants=v2",
        },
        body: JSON.stringify({
          metadata: {
            leadName: leadName || "",
            leadEmail: leadEmail || "",
            leadPhone: leadPhone || ""
          }
        })
      });

      if (!threadResponse.ok) {
        const errorText = await threadResponse.text();
        console.error("Erro ao criar thread:", threadResponse.status, errorText);
        throw new Error(`Falha ao criar thread: ${threadResponse.status}`);
      }

      const thread = await threadResponse.json();
      threadId = thread.id;
      console.log("Thread criada:", threadId);

      // Salvar thread_id na sessão
      if (SUPABASE_URL && SERVICE_KEY) {
        const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
        const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
        await supabase
          .from("Conversas_Sessoes")
          .update({ thread_id: threadId })
          .eq("id", sessionId);
        console.log("Thread ID salvo na sessão");
      }

      // Adicionar contexto do lead ao thread (para que o assistant saiba nome/email/telefone)
      try {
        const contextParts: string[] = [];
        if (leadName) contextParts.push(`Nome: ${leadName}`);
        if (leadEmail) contextParts.push(`Email: ${leadEmail}`);
        if (leadPhone) contextParts.push(`Telefone: ${leadPhone}`);
        if (contextParts.length > 0) {
          const contextMessage = `Contexto do lead: ${contextParts.join(" | ")}. Use esses dados durante a conversa (não peça novamente, a menos que necessário).`;
          const ctxResp = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${OPENAI_API_KEY}`,
              "Content-Type": "application/json",
              "OpenAI-Beta": "assistants=v2",
            },
            body: JSON.stringify({
              role: "user",
              content: contextMessage,
            }),
          });
          if (!ctxResp.ok) {
            const t = await ctxResp.text();
            console.error("Falha ao adicionar mensagem de contexto:", ctxResp.status, t);
          } else {
            console.log("Mensagem de contexto adicionada ao thread");
          }
        }
      } catch (e) {
        console.error("Erro ao adicionar contexto do lead:", e);
      }
    } else {
      console.log("Reutilizando thread existente:", threadId);
    }

    // Adicionar mensagem do usuário ao thread
    const messageResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2",
      },
      body: JSON.stringify({
        role: "user",
        content: message,
      }),
    });

    if (!messageResponse.ok) {
      const errorText = await messageResponse.text();
      console.error("Erro ao adicionar mensagem:", messageResponse.status, errorText);
      throw new Error(`Falha ao adicionar mensagem: ${messageResponse.status}`);
    }

    console.log("Mensagem adicionada ao thread");

    // Executar o assistant
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2",
      },
      body: JSON.stringify({
        assistant_id: OPENAI_ASSISTANT_ID,
      }),
    });

    if (!runResponse.ok) {
      const errorText = await runResponse.text();
      console.error("Erro ao iniciar run:", runResponse.status, errorText);
      throw new Error(`Falha ao iniciar run: ${runResponse.status}`);
    }

    const run = await runResponse.json();
    const runId = run.id;
    console.log("Run iniciada:", runId);

    // Aguardar conclusão do run (com timeout)
    let runStatus = "in_progress";
    let attempts = 0;
    const maxAttempts = 30;

    while (runStatus === "in_progress" || runStatus === "queued") {
      if (attempts >= maxAttempts) {
        throw new Error("Timeout ao aguardar resposta do assistant");
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;

      const statusResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "OpenAI-Beta": "assistants=v2",
        },
      });

      if (!statusResponse.ok) {
        throw new Error("Falha ao verificar status do run");
      }

      const statusData = await statusResponse.json();
      runStatus = statusData.status;
      console.log("Status da run:", runStatus, "Tentativa:", attempts);

      if (runStatus === "failed" || runStatus === "cancelled" || runStatus === "expired") {
        throw new Error(`Run falhou com status: ${runStatus}`);
      }
    }

    // Obter mensagens do thread
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "OpenAI-Beta": "assistants=v2",
      },
    });

    if (!messagesResponse.ok) {
      throw new Error("Falha ao obter mensagens");
    }

    const messagesData = await messagesResponse.json();
    const assistantMessages = messagesData.data.filter((msg: any) => msg.role === "assistant");
    
    if (assistantMessages.length === 0) {
      throw new Error("Nenhuma resposta do assistant");
    }

    const reply = assistantMessages[0].content[0].text.value;
    console.log("Resposta do assistant:", reply);

    return new Response(
      JSON.stringify({ reply, threadId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Erro no chat-assistant:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Erro ao processar mensagem",
        details: error.toString() 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
