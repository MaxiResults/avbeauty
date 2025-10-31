import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customLogin, isCustomAuthenticated } from '@/utils/customAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (isCustomAuthenticated()) {
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
