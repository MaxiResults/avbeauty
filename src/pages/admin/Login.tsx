import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

// =============================================
// BLOQUEADOR DE AUTH NATIVO
// =============================================
// @ts-ignore
if (!window._supabaseAuthBlocked) {
  // @ts-ignore
  window._supabaseAuthBlocked = true;
  
  const originalFetch = window.fetch;
  // @ts-ignore
  window.fetch = function(...args) {
    const url = args[0];
    if (url && url.includes('/auth/v1/token')) {
      console.log('🚫 AUTH NATIVO BLOQUEADO');
      return Promise.reject(new Error('Use auth customizada'));
    }
    return originalFetch.apply(this, args);
  };
}

// =============================================
// CONFIGURAÇÃO DO SUPABASE (AUTH DESABILITADO)
// =============================================
const supabaseUrl = 'https://sunccjukvrximjiqzdkm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1bmNjanVrdnJ4aW1qaXF6ZGttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNzMyODUsImV4cCI6MjA3NDg0OTI4NX0.Xt68Jol4GQ-GeL7g4z_wmm6ui81BIpTNJmNO7WhR_7E';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: false // ✅ DESABILITA COMPLETAMENTE
});

// =============================================
// FUNÇÕES DE AUTENTICAÇÃO CUSTOMIZADA
// =============================================
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

const hashSenha = async (senha: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(senha);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

const getCustomSession = (): SessionData | null => {
  try {
    const session = localStorage.getItem('custom_auth_session');
    if (!session) return null;
    const parsed: SessionData = JSON.parse(session);
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

const isCustomAuthenticated = (): boolean => {
  return getCustomSession() !== null;
};

const customLogin = async (email: string, senha: string) => {
  try {
    console.log('🔐 LOGIN CUSTOMIZADO - Email:', email);

    const senhaHash = await hashSenha(senha);
    
    const { data: user, error } = await supabase
      .from('usuarios')
      .select('id, nome, email, senha_hash, role, ativo, cliente_id, empresa_id')
      .eq('email', email)
      .eq('cliente_id', 2)
      .eq('empresa_id', 2)
      .eq('ativo', true)
      .single();

    if (error || !user) {
      return { success: false, error: 'Usuário não encontrado' };
    }

    if (senhaHash !== user.senha_hash) {
      return { success: false, error: 'Senha incorreta' };
    }

    const sessionData: SessionData = {
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role
      },
      expires: Date.now() + (24 * 60 * 60 * 1000),
      timestamp: Date.now()
    };

    localStorage.setItem('custom_auth_session', JSON.stringify(sessionData));
    console.log('🎉 LOGIN CUSTOMIZADO SUCESSO!');

    return { success: true, user: sessionData.user };

  } catch (error) {
    console.error('💥 ERRO NO LOGIN:', error);
    return { success: false, error: 'Erro ao fazer login' };
  }
};

// =============================================
// COMPONENTE LOGIN
// =============================================
export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // ⚠️ USE EFFECT CORRIGIDO - SEM AUTH NATIVO
  useEffect(() => {
    console.log('🔧 LOGIN - Verificando auth customizada...');
    
    // ✅ APENAS auth customizada - NADA de supabase.auth!
    if (isCustomAuthenticated()) {
      console.log('🔧 LOGIN - Usuário autenticado, redirecionando...');
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !senha) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);

    try {
      const result = await customLogin(email, senha);

      if (result.success) {
        toast.success('Login realizado com sucesso!');
        navigate('/admin/dashboard');
      } else {
        toast.error(result.error || 'Erro ao fazer login');
      }
    } catch (error) {
      toast.error('Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-hover">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-terracota rounded-lg">
            <span className="text-3xl font-bold text-terracota-foreground">NG</span>
          </div>
          <CardTitle className="text-2xl">Nicole Guedes Admin</CardTitle>
          <CardDescription>Entre com suas credenciais para acessar o painel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-terracota hover:bg-terracota/90 text-terracota-foreground"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
