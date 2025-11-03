import { motion } from 'framer-motion';

export function ProvaSocial() {
  const depoimentos = [
    {
      stars: 5,
      text: 'Minha sobrancelha ficou perfeita com a Andréia! Resultado super natural e sofisticado.',
      autor: 'Carla M. - Ermelino Matarazzo',
    },
    {
      stars: 5,
      text: 'Fiz coloração labial e adorei! Atendimento humanizado e cuidadoso da equipe AV Beauty.',
      autor: 'Beatriz S. - Zona Leste',
    },
    {
      stars: 5,
      text: 'Já fiz 3 procedimentos na AV Beauty. Ansiosa pela Black Friday!',
      autor: 'Ana C. - São Miguel',
    },
    {
      stars: 5,
      text: 'Equipe maravilhosa, lugar acolhedor e resultados impecáveis! Super recomendo!',
      autor: 'Juliana R. - Penha',
    },
  ];

  return (
    <section className="py-20 px-4 bg-[#000000]">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-display font-bold text-[#fdfdfd] text-center mb-12"
        >
          O QUE NOSSOS CLIENTES ESTÃO DIZENDO
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {depoimentos.map((depoimento, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="p-8 rounded-2xl bg-[#181818] border border-[#64473b] hover:border-[#704e3b] transition-all"
            >
              {/* Estrelas */}
              <div className="text-2xl mb-4">
                {'⭐'.repeat(depoimento.stars)}
              </div>

              {/* Texto */}
              <p className="text-lg font-sans text-[#ececec] italic mb-4 leading-relaxed">
                "{depoimento.text}"
              </p>

              {/* Autor */}
              <p className="text-sm font-sans text-[#704e3b] font-semibold">
                - {depoimento.autor}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-lg font-sans text-[#704e3b]">
            💬 Mais de 500 clientes satisfeitas na Zona Leste
          </p>
        </motion.div>
      </div>
    </section>
  );
}
