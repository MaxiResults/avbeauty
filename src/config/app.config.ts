/**
 * Configurações globais da aplicação AVBeauty
 * 
 * ATENÇÃO: Estes valores são utilizados em todas as queries do Supabase
 * para filtrar dados específicos do cliente/empresa
 */
export const APP_CONFIG = {
  /**
   * ID do cliente no banco de dados
   * Utilizado para segregar dados entre diferentes clientes
   */
  CLIENTE_ID: 3,

  /**
   * ID da empresa no banco de dados  
   * Utilizado para segregar dados entre diferentes empresas de um mesmo cliente
   */
  EMPRESA_ID: 3,
} as const;

// Exports individuais para conveniência
export const APP_CLIENTE_ID = APP_CONFIG.CLIENTE_ID;
export const APP_EMPRESA_ID = APP_CONFIG.EMPRESA_ID;
