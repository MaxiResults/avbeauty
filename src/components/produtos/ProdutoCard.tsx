import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, Trash2, Package } from 'lucide-react';
import { Produto } from '@/types/produto';

interface ProdutoCardProps {
  produto: Produto;
  onDelete: (id: number) => void;
  onPreview: (produto: Produto) => void;
}

export function ProdutoCard({ produto, onDelete, onPreview }: ProdutoCardProps) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const calcularDesconto = () => {
    if (!produto.preco_promocional || produto.preco_promocional >= produto.preco_padrao) {
      return null;
    }
    const desconto = ((produto.preco_padrao - produto.preco_promocional) / produto.preco_padrao) * 100;
    return Math.round(desconto);
  };

  const desconto = calcularDesconto();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 border border-border">
      <div className="relative h-48 bg-gradient-to-br from-muted/50 to-muted overflow-hidden">
        {produto.imagem_principal && !imageError ? (
          <img
            src={produto.imagem_principal}
            alt={produto.nome}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted/50">
            <Package className="w-16 h-16 text-muted-foreground/30" />
          </div>
        )}
        
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start gap-2">
          <Badge
            className={
              produto.status === 'ativo'
                ? 'bg-green-500/90 hover:bg-green-600 text-white shadow-sm ml-auto'
                : 'bg-red-500/90 hover:bg-red-600 text-white shadow-sm ml-auto'
            }
          >
            {produto.status === 'ativo' ? 'Disponível' : 'Indisponível'}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg line-clamp-2 min-h-[3.5rem]">
            {produto.nome}
          </h3>
          {produto.categoria && (
            <p className="text-sm text-muted-foreground mt-1">
              {produto.categoria}
            </p>
          )}
        </div>

        <div className="space-y-1">
          {desconto && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground line-through">
                R$ {produto.preco_padrao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
              <Badge variant="outline" className="text-primary border-primary">
                {desconto}% OFF
              </Badge>
            </div>
          )}
          <div className="text-2xl font-bold text-[#97624b]">
            R$ {(produto.preco_promocional || produto.preco_padrao).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm text-muted-foreground pt-2 border-t">
          {produto.controla_estoque && (
            <span className="flex items-center gap-1">
              <Package className="w-4 h-4" />
              Estoque Limitado
            </span>
          )}
          {produto.ordem_exibicao && (
            <span>
              📊 Ordem: #{produto.ordem_exibicao}
            </span>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => navigate(`/admin/produtos/${produto.id}`)}
          >
            <Edit className="w-4 h-4 mr-1" />
            Editar
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPreview(produto)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(produto.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
