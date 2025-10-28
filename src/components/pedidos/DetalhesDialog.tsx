import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { Pedido, PedidoItem } from '@/types/pedido';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Package, Mail, MessageCircle, Copy, ExternalLink, FileText, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface DetalhesDialogProps {
  pedido: Pedido | null;
  itens: PedidoItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DetalhesDialog({ pedido, itens, open, onOpenChange }: DetalhesDialogProps) {
  if (!pedido) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDateTime = (date: string) => {
    return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const handleWhatsApp = () => {
    const phone = pedido.Lead_Telefone.replace(/\D/g, '');
    const message = `Olá ${pedido.Lead_Nome}, sobre seu pedido ${pedido.Codigo}...`;
    window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleEmail = () => {
    const subject = `Pedido ${pedido.Codigo} - Nicole Guedes Odonto`;
    const body = `Olá ${pedido.Lead_Nome},\n\nSobre seu pedido ${pedido.Codigo}...\n\n`;
    window.location.href = `mailto:${pedido.Lead_Email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleCopyPaymentID = () => {
    if (pedido.Payment_ID) {
      navigator.clipboard.writeText(pedido.Payment_ID);
      toast.success('Payment ID copiado!');
    }
  };

  const handleViewGateway = () => {
    if (!pedido.Payment_ID || !pedido.Payment_Gateway) return;

    let url = '';
    if (pedido.Payment_Gateway.toLowerCase() === 'mercadopago') {
      url = `https://www.mercadopago.com.br/money/admin/payments/${pedido.Payment_ID}`;
    } else if (pedido.Payment_Gateway.toLowerCase() === 'pagseguro') {
      url = `https://pagseguro.uol.com.br/transaction/details.jhtml?code=${pedido.Payment_ID}`;
    }

    if (url) window.open(url, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">Pedido #{pedido.Codigo}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {formatDateTime(pedido.Created_at)}
              </p>
            </div>
            <StatusBadge status={pedido.Status_Pagamento} />
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {/* Dados do Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dados do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{pedido.Lead_Nome}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{pedido.Lead_Email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telefone</p>
                <p className="font-medium">{pedido.Lead_Telefone}</p>
              </div>
              {pedido.Lead_CPF && (
                <div>
                  <p className="text-sm text-muted-foreground">CPF</p>
                  <p className="font-medium">{pedido.Lead_CPF}</p>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={handleWhatsApp}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
                <Button size="sm" variant="outline" onClick={handleEmail}>
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Dados de Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dados de Pagamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Forma</p>
                <p className="font-medium">{pedido.Forma_Pagto}</p>
              </div>
              {pedido.Numero_Parcelas && pedido.Numero_Parcelas > 1 && (
                <div>
                  <p className="text-sm text-muted-foreground">Parcelas</p>
                  <p className="font-medium">{pedido.Numero_Parcelas}x</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <StatusBadge status={pedido.Status_Pagamento} />
              </div>
              {pedido.Payment_Gateway && (
                <div>
                  <p className="text-sm text-muted-foreground">Gateway</p>
                  <p className="font-medium capitalize">{pedido.Payment_Gateway}</p>
                </div>
              )}
              {pedido.Payment_ID && (
                <div>
                  <p className="text-sm text-muted-foreground">Payment ID</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm">{pedido.Payment_ID}</p>
                    <Button size="icon" variant="ghost" onClick={handleCopyPaymentID}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
              {pedido.Payment_ID && pedido.Payment_Gateway && (
                <Button size="sm" variant="outline" onClick={handleViewGateway}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ver no Gateway
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Campanha */}
        {pedido.Campanha_Nome && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Campanha</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{pedido.Campanha_Nome}</p>
            </CardContent>
          </Card>
        )}

        {/* Produtos do Pedido */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Produtos do Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {itens.map((item) => (
                <div key={item.ID} className="flex items-center gap-4 pb-4 border-b last:border-0">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                    {item.Imagem_Produto ? (
                      <img
                        src={item.Imagem_Produto}
                        alt={item.Produto_Nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.Produto_Nome}</p>
                    <p className="text-sm text-muted-foreground">
                      Qtd: {item.Quantidade} • {formatCurrency(item.Preco_Unitario)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(item.Preco_Total)}</p>
                  </div>
                </div>
              ))}

              <div className="space-y-2 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(pedido.Valor)}</span>
                </div>
                {pedido.Desconto > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Desconto</span>
                    <span>- {formatCurrency(pedido.Desconto)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>TOTAL</span>
                  <span className="text-[#97624b]">{formatCurrency(pedido.Valor_Total)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Histórico / Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{formatDateTime(pedido.Created_at)} - Pedido criado</p>
                </div>
              </div>
              {pedido.Status_Pagamento === 'pago' && (
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Pagamento confirmado</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ações</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Gerar Nota Fiscal
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="w-4 h-4 mr-2" />
              Reenviar Confirmação
            </Button>
            <Button variant="outline" size="sm">
              <Copy className="w-4 h-4 mr-2" />
              Copiar Link Pagamento
            </Button>
            {pedido.Status_Pagamento === 'pendente' && (
              <Button variant="outline" size="sm" className="text-red-600">
                <RefreshCw className="w-4 h-4 mr-2" />
                Cancelar Pedido
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button className="bg-[#97624b] hover:bg-[#7d5340]">
            <FileText className="w-4 h-4 mr-2" />
            Imprimir Pedido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
