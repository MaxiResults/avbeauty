import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

export default function BlackFriday() {
  const { cartCount, isCartOpen, setIsCartOpen } = useCart();
  const [produtos, setProdutos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProdutos();
  }, []);

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
          galeria_imagens,
          controlar_estoque,
          vagas_disponiveis,
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
      <Toaster />
    </div>
  );
}
