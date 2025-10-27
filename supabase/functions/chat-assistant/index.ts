import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { message, sessionId, leadName } = await req.json();
    console.log("Recebida mensagem:", message, "Sessão:", sessionId);

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const OPENAI_ASSISTANT_ID = Deno.env.get("OPENAI_ASSISTANT_ID");

    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY não configurado");
    }

    if (!OPENAI_ASSISTANT_ID) {
      throw new Error("OPENAI_ASSISTANT_ID não configurado. Por favor configure o ID do seu Assistant da OpenAI");
    }

    console.log("Usando Assistant ID:", OPENAI_ASSISTANT_ID);

    // Criar thread para a conversa
    const threadResponse = await fetch("https://api.openai.com/v1/threads", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2",
      },
    });

    if (!threadResponse.ok) {
      const errorText = await threadResponse.text();
      console.error("Erro ao criar thread:", threadResponse.status, errorText);
      throw new Error(`Falha ao criar thread: ${threadResponse.status}`);
    }

    const thread = await threadResponse.json();
    const threadId = thread.id;
    console.log("Thread criada:", threadId);

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
      JSON.stringify({ reply }),
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
