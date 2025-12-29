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

      console.log('🔧 Iniciando processo de checkout...');

      // Buscar dados completos dos produtos (incluindo codigo_externo)
      const produtosIds = cart.map(item => item.produto_id);
      const { data: produtosCompletos } = await supabase
        .from('produtos')
        .select('id, nome, codigo_externo')
        .in('id', produtosIds)
        .eq('cliente_id', 3)
        .eq('empresa_id', 3);

      // Mapear produtos com codigo_externo
      const produtosComCodigo = cart.map(item => {
        const produtoCompleto = produtosCompletos?.find(p => p.id === item.produto_id);
        return {
          ...item,
          codigo_externo: produtoCompleto?.codigo_externo || null
        };
      });

      console.log('🛒 Produtos com código externo:', produtosComCodigo);

      // 1. Verificar se lead existe (com tratamento de erro melhorado)
      let leadId;
      
      try {
        const { data: leadExist, error: leadQueryError } = await supabase
          .from('Leads_Cadastro')
          .select('id')
          .eq('email', formData.email) // ✅ CORRETO: email (não Email_Lead)
          .eq('Cliente_ID', 3)
          .eq('Empresa_ID', 3)
          .maybeSingle();

        if (leadQueryError && leadQueryError.code !== 'PGRST116') {
          console.error('Erro ao buscar lead:', leadQueryError);
          throw new Error('Erro ao verificar cadastro');
        }

        // 2. Se lead existe, atualizar
        if (leadExist) {
          console.log('📝 Lead existente encontrado, atualizando...');
          const { error: updateError } = await supabase
            .from('Leads_Cadastro')
            .update({
              nome: formData.nome,
              telefone: `55${formData.telefone.replace(/\D/g, '')}`,
              cpf: formData.cpf,
              status: 'aguardando_pagamento',
              Empresa_ID: 3,
              Endereco_CEP: formData.endereco.cep || null,
              Endereco_Logradouro: formData.endereco.logradouro || null,
              Endereco_Numero: formData.endereco.numero || null,
              Endereco_Complemento: formData.endereco.complemento || null,
              Endereco_Bairro: formData.endereco.bairro || null,
              Endereco_Cidade: formData.endereco.cidade || null,
              Endereco_Estado: formData.endereco.estado || null,
              Endereco_Pais: formData.endereco.pais || 'Brasil',
              updated_at: new Date().toISOString()
            })
            .eq('id', leadExist.id);

          if (updateError) {
            console.error('Erro ao atualizar lead:', updateError);
            throw new Error('Erro ao atualizar cadastro');
          }
          
          leadId = leadExist.id;
        } else {
          // 3. Se lead não existe, criar novo
          console.log('📝 Criando novo lead...');
          const { data: novoLead, error: insertError } = await supabase
            .from('Leads_Cadastro')
            .insert({
              Cliente_ID: 3,
              Empresa_ID: 3,
              nome: formData.nome,
              email: formData.email,
              telefone: `55${formData.telefone.replace(/\D/g, '')}`,
              cpf: formData.cpf,
              interesse: cart.map(item => item.nome).join(', '),
              status: 'aguardando_pagamento',
              canal_origem: 'Black Friday',
              origem_url: window.location.href,
              Endereco_CEP: formData.endereco.cep || null,
              Endereco_Logradouro: formData.endereco.logradouro || null,
              Endereco_Numero: formData.endereco.numero || null,
              Endereco_Complemento: formData.endereco.complemento || null,
              Endereco_Bairro: formData.endereco.bairro || null,
              Endereco_Cidade: formData.endereco.cidade || null,
              Endereco_Estado: formData.endereco.estado || null,
              Endereco_Pais: formData.endereco.pais || 'Brasil',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select('id')
            .single();

          if (insertError) {
            console.error('Erro ao criar lead:', insertError);
            
            if (insertError.code === '42501') {
              throw new Error('Permissão negada. Verifique as políticas de segurança.');
            }
            
            throw new Error(`Erro ao criar cadastro: ${insertError.message}`);
          }
          
          leadId = novoLead.id;
        }

        console.log('✅ Lead processado com ID:', leadId);

        // 4. Gerar order_nsu único
        const orderNsu = gerarOrderNsu();

        // 5. Calcular total SEM desconto (valor integral)
        const valorTotal = subtotal;

        // 6. Salvar dados no sessionStorage
        const dadosCheckout = {
          leadId,
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          cpf: formData.cpf,
          formaPagamento: formData.formaPagamento,
          endereco: {
            cep: formData.endereco.cep || null,
            logradouro: formData.endereco.logradouro || null,
            numero: formData.endereco.numero || null,
            complemento: formData.endereco.complemento || null,
            bairro: formData.endereco.bairro || null,
            cidade: formData.endereco.cidade || null,
            estado: formData.endereco.estado || null
          },
          produtos: produtosComCodigo.map(p => ({
            produto_id: p.produto_id,
            produto_nome: p.nome,
            codigo_externo: p.codigo_externo,
            quantidade: p.quantidade,
            preco_unitario: p.preco,
            preco_final: p.preco
          })),
          valorTotal,
          orderNsu
        };

        sessionStorage.setItem('checkout_dados', JSON.stringify(dadosCheckout));
        console.log('💾 Dados salvos no sessionStorage');

        // 7. Preparar itens para InfinitePay (valor integral, sem desconto)
        const items = cart.map(produto => ({
          name: produto.nome,
          price: realParaCentavos(produto.preco),
          quantity: produto.quantidade
        }));

        console.log('🛒 Itens para pagamento:', items);

        // 8. URL de redirecionamento
        const redirectUrl = `${window.location.origin}/checkout/confirmacao`;

        // 9. Gerar link InfinitePay
        const linkPagamento = gerarLinkInfinitePay({
          items,
          orderNsu,
          redirectUrl,
          customerName: formData.nome,
          customerEmail: formData.email,
          customerCellphone: `55${formData.telefone.replace(/\D/g, '')}`,
          addressCep: formData.endereco.cep?.replace(/\D/g, ''),
          addressComplement: formData.endereco.complemento,
          addressNumber: formData.endereco.numero
        });

        console.log('🔗 Link de pagamento gerado');

        // 10. Limpar carrinho e redirecionar
        clearCart();
        console.log('🔄 Redirecionando para pagamento...');
        window.location.href = linkPagamento;

      } catch (dbError: any) {
        console.error('❌ Erro no banco de dados:', dbError);
        throw dbError;
      }

    } catch (error: any) {
      console.error('❌ Erro completo ao criar pedido:', error);
      toast({
        title: 'Erro ao processar pedido',
        description: error.message || 'Tente novamente em alguns instantes.',
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
            <p className="text-sm text-gray-600 mt-2">
              Aguarde, não feche esta página.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
