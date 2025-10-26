const About = () => {
  return (
    <section id="sobre" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Text content */}
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-6">
              Sobre a Nicole Guedes Odonto
            </h2>
            
            <div className="space-y-4 text-muted-foreground leading-relaxed">
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

          {/* Image placeholder */}
          <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-rose-light/50 via-primary/10 to-accent/20 shadow-soft overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">✨</span>
                  </div>
                  <p className="text-muted-foreground font-medium">
                    Espaço reservado para imagem da clínica
                  </p>
                </div>
              </div>
            </div>
            
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-terracota/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
