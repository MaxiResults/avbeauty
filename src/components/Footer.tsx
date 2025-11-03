import { Instagram, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
const Footer = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };
  const menuItems = [{
    label: "Home",
    id: "home"
  }, {
    label: "Sobre",
    id: "sobre"
  }, {
    label: "Procedimentos",
    id: "servicos"
  }, {
    label: "Depoimentos",
    id: "depoimentos"
  }, {
    label: "Galeria",
    id: "galeria"
  }, {
    label: "Contato",
    id: "contato"
  }];
  return <footer className="bg-[#181818] text-[#ececec] py-12 border-t border-[#64473b]/20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Logo and description */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-[#64473b] flex items-center justify-center">
                <span className="text-[#fdfdfd] font-display font-bold text-xl">AV</span>
              </div>
              <span className="ml-3 font-display font-semibold text-lg text-[#ececec]">AV Beauty</span>
            </div>
            <p className="text-[#737373] max-w-md mx-auto font-sans">
              Studio de estética facial em Ermelino Matarazzo - Zona Leste de SP
            </p>
            <p className="text-[#737373] max-w-md mx-auto font-sans mt-2">
              Rua Governador Archer, 22 - Parque Cisper, SP
            </p>
            <p className="text-[#737373] max-w-md mx-auto font-sans mt-1">
              📱 (11) 98936-8534
            </p>
          </div>

          {/* Menu links */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {menuItems.map(item => <button key={item.id} onClick={() => scrollToSection(item.id)} className="text-[#737373] hover:text-[#ececec] transition-smooth font-sans">
                {item.label}
              </button>)}
          </div>

          {/* Social links */}
          <div className="flex justify-center gap-4 mb-8">
            <a href="https://www.instagram.com/andreiavieira_beauty/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#64473b]/20 hover:bg-[#64473b]/40 flex items-center justify-center transition-smooth" aria-label="Instagram">
              <Instagram className="w-5 h-5 text-[#ececec]" />
            </a>
            <a href="https://www.facebook.com/andreiavieiraclinic/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#64473b]/20 hover:bg-[#64473b]/40 flex items-center justify-center transition-smooth" aria-label="Facebook">
              <svg className="w-5 h-5 text-[#ececec]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://wa.me/5511989368534" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#64473b]/20 hover:bg-[#64473b]/40 flex items-center justify-center transition-smooth" aria-label="WhatsApp">
              <MessageCircle className="w-5 h-5 text-[#ececec]" />
            </a>
          </div>

          {/* Bottom section */}
          <div className="border-t border-[#64473b]/20 pt-8 text-center">
            <p className="text-sm text-[#737373] mb-2 font-sans">
              © 2024 AV Beauty - Todos os direitos reservados
            </p>
            <div className="flex justify-center gap-4 text-sm text-[#737373]">
              <Link to="/politica-de-privacidade" className="hover:text-[#ececec] transition-smooth font-sans">
                Política de Privacidade
              </Link>
              <span>|</span>
              <Link to="/termos-de-uso" className="hover:text-[#ececec] transition-smooth font-sans">
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;