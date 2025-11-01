import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

// =============================================
// CONFIGURAÇÃO DO SUPABASE (DIRETA NO ARQUIVO)
// =============================================
const supabaseUrl = 'https://sunccjukvrximjiqzdkm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1bmNjanVrdnJ4aW1qaXF6ZGttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNzMyODUsImV4cCI6MjA3NDg0OTI4NX0.Xt68Jol4GQ-GeL7g4z_wmm6ui81BIpTNJmNO7WhR_7E';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// =============================================
// TIPOS E INTERFACES
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

interface LoginResult {
  success: boolean;
  error?: string;
  user?: User;
}

// =============================================
// FUNÇÕES DE AUTENTICAÇÃO (DIRETAS NO ARQUIVO)
// =============================================

// Função para gerar hash SHA-256
const hashSenha = async (senha: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(senha);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

// Login
const customLogin = async (email: string, senha: string): Promise<LoginResult> => {
  try {
    console.log('🔐 === INICIANDO LOGIN ===');
    console.log('📧 Email fornecido:', email);

    const senhaHash = await hashSenha(senha);
    console.log('🔐 Hash da senha gerado:', senhaHash);

    console.log('📋 Executando query no Supabase...');
    
    const { data: user, error } = await supabase
      .from('usuarios')
      .select('id, nome, email, senha_hash, role, ativo, cliente_id, empresa_id')
      .eq('email', email)
      .eq('cliente_id', 2)
      .eq('empresa_id', 2)
      .eq('ativo', true)
      .single();

    console.log('📊 RESULTADO DA QUERY:', { user, error });

    if (error || !user) {
      return { success: false, error: 'Usuário não encontrado ou inativo' };
    }

    console.log('👤 USUÁRIO ENCONTRADO:', user);

    // Verificar senha
    console.log('🔍 COMPARANDO SENHAS:');
    console.log('- Hash fornecido:', senhaHash);
    console.log('- Hash no banco:', user.senha_hash);

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

    return { success: true, user: sessionData.user };

  } catch (error) {
    console.error('💥 ERRO NO LOGIN:', error);
    return { success: false, error: 'Erro ao fazer login. Tente novamente.' };
  }
};

// Obter sessão
const getCustomSession = (): SessionData | null => {
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
const isCustomAuthenticated = (): boolean => {
  return getCustomSession() !== null;
};

// Logout (se precisar em outros lugares)
export const customLogout = () => {
  localStorage.removeItem('custom_auth_session');
  window.location.href = '/admin/login';
};

// =============================================
// COMPONENTE LOGIN
// =============================================
export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔧 LOGIN - Verificando autenticação...');
    // Redirect if already logged in
    if (isCustomAuthenticated()) {
      console.log('🔧 LOGIN - Usuário já autenticado, redirecionando...');
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔧 LOGIN - Form submetido', { email, senha: senha ? '***' : 'vazia' });

    if (!email || !senha) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔧 LOGIN - Chamando customLogin...');
      const result = await customLogin(email, senha);
      console.log('🔧 LOGIN - Resultado do customLogin:', result);

      if (result.success) {
        toast.success('Login realizado com sucesso!');
        navigate('/admin/dashboard');
      } else {
        toast.error(result.error || 'Erro ao fazer login');
      }
    } catch (error) {
      console.error('🔧 LOGIN - Erro capturado:', error);
      toast.error('Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-hover">
        <CardHeader className="text-center">
          {/* Logo */}
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
