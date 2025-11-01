import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Sidebar } from '@/components/admin/Sidebar';
import { Header } from '@/components/admin/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import EnderecoForm from '@/components/EnderecoForm';
import ItemPedido from '@/components/pedidos/ItemPedido';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';

interface Produto {
  id: number;
  nome: string;
  preco_padrao: number;
  preco_promocional: number | null;
  codigo_externo: string | null;
}

interface ItemPedidoData {
  id?: string;
  produto_id: number | null;
  produto_nome: string;
  quantidade: number;
  preco_unitario: number;
  desconto_item: number;
  observacoes: string;
}

interface EnderecoData {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
}

export default function EditarPedido() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [pedido, setPedido] = useState<any>(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('');
  const [parcelas, setParcelas] = useState('1');
  const [statusPagamento, setStatusPagamento] = useState('');
  const [statusPedido, setStatusPedido] = useState('');
  const [obsGerais, setObsGerais] = useState('');
  const [descontoGeral, setDescontoGeral] = useState(0);
  
  const [endereco, setEndereco] = useState<EnderecoData>({
    cep: '', logradouro: '', numero: '', complemento: '',
    bairro: '', cidade: '', estado: '', pais: 'Brasil'
  });
  
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [itens, setItens] = useState<ItemPedidoData[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    carregarPedido();
    carregarProdutos();
  }, [id]);

  const carregarProdutos = async () => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('id, nome, preco_padrao, preco_promocional, codigo_externo')
        .eq('cliente_id', 2)
        .eq('status', 'ativo')
        .order('nome');

      if (error) throw error;
      setProdutos(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar produtos:', error);
      toast.error('Erro ao carregar produtos');
    }
  };

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
      setNome(pedidoData.lead_nome || '');
      setEmail(pedidoData.lead_email || '');
      setTelefone(pedidoData.lead_telefone || '');
      setCpf(pedidoData.lead_cpf || '');
      setFormaPagamento(pedidoData.forma_pagto?.split(' - ')[0] || '');
      setParcelas(pedidoData.numero_parcelas?.toString() || '1');
      setStatusPagamento(pedidoData.status_pagamento || '');
      setStatusPedido(pedidoData.status_pedido || '');
      setObsGerais(pedidoData.observacoes_gerais || '');
      setDescontoGeral(pedidoData.desconto_geral || 0);
      
      setEndereco({
        cep: pedidoData.endereco_cep || '',
        logradouro: pedidoData.endereco_logradouro || '',
        numero: pedidoData.endereco_numero || '',
        complemento: pedidoData.endereco_complemento || '',
        bairro: pedidoData.endereco_bairro || '',
        cidade: pedidoData.endereco_cidade || '',
        estado: pedidoData.endereco_estado || '',
        pais: pedidoData.endereco_pais || 'Brasil'
      });

      const itensFormatados = itensData.map((item: any) => ({
        id: item.id,
        produto_id: item.produto_id,
        produto_nome: item.produto_nome,
        quantidade: item.quantidade,
        preco_unitario: item.preco_unitario,
        desconto_item: item.desconto_item || 0,
        observacoes: item.observacoes || ''
      }));

      setItens(itensFormatados);
    } catch (error: any) {
      console.error('Erro ao carregar pedido:', error);
      toast.error('Erro ao carregar pedido');
    } finally {
      setLoading(false);
    }
  };

  const handleItemChange = (index: number, novoItem: ItemPedidoData) => {
    const novosItens = [...itens];
    novosItens[index] = novoItem;
    setItens(novosItens);
  };

  const adicionarItem = () => {
    setItens([...itens, {
      produto_id: null,
      produto_nome: '',
      quantidade: 1,
      preco_unitario: 0,
      desconto_item: 0,
      observacoes: ''
    }]);
  };

  const removerItem = (index: number) => {
    if (itens.length > 1) {
      setItens(itens.filter((_, i) => i !== index));
    } else {
      toast.error('O pedido precisa ter pelo menos 1 item');
    }
  };

  const calcularSubtotal = () => {
    return itens.reduce((soma, item) => {
      const qtd = item.quantidade || 1;
      const preco = item.preco_unitario || 0;
      const desc = item.desconto_item || 0;
      return soma + ((qtd * preco) - desc);
    }, 0);
  };

  const calcularTotal = () => {
    return calcularSubtotal() - (descontoGeral || 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // 1. Atualizar pedido
      const { error: pedidoError } = await supabase
        .from('pedidos')
        .update({
          lead_nome: nome,
          lead_email: email,
          lead_telefone: telefone,
          lead_cpf: cpf,
          endereco_cep: endereco.cep || null,
          endereco_logradouro: endereco.logradouro || null,
          endereco_numero: endereco.numero || null,
          endereco_complemento: endereco.complemento || null,
          endereco_bairro: endereco.bairro || null,
          endereco_cidade: endereco.cidade || null,
          endereco_estado: endereco.estado || null,
          endereco_pais: endereco.pais || 'Brasil',
          desconto_geral: descontoGeral || 0,
          forma_pagto: `${formaPagamento} - ${parcelas}x`,
          numero_parcelas: parseInt(parcelas),
          status_pedido: statusPedido,
          status_pagamento: statusPagamento,
          observacoes_gerais: obsGerais,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (pedidoError) throw pedidoError;

      // 2. Deletar itens antigos
      const { error: deleteError } = await supabase
        .from('pedidos_itens')
        .delete()
        .eq('pedido_id', id);

      if (deleteError) throw deleteError;

      // 3. Inserir itens novos/atualizados
      const itensParaInserir = itens.map(item => {
        const produto = produtos.find(p => p.id === item.produto_id);
        
        return {
          cliente_id: 2,
          empresa_id: 2,
          pedido_id: id,
          produto_id: item.produto_id,
          produto_nome: item.produto_nome,
          codigo_externo: produto?.codigo_externo || null,
          quantidade: item.quantidade || 1,
          preco_unitario: item.preco_unitario || 0,
          desconto_item: item.desconto_item || 0,
          preco_total: ((item.quantidade || 1) * (item.preco_unitario || 0)) - (item.desconto_item || 0),
          observacoes: item.observacoes
        };
      });

      const { error: itensError } = await supabase
        .from('pedidos_itens')
        .insert(itensParaInserir);

      if (itensError) throw itensError;

      toast.success('Pedido atualizado com sucesso!');
      navigate('/admin/pedidos');
    } catch (error: any) {
      console.error('Erro ao atualizar pedido:', error);
      toast.error('Erro ao atualizar pedido: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando pedido...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Pedido não encontrado</h2>
            <Button onClick={() => navigate('/admin/pedidos')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para pedidos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (pedido.status_pedido === 'cancelado') {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header title="Editar Pedido" />
          <main className="p-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-destructive/10 border border-destructive rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold text-destructive mb-4">Pedido Cancelado</h2>
                <p className="text-muted-foreground mb-6">Este pedido está cancelado e não pode ser editado.</p>
                <Button onClick={() => navigate('/admin/pedidos')}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para pedidos
                </Button>
              </div>
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
        <Header title={`Editar Pedido #${pedido.codigo}`} />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => navigate('/admin/pedidos')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                pedido.status_pedido === 'pago' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {pedido.status_pedido}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="bg-card border rounded-lg p-6 space-y-8">
              {/* DADOS DO CLIENTE */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Dados do Cliente</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input 
                      id="nome"
                      value={nome} 
                      onChange={(e) => setNome(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email"
                      type="email"
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input 
                      id="telefone"
                      value={telefone} 
                      onChange={(e) => setTelefone(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input 
                      id="cpf"
                      value={cpf} 
                      onChange={(e) => setCpf(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* ENDEREÇO */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Endereço</h2>
                <EnderecoForm endereco={endereco} onChange={setEndereco} />
              </div>

              {/* PRODUTOS/ITENS */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Produtos/Serviços</h2>
                <div className="space-y-4">
                  {itens.map((item, index) => (
                    <ItemPedido
                      key={index}
                      item={item}
                      index={index}
                      produtos={produtos}
                      onChange={handleItemChange}
                      onRemove={removerItem}
                    />
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={adicionarItem}
                    className="w-full"
                  >
                    + Adicionar Produto
                  </Button>
                </div>
              </div>

              {/* RESUMO E PAGAMENTO */}
              <div className="space-y-4 border-t pt-6">
                <h2 className="text-xl font-semibold">Resumo e Pagamento</h2>
                
                <div className="bg-muted/50 rounded-lg p-4 space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">R$ {calcularSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <Label>Desconto Geral:</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={descontoGeral}
                      onChange={(e) => setDescontoGeral(parseFloat(e.target.value) || 0)}
                      className="w-32 text-right"
                    />
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>TOTAL:</span>
                    <span className="text-green-600">R$ {calcularTotal().toFixed(2)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Forma de Pagamento *</Label>
                    <Select value={formaPagamento} onValueChange={setFormaPagamento} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pix">Pix</SelectItem>
                        <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                        <SelectItem value="Débito">Débito</SelectItem>
                        <SelectItem value="Crédito">Crédito</SelectItem>
                        <SelectItem value="Misto">Misto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Parcelas</Label>
                    <Select value={parcelas} onValueChange={setParcelas}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1x</SelectItem>
                        <SelectItem value="2">2x</SelectItem>
                        <SelectItem value="3">3x</SelectItem>
                        <SelectItem value="4">4x</SelectItem>
                        <SelectItem value="6">6x</SelectItem>
                        <SelectItem value="12">12x</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Status do Pedido *</Label>
                    <Select value={statusPedido} onValueChange={setStatusPedido} required>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="pago">Pago</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Status do Pagamento *</Label>
                    <Select value={statusPagamento} onValueChange={setStatusPagamento} required>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="approved">Aprovado</SelectItem>
                        <SelectItem value="rejected">Rejeitado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Observações Gerais</Label>
                  <Textarea 
                    value={obsGerais} 
                    onChange={(e) => setObsGerais(e.target.value)} 
                    placeholder="Observações gerais do pedido (opcional)"
                    rows={3}
                  />
                </div>
              </div>

              {/* BOTÕES */}
              <div className="flex gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/admin/pedidos')} 
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={saving} 
                  className="flex-1 bg-[#97624b] hover:bg-[#7d5340]"
                >
                  {saving ? (
                    <>Salvando...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
