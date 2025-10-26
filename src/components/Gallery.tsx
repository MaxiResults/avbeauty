import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Gallery = () => {
  const [selectedCase, setSelectedCase] = useState<number | null>(null);

  const transformations = [
    { title: "Lentes Naturais", id: 1 },
    { title: "Harmonização Facial", id: 2 },
    { title: "Clareamento Dental", id: 3 },
    { title: "Preenchimento Labial", id: 4 },
    { title: "Lentes + Harmonização", id: 5 },
    { title: "Bioestimuladores", id: 6 },
  ];

  return (
    <section id="galeria" className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground mb-3 md:mb-4">
            Galeria de Transformações
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Resultados reais de pacientes que confiaram em nosso trabalho
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {transformations.map((item, index) => (
                <CarouselItem key={item.id} className="pl-2 md:pl-4 basis-full">
                  <div
                    className="animate-fade-in cursor-pointer"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => setSelectedCase(index)}
                  >
                    <div className="grid grid-cols-2 gap-2 md:gap-4">
                      {/* Antes */}
                      <div className="group relative overflow-hidden rounded-lg md:rounded-xl shadow-soft hover:shadow-hover transition-smooth">
                        <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 via-rose-light/20 to-accent/10 flex flex-col items-center justify-center p-4 md:p-6">
                          <div className="w-12 h-12 md:w-16 md:h-16 bg-card/80 rounded-full flex items-center justify-center mb-2 md:mb-3">
                            <span className="text-2xl md:text-3xl">📸</span>
                          </div>
                          <p className="font-display font-semibold text-foreground text-sm md:text-base text-center mb-1">
                            {item.title}
                          </p>
                          <p className="text-xs md:text-sm text-muted-foreground">Antes</p>
                        </div>
                        <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
                          <p className="text-primary-foreground font-semibold text-xs md:text-sm px-4 text-center">
                            Ver ampliado
                          </p>
                        </div>
                      </div>

                      {/* Depois */}
                      <div className="group relative overflow-hidden rounded-lg md:rounded-xl shadow-soft hover:shadow-hover transition-smooth">
                        <div className="aspect-[3/4] bg-gradient-to-br from-accent/10 via-terracota/20 to-rose-light/30 flex flex-col items-center justify-center p-4 md:p-6">
                          <div className="w-12 h-12 md:w-16 md:h-16 bg-card/80 rounded-full flex items-center justify-center mb-2 md:mb-3">
                            <span className="text-2xl md:text-3xl">✨</span>
                          </div>
                          <p className="font-display font-semibold text-foreground text-sm md:text-base text-center mb-1">
                            {item.title}
                          </p>
                          <p className="text-xs md:text-sm text-muted-foreground">Depois</p>
                        </div>
                        <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
                          <p className="text-primary-foreground font-semibold text-xs md:text-sm px-4 text-center">
                            Ver ampliado
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Mobile label */}
                    <div className="mt-3 text-center md:hidden">
                      <p className="text-sm text-muted-foreground">
                        Deslize para ver mais transformações
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="-left-12 lg:-left-16" />
              <CarouselNext className="-right-12 lg:-right-16" />
            </div>
          </Carousel>

          {/* Navigation dots for mobile */}
          <div className="flex justify-center gap-2 mt-6 md:hidden">
            {transformations.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-primary/30"
              />
            ))}
          </div>
        </div>

        {/* Lightbox */}
        {selectedCase !== null && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setSelectedCase(null)}
          >
            <button
              className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-smooth z-10"
              onClick={() => setSelectedCase(null)}
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            
            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Antes - Lightbox */}
              <div className="rounded-lg md:rounded-xl overflow-hidden">
                <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 via-rose-light/30 to-accent/20 flex flex-col items-center justify-center p-6 md:p-8">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-card/80 rounded-full flex items-center justify-center mb-4">
                    <span className="text-4xl md:text-5xl">📸</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2 text-center">
                    {transformations[selectedCase].title}
                  </h3>
                  <p className="text-white/80 text-sm md:text-base">Antes</p>
                </div>
              </div>

              {/* Depois - Lightbox */}
              <div className="rounded-lg md:rounded-xl overflow-hidden">
                <div className="aspect-[3/4] bg-gradient-to-br from-accent/20 via-terracota/30 to-rose-light/40 flex flex-col items-center justify-center p-6 md:p-8">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-card/80 rounded-full flex items-center justify-center mb-4">
                    <span className="text-4xl md:text-5xl">✨</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2 text-center">
                    {transformations[selectedCase].title}
                  </h3>
                  <p className="text-white/80 text-sm md:text-base">Depois</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
