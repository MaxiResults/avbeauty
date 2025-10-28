-- Criar bucket para imagens de produtos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'produtos',
  'produtos',
  true,
  2097152, -- 2MB em bytes
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Criar políticas de acesso ao bucket produtos
CREATE POLICY "Permitir leitura pública de imagens de produtos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'produtos');

CREATE POLICY "Permitir upload de imagens de produtos autenticados"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'produtos' AND
  (storage.foldername(name))[1] = '2' AND
  (storage.foldername(name))[2] = '2'
);

CREATE POLICY "Permitir atualização de imagens de produtos autenticados"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'produtos' AND
  (storage.foldername(name))[1] = '2' AND
  (storage.foldername(name))[2] = '2'
);

CREATE POLICY "Permitir exclusão de imagens de produtos autenticados"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'produtos' AND
  (storage.foldername(name))[1] = '2' AND
  (storage.foldername(name))[2] = '2'
);