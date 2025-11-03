import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      pergunta: 'Quando a promoção começa?',
      resposta: 'Em breve! Cadastrados receberão aviso por email e WhatsApp 24h antes do lançamento.',
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
      pergunta: 'Posso compartilhar meu link?',
      resposta: 'O link é pessoal e rastreável para garantir exclusividade aos cadastrados.',
    },
    {
      pergunta: 'O que acontece se eu não me cadastrar?',
      resposta: 'Você perderá as condições exclusivas e descontos especiais para cadastrados.',
    },
    {
      pergunta: 'O cadastro me obriga a comprar?',
      resposta: 'Não! Você recebe o acesso e decide depois se quer aproveitar a promoção.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-white text-center mb-12"
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
                  ? 'border-[#FFD700] bg-[#1a1a1a]'
                  : 'border-[#3a3a3a] bg-[#1a1a1a]'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-[#2a2a2a] transition-colors"
              >
                <span className={`text-lg font-semibold ${
                  activeIndex === index ? 'text-[#FFD700]' : 'text-white'
                }`}>
                  {faq.pergunta}
                </span>
                <motion.span
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl text-[#FFD700]"
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
                    <div className="px-6 pb-6 text-[#B8B8B8] leading-relaxed">
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
