import { Instagram, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FooterTeaser() {
  return (
    <footer className="bg-[#000000] border-t border-[#2a2a2a] py-12 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-[#FFD700] mb-2">
            AV Beauty
          </h3>
          <p className="text-[#666] text-sm">
            Studio de estética facial em Ermelino Matarazzo - Zona Leste de SP
          </p>
        </div>

        <div className="flex items-center justify-center gap-8">
          <a
            href="https://www.instagram.com/andreiavieira_beauty/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#666] hover:text-[#FFD700] transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-6 h-6" />
          </a>
          <a
            href="https://wa.me/5511989368534"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#666] hover:text-[#FFD700] transition-colors"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-6 h-6" />
          </a>
        </div>

        <div className="text-[#666] text-sm space-y-2">
          <p>© 2024 AV Beauty</p>
          <p>Todos os direitos reservados</p>
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-[#666]">
          <Link to="/politica-de-privacidade" className="hover:text-[#FFD700] transition-colors">
            Política de Privacidade
          </Link>
          <span>|</span>
          <Link to="/termos-de-uso" className="hover:text-[#FFD700] transition-colors">
            Termos de Uso
          </Link>
        </div>
      </div>
    </footer>
  );
}
