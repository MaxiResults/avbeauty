import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session, User as SupaUser } from '@supabase/supabase-js';

interface User {
  ID: string;
  Email: string;
  Nome: string;
  Role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  const mapUser = (u: SupaUser): User => {
    const nome = (u.user_metadata?.Nome as string) ||
      (u.user_metadata?.name as string) ||
      (u.email ? u.email.split('@')[0] : 'Usuário');
    const role = (u.app_metadata?.role as string) || 'user';
    return { ID: u.id, Email: u.email ?? '', Nome: nome, Role: role };
  };

  useEffect(() => {
    // 1) Listen for auth state changes FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ? mapUser(sess.user) : null);
      setLoading(false);
    });

    // 2) Then retrieve existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ? mapUser(session.user) : null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message || 'Email ou senha incorretos' };
      if (!data.session || !data.user) return { success: false, error: 'Credenciais inválidas' };
      setSession(data.session);
      setUser(mapUser(data.user));
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: 'Erro ao fazer login. Tente novamente.' };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });
      if (error) return { success: false, error: error.message || 'Falha no cadastro' };
      if (data.user) setUser(mapUser(data.user));
      if (data.session) setSession(data.session);
      return { success: true };
    } catch (err) {
      console.error('Signup error:', err);
      return { success: false, error: 'Erro ao cadastrar. Tente novamente.' };
    }
  };

  const logout = () => {
    supabase.auth.signOut().catch((e) => console.error('Logout error:', e));
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
