import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/admin/Sidebar';
import { Header } from '@/components/admin/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { StatCard } from '@/components/pedidos/StatCard';
import { StatusBadge } from '@/components/pedidos/StatusBadge';
import { DetalhesDialog } from '@/components/pedidos/DetalhesDialog';
import { supabase } from '@/lib/supabase';
import { Pedido, PedidoDB, PedidoItem, dbToPedido } from '@/types/pedido';
import { toast } from 'sonner';
import { Package2, CheckCircle, Clock, DollarSign, Search, Download, RefreshCw, Eye, FileText, Copy, MoreVertical, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function ListaPedidos() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [edPedido, setedPedido] = useState<Pedido | null>(null);
  const [pedidoItens, setPedidoItens] = useState<PedidoItem[]>([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Estatísticas
  const [stats, setStats] = useState({
    total: 0,
    pagos: 0,
    pendentes: 0,
    faturamento: 0,
  });

  useEffect(() => {
    fetchPedidos();
    fetchStats();
  }, [searchTerm, statusFilter]);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select('status_pagamento, valor_total')
        .eq('cliente_id', 2)
        .eq('empresa_id', 2);

      if (error) throw error;

      const total = data.length;
      const pagos = data.filter(p => p.status_pagamento === 'pago').length;
      const pendentes = data.filter(p => p.status_pagamento === 'pendente').length;
      const faturamento = data
        .filter(p => p.status_pagamento === 'pago')
        .reduce((sum, p) => sum + p.valor_total, 0);

      setStats({ total, pagos, pendentes, faturamento });
    } catch (error: any) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('pedidos')
        .select(`
          *,
          campanhas:campanha_id(nome_campanha)
        `)
        .eq('cliente_id', 2)
        .eq('empresa_id', 2)
        .order('created_at', { ascending: false });

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status_pagamento', statusFilter);
      }

      if (searchTerm) {
        query = query.or(
          `codigo.ilike.%${searchTerm}%,lead_nome.ilike.%${searchTerm}%,lead_cpf.ilike.%${searchTerm}%,lead_email.ilike.%${searchTerm}%`
        );
      }

      const { data, error } = await query;

      if (error) throw error;

      const pedidosData = (data || []).map((p: any) => ({
        ...dbToPedido(p as PedidoDB),
        Campanha_Nome: p.campanhas?.nome_campanha,
      }));

      setPedidos(pedidosData);
    } catch (error: any) {
      toast.error('Erro ao carregar pedidos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (pedido: Pedido) => {
    try {
      const { data, error } = await supabase
        .from('pedidos_itens')
        .select(`
          *,
          produtos(imagem_principal)
        `)
        .eq('pedido_id', pedido.ID)
        .eq('cliente_id', 2)
        .eq('empresa_id', 2);

      if (error) throw error;

      const itens = (data || []).map((item: any) => ({
        ID: item.id,
        Pedido_ID: item.pedido_id,
        Produto_ID: item.produto_id,
        Produto_Nome: item.produto_nome,
        Quantidade: item.quantidade,
        Preco_Unitario: item.preco_unitario,
        Preco_Total: item.preco_total,
        Imagem_Produto: item.produtos?.imagem_principal,
      }));

      setPedidoItens(itens);
      setedPedido(pedido);
      setDetailsOpen(true);
    } catch (error: any) {
      toast.error('Erro ao carregar detalhes: ' + error.message);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDateTime = (date: string) => {
    return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  const handleCopyLink = (pedido: Pedido) => {
    if (pedido.Link_Pagamento) {
      navigator.clipboard.writeText(pedido.Link_Pagamento);
      toast.success('Link copiado!');
    }
  };

  // Paginação
  const totalPages = Math.ceil(pedidos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPedidos = pedidos.slice(startIndex, endIndex);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <Header title="Pedidos" />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">Pedidos</h2>
                <p className="text-muted-foreground mt-1">
                  Gerencie os pedidos e acompanhe pagamentos
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => navigate('/admin/pedidos/novo-manual')}
                  className="bg-[#97624b] hover:bg-[#7d5340]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Pedido Presencial
                </Button>
                <Button variant="outline" onClick={fetchPedidos}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Atualizar
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Exportar
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Excel (.xlsx)</DropdownMenuItem>
                    <DropdownMenuItem>CSV (.csv)</DropdownMenuItem>
                    <DropdownMenuItem>PDF</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total de Pedidos"
                value={stats.total}
                icon={Package2}
                color="text-blue-600"
              />
              <StatCard
                title="Pedidos Confirmados"
                value={stats.pagos}
                icon={CheckCircle}
                subtitle={`${stats.total > 0 ? Math.round((stats.pagos / stats.total) * 100) : 0}% do total`}
                color="text-green-600"
              />
              <StatCard
                title="Aguardando Pagamento"
                value={stats.pendentes}
                icon={Clock}
                color="text-orange-600"
              />
              <StatCard
                title="Faturamento Confirmado"
                value={formatCurrency(stats.faturamento)}
                icon={DollarSign}
                color="text-blue-600"
              />
            </div>

            {/* Filtros */}
            <div className="bg-card border rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Código, nome ou CPF"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status Pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                    <SelectItem value="reembolsado">Reembolsado</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>

            {/* Tabela de Pedidos */}
            <div className="bg-card border rounded-lg overflow-hidden">
              {loading ? (
                <div className="p-8 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : currentPedidos.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Campanha</TableHead>
                      <TableHead>Valor Total</TableHead>
                      <TableHead>Pagamento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentPedidos.map((pedido) => (
                      <TableRow key={pedido.ID} className="hover:bg-muted/50">
                        <TableCell>
                          <Button
                            variant="link"
                            className="font-bold p-0 h-auto"
                            onClick={() => handleViewDetails(pedido)}
                          >
                            {pedido.Codigo}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{pedido.Lead_Nome}</p>
                            <p className="text-xs text-muted-foreground">{pedido.Lead_Email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>{format(new Date(pedido.Created_at), 'dd/MM/yyyy', { locale: ptBR })}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(pedido.Created_at), 'HH:mm', { locale: ptBR })}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {pedido.Campanha_Nome || <span className="text-muted-foreground">-</span>}
                        </TableCell>
                        <TableCell className="font-bold">
                          {formatCurrency(pedido.Valor_Total)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{pedido.Forma_Pagto}</p>
                            {pedido.Numero_Parcelas && pedido.Numero_Parcelas > 1 && (
                              <p className="text-xs text-muted-foreground">{pedido.Numero_Parcelas}x</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={pedido.Status_Pagamento} />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleViewDetails(pedido)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleCopyLink(pedido)}>
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copiar Link
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileText className="w-4 h-4 mr-2" />
                                  Nota Fiscal
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <Package2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                  <h3 className="text-xl font-semibold mb-2">Nenhum pedido encontrado</h3>
                  <p className="text-muted-foreground">
                    Ajuste os filtros ou aguarde novos pedidos
                  </p>
                </div>
              )}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Mostrando {startIndex + 1}-{Math.min(endIndex, pedidos.length)} de {pedidos.length} pedidos
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className={currentPage === pageNum ? 'bg-[#97624b] hover:bg-[#7d5340]' : ''}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Próximo
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <DetalhesDialog
        pedido={edPedido}
        itens={pedidoItens}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </div>
  );
}
