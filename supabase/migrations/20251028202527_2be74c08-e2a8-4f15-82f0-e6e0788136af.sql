-- Criar tabela de produtos
CREATE TABLE IF NOT EXISTS public.produtos (
  ID SERIAL PRIMARY KEY,
  Cliente_ID SMALLINT NOT NULL DEFAULT 2,
  Empresa_ID SMALLINT NOT NULL DEFAULT 2,
  Nome TEXT NOT NULL,
  Slug TEXT NOT NULL UNIQUE,
  Descricao_Curta TEXT,
  Descricao_Completa TEXT,
  Categoria TEXT,
  Preco_Padrao NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  Preco_Promocional NUMERIC(10,2),
  Desconto_Percentual NUMERIC(5,2),
  Imagem_Principal TEXT,
  Galeria_Imagens TEXT[],
  Status TEXT NOT NULL DEFAULT 'ativo',
  Controlar_Estoque BOOLEAN DEFAULT false,
  Vagas_Disponiveis INTEGER,
  Vagas_Vendidas INTEGER DEFAULT 0,
  Ordem_Exibicao INTEGER DEFAULT 0,
  Meta_Title TEXT,
  Meta_Description TEXT,
  Created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  Updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;

-- Criar policies para produtos
CREATE POLICY "Produtos visíveis publicamente" 
ON public.produtos 
FOR SELECT 
USING (Status = 'ativo' AND Cliente_ID = 2 AND Empresa_ID = 2);

CREATE POLICY "Usuários autenticados podem criar produtos" 
ON public.produtos 
FOR INSERT 
WITH CHECK (Cliente_ID = 2 AND Empresa_ID = 2);

CREATE POLICY "Usuários autenticados podem atualizar produtos" 
ON public.produtos 
FOR UPDATE 
USING (Cliente_ID = 2 AND Empresa_ID = 2);

CREATE POLICY "Usuários autenticados podem deletar produtos" 
ON public.produtos 
FOR DELETE 
USING (Cliente_ID = 2 AND Empresa_ID = 2);

-- Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_produtos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.Updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Criar trigger para produtos
CREATE TRIGGER update_produtos_updated_at
BEFORE UPDATE ON public.produtos
FOR EACH ROW
EXECUTE FUNCTION public.update_produtos_updated_at();

-- Criar trigger para campanhas (estava faltando)
CREATE TRIGGER update_campanhas_updated_at_trigger
BEFORE UPDATE ON public.campanhas
FOR EACH ROW
EXECUTE FUNCTION public.update_campanhas_updated_at();

-- Criar policies para o bucket de storage produtos
CREATE POLICY "Imagens de produtos são públicas" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'produtos');

CREATE POLICY "Usuários autenticados podem fazer upload de produtos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'produtos');

CREATE POLICY "Usuários autenticados podem atualizar imagens de produtos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'produtos');

CREATE POLICY "Usuários autenticados podem deletar imagens de produtos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'produtos');