import { motion } from 'framer-motion';

export function WhyCadastrar() {
  const beneficios = [
    {
      icon: '✨',
      title: 'Acesso antecipado a promoções exclusivas',
      description: 'Seja a primeira a garantir os melhores horários e condições',
    },
    {
      icon: '🎁',
      title: 'Descontos especiais em micropigmentação e tratamentos',
      description: 'Ofertas exclusivas em AV Brow, Coloração Labial, Brow Lamination e mais',
    },
    {
      icon: '⚡',
      title: 'Brindes surpresa para as primeiras cadastradas',
      description: 'Receba benefícios extras por email e WhatsApp',
    },
    {
      icon: '⏰',
      title: 'Sem filas, sem espera',
      description: 'Enquanto outras descobrem, você já agenda',
    },
    {
      icon: '🔐',
      title: '100% gratuito e sem compromisso',
      description: 'Cadastre-se agora, decida depois',
    },
  ];

  return (
    <section className="py-24 px-4 bg-[#000000]">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-display font-bold text-[#fdfdfd] text-center mb-16"
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
                <h3 className="text-2xl font-subtitle font-semibold text-[#704e3b] mb-2">
                  {beneficio.title}
                </h3>
                <p className="text-lg font-sans text-[#737373] leading-relaxed">
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
