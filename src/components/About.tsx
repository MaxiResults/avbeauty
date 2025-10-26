import draNicole from "@/assets/dra-nicole.jpg";

const About = () => {
  return (
    <section id="sobre" className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
          {/* Text content */}
          <div className="space-y-4 md:space-y-6 animate-fade-in order-2 lg:order-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground mb-4 md:mb-6">
              Sobre a Nicole Guedes Odonto
            </h2>
            
            <div className="space-y-3 md:space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
              <p>
                Na Nicole Guedes Odonto, acreditamos que um sorriso bonito vai muito além da 
                estética — ele reflete confiança, leveza e bem-estar. Por isso, cada tratamento 
                é planejado de forma personalizada, respeitando a identidade e a beleza natural 
                de cada paciente.
              </p>
              
              <p>
                Nosso propósito é transformar o cuidado odontológico em uma experiência acolhedora 
                e inspiradora. Da recepção ao atendimento clínico, cada detalhe foi pensado para 
                proporcionar conforto, segurança e exclusividade.
              </p>
              
              <p>
                Com tecnologia de ponta, técnicas modernas e um olhar artístico apurado, oferecemos 
                resultados hiper-realistas e harmônicos, revelando sorrisos autênticos e naturais.
              </p>
              
              <p className="font-semibold text-foreground">
                Aqui, cada pessoa é única — e cada sorriso, uma obra de arte.
              </p>
              
              <p className="text-primary font-display text-lg pt-4">
                Nicole Guedes Odonto: o encontro perfeito entre ciência, estética e cuidado genuíno.
              </p>
            </div>
          </div>

          {/* Image - Dra Nicole */}
          <div className="relative animate-fade-in order-1 lg:order-2" style={{ animationDelay: "0.2s" }}>
            <div className="aspect-[4/5] rounded-2xl shadow-soft overflow-hidden">
              <img 
                src={draNicole} 
                alt="Dra. Nicole Guedes" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 w-24 h-24 md:w-32 md:h-32 bg-terracota/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6 w-24 h-24 md:w-32 md:h-32 bg-primary/20 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
