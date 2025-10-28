import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { z } from 'zod';

const emailSchema = z.string().email('Email inválido');
const passwordSchema = z.string().min(6, 'Senha deve ter no mínimo 6 caracteres');

export default function Auth() {
  const navigate = useNavigate();
  const { user, login, signUp } = useAuth();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // SEO basics
    document.title = 'Login e Cadastro - Área do Administrador';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Acesse ou crie sua conta para o painel administrativo.');
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailCheck = emailSchema.safeParse(loginEmail);
    const passCheck = passwordSchema.safeParse(loginPassword);
    if (!emailCheck.success) return toast.error(emailCheck.error.issues[0]?.message || 'Email inválido');
    if (!passCheck.success) return toast.error(passCheck.error.issues[0]?.message || 'Senha inválida');

    setIsSubmitting(true);
    const res = await login(loginEmail, loginPassword);
    setIsSubmitting(false);
    if (res.success) {
      toast.success('Bem-vindo!');
      navigate('/admin/dashboard', { replace: true });
    } else {
      toast.error(res.error || 'Não foi possível entrar');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailCheck = emailSchema.safeParse(signupEmail);
    const passCheck = passwordSchema.safeParse(signupPassword);
    if (!emailCheck.success) return toast.error(emailCheck.error.issues[0]?.message || 'Email inválido');
    if (!passCheck.success) return toast.error(passCheck.error.issues[0]?.message || 'Senha inválida');

    setIsSubmitting(true);
    const res = await signUp(signupEmail, signupPassword);
    setIsSubmitting(false);
    if (res.success) {
      toast.success('Conta criada! Verifique seu email para confirmar (se necessário).');
      navigate('/admin/dashboard', { replace: true });
    } else {
      toast.error(res.error || 'Não foi possível criar a conta');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-hover">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-terracota rounded-lg">
            <span className="text-3xl font-bold text-terracota-foreground">NG</span>
          </div>
          <CardTitle className="text-2xl">Área do Administrador</CardTitle>
          <CardDescription>Acesse sua conta ou faça seu cadastro</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <Button type="submit" className="w-full bg-terracota hover:bg-terracota/90 text-terracota-foreground" disabled={isSubmitting}>
                  {isSubmitting ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="mínimo 6 caracteres"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <Button type="submit" className="w-full bg-terracota hover:bg-terracota/90 text-terracota-foreground" disabled={isSubmitting}>
                  {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
