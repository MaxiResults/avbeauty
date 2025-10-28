import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { Header } from '@/components/admin/Header';
import { StatCard } from '@/components/admin/StatCard';
import { DollarSign, ShoppingBag, Package, Megaphone } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
      // Total de vendas confirmadas
      const { count: vendasCount } = await supabase
        .from('Pedidos')
        .select('*', { count: 'exact', head: true })
        .eq('Status_Pagamento', 'pago')
        .eq('Cliente_ID', 2)
        .eq('Empresa_ID', 2);

      // Faturamento total
      const { data: pedidos } = await supabase
        .from('Pedidos')
        .select('Valor_Total')
        .eq('Status_Pagamento', 'pago')
        .eq('Cliente_ID', 2)
        .eq('Empresa_ID', 2);

      const faturamentoTotal = pedidos?.reduce((sum, p) => sum + (p.Valor_Total || 0), 0) || 0;

      // Produtos ativos
      const { count: produtosCount } = await supabase
        .from('Produtos')
        .select('*', { count: 'exact', head: true })
        .eq('Ativo', true)
        .eq('Cliente_ID', 2)
        .eq('Empresa_ID', 2);

      // Campanhas ativas
      const { count: campanhasCount } = await supabase
        .from('Campanhas')
        .select('*', { count: 'exact', head: true })
        .eq('Campanha_Status', 'Ativo')
        .eq('Cliente_ID', 2)
        .eq('Empresa_ID', 2);

      setStats({
        totalVendas: vendasCount || 0,
        faturamento: faturamentoTotal,
        produtosAtivos: produtosCount || 0,
        campanhasAtivas: campanhasCount || 0,
      });

      // Carregar vendas dos últimos 7 dias para o gráfico
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
      });

      const chartDataPromises = last7Days.map(async (date) => {
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        
        const { count } = await supabase
          .from('Pedidos')
          .select('*', { count: 'exact', head: true })
          .eq('Cliente_ID', 2)
          .eq('Empresa_ID', 2)
          .gte('Created_at', date)
          .lt('Created_at', nextDate.toISOString().split('T')[0]);

        return {
          data: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          vendas: count || 0,
        };
      });

      const chartResults = await Promise.all(chartDataPromises);
      setChartData(chartResults);

      // Carregar últimos 10 pedidos
      const { data: ultimosPedidos } = await supabase
        .from('Pedidos')
        .select('*')
        .eq('Cliente_ID', 2)
        .eq('Empresa_ID', 2)
        .order('Created_at', { ascending: false })
        .limit(10);

      setRecentOrders(ultimosPedidos || []);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
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
      
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <Header title="Dashboard" />
        
        <main className="flex-1 overflow-y-auto p-8">
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
