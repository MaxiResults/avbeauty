import { useState, useEffect } from "react";
import { Menu, X, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setIsMobileMenuOpen(false);
    }
  };

  const menuItems = [
    { label: "Home", id: "home" },
    { label: "Sobre", id: "sobre" },
    { label: "Serviços", id: "servicos" },
    { label: "Depoimentos", id: "depoimentos" },
    { label: "Galeria", id: "galeria" },
    { label: "Contato", id: "contato" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${
        isScrolled ? "bg-card/95 backdrop-blur-md shadow-soft" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src={logo} alt="Nicole Guedes Odonto" className="h-10 w-auto" />
            <span className="font-display font-bold text-xl text-foreground hidden sm:block">
              Nicole Guedes
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-foreground hover:text-primary transition-smooth font-medium"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Social + CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="https://instagram.com/dra.nicoleguedess"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram da Dra. Nicole"
              className="p-2 rounded-full hover:bg-primary/10 transition-smooth"
            >
              <Instagram className="w-5 h-5 text-foreground" />
            </a>
            <a
              href="https://www.facebook.com/dranicoleguedes"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook da Dra. Nicole"
              className="p-2 rounded-full hover:bg-primary/10 transition-smooth"
            >
              <Facebook className="w-5 h-5 text-foreground" />
            </a>
            <Button
              onClick={() =>
                window.open(
                  "https://wa.me/5511951903402?text=Olá!%20Gostaria%20de%20agendar%20uma%20avaliação",
                  "_blank"
                )
              }
              className="bg-terracota hover:bg-terracota/90 text-terracota-foreground"
            >
              Agendar Consulta
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-6 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-foreground hover:text-primary transition-smooth font-medium text-left py-2"
                >
                  {item.label}
                </button>
              ))}
              <Button
                onClick={() =>
                  window.open(
                    "https://wa.me/5511951903402?text=Olá!%20Gostaria%20de%20agendar%20uma%20avaliação",
                    "_blank"
                  )
                }
                className="bg-terracota hover:bg-terracota/90 text-terracota-foreground w-full"
              >
                Agendar Consulta
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
