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
import { toast } from 'sonner';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface Campanha {
  id: number;
  nome_campanha: string;
  investimento_total: number;
}

export default function NovoPedidoManual() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [campanhaId, setCampanhaId] = useState('');
  const [valorTotal, setValorTotal] = useState(0);
  const [formaPagamento, setFormaPagamento] = useState('');
  const [parcelas, setParcelas] = useState('1');
  const [pagamentoConfirmado, setPagamentoConfirmado] = useState(false);
  const [obs, setObs] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [endereco, setEndereco] = useState({
    cep: '', logradouro: '', numero: '', complemento: '',
    bairro: '', cidade: '', estado: '', pais: 'Brasil'
  });

  useEffect(() => {
    carregarCampanhas();
  }, []);

  const carregarCampanhas = async () => {
    try {
      const { data, error } = await supabase
        .from('campanhas')
        .select('id, nome_campanha, investimento_total')
        .eq('cliente_id', 2)
        .eq('empresa_id', 2)
        .eq('ativo', true)
        .order('nome_campanha');

      if (error) throw error;
      setCampanhas(data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar campanhas: ' + error.message);
    }
  };

  const handleCampanhaChange = (id: string) => {
    setCampanhaId(id);
    const camp = campanhas.find(c => c.id.toString() === id);
    if (camp) setValorTotal(camp.investimento_total);
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
        .eq('cliente_id', 2)
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
            cliente_id: 2,
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
      const { data: pedidoData, error: pedidoError } = await supabase
        .from('pedidos')
        .insert({
          cliente_id: 2,
          empresa_id: 2,
          campanha_id: campanhaId ? parseInt(campanhaId) : null,
          lead_nome: nome,
          lead_email: email,
          lead_telefone: telefone,
          lead_cpf: cpf || null,
          endereco_cep: endereco.cep || null,
          endereco_logradouro: endereco.logradouro || null,
          endereco_numero: endereco.numero || null,
          endereco_complemento: endereco.complemento || null,
          endereco_bairro: endereco.bairro || null,
          endereco_cidade: endereco.cidade || null,
          endereco_estado: endereco.estado || null,
          endereco_pais: 'Brasil',
          valor_total: valorTotal,
          status_pagamento: pagamentoConfirmado ? 'pago' : 'pendente',
          forma_pagto: formaPagamento,
          numero_parcelas: parseInt(parcelas),
          origem: 'presencial',
          observacoes_internas: obs || null
        })
        .select('codigo')
        .single();

      if (pedidoError) throw pedidoError;

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

      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <Header title="Novo Pedido Presencial" />

        <main className="flex-1 overflow-y-auto p-8">
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
                        onChange={(e) => setTelefone(e.target.value)}
                        placeholder="(11) 98765-4321"
                        required
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
                <h2 className="text-xl font-semibold mb-4">Dados do Pedido</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="campanha">Pacote *</Label>
                    <Select value={campanhaId} onValueChange={handleCampanhaChange} required>
                      <SelectTrigger id="campanha">
                        <SelectValue placeholder="Selecione o Pacote" />
                      </SelectTrigger>
                      <SelectContent>
                        {campanhas.map(c => (
                          <SelectItem key={c.id} value={c.id.toString()}>
                            {c.nome_campanha} - R$ {c.investimento_total.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
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

                    <div>
                      <Label>Valor Total</Label>
                      <div className="px-4 py-2 border rounded-lg bg-muted flex items-center justify-center font-semibold h-10">
                        R$ {valorTotal.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pagamentoConfirmado"
                      checked={pagamentoConfirmado}
                      onCheckedChange={(checked) => setPagamentoConfirmado(checked === true)}
                    />
                    <Label htmlFor="pagamentoConfirmado" className="cursor-pointer">
                      Pagamento já confirmado
                    </Label>
                  </div>

                  <div>
                    <Label htmlFor="obs">Observações Internas</Label>
                    <Textarea
                      id="obs"
                      value={obs}
                      onChange={(e) => setObs(e.target.value)}
                      placeholder="Observações internas (opcional)"
                      rows={3}
                    />
                  </div>
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
