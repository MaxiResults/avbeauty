export interface ProdutoDB {
  id: number;
  cliente_id: number;
  empresa_id: number;
  nome: string;
  slug: string;
  descricao_curta: string | null;
  descricao_completa: string | null;
  categoria: string | null;
  preco_padrao: number;
  preco_promocional: number | null;
  imagem_principal: string | null;
  status: string;
  controla_estoque: boolean | null;
  vagas_disponiveis: number | null;
  vagas_vendidas: number | null;
  ordem_exibicao: number | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Produto {
  id: number;
  cliente_id: number;
  empresa_id: number;
  nome: string;
  slug: string;
  descricao_curta?: string;
  descricao_completa?: string;
  categoria?: string;
  preco_padrao: number;
  preco_promocional?: number;
  imagem_principal?: string;
  status: string;
  controla_estoque?: boolean;
  vagas_disponiveis?: number;
  vagas_vendidas?: number;
  ordem_exibicao?: number;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

export interface ProdutoFormData {
  Nome: string;
  Slug: string;
  Descricao_Curta: string;
  Descricao_Completa: string;
  Categoria: string;
  Grupo: string;
  Codigo_Externo: string;
  Preco_Padrao: number;
  Preco_Promocional: number;
  Preco_Custo: number;
  Tipo_Estoque: 'Limitado' | 'Ilimitado';
  Controla_Estoque: 'S' | 'N';
  Vagas_Disponiveis: number;
  Status: 'Disponível' | 'Indisponível';
  Principal_Destaque: boolean;
  Ordem_exibicao: number;
  Meta_Title: string;
  Meta_Description: string;
  Observacoes: string;
  Imagem_Principal: File | string | null;
}

export const dbToProduto = (db: ProdutoDB): Produto => ({
  id: db.id,
  cliente_id: db.cliente_id,
  empresa_id: db.empresa_id,
  nome: db.nome,
  slug: db.slug,
  descricao_curta: db.descricao_curta || undefined,
  descricao_completa: db.descricao_completa || undefined,
  categoria: db.categoria || undefined,
  preco_padrao: db.preco_padrao,
  preco_promocional: db.preco_promocional || undefined,
  imagem_principal: db.imagem_principal || undefined,
  status: db.status,
  controla_estoque: db.controla_estoque || undefined,
  vagas_disponiveis: db.vagas_disponiveis || undefined,
  vagas_vendidas: db.vagas_vendidas || undefined,
  ordem_exibicao: db.ordem_exibicao || undefined,
  meta_title: db.meta_title || undefined,
  meta_description: db.meta_description || undefined,
  created_at: db.created_at,
  updated_at: db.updated_at,
});
