import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  customLogin, 
  customLogout, 
  isCustomAuthenticated, 
  getCurrentUser,
  getCustomSession 
} from '@/utils/customAuth';

interface User {
  id: string;
  email: string;
  nome: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cliente Supabase SEM auth (apenas para consultas)
const supabaseUrl = 'https://sunccjukvrximjiqzdkm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1bmNjanVrdnJ4aW1qaXF6ZGttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNzMyODUsImV4cCI6MjA3NDg0OTI4NX0.Xt68Jol4GQ-GeL7g4z_wmm6ui81BIpTNJmNO7WhR_7E';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
    storage: localStorage,
    storageKey: 'ext-auth-context' // Unique key to avoid conflicts
  }
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔧 AUTH CONTEXT - Verificando autenticação customizada...');
    
    // ✅ Use APENAS nossa auth customizada
    if (isCustomAuthenticated()) {
      const currentUser = getCurrentUser();
      console.log('✅ AUTH CONTEXT - Usuário autenticado:', currentUser);
      setUser(currentUser);
    } else {
      console.log('❌ AUTH CONTEXT - Usuário não autenticado');
      setUser(null);
    }
    
    setLoading(false);
    
    // Listen for storage changes (logout from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'custom_auth_session') {
        if (!e.newValue) {
          setUser(null); // Logout from other tab
        } else {
          const currentUser = getCurrentUser();
          setUser(currentUser);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('🔧 AUTH CONTEXT - Login customizado chamado');
      
      // ✅ Use nossa função customizada
      const result = await customLogin(email, password);
      
      if (result.success && result.user) {
        setUser(result.user);
        console.log('✅ AUTH CONTEXT - Login customizado sucesso');
      } else {
        console.log('❌ AUTH CONTEXT - Login customizado falhou:', result.error);
      }
      
      return result;
    } catch (err) {
      console.error('💥 AUTH CONTEXT - Erro no login:', err);
      return { success: false, error: 'Erro ao fazer login. Tente novamente.' };
    }
  };

  const signUp = async (email: string, password: string) => {
    // ❌ Desabilite signUp por enquanto (ou implemente customizado)
    console.log('🚫 AUTH CONTEXT - SignUp desabilitado, use admin para criar usuários');
    return { 
      success: false, 
      error: 'Cadastro desabilitado. Contate o administrador.' 
    };
  };

  const logout = () => {
    console.log('🔧 AUTH CONTEXT - Logout customizado');
    customLogout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    signUp,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
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
