import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Copy, Home } from 'lucide-react';

export default function Obrigado() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [linkExclusivo, setLinkExclusivo] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const link = searchParams.get('link');
    const nomeParam = searchParams.get('nome');
    const emailParam = searchParams.get('email');

    if (!link || !nomeParam || !emailParam) {
      navigate('/cadastro-black-friday');
      return;
    }

    setLinkExclusivo(link);
    setNome(nomeParam);
    setEmail(emailParam);
  }, [searchParams, navigate]);

  const copyLink = () => {
    const linkCompleto = `${window.location.origin}/loja?access=${linkExclusivo}`;
    
    navigator.clipboard.writeText(linkCompleto)
      .then(() => {
        toast.success('Link copiado para área de transferência!');
      })
      .catch(() => {
        toast.error('Erro ao copiar. Selecione e copie manualmente.');
      });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl w-full"
      >
        <div className="text-center space-y-8">
          {/* Título */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-7xl mb-6">✅</div>
            <h1 className="text-5xl font-bold text-[#FFD700] mb-4">
              CADASTRO CONFIRMADO!
            </h1>
            <p className="text-2xl text-white">
              Parabéns, <span className="font-bold">{nome}</span>!
            </p>
            <p className="text-xl text-[#B8B8B8]">
              Você garantiu seu acesso exclusivo!
            </p>
          </motion.div>

          {/* Informações de Envio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center gap-2 text-lg text-[#B8B8B8]">
              <span className="text-2xl">📧</span>
              <span>Enviamos seu link para:</span>
            </div>
            <p className="text-xl text-[#FFD700] font-semibold">{email}</p>
            <div className="flex items-center justify-center gap-2 text-lg text-[#B8B8B8]">
              <span className="text-2xl">📱</span>
              <span>E também para seu WhatsApp!</span>
            </div>
          </motion.div>

          {/* Separador */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

          {/* Link de Acesso */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-white">
              🔗 SEU LINK DE ACESSO:
            </h2>
            
            <div 
              className="p-6 rounded-2xl border-2 border-[#FFD700]"
              style={{
                background: 'rgba(255, 215, 0, 0.1)',
              }}
            >
              <p className="text-sm text-[#B8B8B8] break-all mb-4">
                {window.location.origin}/loja?access={linkExclusivo}
              </p>
              
              <Button
                onClick={copyLink}
                className="w-full md:w-auto h-12 px-8 bg-[#FFD700] hover:bg-[#FF8C00] text-black font-bold rounded-full"
              >
                <Copy className="w-5 h-5 mr-2" />
                COPIAR LINK
              </Button>
            </div>

            <p className="text-sm text-[#B8B8B8]">
              ⚠️ <span className="font-semibold">Guarde este link!</span> Ele é seu passaporte para a promoção exclusiva.
            </p>
          </motion.div>

          {/* Separador */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

          {/* Próximos Passos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white">
              🎯 PRÓXIMOS PASSOS:
            </h2>

            <div className="grid gap-4 max-w-md mx-auto text-left">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-[#1a1a1a]">
                <div className="text-3xl">1️⃣</div>
                <div>
                  <h3 className="text-lg font-semibold text-[#FFD700] mb-1">
                    Aguarde nosso aviso
                  </h3>
                  <p className="text-sm text-[#B8B8B8]">
                    Você receberá uma notificação antes do lançamento
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-[#1a1a1a]">
                <div className="text-3xl">2️⃣</div>
                <div>
                  <h3 className="text-lg font-semibold text-[#FFD700] mb-1">
                    Clique no link
                  </h3>
                  <p className="text-sm text-[#B8B8B8]">
                    Use o link que enviamos para acessar a promoção
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-[#1a1a1a]">
                <div className="text-3xl">3️⃣</div>
                <div>
                  <h3 className="text-lg font-semibold text-[#FFD700] mb-1">
                    Garanta seus procedimentos
                  </h3>
                  <p className="text-sm text-[#B8B8B8]">
                    Aproveite as condições exclusivas antes que acabem
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Botão Voltar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="h-12 px-8 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black rounded-full"
            >
              <Home className="w-5 h-5 mr-2" />
              VOLTAR PARA O SITE
            </Button>
          </motion.div>

          {/* Mensagem Final */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center"
          >
            <p className="text-lg text-[#B8B8B8]">Até breve! 💚</p>
            <p className="text-sm text-[#666]">Equipe AV Beauty</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
