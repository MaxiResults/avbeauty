import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { APP_CLIENTE_ID, APP_EMPRESA_ID } from '@/config/app.config';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sidebar } from '@/components/admin/Sidebar';
import { Header } from '@/components/admin/Header';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('get-usuarios-admin', {
        body: { cliente_id: APP_CLIENTE_ID, empresa_id: APP_EMPRESA_ID }
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      setUsuarios(data?.usuarios || []);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const toggleAtivo = async (id: string, ativoAtual: boolean) => {
    try {
      const { data, error } = await supabase.functions.invoke('update-usuario-admin', {
        body: { id, ativo: !ativoAtual, cliente_id: APP_CLIENTE_ID, empresa_id: APP_EMPRESA_ID }
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

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
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Usuários" />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 lg:ml-64 min-h-screen">
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
                    <tr key={usuario.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-foreground">{usuario.nome}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-muted-foreground">{usuario.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                          {usuario.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          usuario.ativo 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {usuario.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleAtivo(usuario.id, usuario.ativo)}
                        >
                          {usuario.ativo ? 'Desativar' : 'Ativar'}
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
        </main>
      </div>
    </div>
  );
}
