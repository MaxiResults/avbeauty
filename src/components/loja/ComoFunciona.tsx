import { ShoppingBag, CreditCard, Calendar } from 'lucide-react';

export function ComoFunciona() {
  const steps = [
    {
      icon: ShoppingBag,
      title: 'Escolha seu procedimento',
      description: 'Navegue pelas ofertas exclusivas e selecione o tratamento ideal para você.',
    },
    {
      icon: CreditCard,
      title: 'Garanta sua vaga com desconto',
      description: 'Finalize o pagamento e garanta o preço promocional do Lote 1.',
    },
    {
      icon: Calendar,
      title: 'Agende depois',
      description: 'Entre em contato para agendar seu procedimento na melhor data para você.',
    },
  ];

  return (
    <section className="bg-[#f3f0e9] py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#292823] mb-4">
            Como Funciona
          </h2>
          <p className="text-lg text-gray-600">
            Simples, rápido e seguro
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#3a4934]/10 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-[#3a4934]" />
                  </div>
                  <div className="text-4xl font-bold text-[#97624b]">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-[#292823]">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
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
