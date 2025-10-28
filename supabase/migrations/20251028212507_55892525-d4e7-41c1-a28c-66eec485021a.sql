-- Políticas RLS para o bucket 'produtos' no storage
-- Permitir leitura pública das imagens
CREATE POLICY "Imagens de produtos são publicamente acessíveis"
ON storage.objects FOR SELECT
USING (bucket_id = 'produtos');

-- Permitir upload para usuários autenticados
CREATE POLICY "Usuários autenticados podem fazer upload de produtos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'produtos' 
  AND auth.role() = 'authenticated'
);

-- Permitir atualização para usuários autenticados
CREATE POLICY "Usuários autenticados podem atualizar imagens de produtos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'produtos' 
  AND auth.role() = 'authenticated'
);

-- Permitir deleção para usuários autenticados
CREATE POLICY "Usuários autenticados podem deletar imagens de produtos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'produtos' 
  AND auth.role() = 'authenticated'
);