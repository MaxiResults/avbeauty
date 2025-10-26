import { Button } from "@/components/ui/button";
import { Sparkles, Star, Smile } from "lucide-react";

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const features = [
    {
      icon: Smile,
      title: "Lentes Hiper-Realistas",
      description: "Transformação natural e duradoura do seu sorriso com tecnologia de ponta",
    },
    {
      icon: Sparkles,
      title: "Harmonização Facial",
      description: "Equilíbrio perfeito entre beleza natural e técnicas avançadas",
    },
    {
      icon: Star,
      title: "Resultados Naturais",
      description: "Cada sorriso é único, assim como nossos tratamentos personalizados",
    },
  ];

  return (
    <section id="home" className="relative pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-light/30 via-background to-primary/5 -z-10" />
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4 sm:mb-6 animate-fade-in-up leading-tight px-2">
            Sorrisos que encantam,
            <br />
            <span className="text-primary">resultados que transformam</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 animate-fade-in max-w-2xl mx-auto px-4">
            Especialistas em lentes naturais hiper-realistas e harmonização facial
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 animate-fade-in px-4">
            <Button
              size="lg"
              onClick={() =>
                window.open(
                  "https://wa.me/5511951903402?text=Olá!%20Gostaria%20de%20transformar%20meu%20sorriso",
                  "_blank"
                )
              }
              className="bg-terracota hover:bg-terracota/90 text-terracota-foreground text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6"
            >
              Quero transformar meu sorriso
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("servicos")}
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6"
            >
              Conheça nossos serviços
            </Button>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16 md:mt-20">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card p-5 sm:p-6 rounded-xl shadow-soft hover:shadow-hover transition-smooth animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-base sm:text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
