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
    const { limit, type } = body; // type: 'recent' | 'stats' | 'chart'

    if (type === 'stats') {
      // Buscar estatísticas gerais
      const { data, error } = await supabase
        .from("pedidos")
        .select("valor_total, status_pedido")
        .eq("cliente_id", 3)
        .eq("empresa_id", 3);

      if (error) {
        console.error("get-pedidos-admin stats error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
      }

      const totalVendas = data?.length || 0;
      const faturamento = data?.reduce((sum, p) => sum + (Number(p.valor_total) || 0), 0) || 0;

      return new Response(
        JSON.stringify({ stats: { totalVendas, faturamento } }),
        { status: 200, headers: corsHeaders }
      );
    }

    if (type === 'chart') {
      // Buscar dados dos últimos 7 dias
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from("pedidos")
        .select("created_at, valor_total")
        .eq("cliente_id", 3)
        .eq("empresa_id", 3)
        .gte("created_at", sevenDaysAgo.toISOString())
        .order("created_at", { ascending: true });

      if (error) {
        console.error("get-pedidos-admin chart error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
      }

      // Agrupar por dia
      const chartData: { [key: string]: { date: string; vendas: number } } = {};
      
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const dateStr = date.toISOString().split('T')[0];
        chartData[dateStr] = { date: dateStr, vendas: 0 };
      }

      data?.forEach(pedido => {
        const dateStr = pedido.created_at.split('T')[0];
        if (chartData[dateStr]) {
          chartData[dateStr].vendas++;
        }
      });

      return new Response(
        JSON.stringify({ chartData: Object.values(chartData) }),
        { status: 200, headers: corsHeaders }
      );
    }

    // Buscar pedidos recentes
    const { data, error } = await supabase
      .from("pedidos")
      .select("codigo, lead_nome, valor_total, status_pedido, created_at")
      .eq("cliente_id", 3)
      .eq("empresa_id", 3)
      .order("created_at", { ascending: false })
      .limit(limit || 10);

    if (error) {
      console.error("get-pedidos-admin error:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ pedidos: data ?? [] }), { status: 200, headers: corsHeaders });
  } catch (e) {
    console.error("get-pedidos-admin exception:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : String(e) }),
      { status: 500, headers: corsHeaders }
    );
  }
});
