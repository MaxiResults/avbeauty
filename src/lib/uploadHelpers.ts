import { supabase } from '@/integrations/supabase/client';
import { toZonedTime } from 'date-fns-tz';

const TIMEZONE = 'America/Sao_Paulo';

export const uploadProdutoImage = async (file: File): Promise<string> => {
  // Verificar autenticação
  const { data: { session } } = await supabase.auth.getSession();
  console.log('🔐 Upload - Sessão ativa?', !!session);
  console.log('🔐 Upload - User ID:', session?.user?.id);
  
  if (!session) {
    throw new Error('Usuário não autenticado. Faça login para fazer upload.');
  }

  const timestamp = toZonedTime(new Date(), TIMEZONE).getTime();
  const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const filePath = `2/2/${fileName}`;

  console.log('📁 Upload path:', filePath);

  const { error: uploadError } = await supabase.storage
    .from('produtos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    console.error('❌ Erro no upload:', uploadError);
    throw new Error(`Erro ao fazer upload: ${uploadError.message}`);
  }

  const { data: urlData } = supabase.storage
    .from('produtos')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
};

export const deleteProdutoImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extrair o caminho do arquivo da URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/produtos/');
    if (pathParts.length < 2) return;
    
    const filePath = pathParts[1];

    const { error } = await supabase.storage
      .from('produtos')
      .remove([filePath]);

    if (error) {
      console.error('Erro ao deletar imagem:', error);
    }
  } catch (error) {
    console.error('Erro ao processar deleção de imagem:', error);
  }
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 2 * 1024 * 1024; // 2MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Formato não aceito. Use JPG, PNG ou WEBP.' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'Imagem muito grande. Máximo 2MB.' };
  }

  return { valid: true };
};
