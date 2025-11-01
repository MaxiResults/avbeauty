import { useState } from 'react';
import { buscarCEP, formatarCEP, estadosBrasil } from '@/utils/viaCep';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search } from 'lucide-react';

interface EnderecoData {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
}

interface EnderecoFormProps {
  endereco: EnderecoData;
  onChange: (endereco: EnderecoData) => void;
  obrigatorio?: boolean;
}

export default function EnderecoForm({ endereco, onChange, obrigatorio = false }: EnderecoFormProps) {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleBuscar = async () => {
    if (!endereco.cep) return;
    setLoading(true);
    const result = await buscarCEP(endereco.cep);
    if (result.success) {
      onChange({ ...endereco, ...result });
      setErro('');
    } else {
      setErro(result.error);
    }
    setLoading(false);
  };

  const handleCEP = (val: string) => {
    const fmt = formatarCEP(val);
    onChange({ ...endereco, cep: fmt });
    if (val.replace(/\D/g, '').length === 8) handleBuscar();
  };

  return (
    <div className="space-y-4 border-t pt-6 mt-6">
      <h3 className="text-lg font-semibold">
        Endereço {!obrigatorio && <span className="text-sm text-muted-foreground font-normal">(opcional)</span>}
      </h3>

      <div className="flex gap-2">
        <Input
          type="text"
          value={endereco.cep || ''}
          onChange={(e) => handleCEP(e.target.value)}
          placeholder="00000-000"
          maxLength={9}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={handleBuscar}
          disabled={loading}
          variant="outline"
          size="icon"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>
      {erro && <p className="text-sm text-destructive">{erro}</p>}

      <Input
        type="text"
        value={endereco.logradouro || ''}
        onChange={(e) => onChange({ ...endereco, logradouro: e.target.value })}
        placeholder="Logradouro"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="text"
          value={endereco.numero || ''}
          onChange={(e) => onChange({ ...endereco, numero: e.target.value })}
          placeholder="Número"
        />
        <Input
          type="text"
          value={endereco.complemento || ''}
          onChange={(e) => onChange({ ...endereco, complemento: e.target.value })}
          placeholder="Complemento"
        />
      </div>

      <Input
        type="text"
        value={endereco.bairro || ''}
        onChange={(e) => onChange({ ...endereco, bairro: e.target.value })}
        placeholder="Bairro"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="text"
          value={endereco.cidade || ''}
          onChange={(e) => onChange({ ...endereco, cidade: e.target.value })}
          placeholder="Cidade"
        />
        <Select
          value={endereco.estado || ''}
          onValueChange={(val) => onChange({ ...endereco, estado: val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            {estadosBrasil.map(uf => (
              <SelectItem key={uf} value={uf}>{uf}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
