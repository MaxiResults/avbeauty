import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, sessionId, leadName } = await req.json();
    console.log('Recebida mensagem:', message, 'Sessão:', sessionId);

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY não configurada');
    }

    // Criar ou recuperar o assistant
    let assistantId = Deno.env.get('OPENAI_ASSISTANT_ID');
    
    if (!assistantId) {
      console.log('Criando novo assistant...');
      const createAssistantResponse = await fetch('https://api.openai.com/v1/assistants', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
          name: "Assistente Dra. Nicole",
          instructions: `Você é a assistente virtual da Dra. Nicole, especialista em harmonização facial. 
          
Seu papel é:
- Ser cordial, profissional e empática
- Responder perguntas sobre procedimentos estéticos (preenchimento, botox, skinbooster, fios de PDO, etc)
- Explicar benefícios e cuidados dos tratamentos
- Incentivar o agendamento de consultas presenciais para avaliação personalizada
- Coletar informações sobre o interesse do cliente
- Nunca dar diagnósticos médicos ou prescrever tratamentos sem avaliação presencial

Informações importantes:
- Localização: São Paulo
- Procedimentos principais: Harmonização facial, preenchimento labial, aplicação de botox, skinbooster, bioestimuladores
- Consulta de avaliação é essencial para plano personalizado
- WhatsApp para agendamento: (11) 95190-3402

Sempre mantenha o tom amigável e profissional, e lembre que cada caso é único e requer avaliação presencial.`,
          model: "gpt-4o-mini",
          tools: []
        })
      });

      const assistant = await createAssistantResponse.json();
      assistantId = assistant.id;
      console.log('Assistant criado:', assistantId);
    }

    // Criar uma thread para esta conversa
    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      }
    });

    const thread = await threadResponse.json();
    console.log('Thread criada:', thread.id);

    // Adicionar a mensagem do usuário à thread
    await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        role: "user",
        content: message
      })
    });

    // Executar o assistant
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        assistant_id: assistantId
      })
    });

    const run = await runResponse.json();
    console.log('Run iniciada:', run.id);

    // Aguardar conclusão da run
    let runStatus = run.status;
    let attempts = 0;
    const maxAttempts = 30;

    while (runStatus !== 'completed' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statusResponse = await fetch(
        `https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`,
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'OpenAI-Beta': 'assistants=v2'
          }
        }
      );

      const statusData = await statusResponse.json();
      runStatus = statusData.status;
      attempts++;
      
      console.log('Status da run:', runStatus, 'Tentativa:', attempts);

      if (runStatus === 'failed' || runStatus === 'cancelled' || runStatus === 'expired') {
        throw new Error(`Run falhou com status: ${runStatus}`);
      }
    }

    if (runStatus !== 'completed') {
      throw new Error('Timeout aguardando resposta do assistant');
    }

    // Recuperar as mensagens
    const messagesResponse = await fetch(
      `https://api.openai.com/v1/threads/${thread.id}/messages`,
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      }
    );

    const messagesData = await messagesResponse.json();
    const assistantMessage = messagesData.data.find((msg: any) => msg.role === 'assistant');
    
    if (!assistantMessage) {
      throw new Error('Nenhuma resposta do assistant encontrada');
    }

    const reply = assistantMessage.content[0].text.value;
    console.log('Resposta do assistant:', reply);

    return new Response(
      JSON.stringify({ reply }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Erro no chat-assistant:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        reply: 'Desculpe, ocorreu um erro. Por favor, tente novamente ou entre em contato pelo WhatsApp.' 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
