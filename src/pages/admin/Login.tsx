import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !senha) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    setIsLoading(true);
    try {
      const result = await login(email, senha);
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
  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181818] to-[#000000] p-4">
      <Card className="w-full max-w-md shadow-2xl border-2 border-[#64473b]/30 bg-[#fdfdfd]">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#624537] via-[#997564] to-[#624537] rounded-lg shadow-lg">
            <span className="text-2xl font-bold text-[#fdfdfd] font-display">AV</span>
          </div>
          <CardTitle className="text-2xl text-[#181818] font-display">AV Beauty Admin</CardTitle>
          <CardDescription className="text-[#737373] font-sans">Entre com suas credenciais para acessar o painel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#181818] font-subtitle">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="seu@email.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                disabled={isLoading}
                className="border-[#64473b]/30 focus:border-[#64473b] focus:ring-[#64473b] font-sans"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha" className="text-[#181818] font-subtitle">Senha</Label>
              <Input 
                id="senha" 
                type="password" 
                placeholder="••••••••" 
                value={senha} 
                onChange={e => setSenha(e.target.value)} 
                required 
                disabled={isLoading}
                className="border-[#64473b]/30 focus:border-[#64473b] focus:ring-[#64473b] font-sans"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#64473b] hover:bg-[#704e3b] text-[#fdfdfd] font-subtitle shadow-lg" 
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>;
}