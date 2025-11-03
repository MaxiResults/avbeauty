import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      pergunta: 'Quando a promoção Black Friday começa?',
      resposta: 'Em breve! Cadastradas receberão aviso por email e WhatsApp 24h antes do lançamento.',
    },
    {
      pergunta: 'Quais procedimentos terão desconto?',
      resposta: 'AV Brow, Coloração Labial, Brow Lamination, Hidragloss, Design de Sobrancelha e muito mais!',
    },
    {
      pergunta: 'Preciso pagar para me cadastrar?',
      resposta: 'Não! O cadastro é 100% gratuito e sem compromisso.',
    },
    {
      pergunta: 'Como recebo meu link de acesso?',
      resposta: 'Automaticamente por email e WhatsApp logo após o cadastro.',
    },
    {
      pergunta: 'Os procedimentos são seguros?',
      resposta: 'Sim! Todos os procedimentos são realizados por profissionais qualificadas com produtos de alta qualidade.',
    },
    {
      pergunta: 'O cadastro me obriga a agendar?',
      resposta: 'Não! Você recebe o acesso e decide depois se quer aproveitar a promoção.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 bg-[#181818]">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-display font-bold text-[#fdfdfd] text-center mb-12"
        >
          DÚVIDAS FREQUENTES
        </motion.h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-xl overflow-hidden border transition-all ${
                activeIndex === index
                  ? 'border-[#704e3b] bg-[#000000]'
                  : 'border-[#64473b] bg-[#000000]'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-[#181818] transition-colors"
              >
                <span className={`text-lg font-subtitle font-semibold ${
                  activeIndex === index ? 'text-[#704e3b]' : 'text-[#fdfdfd]'
                }`}>
                  {faq.pergunta}
                </span>
                <motion.span
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl text-[#704e3b]"
                >
                  ▼
                </motion.span>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 font-sans text-[#737373] leading-relaxed">
                      {faq.resposta}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
