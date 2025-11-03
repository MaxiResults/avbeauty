import { Sparkle, Gem, Palette, Syringe, Star, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
const Services = () => {
  const services = [{
    icon: Sparkle,
    title: "Design Simples",
    description: "Sobrancelhas bem desenhadas que valorizam muito a expressão e harmonia facial"
  }, {
    icon: Palette,
    title: "Design com Henna",
    description: "Nutrição dos fios, preenchimento natural de falhas com duração até 15 dias"
  }, {
    icon: Gem,
    title: "NV Brow (Fio a Fio)",
    description: "Técnica que desenha fios naturais, praticidade no dia a dia com resultado duradouro"
  }, {
    icon: Star,
    title: "Coloração Labial",
    description: "Lábios sempre corados, realce do contorno natural sem necessidade de batom"
  }, {
    icon: Waves,
    title: "Shadow Brow (Sombreada)",
    description: "Efeito maquiagem permanente, volume sofisticado para quem gosta de sobrancelha marcante"
  }, {
    icon: Sparkle,
    title: "Hidragloss",
    description: "Hidratação profunda com ácido hialurônico, lábios macios e volume sutil"
  }, {
    icon: Star,
    title: "Reconstrução de Sobrancelhas",
    description: "Tratamento que estimula crescimento, fortalece e recupera sobrancelhas ralas"
  }, {
    icon: Syringe,
    title: "Despigmentação a Laser",
    description: "Remoção segura de pigmentação antiga, correção de designs indesejados"
  }, {
    icon: Waves,
    title: "Brow Lamination",
    description: "Alinha e realça pelos, efeito lifting com volume instantâneo durando até 2 meses"
  }, {
    icon: Gem,
    title: "Derma (Dermaplaning)",
    description: "Renovação celular, clareia manchas, estimula colágeno devolvendo viço e maciez"
  }];
  return <section id="servicos" className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground mb-3 md:mb-4">Nossos Procedimentos</h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">Procedimentos especializados em embelezamento facial para realçar sua beleza natural</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto mb-8 sm:mb-12">
          {services.map((service, index) => <div key={index} className="bg-card p-5 sm:p-6 rounded-xl shadow-soft hover:shadow-hover transition-smooth group cursor-pointer animate-fade-in" style={{
          animationDelay: `${index * 0.1}s`
        }}>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary/20 transition-smooth">
                <service.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg sm:text-xl text-foreground mb-2 sm:mb-3 group-hover:text-primary transition-smooth">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>)}
        </div>

        <div className="text-center animate-fade-in">
          <Button size="lg" onClick={() => window.open("https://wa.me/5511989368534?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20procedimentos", "_blank")} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Saiba mais sobre cada procedimento
          </Button>
        </div>
      </div>
    </section>;
};
export default Services;