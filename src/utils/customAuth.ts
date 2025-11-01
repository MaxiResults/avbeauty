/**
 * ⚠️ AVISO DE SEGURANÇA CRÍTICO ⚠️ atualizado
 * 
 * Este sistema de autenticação tem FALHAS GRAVES de segurança:
 * 1. localStorage pode ser manipulado pelo usuário (F12 > Application > Local Storage)
 * 2. SHA-256 sem salt é vulnerável a rainbow tables
 * 3. Não há validação server-side - toda segurança está no cliente
 * 4. Qualquer usuário técnico pode se promover a admin editando localStorage
 * 
 * NÃO USE EM PRODUÇÃO sem implementar:
 * - Tokens JWT assinados no servidor
 * - Bcrypt/Argon2 para hash de senhas com salt
 * - Validação server-side de permissões
 * - Rate limiting para prevenir ataques de força bruta
 */

import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  nome: string;
  email: string;
  role: string;
}

interface SessionData {
  user: User;
  expires: number;
  timestamp: number;
}

// Função para gerar hash SHA-256 (INSEGURO - use bcrypt em produção!)
const hashSenha = async (senha: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(senha);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

// Login
export const customLogin = async (email: string, senha: string) => {
  try {
    console.log('🔐 === INICIANDO LOGIN ===');
    console.log('📧 Email fornecido:', email);
    console.log('🔑 Senha fornecida:', senha ? '***' : 'vazia');

    // Gerar hash da senha digitada
    const senhaHash = await hashSenha(senha);
    console.log('🔐 Hash da senha gerado:', senhaHash);

    console.log('📋 Executando query no Supabase...');
    
    // Buscar usuário no banco EXTERNO do Supabase
    const { data: user, error } = await supabase
      .from('usuarios')
      .select('id, nome, email, senha_hash, role, ativo, cliente_id, empresa_id')
      .eq('email', email)
      .eq('cliente_id', 2)
      .eq('empresa_id', 2)
      .eq('ativo', true)
      .single();

    console.log('📊 RESULTADO DA QUERY:');
    console.log('- Error:', error);
    console.log('- User encontrado:', user);

    if (error) {
      console.log('❌ ERRO NA QUERY:', error.message);
      console.log('- Detalhes:', error.details);
      console.log('- Hint:', error.hint);
      return { success: false, error: 'Erro ao buscar usuário: ' + error.message };
    }

    if (!user) {
      console.log('❌ USUÁRIO NÃO ENCONTRADO');
      console.log('- Verifique se existe usuário com:');
      console.log('  • email:', email);
      console.log('  • cliente_id: 2');
      console.log('  • empresa_id: 2');
      console.log('  • ativo: true');
      return { success: false, error: 'Usuário não encontrado ou inativo' };
    }

    console.log('👤 USUÁRIO ENCONTRADO:');
    console.log('- ID:', user.id);
    console.log('- Nome:', user.nome);
    console.log('- Email:', user.email);
    console.log('- Role:', user.role);
    console.log('- Senha_hash no banco:', user.senha_hash);
    console.log('- Ativo:', user.ativo);
    console.log('- Cliente_ID:', user.cliente_id);
    console.log('- Empresa_ID:', user.empresa_id);

    // Verificar senha
    console.log('🔍 COMPARANDO SENHAS:');
    console.log('- Hash fornecido:', senhaHash);
    console.log('- Hash no banco:', user.senha_hash);
    console.log('- São iguais?', senhaHash === user.senha_hash);

    if (senhaHash !== user.senha_hash) {
      console.log('❌ SENHA INCORRETA');
      return { success: false, error: 'Senha incorreta' };
    }

    console.log('✅ SENHA CORRETA!');

    // Criar sessão
    const sessionData: SessionData = {
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role
      },
      expires: Date.now() + (24 * 60 * 60 * 1000), // 24 horas
      timestamp: Date.now()
    };

    localStorage.setItem('custom_auth_session', JSON.stringify(sessionData));
    console.log('🎉 LOGIN REALIZADO COM SUCESSO!');
    console.log('💾 Sessão salva no localStorage');

    return { success: true, user: sessionData.user };

  } catch (error) {
    console.error('💥 ERRO NO LOGIN:', error);
    return { success: false, error: 'Erro ao fazer login. Tente novamente.' };
  }
};

// Logout
export const customLogout = () => {
  localStorage.removeItem('custom_auth_session');
  window.location.href = '/admin/login';
};

// Obter sessão
export const getCustomSession = (): SessionData | null => {
  try {
    const session = localStorage.getItem('custom_auth_session');
    if (!session) return null;

    const parsed: SessionData = JSON.parse(session);

    // Verificar expiração
    if (parsed.expires < Date.now()) {
      localStorage.removeItem('custom_auth_session');
      return null;
    }

    return parsed;
  } catch (error) {
    localStorage.removeItem('custom_auth_session');
    return null;
  }
};

// Verificar autenticação
export const isCustomAuthenticated = (): boolean => {
  return getCustomSession() !== null;
};

// Obter usuário atual
export const getCurrentUser = (): User | null => {
  const session = getCustomSession();
  return session?.user || null;
};

// HELPER: Gerar hash de senha (para cadastro de novos usuários)
export const gerarHashSenha = async (senha: string): Promise<string> => {
  return await hashSenha(senha);
};
