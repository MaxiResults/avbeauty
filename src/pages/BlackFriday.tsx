import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Hero } from '@/components/loja/Hero';
import { Contador } from '@/components/loja/Contador';
import { ComoFunciona } from '@/components/loja/ComoFunciona';
import { ProductGrid } from '@/components/loja/ProductGrid';
import { CartDrawer } from '@/components/loja/CartDrawer';
import Footer from '@/components/Footer';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Toaster } from '@/components/ui/toaster';
import { toast } from 'sonner';

export default function BlackFriday() {
  const navigate = useNavigate();
  const { cartCount, isCartOpen, setIsCartOpen } = useCart();
  const [produtos, setProdutos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nomeCliente, setNomeCliente] = useState('');
  const [accessChecked, setAccessChecked] = useState(false);

  // Validar acesso exclusivo
  useEffect(() => {
    const checkAccess = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('access');

      if (!accessToken) {
        toast.error('⚠️ Acesso exclusivo apenas para cadastrados');
        setTimeout(() => {
          navigate('/cadastro-black-friday');
        }, 2000);
        return;
      }

      try {
        // Validar token no Supabase
        const { data: lead, error } = await supabase
          .from('Leads_Cadastro_Teaser')
          .select('*')
          .eq('Link_Exclusivo', accessToken)
          .eq('Cliente_ID', 2)
          .eq('Empresa_ID', 2)
          .maybeSingle();

        if (!lead || error) {
          toast.error('❌ Link inválido ou expirado');
          setTimeout(() => {
            navigate('/cadastro-black-friday');
          }, 2000);
          return;
        }

        // Token válido! Registrar acesso
        const dataAtual = new Date().toISOString();
        await supabase
          .from('Leads_Cadastro_Teaser')
          .update({
            Data_Primeiro_Acesso: lead.Data_Primeiro_Acesso || dataAtual,
            Numero_Acessos: (lead.Numero_Acessos || 0) + 1,
          })
          .eq('Link_Exclusivo', accessToken);

        setNomeCliente(lead.Nome);
        toast.success(`Bem-vindo(a), ${lead.Nome}! 🎉`);
        setAccessChecked(true);
      } catch (error) {
        console.error('Erro ao validar acesso:', error);
        toast.error('Erro ao validar acesso. Tente novamente.');
        setTimeout(() => {
          navigate('/cadastro-black-friday');
        }, 2000);
      }
    };

    checkAccess();
  }, [navigate]);

  useEffect(() => {
    if (accessChecked) {
      loadProdutos();
    }
  }, [accessChecked]);

  const loadProdutos = async () => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select(`
          id,
          nome,
          slug,
          descricao_curta,
          categoria,
          preco_padrao,
          preco_promocional,
          imagem_principal,
          imagem_galeria,
          controla_estoque,
          vagas_vendidas,
          ordem_exibicao
        `)
        .eq('cliente_id', 2)
        .eq('empresa_id', 2)
        .eq('status', 'ativo')
        .order('ordem_exibicao', { ascending: true });

      if (error) throw error;
      setProdutos(data || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {!accessChecked ? (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#FFD700] border-t-transparent mx-auto" />
            <p className="text-white text-xl">Validando seu acesso...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Header Fixo */}
          <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-40">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <img 
                  src="/src/assets/logo.png" 
                  alt="Nicole Guedes Odonto" 
                  className="h-10"
                />
              </Link>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:bg-accent/10 rounded-lg transition-colors"
                aria-label={`Carrinho com ${cartCount} itens`}
              >
                <ShoppingCart className="w-6 h-6 text-primary" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </header>

          {/* Conteúdo Principal */}
          <main className="pt-16">
            <Hero />
            <Contador />
            <ComoFunciona />
            <ProductGrid produtos={produtos} isLoading={isLoading} />
          </main>

          <Footer />
          <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
      )}
      <Toaster />
    </div>
  );
}
