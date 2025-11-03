import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { submitLead } from '@/lib/supabase';

interface FormularioCadastroProps {
  cadastroCount: number;
}

export function FormularioCadastro({ cadastroCount }: FormularioCadastroProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [aceito, setAceito] = useState(false);

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const generateUniqueLink = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (nome.length < 3) {
      toast.error('Nome deve ter pelo menos 3 caracteres');
      return;
    }

    if (telefone.replace(/\D/g, '').length !== 11) {
      toast.error('Telefone inválido');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      toast.error('Email inválido');
      return;
    }

    if (!aceito) {
      toast.error('Você precisa aceitar a política de privacidade');
      return;
    }

    setLoading(true);

    try {
      const uniqueLink = generateUniqueLink();
      let ip = '';
      try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipRes.json();
        ip = ipData.ip;
      } catch (error) {
        console.error('Erro ao obter IP:', error);
      }

      const lead = {
        site_url: 'avbeauty.com.br',
        lead_nome: nome,
        lead_telefone: telefone,
        lead_email: email,
        lead_interest: 'Black Friday - Acesso Antecipado',
        lead_obs: `IP: ${ip} | Link: ${uniqueLink}`,
        cliente_id: 3,
        empresa_id: 3,
      };

      await submitLead(lead);
      navigate(`/obrigado?link=${encodeURIComponent(uniqueLink)}&nome=${encodeURIComponent(nome)}`);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao cadastrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="formulario-cadastro" className="py-24 px-4 bg-[#181818]">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-display font-bold text-[#704e3b] mb-4">
            GARANTA SEU DESCONTO EXCLUSIVO
          </h2>
          <p className="text-xl font-sans text-[#737373]">
            É rápido, gratuito e você recebe seu link exclusivo na hora!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-[#000000] rounded-2xl p-8 border-2 border-[#64473b]"
          style={{ boxShadow: '0 8px 32px rgba(112, 78, 59, 0.1)' }}
        >
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="nome" className="block text-[#fdfdfd] font-sans font-semibold mb-2">
                  Nome Completo *
                </label>
                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-4 py-3 bg-[#181818] text-[#fdfdfd] rounded-lg border border-[#64473b] focus:border-[#704e3b] focus:outline-none transition-colors font-sans"
                  placeholder="Seu nome completo"
                  required
                />
              </div>

              <div>
                <label htmlFor="telefone" className="block text-[#fdfdfd] font-sans font-semibold mb-2">
                  WhatsApp *
                </label>
                <input
                  id="telefone"
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(maskPhone(e.target.value))}
                  className="w-full px-4 py-3 bg-[#181818] text-[#fdfdfd] rounded-lg border border-[#64473b] focus:border-[#704e3b] focus:outline-none transition-colors font-sans"
                  placeholder="(11) 98765-4321"
                  maxLength={15}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-[#fdfdfd] font-sans font-semibold mb-2">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#181818] text-[#fdfdfd] rounded-lg border border-[#64473b] focus:border-[#704e3b] focus:outline-none transition-colors font-sans"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div className="flex items-start gap-3 pt-2">
                <input
                  id="aceito"
                  type="checkbox"
                  checked={aceito}
                  onChange={(e) => setAceito(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-[#64473b] bg-[#181818]"
                  required
                />
                <label htmlFor="aceito" className="text-sm font-sans text-[#737373]">
                  Aceito receber comunicações sobre a promoção e estou de acordo com a{' '}
                  <a href="/politica-de-privacidade" className="text-[#704e3b] hover:underline">
                    Política de Privacidade
                  </a>
                </label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 text-xl font-display font-bold rounded-full text-[#fdfdfd] border-none"
                style={{
                  background: 'linear-gradient(135deg, #704e3b 0%, #997564 50%, #624537 100%)',
                  boxShadow: '0 4px 16px rgba(112, 78, 59, 0.4)',
                }}
              >
                {loading ? 'PROCESSANDO...' : 'CADASTRAR E RECEBER LINK →'}
              </Button>
            </div>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8 space-y-4"
        >
          <div className="flex items-center justify-center gap-2 text-[#704e3b]">
            <span className="text-2xl">👥</span>
            <span className="text-xl font-sans font-semibold">{cadastroCount}+ pessoas já garantiram acesso</span>
          </div>
          <div className="flex items-center justify-center gap-4 text-sm font-sans text-[#737373]">
            <span className="flex items-center gap-1">
              <span className="text-green-500">✓</span> Gratuito
            </span>
            <span className="flex items-center gap-1">
              <span className="text-green-500">✓</span> Rápido
            </span>
            <span className="flex items-center gap-1">
              <span className="text-green-500">✓</span> Link na hora
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
