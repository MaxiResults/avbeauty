/**
 * ⚠️ AVISO DE SEGURANÇA CRÍTICO ⚠️
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
    // Gerar hash da senha digitada
    const senhaHash = await hashSenha(senha);

    // Buscar usuário no banco EXTERNO do Supabase
    const { data: user, error } = await supabase
      .from('usuarios')
      .select('id, nome, email, senha_hash, role, ativo, cliente_id, empresa_id')
      .eq('email', email)
      .eq('cliente_id', 2)
      .eq('empresa_id', 2)
      .eq('ativo', true)
      .single();

    if (error || !user) {
      return { success: false, error: 'Usuário não encontrado ou inativo' };
    }

    // Verificar senha
    if (senhaHash !== user.senha_hash) {
      return { success: false, error: 'Senha incorreta' };
    }

    // Criar sessão (INSEGURO - localStorage pode ser manipulado!)
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

    return { success: true, user: sessionData.user };

  } catch (error) {
    console.error('Erro no login:', error);
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
