import { ShoppingBag, CreditCard, Calendar } from 'lucide-react';

export function ComoFunciona() {
  const steps = [
    {
      icon: ShoppingBag,
      title: 'Escolha seu tratamento',
      description: 'Navegue pelas ofertas exclusivas de sobrancelhas, lábios e procedimentos faciais.',
    },
    {
      icon: CreditCard,
      title: 'Garanta seu desconto especial',
      description: 'Finalize o pagamento e garanta o preço promocional com descontos imperdíveis.',
    },
    {
      icon: Calendar,
      title: 'Agende depois',
      description: 'Entre em contato para agendar seu procedimento estético na melhor data.',
    },
  ];

  return (
    <section className="bg-[#ececec] py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#181818] mb-4 font-display">
            Como Funciona
          </h2>
          <p className="text-lg text-[#737373] font-sans">
            Simples, rápido e seguro
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="bg-[#fdfdfd] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-[#64473b]/20"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#64473b]/10 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-[#64473b]" />
                  </div>
                  <div className="text-4xl font-bold text-[#704e3b] font-display">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-[#181818] font-subtitle">
                    {step.title}
                  </h3>
                  <p className="text-[#737373] font-sans">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
