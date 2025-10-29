import { Instagram, Mail, Phone } from 'lucide-react';

export function FooterTeaser() {
  return (
    <footer className="bg-[#000000] border-t border-[#2a2a2a] py-12 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-[#FFD700] mb-2">
            Nicole Guedes Odonto
          </h3>
          <p className="text-[#666] text-sm">
            Sorrisos que encantam, resultados que transformam
          </p>
        </div>

        <div className="flex items-center justify-center gap-8">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#666] hover:text-[#FFD700] transition-colors"
          >
            <Instagram className="w-6 h-6" />
          </a>
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#666] hover:text-[#FFD700] transition-colors"
          >
            <Phone className="w-6 h-6" />
          </a>
          <a
            href="mailto:contato@nicoleguedesodonto.com.br"
            className="text-[#666] hover:text-[#FFD700] transition-colors"
          >
            <Mail className="w-6 h-6" />
          </a>
        </div>

        <div className="text-[#666] text-sm space-y-2">
          <p>© 2024 Nicole Guedes Odonto</p>
          <p>Todos os direitos reservados</p>
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-[#666]">
          <a href="#" className="hover:text-[#FFD700] transition-colors">
            Política de Privacidade
          </a>
          <span>|</span>
          <a href="#" className="hover:text-[#FFD700] transition-colors">
            Termos de Uso
          </a>
        </div>
      </div>
    </footer>
  );
}
