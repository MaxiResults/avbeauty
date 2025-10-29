import { Button } from '@/components/ui/button';
import { ShoppingCart, Zap } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/utils/formatadores';

interface ProductCardProps {
  produto: any;
}

export function ProductCard({ produto }: ProductCardProps) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const precoOriginal = produto.preco_padrao || 0;
  const precoPromocional = produto.preco_promocional || precoOriginal;
  const descontoPercentual = precoOriginal > 0 
    ? Math.round(((precoOriginal - precoPromocional) / precoOriginal) * 100)
    : 0;
  const economia = precoOriginal - precoPromocional;
  const parcelamento = precoPromocional / 12;
  const vagasDisponiveis = produto.vagas_disponiveis 
    ? produto.vagas_disponiveis - (produto.vagas_vendidas || 0)
    : null;

  const handleAddToCart = () => {
    addToCart(produto);
  };

  const handleBuyNow = () => {
    addToCart(produto);
    navigate('/checkout');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
      {/* Imagem */}
      <div className="relative h-64">
        <img
          src={produto.imagem_principal || '/placeholder.svg'}
          alt={produto.nome}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          {descontoPercentual > 0 && (
            <span className="bg-destructive text-white px-3 py-1 rounded-lg font-bold text-sm">
              {descontoPercentual}% OFF
            </span>
          )}
          {vagasDisponiveis !== null && vagasDisponiveis > 0 && (
            <span className="bg-warning text-white px-3 py-1 rounded-lg font-semibold text-sm ml-auto">
              {vagasDisponiveis} vaga{vagasDisponiveis !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-[#292823] line-clamp-2 mb-1">
            {produto.nome}
          </h3>
          {produto.categoria && (
            <p className="text-sm text-gray-500">{produto.categoria}</p>
          )}
        </div>

        {/* Preços */}
        <div className="space-y-2">
          {descontoPercentual > 0 && (
            <p className="text-gray-400 line-through text-base">
              {formatCurrency(precoOriginal)}
            </p>
          )}
          <p className="text-3xl font-bold text-[#3a4934]">
            {formatCurrency(precoPromocional)}
          </p>
          <p className="text-sm text-gray-600">
            ou 12x de {formatCurrency(parcelamento)} sem juros
          </p>
          {economia > 0 && (
            <p className="text-sm font-bold text-success">
              💰 Você economiza: {formatCurrency(economia)}
            </p>
          )}
        </div>

        {/* Botões */}
        <div className="space-y-2 pt-2">
          <Button
            onClick={handleAddToCart}
            variant="outline"
            className="w-full border-[#97624b] text-[#97624b] hover:bg-[#97624b] hover:text-white"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Adicionar ao Carrinho
          </Button>
          <Button
            onClick={handleBuyNow}
            className="w-full bg-[#97624b] hover:bg-[#97624b]/90 text-white"
          >
            <Zap className="w-4 h-4 mr-2" />
            Comprar Agora
          </Button>
        </div>
      </div>
    </div>
  );
}
