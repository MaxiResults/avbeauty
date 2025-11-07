import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/utils/formatadores';
import { Lock } from 'lucide-react';

export function OrderSummary() {
  const { cart, subtotal, desconto, total } = useCart();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
      <h2 className="text-2xl font-bold text-[#292823] mb-6">
        Resumo do Pedido
      </h2>

      {/* Lista de Produtos */}
      <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
        {cart.map((item) => (
          <div key={item.produto_id} className="flex gap-3 pb-4 border-b">
            <img
              src={item.imagem || '/placeholder.svg'}
              alt={item.nome}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-[#292823] line-clamp-2">
                {item.nome}
              </p>
              <p className="text-sm text-gray-600">
                {item.quantidade}x {formatCurrency(item.preco)}
              </p>
            </div>
            <div className="font-bold text-[#3a4934]">
              {formatCurrency(item.preco * item.quantidade)}
            </div>
          </div>
        ))}
      </div>

      {/* Totais */}
      <div className="space-y-3 pt-4 border-t">
        <div className="flex justify-between text-2xl font-bold text-[#292823]">
          <span>TOTAL:</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Badge de Segurança */}
      <div className="mt-6 p-4 bg-success/10 rounded-lg flex items-center gap-2 justify-center text-success">
        <Lock className="w-5 h-5" />
        <span className="font-semibold text-sm">Pagamento 100% Seguro</span>
      </div>
    </div>
  );
}
