import { Instagram, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
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
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Logo and description */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-xl">AV</span>
              </div>
              <span className="ml-3 font-display font-semibold text-lg">
                AVBeauty
              </span>
            </div>
            <p className="text-secondary-foreground/80 max-w-md mx-auto">
              Studio de estética facial em Ermelino Matarazzo - Zona Leste de SP
            </p>
          </div>

          {/* Menu links */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-secondary-foreground/80 hover:text-secondary-foreground transition-smooth"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Social links */}
          <div className="flex justify-center gap-4 mb-8">
            <a
              href="https://www.instagram.com/andreiavieira_beauty/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-secondary-foreground/10 hover:bg-secondary-foreground/20 flex items-center justify-center transition-smooth"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://wa.me/5511989368534"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-secondary-foreground/10 hover:bg-secondary-foreground/20 flex items-center justify-center transition-smooth"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>

          {/* Bottom section */}
          <div className="border-t border-secondary-foreground/10 pt-8 text-center">
            <p className="text-sm text-secondary-foreground/60 mb-2">
              © 2024 AVBeauty - Todos os direitos reservados
            </p>
            <div className="flex justify-center gap-4 text-sm text-secondary-foreground/60">
              <Link 
                to="/politica-de-privacidade" 
                className="hover:text-secondary-foreground transition-smooth"
              >
                Política de Privacidade
              </Link>
              <span>|</span>
              <Link 
                to="/termos-de-uso" 
                className="hover:text-secondary-foreground transition-smooth"
              >
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
