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

  const handleAddToCart = () => {
    addToCart(produto);
  };

  const handleBuyNow = () => {
    addToCart(produto);
    navigate('/checkout');
  };

  return (
    <div className="bg-[#fdfdfd] rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-[#64473b]/20">
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
            <span className="bg-[#64473b] text-[#fdfdfd] px-3 py-1 rounded-lg font-bold text-sm font-subtitle">
              {descontoPercentual}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-[#181818] line-clamp-2 mb-1 font-subtitle">
            {produto.nome}
          </h3>
          {produto.categoria && (
            <p className="text-sm text-[#737373] font-sans">{produto.categoria}</p>
          )}
        </div>

        {/* Preços */}
        <div className="space-y-2">
          {descontoPercentual > 0 && (
            <p className="text-[#737373] line-through text-base font-sans">
              {formatCurrency(precoOriginal)}
            </p>
          )}
          <p className="text-3xl font-bold text-[#64473b] font-display">
            {formatCurrency(precoPromocional)}
          </p>
          <p className="text-sm text-[#737373] font-sans">
            ou 12x de {formatCurrency(parcelamento)} sem juros
          </p>
          {economia > 0 && (
            <p className="text-sm font-bold text-[#704e3b] font-subtitle">
              💰 Você economiza: {formatCurrency(economia)}
            </p>
          )}
        </div>

        {/* Botões */}
        <div className="space-y-2 pt-2">
          <Button
            onClick={handleAddToCart}
            variant="outline"
            className="w-full border-[#64473b] text-[#64473b] hover:bg-[#64473b] hover:text-[#fdfdfd] font-subtitle"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Adicionar ao Carrinho
          </Button>
          <Button
            onClick={handleBuyNow}
            className="w-full bg-[#64473b] hover:bg-[#704e3b] text-[#fdfdfd] font-subtitle"
          >
            <Zap className="w-4 h-4 mr-2" />
            Comprar Agora
          </Button>
        </div>
      </div>
    </div>
  );
}
