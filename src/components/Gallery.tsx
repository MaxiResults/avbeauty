import { useState } from "react";
import { X } from "lucide-react";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const cases = [
    { title: "Lentes Naturais", type: "Antes" },
    { title: "Lentes Naturais", type: "Depois" },
    { title: "Harmonização Facial", type: "Antes" },
    { title: "Harmonização Facial", type: "Depois" },
    { title: "Clareamento Dental", type: "Antes" },
    { title: "Clareamento Dental", type: "Depois" },
    { title: "Preenchimento Labial", type: "Antes" },
    { title: "Preenchimento Labial", type: "Depois" },
    { title: "Lentes + Harmonização", type: "Antes" },
  ];

  return (
    <section id="galeria" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
            Galeria de Transformações
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Resultados reais de pacientes que confiaram em nosso trabalho
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {cases.map((item, index) => (
            <div
              key={index}
              className="relative group cursor-pointer overflow-hidden rounded-xl shadow-soft hover:shadow-hover transition-smooth animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => setSelectedImage(index)}
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 via-rose-light/20 to-accent/10 flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-card/80 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-3xl">
                      {item.type === "Antes" ? "📸" : "✨"}
                    </span>
                  </div>
                  <p className="font-display font-semibold text-foreground mb-1">
                    {item.title}
                  </p>
                  <p className="text-sm text-muted-foreground">{item.type}</p>
                </div>
              </div>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
                <p className="text-primary-foreground font-semibold">Ver em tamanho completo</p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage !== null && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-smooth"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <div className="max-w-4xl w-full">
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 via-rose-light/30 to-accent/20 rounded-xl flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 bg-card/80 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-5xl">
                      {cases[selectedImage].type === "Antes" ? "📸" : "✨"}
                    </span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-2">
                    {cases[selectedImage].title}
                  </h3>
                  <p className="text-white/80">{cases[selectedImage].type}</p>
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
