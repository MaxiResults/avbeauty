-- Remover todas as policies antigas do storage produtos
DROP POLICY IF EXISTS "Imagens de produtos são públicas" ON storage.objects;
DROP POLICY IF EXISTS "Permitir atualização de imagens de produtos autenticados" ON storage.objects;
DROP POLICY IF EXISTS "Permitir exclusão de imagens de produtos autenticados" ON storage.objects;
DROP POLICY IF EXISTS "Permitir leitura pública de imagens de produtos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir upload de imagens de produtos autenticados" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar imagens de produtos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar imagens de produtos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem fazer upload de produtos" ON storage.objects;

-- Criar policies corretas e sem conflito
-- 1. Leitura pública (qualquer um pode ver as imagens)
CREATE POLICY "Leitura pública de produtos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'produtos');

-- 2. Upload apenas autenticado com path 2/2
CREATE POLICY "Upload autenticado de produtos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'produtos' 
  AND (storage.foldername(name))[1] = '2'
  AND (storage.foldername(name))[2] = '2'
);

-- 3. Update apenas autenticado com path 2/2
CREATE POLICY "Update autenticado de produtos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'produtos'
  AND (storage.foldername(name))[1] = '2'
  AND (storage.foldername(name))[2] = '2'
);

-- 4. Delete apenas autenticado com path 2/2
CREATE POLICY "Delete autenticado de produtos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'produtos'
  AND (storage.foldername(name))[1] = '2'
  AND (storage.foldername(name))[2] = '2'
);