/**
 * Configurações globais da aplicação AVBeauty
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 🎯 PONTO CENTRAL DE CONFIGURAÇÃO
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * ATENÇÃO: Estes valores controlam TODO o sistema AVBeauty!
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 📍 ONDE ESTES VALORES SÃO USADOS:
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * 1. FRONTEND (Queries e Filtros):
 *    • src/utils/customAuth.ts - Autenticação de usuários admin
 *    • src/components/teaser/FormularioCadastro.tsx - Cadastro de leads
 *    • src/lib/supabase.ts - Submissão de leads do site
 *    • Todas as páginas admin (produtos, pedidos, campanhas)
 *    • Todas as páginas públicas (checkout, loja)
 * 
 * 2. EDGE FUNCTIONS (Passados via Body):
 *    • create-lead - Recebe e usa para criar leads
 *    • chat-assistant - Recebe e usa para salvar conversas
 *    • save-message - Recebe e usa para salvar mensagens
 *    • start-chat - Recebe e usa para criar sessões
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 🔄 COMO FUNCIONA O FLUXO:
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * 1. Você configura os IDs AQUI (neste arquivo)
 * 2. Frontend importa e usa em queries: .eq('cliente_id', APP_CLIENTE_ID)
 * 3. Frontend passa para Edge Functions: { cliente_id: APP_CLIENTE_ID }
 * 4. Edge Functions recebem e usam para salvar no banco
 * 5. Dados ficam segregados por cliente_id e empresa_id
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 🎨 ARQUITETURA MULTI-TENANT:
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * Este sistema permite múltiplos projetos compartilharem:
 * • Mesmo banco de dados Supabase
 * • Mesmas Edge Functions
 * • Mesma infraestrutura
 * 
 * Cada projeto tem seu próprio app.config.ts com IDs únicos:
 * • AVBeauty: cliente_id: 3, empresa_id: 3
 * • Giro Digital: cliente_id: X, empresa_id: X
 * • Futuro Projeto: cliente_id: Y, empresa_id: Y
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ⚡ PARA CRIAR UM NOVO PROJETO:
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * 1. Clone este projeto
 * 2. Mude APENAS os valores abaixo para novos IDs
 * 3. Edge Functions funcionam automaticamente!
 * 4. Zero configuração adicional necessária
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 🚨 IMPORTANTE:
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * • NÃO altere estes valores em produção sem testar antes
 * • Mudar IDs pode afetar dados existentes no banco
 * • Sempre faça backup antes de alterar
 * • IDs devem existir nas tabelas 'clientes' e 'empresas'
 * 
 */

export const APP_CONFIG = {
  /**
   * ID do cliente no banco de dados
   * Utilizado para segregar dados entre diferentes clientes
   * AVBeauty = 3
   */
  CLIENTE_ID: 3,

  /**
   * ID da empresa no banco de dados  
   * Utilizado para segregar dados entre diferentes empresas de um mesmo cliente
   * AVBeauty = 3
   */
  EMPRESA_ID: 3,
} as const;

// Exports individuais para conveniência
export const APP_CLIENTE_ID = APP_CONFIG.CLIENTE_ID;
export const APP_EMPRESA_ID = APP_CONFIG.EMPRESA_ID;
