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

  let body: any = {};
  let transactionNsu: string = '';
  
  try {
    console.log('=== VERIFICAR PAGAMENTO INFINITEPAY ===');
    console.log('Request method:', req.method, 'Content-Type:', req.headers.get('content-type'));

    // Ensure POST and safely parse JSON body
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, message: 'Método não permitido' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    try {
      body = await req.json();
    } catch (e) {
      console.warn('Corpo não-JSON ou vazio; prosseguindo com body = {}', e);
      body = {};
    }

    const { transactionNsu: txnNsu, externalOrderNsu, slug, dadosCheckout } = body || {};
    transactionNsu = txnNsu;

    if (!transactionNsu || !externalOrderNsu) {
      return new Response(
        JSON.stringify({ success: false, message: 'Parâmetros obrigatórios ausentes' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
        cliente_id: 2,
        transaction_id: transactionNsu,
        order_nsu: externalOrderNsu,
        slug: slug || null,
        capture_method: dadosCheckout?.capture_method || null,
        receipt_url: dadosCheckout?.receipt_url || null,
        payload_completo: { transactionNsu, externalOrderNsu, slug, dadosCheckout },
        processado: false,
        sucesso: null
      });
    
    if (logError) {
      console.error('Erro ao registrar log:', logError);
      throw new Error(`Erro ao registrar log: ${logError.message}`);
    }
    
    // 2. Lead vem do dadosCheckout
    const leadId = dadosCheckout?.leadId || null;
    console.log('Lead ID do checkout:', leadId);
    
    // 3. Normalizar itens e calcular total (SEM DESCONTO)
    console.log('Normalizando itens do pedido...');
    const formaPagamento = (dadosCheckout?.formaPagamento || 'pix') as string;

    type ItemEntrada = { produto_id?: number; id?: number; quantidade: number; preco_unitario?: number; preco_final?: number; };
    const origemProdutos: ItemEntrada[] = Array.isArray(dadosCheckout?.produtos)
      ? dadosCheckout.produtos
      : Array.isArray(dadosCheckout?.carrinho)
        ? dadosCheckout.carrinho
        : [];

    if (!origemProdutos || origemProdutos.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'Itens do pedido ausentes' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const itensNormalizados = origemProdutos.map((it: any) => {
      const pid = it.produto_id ?? it.id;
      const q = Number(it.quantidade) || 1;
      const unit = typeof it.preco_final === 'number'
        ? it.preco_final
        : typeof it.preco_unitario === 'number'
          ? it.preco_unitario
          : 0;
      return { 
        produto_id: pid, 
        quantidade: q, 
        preco_unitario: unit,
        preco_total: unit * q 
      };
    });

    const valorTotal = itensNormalizados.reduce((acc, it) => acc + it.preco_total, 0);
    
    // 4. Criar pedido (apenas campos essenciais que existem no banco externo)
    const { data: pedido, error: pedidoError } = await supabaseExt
      .from('pedidos')
      .insert({
        cliente_id: 2,
        empresa_id: 2,
        lead_id: leadId,
        campanha_id: dadosCheckout?.campanhaId || null,
        codigo: externalOrderNsu,
        valor: valorTotal,
        status_pedido: 'aguardando_pagamento',
        forma_pagamento: formaPagamento,
      })
      .select()
      .single();
    
    if (pedidoError) {
      console.error('Erro ao criar pedido:', pedidoError);
      throw new Error(`Erro ao criar pedido: ${pedidoError.message}`);
    }
    
    console.log('Pedido criado:', pedido.id);
    
    // 5. Criar itens do pedido
    console.log('Criando itens do pedido...');
    const itens = itensNormalizados.map((item: any) => ({
      pedido_id: pedido.id,
      cliente_id: 2,
      empresa_id: 2,
      produto_id: item.produto_id,
      produto_nome: item.produto_nome || `Produto ${item.produto_id}`,
      quantidade: item.quantidade,
      preco_unitario: item.preco_unitario,
      preco_total: item.preco_total,
    }));
    
    const { error: itensError } = await supabaseExt
      .from('pedidos_itens')
      .insert(itens);
    
    if (itensError) {
      console.error('Erro ao criar itens:', itensError);
      throw new Error(`Erro ao criar itens: ${itensError.message}`);
    }
    
    // 6. Criar transação de pagamento
    console.log('Criando transação de pagamento...');
    const { error: transacaoError } = await supabaseExt
      .from('transacoes_pagamento')
      .insert({
        pedido_id: pedido.id,
        cliente_id: 2,
        empresa_id: 2,
        gateway: 'infinitepay',
        transaction_id: transactionNsu,
        order_nsu: externalOrderNsu,
        valor_total: valorTotal,
        status: 'pendente',
        metodo_pagamento: formaPagamento,
      });
    
    if (transacaoError) {
      console.error('Erro ao criar transação:', transacaoError);
      throw new Error(`Erro ao criar transação: ${transacaoError.message}`);
    }
    
    // 7. Atualizar log do webhook
    await supabaseExt
      .from('logs_webhook_infinitepay')
      .update({ 
        processado: true, 
        sucesso: true, 
        pedido_criado_id: pedido.id,
        processado_at: new Date().toISOString()
      })
      .eq('transaction_id', transactionNsu);
    
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
    const msg = (error as any)?.message || 'Erro ao processar pagamento';
    
    // Tentar registrar erro no log
    try {
      const { transactionNsu } = body || {};
      if (transactionNsu) {
        const extSupabaseUrl = Deno.env.get('EXT_SUPABASE_URL');
        const extSupabaseKey = Deno.env.get('EXT_SUPABASE_SERVICE_ROLE_KEY');
        if (extSupabaseUrl && extSupabaseKey) {
          const supabaseExt = createClient(extSupabaseUrl, extSupabaseKey);
          await supabaseExt
            .from('logs_webhook_infinitepay')
            .update({
              processado: true,
              sucesso: false,
              erro_mensagem: msg,
              processado_at: new Date().toISOString()
            })
            .eq('transaction_id', transactionNsu);
        }
      }
    } catch (logErr) {
      console.error('Erro ao registrar falha no log:', logErr);
    }
    
    return new Response(
      JSON.stringify({
        success: false,
        message: msg,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
