import { Sparkle, Gem, Palette, Syringe, Star, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";

const Services = () => {
  const services = [
    {
      icon: Gem,
      title: "Lentes Naturais Hiper-Realistas",
      description: "Transformação natural e duradoura do seu sorriso com tecnologia de última geração",
    },
    {
      icon: Sparkle,
      title: "Clareamento Dental",
      description: "Dentes brancos e saudáveis com segurança e resultados impressionantes",
    },
    {
      icon: Palette,
      title: "Harmonização Facial",
      description: "Equilíbrio e rejuvenescimento do rosto com técnicas modernas",
    },
    {
      icon: Waves,
      title: "Preenchimento Labial",
      description: "Volume e definição natural dos lábios respeitando sua harmonia facial",
    },
    {
      icon: Star,
      title: "Bioestimuladores de Colágeno",
      description: "Estímulo natural do colágeno da pele para rejuvenescimento duradouro",
    },
    {
      icon: Syringe,
      title: "Toxina Botulínica",
      description: "Suavização de linhas de expressão com resultados naturais e elegantes",
    },
  ];

  return (
    <section id="servicos" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
            Nossos Serviços
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Procedimentos especializados para transformar seu sorriso e realçar sua beleza natural
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-xl shadow-soft hover:shadow-hover transition-smooth group cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-smooth">
                <service.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-xl text-foreground mb-3 group-hover:text-primary transition-smooth">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center animate-fade-in">
          <Button
            size="lg"
            onClick={() =>
              window.open(
                "https://wa.me/5511951903402?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20procedimentos",
                "_blank"
              )
            }
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Saiba mais sobre cada procedimento
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
