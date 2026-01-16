import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Sidebar } from '@/components/admin/Sidebar';
import { Header } from '@/components/admin/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import EnderecoForm from '@/components/EnderecoForm';
import ItemPedido from '@/components/pedidos/ItemPedido';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Plus } from 'lucide-react';
import { maskPhone, onlyNumbers } from '@/utils/formatadores';
import { APP_CLIENTE_ID, APP_EMPRESA_ID } from '@/config/app.config';

interface Produto {
  id: number;
  nome: string;
  preco_padrao: number;
  preco_promocional: number | null;
  codigo_externo: string | null;
}

interface ItemPedidoData {
  produto_id: number | null;
  produto_nome: string;
  quantidade: number;
  preco_unitario: number;
  desconto_item: number;
  observacoes: string;
}

export default function NovoPedidoManual() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('');
  const [parcelas, setParcelas] = useState('1');
  const [pagamentoConfirmado, setPagamentoConfirmado] = useState(false);
  const [obsGerais, setObsGerais] = useState('');
  const [descontoGeral, setDescontoGeral] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [itens, setItens] = useState<ItemPedidoData[]>([{
    produto_id: null,
    produto_nome: '',
    quantidade: 1,
    preco_unitario: 0,
    desconto_item: 0,
    observacoes: ''
  }]);

  const [endereco, setEndereco] = useState({
    cep: '', logradouro: '', numero: '', complemento: '',
    bairro: '', cidade: '', estado: '', pais: 'Brasil'
  });

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('id, nome, preco_padrao, preco_promocional, codigo_externo')
        .eq('cliente_id', APP_CLIENTE_ID)
        .eq('status', 'ativo')
        .order('nome');

      if (error) throw error;
      setProdutos(data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar produtos: ' + error.message);
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
    setLoading(true);

    try {
      // Buscar ou criar lead
      const { data: leadExist, error: leadError } = await supabase
        .from('Leads_Cadastro')
        .select('id')
        .eq('email', email)
        .eq('Cliente_ID', APP_CLIENTE_ID)
        .eq('Empresa_ID', APP_EMPRESA_ID)
        .maybeSingle();

      if (leadError && leadError.code !== 'PGRST116') throw leadError;

      let leadId;

      if (leadExist) {
        const { error: updateError } = await supabase
          .from('Leads_Cadastro')
          .update({
            nome: nome,
            telefone: telefone,
            observacoes: cpf ? `CPF: ${cpf}` : null,
            interesse: 'pedido-presencial',
            status: 'convertido'
          })
          .eq('id', leadExist.id);

        if (updateError) throw updateError;
        leadId = leadExist.id;
      } else {
        const { data: novo, error: insertError } = await supabase
          .from('Leads_Cadastro')
          .insert({
            Cliente_ID: APP_CLIENTE_ID,
            Empresa_ID: APP_EMPRESA_ID, 
            nome: nome,
            email: email,
            telefone: telefone,
            observacoes: cpf ? `CPF: ${cpf}` : null,
            interesse: 'pedido-presencial',
            canal_origem: 'presencial',
            status: 'convertido',
            origem_url: window.location.origin
          })
          .select('id')
          .single();

        if (insertError) throw insertError;
        leadId = novo.id;
      }

      // Criar pedido
      // Normalizar telefone com 55
      const telefoneNormalizado = onlyNumbers(telefone);
      const telefoneComDDI = telefoneNormalizado.startsWith('55') ? telefoneNormalizado : '55' + telefoneNormalizado;

      const { data: pedidoData, error: pedidoError } = await supabase
        .from('pedidos')
        .insert({
          cliente_id: APP_CLIENTE_ID,
          empresa_id: APP_EMPRESA_ID,
          lead_id: leadId,
          lead_nome: nome,
          lead_email: email,
          lead_telefone: telefoneComDDI,
          lead_cpf: cpf || null,
          endereco_cep: endereco.cep || null,
          endereco_logradouro: endereco.logradouro || null,
          endereco_numero: endereco.numero || null,
          endereco_complemento: endereco.complemento || null,
          endereco_bairro: endereco.bairro || null,
          endereco_cidade: endereco.cidade || null,
          endereco_estado: endereco.estado || null,
          endereco_pais: 'Brasil',
          desconto_geral: descontoGeral || 0,
          forma_pagto: `${formaPagamento} - ${parcelas}x`,
          numero_parcelas: parseInt(parcelas),
          status_pedido: pagamentoConfirmado ? 'pago' : 'pendente',
          status_pagamento: pagamentoConfirmado ? 'approved' : 'pending',
          observacoes_gerais: obsGerais || null
        })
        .select('id, codigo')
        .single();

      if (pedidoError) throw pedidoError;

      // Criar itens do pedido
      const itensParaInserir = itens.map(item => {
        // Buscar produto completo para pegar codigo_externo
        const produto = produtos.find(p => p.id === item.produto_id);
        
        return {
          cliente_id: APP_CLIENTE_ID,
          empresa_id: APP_EMPRESA_ID,
          pedido_id: pedidoData.id,
          produto_id: item.produto_id,
          produto_nome: item.produto_nome,
          codigo_externo: produto?.codigo_externo || null,
          quantidade: item.quantidade || 1,
          preco_unitario: item.preco_unitario || 0,
          desconto_item: item.desconto_item || 0,
          preco_total: ((item.quantidade || 1) * (item.preco_unitario || 0)) - (item.desconto_item || 0),
          observacoes: item.observacoes || null
        };
      });

      const { error: itensError } = await supabase
        .from('pedidos_itens')
        .insert(itensParaInserir);

      if (itensError) throw itensError;

      toast.success('Pedido criado com sucesso!');
      navigate('/admin/pedidos');
    } catch (error: any) {
      console.error('Erro ao criar pedido:', error);
      toast.error('Erro ao criar pedido: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Novo Pedido Presencial" />

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 lg:ml-64 min-h-screen">
          <div className="max-w-3xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/pedidos')}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>

            <h1 className="text-3xl font-bold mb-6">Novo Pedido Presencial</h1>

            <form onSubmit={handleSubmit} className="bg-card rounded-lg shadow p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Dados do Cliente</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Nome Completo"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@exemplo.com"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="telefone">Telefone *</Label>
                      <Input
                        id="telefone"
                        type="text"
                        value={telefone}
                        onChange={(e) => setTelefone(maskPhone(e.target.value))}
                        placeholder="(11) 98765-4321"
                        required
                        maxLength={15}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cpf">CPF</Label>
                      <Input
                        id="cpf"
                        type="text"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        placeholder="000.000.000-00"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <EnderecoForm endereco={endereco} onChange={setEndereco} />

              <div>
                <h2 className="text-xl font-semibold mb-4">Produtos/Serviços</h2>
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
                    className="w-full border-dashed border-2"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Produto
                  </Button>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
                
                <div className="bg-muted/50 rounded-lg p-4 space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">R$ {calcularSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <Label htmlFor="descontoGeral">Desconto Geral:</Label>
                    <Input
                      id="descontoGeral"
                      type="number"
                      step="0.01"
                      min="0"
                      value={descontoGeral}
                      onChange={(e) => setDescontoGeral(parseFloat(e.target.value) || 0)}
                      className="w-32 text-right"
                      placeholder="R$ 0,00"
                    />
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>TOTAL:</span>
                    <span className="text-primary">R$ {calcularTotal().toFixed(2)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor="formaPagamento">Forma de Pagamento *</Label>
                    <Select value={formaPagamento} onValueChange={setFormaPagamento} required>
                      <SelectTrigger id="formaPagamento">
                        <SelectValue placeholder="Selecione" />
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

                  <div>
                    <Label htmlFor="parcelas">Parcelas</Label>
                    <Select value={parcelas} onValueChange={setParcelas}>
                      <SelectTrigger id="parcelas">
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

                  <div className="flex items-center">
                    <div className="flex items-center space-x-2 pt-6">
                      <Checkbox
                        id="pagamentoConfirmado"
                        checked={pagamentoConfirmado}
                        onCheckedChange={(checked) => setPagamentoConfirmado(checked === true)}
                      />
                      <Label htmlFor="pagamentoConfirmado" className="cursor-pointer">
                        Pago
                      </Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="obsGerais">Observações Gerais</Label>
                  <Textarea
                    id="obsGerais"
                    value={obsGerais}
                    onChange={(e) => setObsGerais(e.target.value)}
                    placeholder="Observações gerais do pedido (opcional)"
                    rows={2}
                  />
                </div>
              </div>

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
                  disabled={loading}
                  className="flex-1"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? 'Criando...' : 'Criar Pedido'}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
