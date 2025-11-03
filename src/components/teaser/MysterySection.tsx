import { motion } from 'framer-motion';

export function MysterySection() {
  const cards = [
    {
      icon: '🔒',
      title: 'Descontos em Procedimentos',
      value: 'Até ??%',
      hint: 'AV Brow, Coloração Labial, Brow Lamination',
    },
    {
      icon: '🔒',
      title: 'Bônus Exclusivos',
      value: '????',
      hint: 'Hidragloss e surpresas especiais',
    },
    {
      icon: '🔒',
      title: 'Condições Únicas',
      value: '????',
      hint: 'Parcelamento especial em tratamentos faciais',
    },
  ];

  return (
    <section className="py-24 px-4" style={{
      background: 'linear-gradient(180deg, #181818 0%, #000000 100%)',
    }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-display font-bold text-[#fdfdfd] mb-4">
            O QUE ESTÁ POR VIR?
          </h2>
          <p className="text-xl font-sans text-[#737373]">
            Você só descobrirá se se cadastrar...
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -8 }}
              className="relative p-8 rounded-2xl text-center overflow-hidden group"
              style={{
                background: 'rgba(24, 24, 24, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(112, 78, 59, 0.2)',
              }}
            >
              {/* Glow effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'radial-gradient(circle at center, rgba(112,78,59,0.1) 0%, transparent 70%)',
                }}
              />

              <div className="relative z-10">
                <div className="text-6xl mb-6 opacity-70">{card.icon}</div>
                <h3 className="text-2xl font-subtitle font-semibold text-[#fdfdfd] mb-4">
                  {card.title}
                </h3>
                <div 
                  className="text-4xl font-display font-bold text-[#704e3b] mb-2"
                  style={{
                    filter: 'blur(8px)',
                    textShadow: '0 0 20px rgba(112, 78, 59, 0.8)',
                    userSelect: 'none',
                  }}
                >
                  {card.value}
                </div>
                <p className="text-sm font-sans text-[#737373] opacity-0 group-hover:opacity-100 transition-opacity">
                  {card.hint}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center text-lg font-sans text-[#704e3b] mt-12"
        >
          Cadastre-se para ser o primeiro a descobrir
        </motion.p>
      </div>
    </section>
  );
}
