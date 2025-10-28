// Tipo do banco de dados (snake_case conforme Supabase)
export interface CampanhaDB {
  id: number;
  cliente_id: number;
  empresa_id: number;
  nome_campanha: string;
  slug: string;
  campanha_status: 'Ativo' | 'Suspensa' | 'Cancelada' | 'Concluída' | 'Agendada';
  campanha_tipo: string | null;
  descricao: string | null;
  data_inicio: string;
  data_fim: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  canal_principal: string | null;
  plataforma_ads: string | null;
  investimento_total: number;
  url_principal: string;
  publico_alvo: string | null;
  criado_por: string | null;
  created_at: string;
  updated_at: string;
  ativo: boolean;
}

// Tipo para uso na aplicação (PascalCase)
export interface Campanha {
  ID: number;
  Cliente_ID: number;
  Empresa_ID: number;
  Nome_campanha: string;
  Slug: string;
  Campanha_Status: 'Ativo' | 'Suspensa' | 'Cancelada' | 'Concluída' | 'Agendada';
  Campanha_Tipo?: string;
  Descricao?: string;
  Data_Inicio: string;
  Data_Fim: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  canal_principal?: string;
  plataforma_ads?: string;
  Investimento_total: number;
  url_principal: string;
  publico_alvo?: string;
  Criado_Por?: string;
  Created_at: string;
  Updated_at: string;
  Ativo: boolean;
}

// Converter de DB para App
export const dbToCampanha = (db: CampanhaDB): Campanha => ({
  ID: db.id,
  Cliente_ID: db.cliente_id,
  Empresa_ID: db.empresa_id,
  Nome_campanha: db.nome_campanha,
  Slug: db.slug,
  Campanha_Status: db.campanha_status,
  Campanha_Tipo: db.campanha_tipo || undefined,
  Descricao: db.descricao || undefined,
  Data_Inicio: db.data_inicio,
  Data_Fim: db.data_fim,
  utm_source: db.utm_source || undefined,
  utm_medium: db.utm_medium || undefined,
  utm_campaign: db.utm_campaign || undefined,
  utm_content: db.utm_content || undefined,
  canal_principal: db.canal_principal || undefined,
  plataforma_ads: db.plataforma_ads || undefined,
  Investimento_total: db.investimento_total,
  url_principal: db.url_principal,
  publico_alvo: db.publico_alvo || undefined,
  Criado_Por: db.criado_por || undefined,
  Created_at: db.created_at,
  Updated_at: db.updated_at,
  Ativo: db.ativo,
});

export interface CampanhaFormData {
  Nome_campanha: string;
  Slug: string;
  Campanha_Status: 'Ativo' | 'Suspensa' | 'Cancelada' | 'Concluída' | 'Agendada';
  Campanha_Tipo?: string;
  Descricao?: string;
  Data_Inicio: Date;
  Data_Fim: Date;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  canal_principal?: string;
  plataforma_ads?: string[];
  Investimento_total: number;
  url_principal: string;
  publico_alvo?: string;
}
