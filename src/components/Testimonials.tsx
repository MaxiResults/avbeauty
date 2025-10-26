import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Ana Paula Santos",
      text: "Resultado incrível! As lentes ficaram tão naturais que ninguém acredita que não são meus dentes originais. A Dra. Nicole tem um olhar muito especial para os detalhes.",
      rating: 5,
    },
    {
      name: "Mariana Costa",
      text: "O atendimento é excepcional do início ao fim. Me senti acolhida e segura durante todo o processo. Meu sorriso ficou perfeito, exatamente como sonhei!",
      rating: 5,
    },
    {
      name: "Juliana Oliveira",
      text: "A harmonização facial superou todas as minhas expectativas. Resultados naturais e um atendimento humanizado. Recomendo de olhos fechados!",
      rating: 5,
    },
    {
      name: "Fernanda Lima",
      text: "Clínica impecável, tecnologia de ponta e profissionais extremamente qualificados. Meu sorriso está radiante e minha autoestima lá em cima!",
      rating: 5,
    },
    {
      name: "Beatriz Mendes",
      text: "Fiz o clareamento e as lentes. O resultado ficou tão perfeito e natural que todos acham que é meu sorriso original. Gratidão eterna!",
      rating: 5,
    },
    {
      name: "Camila Rodrigues",
      text: "Profissionalismo, cuidado e atenção em cada detalhe. A Dra. Nicole é uma verdadeira artista! Meu sorriso nunca esteve tão bonito.",
      rating: 5,
    },
  ];

  const itemsPerView = 3;
  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

  const next = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <section id="depoimentos" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
            O que nossos pacientes dizem
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Depoimentos reais de quem transformou o sorriso e a autoestima conosco
          </p>
        </div>

        <div className="max-w-6xl mx-auto relative">
          {/* Carousel container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 px-3"
                >
                  <div className="bg-card p-6 rounded-xl shadow-soft h-full">
                    {/* Profile placeholder */}
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-rose/20 flex items-center justify-center">
                        <span className="text-xl font-display font-semibold text-primary">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                        <div className="flex gap-0.5 mt-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-terracota text-terracota" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      "{testimonial.text}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="rounded-full border-2"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="rounded-full border-2"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
