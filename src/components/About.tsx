import avbeautyTeam from "@/assets/andreia-vanessa.jpg";
const About = () => {
  return <section id="sobre" className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
          {/* Text content */}
          <div className="space-y-4 md:space-y-6 animate-fade-in order-2 lg:order-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground mb-4 md:mb-6">Sobre a AV Beauty</h2>
            
            <div className="space-y-3 md:space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
              <p>A AV BEAUTY nasceu da união de talentos de duas mulheres movidas por ação, visão e propósito. Unimos experiência e sensibilidade para oferecer serviços de embelezamento facial que valorizam, harmonizam e elevam a autoestima, trazendo leveza e naturalidade à expressão.  </p>
              
              <p>Desde a sua criação, a marca carrega o DNA da excelência, da arte e da inovação. Essa essência reflete a trajetória de Andreia, profissional referência na área da beleza, que transforma cada atendimento em uma experiência de confiança e satisfação por meio de seu talento refinado e olhar minucioso.</p>
              
              <p>Ao lado dela, Vanessa trouxe sua criatividade e visão sensível para construir um conceito único de experiência do cliente, presente em cada detalhe do espaço e dos serviços oferecidos.</p>
              
              <p className="font-semibold text-foreground">Na AV BEAUTY, cada atendimento é guiado por empatia, e cada mulher é lembrada de que a verdadeira beleza começa de dentro para fora.</p>
              
              <p className="font-display text-lg pt-4 text-inherit">
                Somos Andréia Vieira e Vanessa: profissionais apaixonadas por estética facial e pelo poder transformador do cuidado genuíno.
              </p>
            </div>
          </div>

          {/* Image - AVBeauty */}
          <div className="relative animate-fade-in order-1 lg:order-2" style={{
          animationDelay: "0.2s"
        }}>
            <div className="aspect-[4/5] rounded-2xl shadow-soft overflow-hidden">
              <img src={avbeautyTeam} alt="Andréia Vieira e Vanessa - AVBeauty" className="w-full h-full object-cover" />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 w-24 h-24 md:w-32 md:h-32 bg-secondary/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6 w-24 h-24 md:w-32 md:h-32 bg-primary/20 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>;
};
export default About;