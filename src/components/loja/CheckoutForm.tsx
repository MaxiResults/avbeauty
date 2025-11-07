import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { maskCPF, maskPhone } from '@/utils/formatadores';
import { validarCPF, validarEmail, validarTelefone } from '@/utils/validacoes';
import EnderecoForm from '@/components/EnderecoForm';
import { useCart } from '@/hooks/useCart';

interface CheckoutFormProps {
  onSubmit: (data: any) => void;
  isProcessing: boolean;
}

export function CheckoutForm({ onSubmit, isProcessing }: CheckoutFormProps) {
  const { setFormaPagamento } = useCart();
  
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    formaPagamento: 'pix',
    parcelas: 1,
    aceitoTermos: false,
    aceitoOfertas: false,
  });

  const [endereco, setEndereco] = useState({
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    pais: 'Brasil'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpar erro do campo ao digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!validarCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    if (!validarEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!validarTelefone(formData.telefone)) {
      newErrors.telefone = 'Telefone inválido';
    }

    if (!formData.aceitoTermos) {
      newErrors.aceitoTermos = 'Você deve aceitar os termos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ ...formData, endereco });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
      {/* Dados Pessoais */}
      <div>
        <h2 className="text-2xl font-bold text-[#292823] mb-6">Seus Dados</h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome Completo *</Label>
            <Input
              id="nome"
              placeholder="Maria Silva"
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              className={errors.nome ? 'border-destructive' : ''}
            />
            {errors.nome && (
              <p className="text-sm text-destructive mt-1">{errors.nome}</p>
            )}
          </div>

          <div>
            <Label htmlFor="cpf">CPF *</Label>
            <Input
              id="cpf"
              placeholder="000.000.000-00"
              value={formData.cpf}
              onChange={(e) => handleChange('cpf', maskCPF(e.target.value))}
              maxLength={14}
              className={errors.cpf ? 'border-destructive' : ''}
            />
            {errors.cpf && (
              <p className="text-sm text-destructive mt-1">{errors.cpf}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              placeholder="maria@email.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="telefone">Telefone *</Label>
            <Input
              id="telefone"
              placeholder="(11) 99999-9999"
              value={formData.telefone}
              onChange={(e) => handleChange('telefone', maskPhone(e.target.value))}
              maxLength={15}
              className={errors.telefone ? 'border-destructive' : ''}
            />
            {errors.telefone && (
              <p className="text-sm text-destructive mt-1">{errors.telefone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Endereço */}
      <EnderecoForm endereco={endereco} onChange={setEndereco} />

      {/* Forma de Pagamento */}
      <div>
        <h2 className="text-2xl font-bold text-[#292823] mb-4">
          Forma de Pagamento
        </h2>

        <RadioGroup
          value={formData.formaPagamento}
          onValueChange={(value) => {
            handleChange('formaPagamento', value);
            setFormaPagamento(value as 'pix' | 'cartao' | 'boleto');
          }}
        >
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-4 border-2 border-success rounded-lg bg-success/5">
              <RadioGroupItem value="pix" id="pix" />
              <Label htmlFor="pix" className="flex-1 cursor-pointer">
                <div className="font-semibold">Pix - 5% de desconto extra</div>
                <div className="text-sm text-gray-600 mt-1">
                  💰 Pagamento instantâneo
                </div>
              </Label>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <RadioGroupItem value="cartao" id="cartao" />
              <Label htmlFor="cartao" className="flex-1 cursor-pointer">
                <div className="font-semibold">Cartão de Crédito</div>
                <div className="text-sm text-gray-600 mt-1">
                  💳 Parcelamento em até 3x
                </div>
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Termos */}
      <div className="space-y-3">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="termos"
            checked={formData.aceitoTermos}
            onCheckedChange={(checked) =>
              handleChange('aceitoTermos', checked)
            }
          />
          <Label htmlFor="termos" className="text-sm cursor-pointer leading-relaxed">
            Li e aceito os{' '}
            <a href="#" className="text-[#97624b] underline">
              Termos de Uso
            </a>{' '}
            e{' '}
            <a href="#" className="text-[#97624b] underline">
              Política de Privacidade
            </a>{' '}
            *
          </Label>
        </div>
        {errors.aceitoTermos && (
          <p className="text-sm text-destructive">{errors.aceitoTermos}</p>
        )}

        <div className="flex items-start space-x-2">
          <Checkbox
            id="ofertas"
            checked={formData.aceitoOfertas}
            onCheckedChange={(checked) =>
              handleChange('aceitoOfertas', checked)
            }
          />
          <Label htmlFor="ofertas" className="text-sm cursor-pointer leading-relaxed">
            Aceito receber ofertas e novidades por email
          </Label>
        </div>
      </div>

      {/* Botão */}
      <Button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-[#97624b] hover:bg-[#97624b]/90 text-white h-14 text-lg font-semibold"
      >
        {isProcessing ? '⏳ Processando...' : '🔒 Finalizar Compra'}
      </Button>
    </form>
  );
}
