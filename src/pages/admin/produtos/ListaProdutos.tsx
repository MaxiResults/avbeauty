import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/admin/Sidebar';
import { Header } from '@/components/admin/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ProdutoCard } from '@/components/produtos/ProdutoCard';
import { PreviewDialog } from '@/components/produtos/PreviewDialog';
import { DeleteDialog } from '@/components/produtos/DeleteDialog';
import { supabase } from '@/lib/supabase';
import { Produto, ProdutoDB, dbToProduto } from '@/types/produto';
import { toast } from 'sonner';
import { Plus, Search, Package } from 'lucide-react';
import { APP_CLIENTE_ID, APP_EMPRESA_ID } from '@/config/app.config';

export default function ListaProdutos() {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tipoFilter, setTipoFilter] = useState<string>('all');
  const [ordenacao, setOrdenacao] = useState<string>('ordem');
  const [categorias, setCategorias] = useState<string[]>([]);
  const [previewProduto, setPreviewProduto] = useState<Produto | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchCategorias();
  }, []);

  useEffect(() => {
    fetchProdutos();
  }, [searchTerm, categoriaFilter, statusFilter, tipoFilter, ordenacao]);

  const fetchCategorias = async () => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('categoria')
        .eq('cliente_id', APP_CLIENTE_ID)
        .eq('empresa_id', APP_EMPRESA_ID)
        .not('categoria', 'is', null);

      if (error) throw error;

      const uniqueCategorias = [...new Set(data.map(item => item.categoria).filter(Boolean))] as string[];
      setCategorias(uniqueCategorias);
    } catch (error: any) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const fetchProdutos = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('produtos')
        .select('*')
        .eq('cliente_id', APP_CLIENTE_ID)
        .eq('empresa_id', APP_EMPRESA_ID);

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (categoriaFilter && categoriaFilter !== 'all') {
        query = query.eq('categoria', categoriaFilter);
      }

      if (tipoFilter && tipoFilter !== 'all') {
        if (tipoFilter === 'Limitado') {
          query = query.eq('controla_estoque', true);
        } else if (tipoFilter === 'Ilimitado') {
          query = query.eq('controla_estoque', false);
        }
      }

      if (searchTerm) {
        query = query.or(
          `nome.ilike.%${searchTerm}%,slug.ilike.%${searchTerm}%,descricao_curta.ilike.%${searchTerm}%,categoria.ilike.%${searchTerm}%`
        );
      }

      // Ordenação
      switch (ordenacao) {
        case 'nome':
          query = query.order('nome', { ascending: true });
          break;
        case 'preco_asc':
          query = query.order('preco_padrao', { ascending: true });
          break;
        case 'preco_desc':
          query = query.order('preco_padrao', { ascending: false });
          break;
        case 'recente':
          query = query.order('created_at', { ascending: false });
          break;
        case 'destaque':
          query = query.order('principal_destaque', { ascending: false }).order('ordem_exibicao', { ascending: true });
          break;
        default:
          query = query.order('ordem_exibicao', { ascending: true });
      }

      const { data, error } = await query;

      if (error) throw error;
      const produtosData = (data as ProdutoDB[] || []).map(dbToProduto);
      setProdutos(produtosData);
    } catch (error: any) {
      toast.error('Erro ao carregar produtos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduto) return;

    try {
      const { error } = await supabase
        .from('produtos')
        .update({ status: 'indisponivel' })
        .eq('id', selectedProduto.id)
        .eq('cliente_id', APP_CLIENTE_ID)
        .eq('empresa_id', APP_EMPRESA_ID);

      if (error) throw error;

      toast.success('✅ Produto excluído com sucesso!');
      setDeleteDialogOpen(false);
      setSelectedProduto(null);
      fetchProdutos();
    } catch (error: any) {
      toast.error('❌ Erro ao excluir produto: ' + error.message);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategoriaFilter('all');
    setStatusFilter('all');
    setTipoFilter('all');
    setOrdenacao('ordem');
  };

  // Paginação
  const totalPages = Math.ceil(produtos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProdutos = produtos.slice(startIndex, endIndex);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Produtos" />

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 lg:ml-64 min-h-screen">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">Produtos</h2>
                <p className="text-muted-foreground mt-1">
                  Gerencie os procedimentos e pacotes da clínica
                </p>
              </div>
              <Button
                onClick={() => navigate('/admin/produtos/novo')}
                className="bg-[#97624b] hover:bg-[#7d5340]"
              >
                <Plus className="mr-2 h-4 w-4" />
                Novo Produto
              </Button>
            </div>

            {/* Filtros */}
            <div className="bg-card border rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome, categoria..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas Categorias</SelectItem>
                    {categorias.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos Status</SelectItem>
                    <SelectItem value="ativo">Disponível</SelectItem>
                    <SelectItem value="indisponivel">Indisponível</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={tipoFilter} onValueChange={setTipoFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos Tipos</SelectItem>
                    <SelectItem value="Limitado">Estoque Limitado</SelectItem>
                    <SelectItem value="Ilimitado">Estoque Ilimitado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" onClick={handleClearFilters}>
                  Limpar Filtros
                </Button>

                <Select value={ordenacao} onValueChange={setOrdenacao}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ordem">Ordem de exibição</SelectItem>
                    <SelectItem value="nome">Nome (A-Z)</SelectItem>
                    <SelectItem value="preco_asc">Preço (menor → maior)</SelectItem>
                    <SelectItem value="preco_desc">Preço (maior → menor)</SelectItem>
                    <SelectItem value="recente">Mais recentes</SelectItem>
                    <SelectItem value="destaque">Destaque primeiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Grid de Produtos */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : currentProdutos.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentProdutos.map((produto) => (
                    <ProdutoCard
                      key={produto.id}
                      produto={produto}
                      onDelete={(id) => {
                        const prod = produtos.find(p => p.id === id);
                        if (prod) {
                          setSelectedProduto(prod);
                          setDeleteDialogOpen(true);
                        }
                      }}
                      onPreview={setPreviewProduto}
                    />
                  ))}
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <Button
                        key={i}
                        variant={currentPage === i + 1 ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(i + 1)}
                        className={currentPage === i + 1 ? 'bg-[#97624b] hover:bg-[#7d5340]' : ''}
                      >
                        {i + 1}
                      </Button>
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Próximo
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-xl font-semibold mb-2">Nenhum produto cadastrado</h3>
                <p className="text-muted-foreground mb-4">
                  Crie seu primeiro produto para começar a vender
                </p>
                <Button
                  onClick={() => navigate('/admin/produtos/novo')}
                  className="bg-[#97624b] hover:bg-[#7d5340]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Produto
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>

      <PreviewDialog
        produto={previewProduto}
        open={!!previewProduto}
        onOpenChange={(open) => !open && setPreviewProduto(null)}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        produtoNome={selectedProduto?.nome || ''}
      />
    </div>
  );
}
