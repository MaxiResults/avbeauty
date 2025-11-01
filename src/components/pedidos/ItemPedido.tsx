import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatadores';

interface Produto {
  id: number;
  nome: string;
  preco_padrao: number;
  preco_promocional: number | null;
}

interface ItemPedidoData {
  produto_id: number | null;
  produto_nome: string;
  quantidade: number;
  preco_unitario: number;
  desconto_item: number;
  observacoes: string;
}

interface ItemPedidoProps {
  item: ItemPedidoData;
  index: number;
  produtos: Produto[];
  onChange: (index: number, item: ItemPedidoData) => void;
  onRemove: (index: number) => void;
}

export default function ItemPedido({ 
  item, 
  index, 
  produtos, 
  onChange, 
  onRemove 
}: ItemPedidoProps) {
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);

  useEffect(() => {
    if (item.produto_id) {
      const prod = produtos.find(p => p.id === item.produto_id);
      setProdutoSelecionado(prod || null);
      if (prod && !item.preco_unitario) {
        onChange(index, {
          ...item,
          produto_nome: prod.nome,
          preco_unitario: prod.preco_promocional || prod.preco_padrao
        });
      }
    }
  }, [item.produto_id, produtos]);

  const handleProdutoChange = (produtoId: string) => {
    const prod = produtos.find(p => p.id === parseInt(produtoId));
    onChange(index, {
      ...item,
      produto_id: parseInt(produtoId),
      produto_nome: prod?.nome || '',
      preco_unitario: prod?.preco_promocional || prod?.preco_padrao || 0
    });
  };

  const calcularTotal = () => {
    const qtd = item.quantidade || 1;
    const preco = item.preco_unitario || 0;
    const desc = item.desconto_item || 0;
    return (qtd * preco) - desc;
  };

  return (
    <div className="border rounded-lg p-4 space-y-3 bg-muted/50">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold">Item {index + 1}</h4>
        {index > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remover
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label htmlFor={`produto-${index}`}>Produto *</Label>
          <Select
            value={item.produto_id?.toString() || ''}
            onValueChange={handleProdutoChange}
            required
          >
            <SelectTrigger id={`produto-${index}`}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {produtos.map(p => (
                <SelectItem key={p.id} value={p.id.toString()}>
                  {p.nome} - {formatCurrency(p.preco_promocional || p.preco_padrao)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor={`quantidade-${index}`}>Quantidade</Label>
          <Input
            id={`quantidade-${index}`}
            type="number"
            min="1"
            value={item.quantidade || 1}
            onChange={(e) => onChange(index, { ...item, quantidade: parseInt(e.target.value) || 1 })}
          />
        </div>

        <div>
          <Label htmlFor={`preco-${index}`}>Preço Unitário</Label>
          <Input
            id={`preco-${index}`}
            type="number"
            step="0.01"
            value={item.preco_unitario || 0}
            onChange={(e) => onChange(index, { ...item, preco_unitario: parseFloat(e.target.value) || 0 })}
          />
        </div>

        <div>
          <Label htmlFor={`desconto-${index}`}>Desconto Item (R$)</Label>
          <Input
            id={`desconto-${index}`}
            type="number"
            step="0.01"
            min="0"
            value={item.desconto_item || 0}
            onChange={(e) => onChange(index, { ...item, desconto_item: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor={`observacoes-${index}`}>Observações</Label>
        <Input
          id={`observacoes-${index}`}
          type="text"
          value={item.observacoes || ''}
          onChange={(e) => onChange(index, { ...item, observacoes: e.target.value })}
          placeholder="Ex: Aplicar na bochecha direita"
        />
      </div>

      <div className="text-right pt-2 border-t">
        <span className="font-semibold text-lg">
          Total: {formatCurrency(calcularTotal())}
        </span>
      </div>
    </div>
  );
}
