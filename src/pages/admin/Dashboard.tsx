import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { Header } from '@/components/admin/Header';
import { StatCard } from '@/components/admin/StatCard';
import { DollarSign, ShoppingBag, Package, Megaphone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

interface Stats {
  totalVendas: number;
  faturamento: number;
  produtosAtivos: number;
  campanhasAtivas: number;
}

interface ChartData {
  data: string;
  vendas: number;
}

interface Pedido {
  ID: string;
  Codigo: string;
  Lead_Nome: string;
  Valor_Total: number;
  Status_Pagamento: string;
  Created_at: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalVendas: 0,
    faturamento: 0,
    produtosAtivos: 0,
    campanhasAtivas: 0,
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [recentOrders, setRecentOrders] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Buscar estatísticas via edge function
      const { data: statsData, error: statsError } = await supabase.functions.invoke('get-pedidos-admin', {
        body: { type: 'stats' }
      });

      if (statsError) throw statsError;

      // Produtos ativos (ainda no banco local Lovable Cloud)
      const { count: produtosCount } = await (supabase as any)
        .from('produtos')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ativo')
        .eq('cliente_id', 3)
        .eq('empresa_id', 3);

      // Campanhas ativas (ainda no banco local Lovable Cloud)
      const { count: campanhasCount } = await (supabase as any)
        .from('campanhas')
        .select('*', { count: 'exact', head: true })
        .eq('campanha_status', 'Ativo')
        .eq('cliente_id', 3)
        .eq('empresa_id', 3);

      setStats({
        totalVendas: statsData?.stats?.totalVendas || 0,
        faturamento: statsData?.stats?.faturamento || 0,
        produtosAtivos: produtosCount || 0,
        campanhasAtivas: campanhasCount || 0,
      });

      // Buscar dados do gráfico via edge function
      const { data: chartResponse, error: chartError } = await supabase.functions.invoke('get-pedidos-admin', {
        body: { type: 'chart' }
      });

      if (chartError) throw chartError;

      const formattedChartData = chartResponse?.chartData?.map((item: any) => ({
        data: new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        vendas: item.vendas
      })) || [];

      setChartData(formattedChartData);

      // Buscar pedidos recentes via edge function
      const { data: pedidosResponse, error: pedidosError } = await supabase.functions.invoke('get-pedidos-admin', {
        body: { type: 'recent', limit: 10 }
      });

      if (pedidosError) throw pedidosError;

      const formattedOrders = pedidosResponse?.pedidos?.map((p: any) => ({
        ID: p.id || '',
        Codigo: p.codigo || '',
        Lead_Nome: p.lead_nome || '',
        Valor_Total: p.valor_total || 0,
        Status_Pagamento: p.status_pedido || '',
        Created_at: p.created_at || ''
      })) || [];

      setRecentOrders(formattedOrders);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      toast.error('Erro ao carregar pedidos: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header title="Dashboard" />
          <main className="p-8">
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
        <Header title="Dashboard" />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 lg:ml-64 min-h-screen">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Vendas Confirmadas"
              value={stats.totalVendas}
              icon={ShoppingBag}
              color="green"
            />
            <StatCard
              title="Faturamento"
              value={formatCurrency(stats.faturamento)}
              icon={DollarSign}
              color="blue"
            />
            <StatCard
              title="Produtos Disponíveis"
              value={stats.produtosAtivos}
              icon={Package}
              color="purple"
            />
            <StatCard
              title="Campanhas em Andamento"
              value={stats.campanhasAtivas}
              icon={Megaphone}
              color="orange"
            />
          </div>

          {/* Chart */}
          <Card className="mb-8 shadow-soft">
            <CardHeader>
              <CardTitle>Vendas por Dia (Últimos 7 dias)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="vendas"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Últimos Pedidos</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin/pedidos')}
              >
                Ver todos
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-sm">Código</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Cliente</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Valor</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, index) => (
                      <tr
                        key={order.ID}
                        className={`border-b border-border hover:bg-muted/50 transition-smooth ${
                          index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                        }`}
                      >
                        <td className="py-3 px-4 text-sm">{order.Codigo}</td>
                        <td className="py-3 px-4 text-sm">{order.Lead_Nome}</td>
                        <td className="py-3 px-4 text-sm font-medium">
                          {formatCurrency(order.Valor_Total)}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.Status_Pagamento === 'pago'
                                ? 'bg-[hsl(var(--success))]/20 text-[hsl(var(--success))]'
                                : 'bg-[hsl(var(--warning))]/20 text-[hsl(var(--warning))]'
                            }`}
                          >
                            {order.Status_Pagamento}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {new Date(order.Created_at).toLocaleDateString('pt-BR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
