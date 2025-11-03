import { Instagram, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FooterTeaser() {
  return (
    <footer className="bg-[#000000] border-t border-[#64473b] py-12 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div>
          <h3 className="text-2xl font-display font-bold text-[#704e3b] mb-2">
            AV Beauty
          </h3>
          <p className="text-[#737373] font-sans text-sm mb-2">
            Studio de estética facial em Ermelino Matarazzo - Zona Leste de SP
          </p>
          <p className="text-[#737373] font-sans text-sm">
            📍 Rua Governador Archer, 22 - Parque Cisper, SP<br/>
            📞 (11) 98936-8534
          </p>
        </div>

        <div className="flex items-center justify-center gap-8">
          <a
            href="https://www.instagram.com/andreiavieira_beauty/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#737373] hover:text-[#704e3b] transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-6 h-6" />
          </a>
          <a
            href="https://www.facebook.com/andreiavieiraclinic/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#737373] hover:text-[#704e3b] transition-colors"
            aria-label="Facebook"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a
            href="https://wa.me/5511989368534"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#737373] hover:text-[#704e3b] transition-colors"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-6 h-6" />
          </a>
        </div>

        <div className="text-[#737373] font-sans text-sm space-y-2">
          <p>© 2024 AV Beauty</p>
          <p>Todos os direitos reservados</p>
        </div>

        <div className="flex items-center justify-center gap-6 text-xs font-sans text-[#737373]">
          <Link to="/politica-de-privacidade" className="hover:text-[#704e3b] transition-colors">
            Política de Privacidade
          </Link>
          <span>|</span>
          <Link to="/termos-de-uso" className="hover:text-[#704e3b] transition-colors">
            Termos de Uso
          </Link>
        </div>
      </div>
    </footer>
  );
}
