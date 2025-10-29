import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔧 Iniciando correção de triggers no banco externo...');

    const databaseUrl = Deno.env.get('EXT_SUPABASE_DB_URL');
    if (!databaseUrl) {
      throw new Error('EXT_SUPABASE_DB_URL não configurada');
    }

    console.log('📝 URL recebida (primeiros 30 chars):', databaseUrl.substring(0, 30));

    // Parse da URL de conexão
    // Formato: postgresql://postgres:senha@host:porta/database
    const urlPattern = /^postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/;
    const match = databaseUrl.match(urlPattern);
    
    if (!match) {
      console.error('❌ URL não corresponde ao padrão esperado');
      console.error('Padrão: postgresql://user:pass@host:port/db');
      throw new Error(`Formato de URL inválido. URL fornecida: ${databaseUrl.substring(0, 50)}...`);
    }

    const [, user, password, hostname, port, database] = match;
    
    console.log('📋 Parâmetros de conexão:');
    console.log('- User:', user);
    console.log('- Hostname:', hostname);
    console.log('- Port:', port);
    console.log('- Database:', database);

    // Conectar ao banco de dados externo
    const client = new Client({
      user,
      password,
      hostname,
      port: parseInt(port),
      database,
    });
    
    console.log('🔌 Tentando conectar...');
    await client.connect();
    console.log('✅ Conectado ao banco externo');

    // SQL para corrigir os triggers
    const fixSQL = `
      -- ========== PRODUTOS ==========
      -- Dropar todos os triggers possíveis (antigos e novos)
      DROP TRIGGER IF EXISTS update_produtos_updated_at ON public.produtos;
      DROP TRIGGER IF EXISTS update_produtos_updated_at_trigger ON public.produtos;
      DROP TRIGGER IF EXISTS trigger_update_produtos_updated_at ON public.produtos;

      -- Recriar função com nome correto minúsculo
      CREATE OR REPLACE FUNCTION public.update_produtos_updated_at()
      RETURNS trigger AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

      -- Criar trigger único e correto
      CREATE TRIGGER update_produtos_updated_at_trigger
        BEFORE UPDATE ON public.produtos
        FOR EACH ROW
        EXECUTE FUNCTION public.update_produtos_updated_at();

      -- ========== CAMPANHAS ==========
      -- Dropar todos os triggers possíveis
      DROP TRIGGER IF EXISTS update_campanhas_updated_at ON public.campanhas;
      DROP TRIGGER IF EXISTS update_campanhas_updated_at_trigger ON public.campanhas;
      DROP TRIGGER IF EXISTS trigger_update_campanhas_updated_at ON public.campanhas;

      -- Recriar função com nome correto minúsculo
      CREATE OR REPLACE FUNCTION public.update_campanhas_updated_at()
      RETURNS trigger AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

      -- Criar trigger único e correto
      CREATE TRIGGER update_campanhas_updated_at_trigger
        BEFORE UPDATE ON public.campanhas
        FOR EACH ROW
        EXECUTE FUNCTION public.update_campanhas_updated_at();
    `;

    console.log('📝 Executando SQL de correção...');
    await client.queryArray(fixSQL);
    console.log('✅ Triggers corrigidos com sucesso!');

    // Verificar triggers criados
    const checkTriggersSQL = `
      SELECT 
        trigger_name,
        event_object_table,
        action_statement
      FROM information_schema.triggers
      WHERE trigger_schema = 'public'
        AND event_object_table IN ('produtos', 'campanhas')
      ORDER BY event_object_table, trigger_name;
    `;
    
    const result = await client.queryObject(checkTriggersSQL);
    console.log('🔍 Triggers atuais:', result.rows);

    await client.end();
    console.log('🎉 Correção finalizada com sucesso!');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Triggers corrigidos com sucesso no banco externo',
        triggers: result.rows
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('❌ Erro ao corrigir triggers:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
