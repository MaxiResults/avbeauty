import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== VERIFICAR PAGAMENTO INFINITEPAY ===');
    
    const { transactionNsu, externalOrderNsu, slug, dadosCheckout } = await req.json();
    
    console.log('Dados recebidos:', { transactionNsu, externalOrderNsu, slug });
    
    // Conectar ao banco externo
    const extSupabaseUrl = Deno.env.get('EXT_SUPABASE_URL');
    const extSupabaseKey = Deno.env.get('EXT_SUPABASE_SERVICE_ROLE_KEY');
    
    if (!extSupabaseUrl || !extSupabaseKey) {
      throw new Error('Credenciais do banco externo não configuradas');
    }
    
    const supabaseExt = createClient(extSupabaseUrl, extSupabaseKey);
    
    // 1. Registrar log do webhook
    console.log('Registrando log do webhook...');
    const { error: logError } = await supabaseExt
      .from('logs_webhook_infinitepay')
      .insert({
        transaction_nsu: transactionNsu,
        external_order_nsu: externalOrderNsu,
        payload: { transactionNsu, externalOrderNsu, slug, dadosCheckout },
        status: 'processando'
      });
    
    if (logError) {
      console.error('Erro ao registrar log:', logError);
    }
    
    // 2. Buscar lead pelo slug (se existir)
    let leadId = null;
    if (slug) {
      console.log('Buscando lead pelo slug:', slug);
      const { data: lead, error: leadError } = await supabaseExt
        .from('leads_cadastro_teaser')
        .select('id')
        .eq('link_exclusivo', slug)
        .maybeSingle();
      
      if (leadError) {
        console.error('Erro ao buscar lead:', leadError);
      } else if (lead) {
        leadId = lead.id;
        console.log('Lead encontrado:', leadId);
      }
    }
    
    // 3. Criar pedido
    console.log('Criando pedido...');
    const valorTotal = dadosCheckout.carrinho.reduce(
      (total: number, item: any) => total + (item.preco_final * item.quantidade),
      0
    );
    
    const { data: pedido, error: pedidoError } = await supabaseExt
      .from('pedidos')
      .insert({
        cliente_id: 2,
        empresa_id: 2,
        lead_id: leadId,
        campanha_id: dadosCheckout.campanhaId || null,
        codigo: externalOrderNsu,
        valor: valorTotal,
        status_pedido: 'aguardando_pagamento',
        forma_pagamento: 'pix',
        cliente_nome: dadosCheckout.nome,
        cliente_email: dadosCheckout.email,
        cliente_telefone: dadosCheckout.telefone,
        cliente_cpf: dadosCheckout.cpf,
        endereco_cep: dadosCheckout.endereco?.cep,
        endereco_logradouro: dadosCheckout.endereco?.logradouro,
        endereco_numero: dadosCheckout.endereco?.numero,
        endereco_complemento: dadosCheckout.endereco?.complemento,
        endereco_bairro: dadosCheckout.endereco?.bairro,
        endereco_cidade: dadosCheckout.endereco?.cidade,
        endereco_estado: dadosCheckout.endereco?.estado,
      })
      .select()
      .single();
    
    if (pedidoError) {
      console.error('Erro ao criar pedido:', pedidoError);
      throw new Error(`Erro ao criar pedido: ${pedidoError.message}`);
    }
    
    console.log('Pedido criado:', pedido.id);
    
    // 4. Criar itens do pedido
    console.log('Criando itens do pedido...');
    const itens = dadosCheckout.carrinho.map((item: any) => ({
      pedido_id: pedido.id,
      produto_id: item.id,
      quantidade: item.quantidade,
      preco_unitario: item.preco_final,
      preco_total: item.preco_final * item.quantidade,
    }));
    
    const { error: itensError } = await supabaseExt
      .from('pedidos_itens')
      .insert(itens);
    
    if (itensError) {
      console.error('Erro ao criar itens:', itensError);
      throw new Error(`Erro ao criar itens: ${itensError.message}`);
    }
    
    // 5. Criar transação de pagamento
    console.log('Criando transação de pagamento...');
    const { error: transacaoError } = await supabaseExt
      .from('transacoes_pagamento')
      .insert({
        pedido_id: pedido.id,
        gateway: 'infinitepay',
        transaction_id: transactionNsu,
        external_order_nsu: externalOrderNsu,
        valor: valorTotal,
        status: 'pendente',
        metodo_pagamento: 'pix',
      });
    
    if (transacaoError) {
      console.error('Erro ao criar transação:', transacaoError);
      throw new Error(`Erro ao criar transação: ${transacaoError.message}`);
    }
    
    // 6. Atualizar log do webhook
    await supabaseExt
      .from('logs_webhook_infinitepay')
      .update({ status: 'sucesso', pedido_id: pedido.id })
      .eq('transaction_nsu', transactionNsu);
    
    console.log('Pedido criado com sucesso!');
    
    return new Response(
      JSON.stringify({
        success: true,
        pedidoId: pedido.id,
        pedidoCodigo: pedido.codigo,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || 'Erro ao processar pagamento',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
