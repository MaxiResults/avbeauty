import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { CheckoutForm } from '@/components/loja/CheckoutForm';
import { OrderSummary } from '@/components/loja/OrderSummary';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { gerarLinkInfinitePay, gerarOrderNsu, realParaCentavos } from '@/utils/infinitepay';

export default function Checkout() {
  const { cart, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  if (cart.length === 0) {
    navigate('/black-friday');
    return null;
  }

  const handleSubmit = async (formData: any) => {
    setIsProcessing(true);

    try {
      // Validações
      if (!formData.nome || !formData.email || !formData.telefone || !formData.cpf) {
        throw new Error('Preencha todos os campos obrigatórios');
      }

      if (cart.length === 0) {
        throw new Error('Carrinho vazio');
      }

      // 1. Salvar/atualizar lead
      const { data: leadExist } = await supabase
        .from('Leads_Cadastro')
        .select('id')
        .eq('email', formData.email)
        .eq('cliente_id', 3)
        .eq('empresa_id', 3)
        .single();

      let leadId;

      if (leadExist) {
        await supabase
          .from('Leads_Cadastro')
          .update({
            nome: formData.nome,
            telefone: `55${formData.telefone.replace(/\D/g, '')}`,
            observacoes: `CPF: ${formData.cpf}`,
            status: 'aguardando_pagamento',
            empresa_id: 3
          })
          .eq('id', leadExist.id);
        
        leadId = leadExist.id;
      } else {
        const { data: novoLead, error: leadError } = await supabase
          .from('Leads_Cadastro')
          .insert({
            cliente_id: 3,
            empresa_id: 3,
            nome: formData.nome,
            email: formData.email,
            telefone: `55${formData.telefone.replace(/\D/g, '')}`,
            interesse: cart.map(item => item.nome).join(', '),
            observacoes: `CPF: ${formData.cpf}`,
            status: 'aguardando_pagamento',
            canal_origem: 'Black Friday',
            origem_url: window.location.href
          })
          .select('id')
          .single();

        if (leadError) throw leadError;
        leadId = novoLead.id;
      }

      // 2. Gerar order_nsu único
      const orderNsu = gerarOrderNsu();

      // 3. Calcular total
      const valorTotal = subtotal;

      // 4. Salvar dados no sessionStorage
      const dadosCheckout = {
        leadId,
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        cpf: formData.cpf,
        produtos: cart.map(p => ({
          produto_id: p.produto_id,
          produto_nome: p.nome,
          quantidade: p.quantidade,
          preco_unitario: p.preco
        })),
        valorTotal,
        orderNsu
      };

      sessionStorage.setItem('checkout_dados', JSON.stringify(dadosCheckout));

      // 5. Preparar itens para InfinitePay
      const items = cart.map(produto => ({
        name: produto.nome,
        price: realParaCentavos(produto.preco),
        quantity: produto.quantidade
      }));

      // 6. URL de redirecionamento
      const redirectUrl = `${import.meta.env.VITE_SITE_URL}/checkout/confirmacao`;

      // 7. Gerar link InfinitePay
      const linkPagamento = gerarLinkInfinitePay({
        items,
        orderNsu,
        redirectUrl,
        customerName: formData.nome,
        customerEmail: formData.email,
        customerCellphone: `55${formData.telefone.replace(/\D/g, '')}`
      });

      // 8. Limpar carrinho e redirecionar
      clearCart();
      window.location.href = linkPagamento;

    } catch (error: any) {
      console.error('Erro ao criar pedido:', error);
      toast({
        title: 'Erro ao processar pedido',
        description: error.message || 'Tente novamente.',
        variant: 'destructive',
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f0e9]">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#292823] flex items-center gap-2">
              Checkout
              <span className="text-success">🔒</span>
            </h1>
            <button
              onClick={() => navigate('/black-friday')}
              className="text-[#97624b] hover:underline"
            >
              ← Voltar às ofertas
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Formulário (60%) */}
          <div className="lg:col-span-3">
            <CheckoutForm onSubmit={handleSubmit} isProcessing={isProcessing} />
          </div>

          {/* Resumo (35%) */}
          <div className="lg:col-span-2">
            <OrderSummary />
          </div>
        </div>
      </main>

      {/* Loading Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#97624b] mx-auto mb-4" />
            <p className="text-lg font-semibold text-[#292823]">
              Processando seu pedido...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
