import { Button } from '@/components/ui/button';
import andreiaVanessa from '@/assets/andreia-vanessa.jpg';

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
    <section className="relative bg-gradient-to-br from-[#fdfdfd] via-[#ececec] to-[#9b9b9b] py-20 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Foto da Andreia */}
          <div className="w-full lg:w-2/5 flex justify-center lg:justify-start">
            <div className="relative">
              <img
                src={andreiaVanessa}
                alt="Andreia Vanessa - AV Beauty"
                className="w-80 h-[480px] object-cover rounded-3xl shadow-2xl border-4 border-[#64473b]"
              />
            </div>
          </div>

          {/* Conteúdo */}
          <div className="w-full lg:w-3/5 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#64473b] text-[#fdfdfd] px-6 py-3 rounded-full font-semibold text-sm animate-pulse shadow-lg font-subtitle">
              🔥 Lote 1 Ativo Agora
            </div>
            
            <p className="text-[#704e3b] uppercase font-semibold text-sm tracking-wider font-subtitle">
              BLACK FRIDAY 2024
            </p>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#181818] leading-tight font-display">
              Black Friday AV Beauty está chegando!
            </h1>

            <p className="text-xl md:text-2xl text-[#737373] font-sans">
              AV Brow • Coloração Labial • Brow Lamination • Hidragloss
            </p>

            <div className="bg-gradient-to-r from-[#624537] via-[#997564] to-[#624537] text-[#fdfdfd] inline-block px-6 py-3 rounded-lg">
              <p className="text-2xl md:text-3xl font-bold font-subtitle">
                Descontos exclusivos em sobrancelhas, lábios e tratamentos faciais!
              </p>
            </div>

            <div className="pt-4">
              <Button
                onClick={scrollToOfertas}
                size="lg"
                className="bg-[#64473b] hover:bg-[#704e3b] text-[#fdfdfd] text-lg px-12 py-6 h-auto rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-subtitle"
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
