import { MessageCircle, MessageSquare } from "lucide-react";
import { useState } from "react";

const FloatingButtons = () => {
  const [showChatTooltip, setShowChatTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-4">
      {/* Chat IA Button - Coming Soon */}
      <div className="relative">
        <button
          onClick={() => setShowChatTooltip(!showChatTooltip)}
          className="w-16 h-16 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg flex items-center justify-center transition-smooth animate-pulse-soft cursor-not-allowed opacity-70"
          aria-label="Chat online"
        >
          <MessageSquare className="w-7 h-7 text-white" />
        </button>
        
        {/* Tooltip */}
        {showChatTooltip && (
          <div className="absolute right-16 bottom-0 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg shadow-lg whitespace-nowrap animate-fade-in">
            <p className="font-semibold">Em breve</p>
            <p className="text-sm">Chat online disponível em breve</p>
          </div>
        )}
      </div>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/5511951903402?text=Olá!%20Gostaria%20de%20agendar%20uma%20avaliação"
        target="_blank"
        rel="noopener noreferrer"
        className="w-16 h-16 rounded-full bg-[#25D366] hover:bg-[#20BD5A] shadow-lg flex items-center justify-center transition-smooth animate-pulse-soft group"
        aria-label="Fale conosco no WhatsApp"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </a>

      {/* WhatsApp Tooltip on hover */}
      <div className="absolute right-16 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg shadow-lg whitespace-nowrap">
          Fale conosco
        </div>
      </div>
    </div>
  );
};

export default FloatingButtons;
