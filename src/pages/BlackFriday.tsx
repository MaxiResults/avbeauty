import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { supabase as cloud } from '@/integrations/supabase/client';
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

  // Verificar se tem link de acesso (apenas para tracking)
  useEffect(() => {
    const checkAccess = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('access');

      // Se não tem token, permite acesso normalmente
      if (!accessToken) {
        setAccessChecked(true);
        return;
      }

      // Se tem token, tenta validar e registrar acesso
      try {
        const { data: lead, error } = await supabase
          .from('leads_cadastro_teaser')
          .select('*')
          .eq('link_exclusivo', accessToken)
          .eq('cliente_id', 2)
          .eq('empresa_id', 2)
          .maybeSingle();

        if (lead && !error) {
          // Token válido! Registrar acesso
          const dataAtual = new Date().toISOString();
          await supabase
            .from('leads_cadastro_teaser')
            .update({
              data_primeiro_acesso: lead.data_primeiro_acesso || dataAtual,
              numero_acessos: (lead.numero_acessos || 0) + 1,
            })
            .eq('link_exclusivo', accessToken);

          setNomeCliente(lead.nome);
          toast.success(`Bem-vindo(a), ${lead.nome}! 🎉`);
        }
      } catch (error) {
        console.error('Erro ao validar acesso:', error);
      }
      
      // Permite acesso independente do resultado
      setAccessChecked(true);
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
      // Buscar via Edge Function (banco EXTERNO, ignora RLS)
      const { data, error } = await cloud.functions.invoke('get-produtos-public');
      if (error) throw error;
      const lista = (data as any)?.produtos ?? [];
      setProdutos(lista);
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
