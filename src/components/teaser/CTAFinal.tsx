import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface CTAFinalProps {
  onCTAClick: () => void;
}

export function CTAFinal({ onCTAClick }: CTAFinalProps) {
  return (
    <section className="py-24 px-4" style={{
      background: 'linear-gradient(180deg, #000000 0%, #181818 100%)',
    }}>
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl font-display font-bold text-[#704e3b] mb-6"
          style={{
            textShadow: '0 0 20px rgba(112, 78, 59, 0.5)',
          }}
        >
          ⚠️ NÃO PERCA AS OFERTAS AVBEAUTY! ⚠️
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-sans text-[#fdfdfd]"
        >
          A Black Friday da estética facial está chegando<br />
          e você não quer ficar de fora.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="space-y-4 max-w-md mx-auto"
        >
          <p className="text-xl font-sans text-[#fdfdfd] mb-6">Cadastre-se AGORA e garanta:</p>
          <div className="text-left space-y-3">
            {[
              'Acesso antecipado às ofertas',
              'Descontos exclusivos',
              'Link personalizado',
              'Sem filas, sem espera',
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-3 text-lg font-sans text-[#ececec]"
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
            className="h-16 px-12 text-xl font-display font-bold rounded-full text-[#fdfdfd] border-none"
            style={{
              background: 'linear-gradient(135deg, #704e3b 0%, #997564 50%, #624537 100%)',
              boxShadow: '0 8px 32px rgba(112, 78, 59, 0.4)',
            }}
          >
            FAZER MEU CADASTRO AGORA →
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2 }}
          className="text-[#997564] font-sans font-semibold mt-6"
        >
          ⏰ Cadastros podem fechar a qualquer momento
        </motion.p>
      </div>
    </section>
  );
}
