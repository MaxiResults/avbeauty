import { motion } from 'framer-motion';

export function WhyCadastrar() {
  const beneficios = [
    {
      icon: '✨',
      title: 'Acesso antecipado à promoção',
      description: 'Seja o primeiro a garantir sua vaga',
    },
    {
      icon: '🎁',
      title: 'Condições especiais exclusivas',
      description: 'Benefícios que só os cadastrados terão',
    },
    {
      icon: '⚡',
      title: 'Link direto e personalizado',
      description: 'Receba por email e WhatsApp',
    },
    {
      icon: '⏰',
      title: 'Sem filas, sem espera',
      description: 'Enquanto outros descobrem, você já compra',
    },
    {
      icon: '🔐',
      title: '100% gratuito e sem compromisso',
      description: 'Cadastre-se agora, decida depois',
    },
  ];

  return (
    <section className="py-24 px-4 bg-[#1a1a1a]">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-white text-center mb-16"
        >
          POR QUE VOCÊ NÃO PODE FICAR DE FORA?
        </motion.h2>

        <div className="space-y-12">
          {beneficios.map((beneficio, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-6"
            >
              <div className="text-5xl flex-shrink-0">{beneficio.icon}</div>
              <div>
                <h3 className="text-2xl font-semibold text-[#FFD700] mb-2">
                  {beneficio.title}
                </h3>
                <p className="text-lg text-[#B8B8B8] leading-relaxed">
                  {beneficio.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
