import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verificarPagamentoInfinitePay } from '@/utils/infinitepay';

export default function CheckoutConfirmacao() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState<'verificando' | 'sucesso' | 'erro'>('verificando');
  const [mensagem, setMensagem] = useState('Verificando pagamento...');
  const [pedidoCodigo, setPedidoCodigo] = useState<string>('');

  useEffect(() => {
    processarRetorno();
  }, []);

  const processarRetorno = async () => {
    try {
      const transactionId = searchParams.get('transaction_id');
      const orderNsu = searchParams.get('order_nsu');
      const slug = searchParams.get('slug');

      if (!transactionId || !orderNsu || !slug) {
        throw new Error('Parâmetros inválidos');
      }

      const dadosCheckoutStr = sessionStorage.getItem('checkout_dados');
      if (!dadosCheckoutStr) {
        throw new Error('Dados do checkout não encontrados');
      }

      const dadosCheckout = JSON.parse(dadosCheckoutStr);

      const resultado = await verificarPagamentoInfinitePay(
        transactionId,
        orderNsu,
        slug,
        dadosCheckout
      );

      if (resultado.success) {
        setPedidoCodigo(resultado.pedidoCodigo || '');
        setStatus('sucesso');
        setMensagem('Pagamento confirmado! Pedido criado com sucesso.');
        sessionStorage.removeItem('checkout_dados');
      } else {
        throw new Error(resultado.message || 'Erro ao confirmar pagamento');
      }

    } catch (error) {
      console.error('Erro ao processar retorno:', error);
      setStatus('erro');
      setMensagem(error instanceof Error ? error.message : 'Erro ao confirmar pagamento');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {status === 'verificando' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold mb-2">Verificando Pagamento</h2>
            <p className="text-gray-600">{mensagem}</p>
          </div>
        )}

        {status === 'sucesso' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Pagamento Confirmado!</h2>
            <p className="text-gray-600 mb-4">{mensagem}</p>
            {pedidoCodigo && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-500">Número do Pedido</p>
                <p className="text-xl font-bold text-gray-900">{pedidoCodigo}</p>
              </div>
            )}
            <p className="text-sm text-gray-600 mb-6">
              Enviamos um email de confirmação com todos os detalhes.
            </p>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Voltar para Home
            </button>
          </div>
        )}

        {status === 'erro' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Erro no Pagamento</h2>
            <p className="text-gray-600 mb-6">{mensagem}</p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Tentar Novamente
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition"
              >
                Voltar para Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
