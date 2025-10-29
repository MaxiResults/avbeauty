import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { CheckoutForm } from '@/components/loja/CheckoutForm';
import { OrderSummary } from '@/components/loja/OrderSummary';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

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
      // Gerar código do pedido
      const codigo = `BF2024-${Date.now().toString().slice(-6)}`;

      // Calcular valores
      const desconto = formData.formaPagamento === 'pix' ? subtotal * 0.05 : 0;
      const valorTotal = subtotal - desconto;

      // TODO: Integração Mercado Pago será adicionada aqui
      /*
      INSTRUÇÕES PARA INTEGRAÇÃO MERCADO PAGO:
      
      1. Adicionar credenciais no arquivo de configuração
      2. Criar preferência de pagamento com os dados do carrinho
      3. Salvar Payment_ID e Link_Pagamento no pedido
      4. Redirecionar cliente para o link de pagamento
      
      Por enquanto: criando pedido e redirecionando para confirmação
      */

      // Criar pedido no Supabase
      const { data: pedido, error: pedidoError } = await supabase
        .from('Leads_Cadastro')
        .insert({
          nome: formData.nome,
          email: formData.email,
          telefone: `55${formData.telefone.replace(/\D/g, '')}`,
          interesse: cart.map(item => item.nome).join(', '),
          observacoes: `Pedido: ${codigo}\nCPF: ${formData.cpf}\nForma de Pagamento: ${formData.formaPagamento}\nValor Total: R$ ${valorTotal.toFixed(2)}`,
          status: 'novo',
          cliente_id: 2,
          canal_origem: 'Black Friday',
          origem_url: window.location.href,
        })
        .select()
        .single();

      if (pedidoError) throw pedidoError;

      // Limpar carrinho
      clearCart();

      // Redirecionar para página de confirmação
      navigate(`/pedido/${codigo}`, {
        state: {
          pedido: {
            codigo,
            nome: formData.nome,
            email: formData.email,
            telefone: formData.telefone,
            formaPagamento: formData.formaPagamento,
            itens: cart,
            subtotal,
            desconto,
            valorTotal,
          },
        },
      });

      toast({
        title: '✅ Pedido criado com sucesso!',
        description: 'Você será redirecionado para a página de confirmação.',
      });
    } catch (error: any) {
      console.error('Erro ao criar pedido:', error);
      toast({
        title: 'Erro ao processar pedido',
        description: error.message || 'Tente novamente.',
        variant: 'destructive',
      });
    } finally {
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
