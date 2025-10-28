import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/admin/Sidebar';
import { Header } from '@/components/admin/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/campanhas/StatusBadge';
import { PeriodoBadge } from '@/components/campanhas/PeriodoBadge';
import { DeleteDialog } from '@/components/campanhas/DeleteDialog';
import { supabase } from '@/lib/supabase';
import { Campanha, CampanhaDB, dbToCampanha } from '@/types/campanha';
import { toast } from 'sonner';
import { Edit, Trash2, Plus, Search } from 'lucide-react';

export default function ListaCampanhas() {
  const navigate = useNavigate();
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCampanha, setSelectedCampanha] = useState<Campanha | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCampanhas();
  }, [searchTerm, statusFilter]);

  const fetchCampanhas = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('campanhas')
        .select('*')
        .eq('Cliente_ID', 2)
        .eq('Empresa_ID', 2)
        .eq('Ativo', true)
        .order('Created_at', { ascending: false });

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('Campanha_Status', statusFilter);
      }

      if (searchTerm) {
        query = query.or(`Nome_campanha.ilike.%${searchTerm}%,Slug.ilike.%${searchTerm}%,Descricao.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      const campanhasData = (data as CampanhaDB[] || []).map(dbToCampanha);
      setCampanhas(campanhasData);
    } catch (error: any) {
      toast.error('Erro ao carregar campanhas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCampanha) return;

    try {
      const { error } = await supabase
        .from('campanhas')
        .update({ Ativo: false })
        .eq('ID', selectedCampanha.ID)
        .eq('Cliente_ID', 2)
        .eq('Empresa_ID', 2);

      if (error) throw error;

      toast.success('✅ Campanha excluída com sucesso!');
      setDeleteDialogOpen(false);
      setSelectedCampanha(null);
      fetchCampanhas();
    } catch (error: any) {
      toast.error('❌ Erro ao excluir campanha: ' + error.message);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  // Paginação
  const totalPages = Math.ceil(campanhas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCampanhas = campanhas.slice(startIndex, endIndex);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <Header title="Campanhas" />

        <main className="flex-1 overflow-y-auto p-8">
          {/* Header da Página */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Campanhas</h2>
            <Button
              onClick={() => navigate('/admin/campanhas/nova')}
              className="bg-terracota hover:bg-terracota/90 text-terracota-foreground"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Campanha
            </Button>
          </div>

          {/* Filtros */}
          <div className="bg-card rounded-lg border border-border p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Suspensa">Suspensa</SelectItem>
                  <SelectItem value="Agendada">Agendada</SelectItem>
                  <SelectItem value="Cancelada">Cancelada</SelectItem>
                  <SelectItem value="Concluída">Concluída</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={handleClearFilters}>
                Limpar Filtros
              </Button>
            </div>
          </div>

          {/* Tabela */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : currentCampanhas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-card rounded-lg border border-border">
              <span className="text-6xl mb-4">📢</span>
              <h3 className="text-xl font-semibold mb-2">Nenhuma campanha criada</h3>
              <p className="text-muted-foreground mb-4">Crie sua primeira campanha para começar</p>
              <Button
                onClick={() => navigate('/admin/campanhas/nova')}
                className="bg-terracota hover:bg-terracota/90 text-terracota-foreground"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nova Campanha
              </Button>
            </div>
          ) : (
            <>
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Nome da Campanha</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Investimento</TableHead>
                      <TableHead>Canais</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentCampanhas.map((campanha) => (
                      <TableRow key={campanha.ID}>
                        <TableCell>
                          <StatusBadge status={campanha.Campanha_Status} />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold">{campanha.Nome_campanha}</span>
                            <span className="text-sm text-muted-foreground">{campanha.Slug}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <PeriodoBadge dataInicio={campanha.Data_Inicio} dataFim={campanha.Data_Fim} />
                        </TableCell>
                        <TableCell>
                          {campanha.Investimento_total > 0
                            ? new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              }).format(campanha.Investimento_total)
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{campanha.utm_source || '-'}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/admin/campanhas/${campanha.ID}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedCampanha(campanha);
                                setDeleteDialogOpen(true);
                              }}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {startIndex + 1} a {Math.min(endIndex, campanhas.length)} de {campanhas.length} campanhas
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    {[...Array(totalPages)].map((_, i) => (
                      <Button
                        key={i}
                        variant={currentPage === i + 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Próximo
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        campanhaName={selectedCampanha?.Nome_campanha || ''}
      />
    </div>
  );
}
