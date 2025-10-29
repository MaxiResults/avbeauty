import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/utils/formatadores';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, subtotal, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const descontoPix = subtotal * 0.05;
  const total = subtotal - descontoPix;

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-white shadow-2xl z-50 animate-slide-in-right overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-[#292823] flex items-center gap-2">
            <ShoppingBag className="w-6 h-6" />
            Seu Carrinho
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Fechar carrinho"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Conteúdo */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Seu carrinho está vazio
            </h3>
            <p className="text-gray-500 mb-6">
              Adicione produtos para começar suas compras
            </p>
            <Button
              onClick={onClose}
              className="bg-[#97624b] hover:bg-[#97624b]/90"
            >
              Continuar Comprando
            </Button>
          </div>
        ) : (
          <>
            {/* Lista de Produtos */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.produto_id}
                  className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <img
                    src={item.imagem || '/placeholder.svg'}
                    alt={item.nome}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#292823] line-clamp-2 mb-1">
                      {item.nome}
                    </h3>
                    <p className="text-lg font-bold text-[#3a4934]">
                      {formatCurrency(item.preco)}
                    </p>

                    {/* Controles de Quantidade */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(item.produto_id, item.quantidade - 1)
                          }
                          disabled={item.quantidade <= 1}
                          className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 font-semibold">
                          {item.quantidade}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.produto_id, item.quantidade + 1)
                          }
                          className="p-2 hover:bg-gray-100"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.produto_id)}
                        className="p-2 text-destructive hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Remover produto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer - Totais e Botões */}
            <div className="border-t p-6 space-y-4 bg-gray-50">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-success font-semibold">
                  <span>Desconto Pix (5%):</span>
                  <span>- {formatCurrency(descontoPix)}</span>
                </div>
                <div className="h-px bg-gray-300" />
                <div className="flex justify-between text-xl font-bold text-[#292823]">
                  <span>TOTAL:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-[#97624b] hover:bg-[#97624b]/90 text-white h-12 text-lg font-semibold"
                >
                  Finalizar Pedido
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full"
                >
                  Continuar Comprando
                </Button>
              </div>

              <p className="text-xs text-center text-gray-500">
                🔒 Pagamento 100% Seguro
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
