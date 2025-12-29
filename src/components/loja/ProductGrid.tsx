import { ProductCard } from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductGridProps {
  produtos: any[];
  isLoading: boolean;
}

export function ProductGrid({ produtos, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <section id="ofertas" className="py-16 lg:py-24 bg-[#fdfdfd]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#181818] mb-4 font-display">
              Ofertas Exclusivas AV Beauty
            </h2>
            <p className="text-lg text-[#737373] font-sans">
              Tratamentos faciais selecionados com descontos imperdíveis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="w-full h-64 rounded-t-2xl" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-1/3" />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="ofertas" className="py-16 lg:py-24 bg-[#fdfdfd]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#181818] mb-4 font-display">
            Ofertas Exclusivas AV Beauty
          </h2>
          <p className="text-lg text-[#737373] font-sans">
            Tratamentos faciais selecionados com descontos imperdíveis
          </p>
        </div>

        {produtos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-[#737373] font-sans">
              Nenhum tratamento disponível no momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {produtos.map((produto) => (
              <ProductCard key={produto.id} produto={produto} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
