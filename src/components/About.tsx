import draNicole from "@/assets/dra-nicole.jpg";

const About = () => {
  return (
    <section id="sobre" className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
          {/* Text content */}
          <div className="space-y-4 md:space-y-6 animate-fade-in order-2 lg:order-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground mb-4 md:mb-6">
              Sobre a AVBeauty
            </h2>
            
            <div className="space-y-3 md:space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
              <p>
                Na AVBeauty, estética facial é apenas o começo. Administrado por Andréia Vieira e Vanessa, 
                duas mulheres que transformaram força e sensibilidade em propósito, o Studio é um espaço 
                onde beleza se revela como expressão de bem-estar, saúde e reconexão com a própria essência.
              </p>
              
              <p>
                Cada atendimento é pensado como um momento único. Aqui, o toque é cuidadoso, o olhar é atento 
                e o tempo é respeitado. Porque acreditamos que o verdadeiro cuidado começa quando você se sente 
                vista, ouvida e acolhida.
              </p>
              
              <p>
                Com anos de experiência e uma paixão genuína pelo que fazem, os profissionais da AVBeauty 
                entregam resultados naturais, sofisticados e profundamente humanos. Tudo é feito com precisão, 
                carinho e respeito pela sua individualidade.
              </p>
              
              <p className="font-semibold text-foreground">
                AVBeauty não é sobre mudar quem você é. É sobre revelar, com delicadeza e precisão, a beleza que já habita em você.
              </p>
              
              <p className="text-primary font-display text-lg pt-4">
                Somos Andréia Vieira e Vanessa: profissionais apaixonadas por estética facial e pelo poder transformador do cuidado genuíno.
              </p>
            </div>
          </div>

          {/* Image - AVBeauty */}
          <div className="relative animate-fade-in order-1 lg:order-2" style={{ animationDelay: "0.2s" }}>
            <div className="aspect-[4/5] rounded-2xl shadow-soft overflow-hidden">
              <img 
                src={draNicole} 
                alt="Andréia Vieira e Vanessa - AVBeauty" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 w-24 h-24 md:w-32 md:h-32 bg-secondary/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6 w-24 h-24 md:w-32 md:h-32 bg-primary/20 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
