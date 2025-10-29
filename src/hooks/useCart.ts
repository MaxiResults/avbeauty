import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const CART_STORAGE_KEY = 'carrinho_nicole_guedes';

export interface CartItem {
  produto_id: number;
  nome: string;
  preco: number;
  preco_original: number;
  quantidade: number;
  imagem: string;
  categoria: string;
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  // Carregar carrinho do localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const data = JSON.parse(savedCart);
        setCart(data.carrinho || []);
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
      }
    }
  }, []);

  // Salvar carrinho no localStorage
  const saveCart = (newCart: CartItem[]) => {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({
        carrinho: newCart,
        updated_at: new Date().toISOString(),
      })
    );
    setCart(newCart);
  };

  // Adicionar ao carrinho
  const addToCart = (produto: any) => {
    const newCart = [...cart];
    const existingIndex = newCart.findIndex(
      (item) => item.produto_id === produto.id
    );

    if (existingIndex >= 0) {
      newCart[existingIndex].quantidade++;
      toast({
        title: 'Quantidade atualizada',
        description: `${produto.nome} agora tem ${newCart[existingIndex].quantidade} unidade(s) no carrinho.`,
      });
    } else {
      newCart.push({
        produto_id: produto.id,
        nome: produto.nome,
        preco: produto.preco_promocional || produto.preco_padrao,
        preco_original: produto.preco_padrao,
        quantidade: 1,
        imagem: produto.imagem_principal || '',
        categoria: produto.categoria || '',
      });
      toast({
        title: '✅ Produto adicionado',
        description: `${produto.nome} foi adicionado ao carrinho!`,
      });
    }

    saveCart(newCart);
  };

  // Remover do carrinho
  const removeFromCart = (produto_id: number) => {
    const newCart = cart.filter((item) => item.produto_id !== produto_id);
    saveCart(newCart);
    toast({
      title: 'Produto removido',
      description: 'O produto foi removido do carrinho.',
    });
  };

  // Atualizar quantidade
  const updateQuantity = (produto_id: number, quantidade: number) => {
    if (quantidade < 1) return;

    const newCart = cart.map((item) =>
      item.produto_id === produto_id ? { ...item, quantidade } : item
    );
    saveCart(newCart);
  };

  // Limpar carrinho
  const clearCart = () => {
    localStorage.removeItem(CART_STORAGE_KEY);
    setCart([]);
  };

  // Calcular totais
  const subtotal = cart.reduce(
    (sum, item) => sum + item.preco * item.quantidade,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantidade, 0);

  return {
    cart,
    cartCount,
    subtotal,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
}
