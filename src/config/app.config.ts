/**
 * Configurações globais da aplicação AVBeauty
 * 
 * ATENÇÃO: Estes valores são utilizados em:
 * - Todas as queries do Supabase no frontend
 * - Todas as inserções no banco de dados
 * - Filtros de dados por cliente/empresa
 * 
 * EDGE FUNCTIONS (Supabase):
 * As Edge Functions do AVBeauty possuem estes mesmos valores HARDCODED:
 * - chat-assistant → Cliente_ID: 3, Empresa_ID: 3
 * - save-message → cliente_id: 3
 * - start-chat → Cliente_ID: 3, Empresa_ID: 3
 * 
 * IMPORTANTE:
 * - Para mudar os IDs do AVBeauty, altere AQUI e também nas Edge Functions no Supabase
 * - Não confundir com as Edge Functions do Giro Digital (sufixo -giro)
 * - AVBeauty usa as funções ORIGINAIS (sem sufixo)
 * 
 * ONDE ESTE ARQUIVO É USADO:
 * - src/utils/customAuth.ts (autenticação de usuários)
 * - src/components/teaser/FormularioCadastro.tsx (cadastro de leads)
 * - src/lib/supabase.ts (submissão de leads)
 * - Todas as páginas admin (produtos, pedidos, campanhas)
 * - Todas as páginas públicas (checkout, loja)
 */
export const APP_CONFIG = {
  CLIENTE_ID: 3,
  EMPRESA_ID: 3,
} as const;

export const APP_CLIENTE_ID = APP_CONFIG.CLIENTE_ID;
export const APP_EMPRESA_ID = APP_CONFIG.EMPRESA_ID;
