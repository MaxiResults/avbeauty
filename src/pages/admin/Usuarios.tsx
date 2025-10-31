import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('ID, Nome, Email, Role, Ativo, Created_at')
        .eq('Cliente_ID', 2)
        .eq('Empresa_ID', 2)
        .order('Created_at', { ascending: false });

      if (error) throw error;
      setUsuarios(data || []);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const toggleAtivo = async (id: string, ativoAtual: boolean) => {
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ Ativo: !ativoAtual, Updated_at: new Date().toISOString() })
        .eq('ID', id);

      if (error) throw error;
      toast.success(`Usuário ${!ativoAtual ? 'ativado' : 'desativado'} com sucesso`);
      carregarUsuarios();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status do usuário');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Usuários</h1>
        <Button onClick={() => navigate('/admin/usuarios/novo')}>
          + Novo Usuário
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-border">
              {usuarios.map((usuario) => (
                <tr key={usuario.ID}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-foreground">{usuario.Nome}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-muted-foreground">{usuario.Email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                      {usuario.Role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      usuario.Ativo 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {usuario.Ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAtivo(usuario.ID, usuario.Ativo)}
                    >
                      {usuario.Ativo ? 'Desativar' : 'Ativar'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {usuarios.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Nenhum usuário encontrado
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
