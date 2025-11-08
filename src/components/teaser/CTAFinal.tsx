import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface CTAFinalProps {
  onCTAClick: () => void;
}

export function CTAFinal({ onCTAClick }: CTAFinalProps) {
  return (
    <section className="py-24 px-4" style={{
      background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
    }}>
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl font-bold text-[#FFD700] mb-6"
          style={{
            textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
          }}
        >
          ⚠️ NÃO FIQUE DE FORA! ⚠️
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-2xl text-white"
        >
          A promoção do ano está chegando<br />
          e você não quer perder isso.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="space-y-4 max-w-md mx-auto"
        >
          <p className="text-xl text-white mb-6">Cadastre-se AGORA e garanta:</p>
          <div className="text-left space-y-3">
            {[
              'Acesso antecipado',
              'Condições exclusivas',
              'Link personalizado',
              'Sem filas, sem espera',
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-3 text-lg text-[#E0E0E0]"
              >
                <span className="text-green-500 text-xl">✓</span>
                {item}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
        >
          <Button
            onClick={onCTAClick}
            className="h-14 sm:h-16 px-6 sm:px-12 text-base sm:text-xl font-bold rounded-full text-black border-none"
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)',
              boxShadow: '0 8px 32px rgba(255, 215, 0, 0.4)',
            }}
          >
            <span className="block sm:hidden">FAZER CADASTRO AGORA →</span>
            <span className="hidden sm:block">FAZER MEU CADASTRO AGORA →</span>
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2 }}
          className="text-[#FF8C00] font-semibold mt-6"
        >
          ⏰ Cadastros podem fechar a qualquer momento
        </motion.p>
      </div>
    </section>
  );
}
