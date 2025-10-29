import { Button } from '@/components/ui/button';
import draNicole from '@/assets/dra-nicole.jpg';

export function Hero() {
  const scrollToOfertas = () => {
    const element = document.getElementById('ofertas');
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-[#f3f0e9] to-[#e5e7eb] py-20 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Foto da Dra. Nicole */}
          <div className="w-full lg:w-2/5 flex justify-center lg:justify-start">
            <div className="relative">
              <img
                src={draNicole}
                alt="Dra. Nicole Guedes"
                className="w-80 h-[480px] object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </div>

          {/* Conteúdo */}
          <div className="w-full lg:w-3/5 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 bg-success text-white px-6 py-3 rounded-full font-semibold text-sm animate-pulse shadow-lg">
              🔥 Lote 1 Ativo Agora
            </div>
            
            <p className="text-[#97624b] uppercase font-semibold text-sm tracking-wider">
              BLACK FRIDAY 2024
            </p>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#292823] leading-tight">
              A maior promoção do ano chegou
            </h1>

            <p className="text-xl md:text-2xl text-gray-600">
              Lentes Naturais • Harmonização Facial • Clareamento
            </p>

            <div className="bg-[#3a4934] text-white inline-block px-6 py-3 rounded-lg">
              <p className="text-2xl md:text-3xl font-bold">
                Descontos imperdíveis em procedimentos selecionados!
              </p>
            </div>

            <div className="pt-4">
              <Button
                onClick={scrollToOfertas}
                size="lg"
                className="bg-[#97624b] hover:bg-[#97624b]/90 text-white text-lg px-12 py-6 h-auto rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Ver Ofertas Exclusivas ↓
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
