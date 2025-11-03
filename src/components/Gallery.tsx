import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import foto1Antes from "@/assets/foto-1-antes.jpg";
import foto1Depois from "@/assets/foto-1-depois.jpg";
import foto2Antes from "@/assets/foto-2-antes.jpg";
import foto2Depois from "@/assets/foto-2-depois.jpg";
import foto3Antes from "@/assets/foto-3-antes.jpg";
import foto3Depois from "@/assets/foto-3-depois.jpg";
import foto4Antes from "@/assets/foto-4-antes.jpg";
import foto4Depois from "@/assets/foto-4-depois.jpg";
import foto5Antes from "@/assets/foto-5-antes.jpg";
import foto5Depois from "@/assets/foto-5-depois.jpg";

const Gallery = () => {
  const [selectedCase, setSelectedCase] = useState<number | null>(null);

  const transformations = [
    { 
      title: "Design de Sobrancelhas", 
      id: 1,
      beforeImage: foto1Antes,
      afterImage: foto1Depois
    },
    { 
      title: "Design com Henna", 
      id: 2,
      beforeImage: foto2Antes,
      afterImage: foto2Depois
    },
    { 
      title: "Brow Lamination", 
      id: 3,
      beforeImage: foto3Antes,
      afterImage: foto3Depois
    },
    { 
      title: "Reconstrução de Sobrancelhas", 
      id: 4,
      beforeImage: foto4Antes,
      afterImage: foto4Depois
    },
    { 
      title: "Despigmentação a Laser", 
      id: 5,
      beforeImage: foto5Antes,
      afterImage: foto5Depois
    },
  ];

  return (
    <section id="galeria" className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground mb-3 md:mb-4">
            Galeria de Transformações
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Resultados reais de clientes que confiaram em nosso trabalho
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
                        <img 
                          src={item.beforeImage} 
                          alt={`${item.title} - Antes`}
                          className="w-full h-full object-cover aspect-[3/4]"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 md:p-4">
                          <p className="font-display font-semibold text-white text-sm md:text-base text-center mb-1">
                            {item.title}
                          </p>
                          <p className="text-xs md:text-sm text-white/90 text-center">Antes</p>
                        </div>
                        <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
                          <p className="text-primary-foreground font-semibold text-xs md:text-sm px-4 text-center">
                            Ver ampliado
                          </p>
                        </div>
                      </div>

                      {/* Depois */}
                      <div className="group relative overflow-hidden rounded-lg md:rounded-xl shadow-soft hover:shadow-hover transition-smooth">
                        <img 
                          src={item.afterImage} 
                          alt={`${item.title} - Depois`}
                          className="w-full h-full object-cover aspect-[3/4]"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 md:p-4">
                          <p className="font-display font-semibold text-white text-sm md:text-base text-center mb-1">
                            {item.title}
                          </p>
                          <p className="text-xs md:text-sm text-white/90 text-center">Depois</p>
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
              <div className="rounded-lg md:rounded-xl overflow-hidden relative">
                <img 
                  src={transformations[selectedCase].beforeImage} 
                  alt={`${transformations[selectedCase].title} - Antes`}
                  className="w-full h-full object-cover aspect-[3/4]"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2 text-center">
                    {transformations[selectedCase].title}
                  </h3>
                  <p className="text-white/90 text-sm md:text-base text-center">Antes</p>
                </div>
              </div>

              {/* Depois - Lightbox */}
              <div className="rounded-lg md:rounded-xl overflow-hidden relative">
                <img 
                  src={transformations[selectedCase].afterImage} 
                  alt={`${transformations[selectedCase].title} - Depois`}
                  className="w-full h-full object-cover aspect-[3/4]"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2 text-center">
                    {transformations[selectedCase].title}
                  </h3>
                  <p className="text-white/90 text-sm md:text-base text-center">Depois</p>
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
