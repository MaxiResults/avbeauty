import { supabase } from '@/lib/supabase';
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

  // Envia o arquivo para a função de backend que faz o upload com service role
  try {
    const { SUPABASE_FUNCTIONS_URL, SUPABASE_ANON_KEY } = await import('@/lib/supabase');

    const form = new FormData();
    form.append('file', file);
    form.append('pathPrefix', '2/2');

    const resp = await fetch(`${SUPABASE_FUNCTIONS_URL}/upload-produto-image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
      body: form,
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error('❌ Erro na função upload-produto-image:', text);
      throw new Error(`Erro ao fazer upload: ${text}`);
    }

    const json = await resp.json();
    return json.publicUrl as string;
  } catch (err) {
    console.error('❌ Erro no upload via função:', err);
    throw err instanceof Error ? err : new Error(String(err));
  }
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
