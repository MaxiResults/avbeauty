import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';
import { Produto } from '@/types/produto';

interface PreviewDialogProps {
  produto: Produto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PreviewDialog({ produto, open, onOpenChange }: PreviewDialogProps) {
  if (!produto) return null;

  const calcularDesconto = () => {
    if (!produto.preco_promocional || produto.preco_promocional >= produto.preco_padrao) {
      return null;
    }
    return Math.round(((produto.preco_padrao - produto.preco_promocional) / produto.preco_padrao) * 100);
  };

  const desconto = calcularDesconto();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preview: Como aparece na loja</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="aspect-video bg-gradient-to-br from-muted/30 to-muted/50 rounded-lg overflow-hidden">
              {produto.imagem_principal ? (
                <img
                  src={produto.imagem_principal}
                  alt={produto.nome}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-16 h-16 text-muted-foreground/30" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{produto.nome}</h2>
              {produto.categoria && (
                <p className="text-muted-foreground mt-1">
                  {produto.categoria}
                </p>
              )}
            </div>

            <div className="space-y-2">
              {desconto && (
                <div className="flex items-center gap-2">
                  <span className="text-lg text-muted-foreground line-through">
                    R$ {produto.preco_padrao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <Badge variant="outline" className="text-primary border-primary">
                    {desconto}% OFF
                  </Badge>
                </div>
              )}
              <div className="text-3xl font-bold text-[#97624b]">
                R$ {(produto.preco_promocional || produto.preco_padrao).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>

            {produto.controlar_estoque && (
              <div className="flex items-center gap-2 text-sm p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <Package className="w-4 h-4" />
                <span>Estoque controlado</span>
              </div>
            )}

            {produto.descricao_completa && (
              <div className="space-y-2 pt-4 border-t">
                <h3 className="font-semibold">Descrição</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {produto.descricao_completa}
                </p>
              </div>
            )}

            <div className="space-y-2 pt-4">
              <Button className="w-full bg-[#97624b] hover:bg-[#7d5340]" disabled>
                Adicionar ao Carrinho
              </Button>
              <Button className="w-full" variant="outline" disabled>
                Comprar Agora
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                (Botões desabilitados no preview)
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
