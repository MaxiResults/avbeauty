export interface ProdutoDB {
  ID: number;
  Cliente_ID: number;
  Empresa_ID: number;
  Nome: string;
  Slug: string;
  Descricao_Curta: string;
  Descricao_Completa: string | null;
  Categoria: string | null;
  Grupo: string | null;
  Preco_Padrao: number;
  Preco_Promocional: number | null;
  Preco_Custo: number | null;
  Tipo_Estoque: 'Limitado' | 'Ilimitado';
  Codigo_Externo: string | null;
  Controla_Estoque: 'S' | 'N';
  Ordem_exibicao: number;
  Principal_Destaque: boolean;
  Imagem_Principal: string | null;
  Imagem_Galeria: string[] | null;
  Status: 'Disponível' | 'Indisponível';
  Ativo: boolean;
  Meta_Title: string | null;
  Meta_Description: string | null;
  Observacoes: string | null;
  Criado_Por: string | null;
  Created_at: string;
  Updated_at: string;
}

export interface Produto {
  ID: number;
  Cliente_ID: number;
  Empresa_ID: number;
  Nome: string;
  Slug: string;
  Descricao_Curta: string;
  Descricao_Completa?: string;
  Categoria?: string;
  Grupo?: string;
  Preco_Padrao: number;
  Preco_Promocional?: number;
  Preco_Custo?: number;
  Tipo_Estoque: 'Limitado' | 'Ilimitado';
  Codigo_Externo?: string;
  Controla_Estoque: 'S' | 'N';
  Ordem_exibicao: number;
  Principal_Destaque: boolean;
  Imagem_Principal?: string;
  Imagem_Galeria?: string[];
  Status: 'Disponível' | 'Indisponível';
  Ativo: boolean;
  Meta_Title?: string;
  Meta_Description?: string;
  Observacoes?: string;
  Criado_Por?: string;
  Created_at: string;
  Updated_at: string;
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
  Imagem_Galeria: (File | string)[];
}

export const dbToProduto = (db: ProdutoDB): Produto => ({
  ID: db.ID,
  Cliente_ID: db.Cliente_ID,
  Empresa_ID: db.Empresa_ID,
  Nome: db.Nome,
  Slug: db.Slug,
  Descricao_Curta: db.Descricao_Curta,
  Descricao_Completa: db.Descricao_Completa || undefined,
  Categoria: db.Categoria || undefined,
  Grupo: db.Grupo || undefined,
  Preco_Padrao: db.Preco_Padrao,
  Preco_Promocional: db.Preco_Promocional || undefined,
  Preco_Custo: db.Preco_Custo || undefined,
  Tipo_Estoque: db.Tipo_Estoque,
  Codigo_Externo: db.Codigo_Externo || undefined,
  Controla_Estoque: db.Controla_Estoque,
  Ordem_exibicao: db.Ordem_exibicao,
  Principal_Destaque: db.Principal_Destaque,
  Imagem_Principal: db.Imagem_Principal || undefined,
  Imagem_Galeria: db.Imagem_Galeria || undefined,
  Status: db.Status,
  Ativo: db.Ativo,
  Meta_Title: db.Meta_Title || undefined,
  Meta_Description: db.Meta_Description || undefined,
  Observacoes: db.Observacoes || undefined,
  Criado_Por: db.Criado_Por || undefined,
  Created_at: db.Created_at,
  Updated_at: db.Updated_at,
});
