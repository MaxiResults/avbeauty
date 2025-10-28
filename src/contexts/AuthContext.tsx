import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

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
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('admin_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase
        .from('Usuarios')
        .select('*')
        .eq('Email', email)
        .eq('Cliente_ID', 2)
        .eq('Empresa_ID', 2)
        .eq('Ativo', true)
        .limit(1);

      if (error || !data || data.length === 0) {
        console.error('Login query error:', error);
        return { success: false, error: 'Email ou senha incorretos' };
      }

      const row = data[0];

      // In production, use bcrypt.compare(password, row.Senha)
      // For now, simple comparison (assuming password is stored as hash)
      // Note: The migration creates the password with bcrypt hash
      const bcryptModule = await import('bcryptjs');
      const bcrypt: any = (bcryptModule as any).default || (bcryptModule as any);
      if (!row.Senha) {
        console.error('Senha hash ausente no registro do usuário');
        return { success: false, error: 'Email ou senha incorretos' };
      }
      const isValid = await bcrypt.compare(password, row.Senha);

      if (!isValid) {
        return { success: false, error: 'Email ou senha incorretos' };
      }

      const userData: User = {
        ID: row.ID,
        Email: row.Email,
        Nome: row.Nome,
        Role: row.Role,
      };

      setUser(userData);
      localStorage.setItem('admin_user', JSON.stringify(userData));

      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: 'Erro ao fazer login. Tente novamente.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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
