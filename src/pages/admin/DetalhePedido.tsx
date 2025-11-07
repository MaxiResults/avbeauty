import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Sidebar } from '@/components/admin/Sidebar';
import { Header } from '@/components/admin/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Pedido {
  id: string;
  codigo: string;
  lead_nome: string;
  lead_email: string;
  lead_telefone: string;
  lead_cpf: string;
  valor_subtotal: number;
  desconto_geral: number;
  valor_total: number;
  forma_pagto: string;
  numero_parcelas: number;
  status_pagamento: string;
  status_pedido: string;
  observacoes_gerais: string;
  created_at: string;
}

interface ItemPedido {
  id: string;
  produto_nome: string;
  quantidade: number;
  preco_unitario: number;
  desconto_item: number;
  preco_total: number;
  observacoes: string;
}

export default function DetalhePedido() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [itens, setItens] = useState<ItemPedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarPedido();
  }, [id]);

  const carregarPedido = async () => {
    try {
      const { data: pedidoData, error: pedidoError } = await supabase
        .from('pedidos')
        .select('*')
        .eq('id', id)
        .single();

      if (pedidoError) throw pedidoError;

      const { data: itensData, error: itensError } = await supabase
        .from('pedidos_itens')
        .select('*')
        .eq('pedido_id', id)
        .order('created_at');

      if (itensError) throw itensError;

      setPedido(pedidoData);
      setItens(itensData || []);
    } catch (error) {
      console.error('Erro ao carregar pedido:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 ml-64 flex flex-col overflow-hidden">
          <Header title="Pedido não encontrado" />
          <main className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto">
              <Button
                variant="ghost"
                onClick={() => navigate('/admin/pedidos')}
                className="mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <p className="text-muted-foreground">Pedido não encontrado</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={`Pedido #${pedido.codigo}`} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 lg:ml-64 min-h-screen">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/pedidos')}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>

            <div className="bg-card rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold">Pedido #{pedido.codigo}</h1>
                  <p className="text-muted-foreground mt-1">
                    {format(new Date(pedido.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  pedido.status_pagamento === 'approved' || pedido.status_pagamento === 'pago'
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {pedido.status_pagamento === 'approved' || pedido.status_pagamento === 'pago' ? 'Pago' : 'Pendente'}
                </span>
              </div>

              {/* Cliente */}
              <div className="mb-6 pb-6 border-b">
                <h2 className="text-lg font-semibold mb-3">Cliente</h2>
                <div className="space-y-1">
                  <p><strong>Nome:</strong> {pedido.lead_nome}</p>
                  <p><strong>Email:</strong> {pedido.lead_email}</p>
                  <p><strong>Telefone:</strong> {pedido.lead_telefone}</p>
                  {pedido.lead_cpf && <p><strong>CPF:</strong> {pedido.lead_cpf}</p>}
                </div>
              </div>

              {/* Itens */}
              <div className="mb-6 pb-6 border-b">
                <h2 className="text-lg font-semibold mb-3">Itens do Pedido</h2>
                <div className="space-y-3">
                  {itens.map((item, index) => (
                    <div key={item.id} className="flex justify-between items-start bg-muted/50 p-4 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold">{index + 1}. {item.produto_nome}</p>
                        {item.observacoes && (
                          <p className="text-sm text-muted-foreground mt-1">Obs: {item.observacoes}</p>
                        )}
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.quantidade}x R$ {item.preco_unitario.toFixed(2)}
                          {item.desconto_item > 0 && (
                            <span className="text-destructive"> - R$ {item.desconto_item.toFixed(2)} desconto</span>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">R$ {item.preco_total.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totais */}
              <div className="mb-6 pb-6 border-b">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">R$ {pedido.valor_subtotal?.toFixed(2) || '0.00'}</span>
                  </div>
                  {pedido.desconto_geral > 0 && (
                    <div className="flex justify-between text-destructive">
                      <span>Desconto Geral:</span>
                      <span>- R$ {pedido.desconto_geral.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold pt-2 border-t">
                    <span>TOTAL:</span>
                    <span className="text-primary">R$ {pedido.valor_total?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </div>

              {/* Pagamento */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Informações de Pagamento</h2>
                <div className="space-y-1">
                  <p><strong>Forma:</strong> {pedido.forma_pagto}</p>
                  <p><strong>Parcelas:</strong> {pedido.numero_parcelas || 1}x</p>
                  <p><strong>Status:</strong> {pedido.status_pagamento === 'approved' || pedido.status_pagamento === 'pago' ? '✅ Aprovado' : '⏳ Pendente'}</p>
                </div>
              </div>

              {/* Observações */}
              {pedido.observacoes_gerais && (
                <div>
                  <h2 className="text-lg font-semibold mb-3">Observações Gerais</h2>
                  <p className="text-muted-foreground bg-muted/50 p-4 rounded-lg">{pedido.observacoes_gerais}</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
