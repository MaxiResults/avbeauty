import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface FormularioCadastroProps {
  cadastroCount: number;
}

export function FormularioCadastro({ cadastroCount }: FormularioCadastroProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    aceito: false,
  });

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const generateUniqueLink = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (formData.nome.length < 3) {
      toast.error('Nome deve ter pelo menos 3 caracteres');
      return;
    }

    if (formData.telefone.replace(/\D/g, '').length !== 11) {
      toast.error('Telefone inválido');
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      toast.error('Email inválido');
      return;
    }

    if (!formData.aceito) {
      toast.error('Você precisa aceitar participar da promoção');
      return;
    }

    setLoading(true);

    try {
      const linkExclusivo = generateUniqueLink();
      const telefoneFormatado = `55${formData.telefone.replace(/\D/g, '')}`;

      // Obter IP
      let ipCadastro = '';
      try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipRes.json();
        ipCadastro = ipData.ip;
      } catch (error) {
        console.error('Erro ao obter IP:', error);
      }

      // Salvar no Supabase
      const { error } = await supabase
        .from('leads_cadastro_teaser')
        .insert({
          cliente_id: 2,
          empresa_id: 2,
          nome: formData.nome,
          telefone: telefoneFormatado,
          email: formData.email,
          link_exclusivo: linkExclusivo,
          status: 'cadastrado',
          ip_cadastro: ipCadastro,
        });

      if (error) {
        // Fallback: se a tabela teaser não existir no banco EXTERNO, salvar em Leads_Cadastro
        const errMsg = (error as any)?.message?.toLowerCase?.() || '';
        const relationMissing = errMsg.includes('relation') && errMsg.includes('does not exist');

        if (relationMissing) {
          const { error: fallbackError } = await supabase
            .from('Leads_Cadastro')
            .insert({
              cliente_id: 2,
              origem_url: window.location.href,
              canal_origem: 'teaser_black_friday',
              nome: formData.nome,
              telefone: telefoneFormatado,
              email: formData.email,
              interesse: 'black_friday_teaser',
              status: 'cadastrado',
            });

          if (fallbackError) {
            console.error('Erro fallback Leads_Cadastro:', fallbackError);
            toast.error('Erro ao cadastrar. Tente novamente.');
            return;
          }
        } else {
          console.error('Erro ao cadastrar (teaser):', error);
          toast.error('Erro ao cadastrar. Tente novamente.');
          return;
        }
      }

      // Redirecionar para página de obrigado
      navigate(`/obrigado?link=${encodeURIComponent(linkExclusivo)}&nome=${encodeURIComponent(formData.nome)}&email=${encodeURIComponent(formData.email)}`);
      
    } catch (error) {
      console.error('Erro ao processar cadastro:', error);
      toast.error('Erro ao processar cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="formulario-cadastro" className="py-24 px-4 bg-[#0a0a0a]">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🎯 GARANTA SEU ACESSO AGORA
          </h2>
          <p className="text-lg text-[#B8B8B8]">
            Preencha seus dados e receba seu link exclusivo
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-8 md:p-12 rounded-3xl"
          style={{
            background: '#2a2a2a',
            border: '2px solid #FFD700',
            boxShadow: '0 0 60px rgba(255, 215, 0, 0.3), 0 20px 80px rgba(0, 0, 0, 0.5)',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-white text-base">
                Nome Completo *
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-60">
                  👤
                </span>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                  className="h-14 pl-12 bg-[#1a1a1a] border-2 border-[#3a3a3a] text-white focus:border-[#FFD700] focus:ring-0 rounded-xl"
                />
              </div>
            </div>

            {/* Telefone */}
            <div className="space-y-2">
              <Label htmlFor="telefone" className="text-white text-base">
                Telefone (WhatsApp) *
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-60">
                  📱
                </span>
                <Input
                  id="telefone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: maskPhone(e.target.value) })}
                  required
                  className="h-14 pl-12 bg-[#1a1a1a] border-2 border-[#3a3a3a] text-white focus:border-[#FFD700] focus:ring-0 rounded-xl"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white text-base">
                E-mail *
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-60">
                  ✉️
                </span>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-14 pl-12 bg-[#1a1a1a] border-2 border-[#3a3a3a] text-white focus:border-[#FFD700] focus:ring-0 rounded-xl"
                />
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-start gap-3 py-4">
              <Checkbox
                id="aceito"
                checked={formData.aceito}
                onCheckedChange={(checked) => setFormData({ ...formData, aceito: checked as boolean })}
                required
                className="border-[#FFD700] data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-[#FFD700] data-[state=checked]:to-[#FF8C00]"
              />
              <label
                htmlFor="aceito"
                className="text-lg text-[#FFD700] font-semibold leading-tight cursor-pointer"
              >
                Quero participar da maior promoção do ano! *
              </label>
            </div>

            {/* Botão Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-16 text-xl font-bold uppercase tracking-wide rounded-full text-black border-none"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)',
                boxShadow: '0 8px 24px rgba(255, 215, 0, 0.4)',
              }}
            >
              {loading ? 'CADASTRANDO...' : 'GARANTIR MEU ACESSO EXCLUSIVO'}
            </Button>

            {/* Badge de Segurança */}
            <p className="text-center text-sm text-[#666] mt-4">
              🔒 Seus dados estão 100% protegidos
            </p>
          </form>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 p-6 rounded-xl text-center"
          style={{
            background: 'rgba(255, 215, 0, 0.05)',
            border: '1px solid rgba(255, 215, 0, 0.2)',
          }}
        >
          <span className="text-2xl">⚡</span>
          <span className="text-3xl font-bold text-[#FFD700] mx-2">{cadastroCount}</span>
          <span className="text-[#B8B8B8]">pessoas já garantiram o acesso</span>
          <br />
          <span className="text-sm text-[#FF8C00] font-semibold block mt-2">
            Não fique de fora!
          </span>
        </motion.div>
      </div>
    </section>
  );
}
