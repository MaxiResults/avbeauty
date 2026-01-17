import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-32 px-4">
        <div className="max-w-lg w-full text-center">
          {/* Decorative 404 */}
          <div className="relative mb-8">
            <span className="text-[150px] md:text-[200px] font-display font-bold text-primary/10 leading-none select-none">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="w-16 h-16 md:w-24 md:h-24 text-primary/40" />
            </div>
          </div>

          {/* Message */}
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
            Página não encontrada
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Desculpe, a página que você está procurando não existe ou foi movida. 
            Que tal voltar para a página inicial?
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              <Link to="/">
                <Home className="w-4 h-4" />
                Ir para Home
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="gap-2 border-primary/30 hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">
              Talvez você esteja procurando:
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/" 
                className="text-sm text-primary hover:text-primary/80 transition-smooth"
              >
                Página Inicial
              </Link>
              <span className="text-border">•</span>
              <Link 
                to="/loja" 
                className="text-sm text-primary hover:text-primary/80 transition-smooth"
              >
                Nossa Loja
              </Link>
              <span className="text-border">•</span>
              <a 
                href="https://wa.me/5511989368534?text=Olá!%20Gostaria%20de%20agendar%20um%20horário"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:text-primary/80 transition-smooth"
              >
                Fale Conosco
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
