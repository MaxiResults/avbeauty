import { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, MessageCircle, Mail, Copy } from 'lucide-react';
import { formatCurrency } from '@/utils/formatadores';
import { useToast } from '@/hooks/use-toast';

export default function PedidoConfirmacao() {
  const { codigo } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const pedido = location.state?.pedido;

  useEffect(() => {
    if (!pedido) {
      navigate('/loja');
    }
  }, [pedido, navigate]);

  if (!pedido) return null;

  const whatsappMessage = `Olá! Criei o pedido ${codigo} no valor de ${formatCurrency(pedido.valorTotal)}. Gostaria de finalizar o pagamento.`;
  const whatsappUrl = `https://wa.me/5511951903402?text=${encodeURIComponent(whatsappMessage)}`;

  const emailSubject = `Pedido ${codigo} - Nicole Guedes Odonto`;
  const emailBody = `Olá!\n\nCriei o pedido ${codigo} no valor de ${formatCurrency(pedido.valorTotal)}.\n\nGostaria de finalizar o pagamento.\n\nObrigado!`;
  const emailUrl = `mailto:contato@nicoleguedesodonto.com.br?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  const copiarCodigo = () => {
    navigator.clipboard.writeText(codigo || '');
    toast({
      title: 'Código copiado!',
      description: 'O código do pedido foi copiado para a área de transferência.',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3f0e9] to-[#e5e7eb] py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center space-y-8">
          {/* Ícone de Sucesso */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-warning/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-warning" />
            </div>
          </div>

          {/* Título */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#292823] mb-2">
              ⏳ Pedido Criado!
            </h1>
            <p className="text-lg text-gray-600">
              Pedido #{codigo}
            </p>
          </div>

          <div className="h-px bg-gray-300" />

          {/* Mensagem */}
          <div className="space-y-4">
            <p className="text-xl text-[#292823]">
              Olá, <span className="font-semibold">{pedido.nome}</span>!
            </p>
            <p className="text-gray-600">
              Seu pedido foi criado com sucesso!
              <br />
              Agora você precisa finalizar o pagamento.
            </p>
          </div>

          <div className="h-px bg-gray-300" />

          {/* Resumo do Pedido */}
          <div className="bg-gray-50 rounded-2xl p-6 text-left space-y-4">
            <h2 className="text-xl font-bold text-[#292823] mb-4">
              📋 Resumo do Pedido
            </h2>

            <div className="space-y-2">
              {pedido.itens.map((item: any) => (
                <div key={item.produto_id} className="flex justify-between">
                  <span className="text-gray-700">
                    • {item.nome} - {item.quantidade}x
                  </span>
                  <span className="font-semibold text-[#3a4934]">
                    {formatCurrency(item.preco * item.quantidade)}
                  </span>
                </div>
              ))}
            </div>

            <div className="h-px bg-gray-300 my-3" />

            <div className="space-y-1">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>{formatCurrency(pedido.subtotal)}</span>
              </div>
              {pedido.desconto > 0 && (
                <div className="flex justify-between text-success font-semibold">
                  <span>Desconto Pix:</span>
                  <span>- {formatCurrency(pedido.desconto)}</span>
                </div>
              )}
            </div>

            <div className="h-px bg-gray-300 my-3" />

            <div className="flex justify-between text-xl font-bold text-[#292823]">
              <span>Valor Total:</span>
              <span>{formatCurrency(pedido.valorTotal)}</span>
            </div>

            <div className="text-sm text-gray-600">
              Forma de Pagamento:{' '}
              <span className="font-semibold">
                {pedido.formaPagamento === 'pix'
                  ? 'Pix'
                  : pedido.formaPagamento === 'cartao'
                  ? 'Cartão de Crédito'
                  : 'Boleto Bancário'}
              </span>
            </div>
          </div>

          <div className="h-px bg-gray-300" />

          {/* Próximos Passos */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#292823]">
              🔜 Próximos Passos:
            </h2>
            <div className="bg-warning/10 border border-warning rounded-lg p-4">
              <p className="text-gray-700">
                ⚠️ A integração de pagamento será ativada em breve. Por
                enquanto, entre em contato via:
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => window.open(whatsappUrl, '_blank')}
                className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white h-14 text-lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Enviar WhatsApp
              </Button>

              <Button
                onClick={() => window.open(emailUrl)}
                variant="outline"
                className="w-full h-14 text-lg border-[#97624b] text-[#97624b] hover:bg-[#97624b] hover:text-white"
              >
                <Mail className="w-5 h-5 mr-2" />
                Enviar E-mail
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 pt-4">
              <span className="text-sm text-gray-600">
                Número do pedido: <strong>{codigo}</strong>
              </span>
              <Button
                onClick={copiarCodigo}
                variant="ghost"
                size="sm"
                className="h-8 px-2"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="h-px bg-gray-300" />

          <Button
            onClick={() => navigate('/loja')}
            variant="outline"
            className="w-full"
          >
            ← Voltar para ofertas
          </Button>
        </div>
      </div>
    </div>
  );
}
