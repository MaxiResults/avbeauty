import { useState, useEffect, useRef } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  remetente: 'lead' | 'IA';
  mensagem: string;
  data_envio: string;
}

interface ChatPopupProps {
  onClose: () => void;
}

const ChatPopup = ({ onClose }: ChatPopupProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(true);
  const [leadData, setLeadData] = useState({
    nome: "",
    email: "",
    telefone: ""
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Helpers for phone formatting and normalization (BR +55)
  const onlyDigits = (str: string) => str.replace(/\D/g, '');
  const maskPhoneBR = (value: string) => {
    const d = onlyDigits(value).slice(0, 11);
    if (d.length <= 2) return d;
    if (d.length <= 6) return `(${d.slice(0,2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
    return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7,11)}`;
  };
  const normalizePhoneToE164BR = (value: string) => {
    let d = onlyDigits(value);
    if (!d.startsWith('55')) d = '55' + d;
    return d;
  };

  const createSession = async (newLeadId: string | number) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-session', {
        body: { leadId: newLeadId }
      });

      if (error) throw error as any;

      return (data as any)?.sessionId ?? (data as any)?.id ?? (data as any)?.ID ?? null;
    } catch (err) {
      console.error('Erro ao criar sessão (seguindo sem persistência de chat):', err);
      return null;
    }
  };

  const saveMessage = async (remetente: 'lead' | 'IA', mensagem: string) => {
    if (!sessionId) return;
    await supabase.functions.invoke('save-message', {
      body: {
        sessionId,
        remetente,
        mensagem,
        tipo_mensagem: 'texto',
        origem: 'site'
      }
    });
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!leadData.nome || !leadData.email || !leadData.telefone) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    try {
      const normalizedPhone = normalizePhoneToE164BR(leadData.telefone);

      const { data, error } = await supabase.functions.invoke('create-lead', {
        body: {
          nome: leadData.nome,
          email: leadData.email,
          telefone: normalizedPhone,
          canal_origem: 'site',
          origem_url: window.location.href,
          status: 'novo',
          observacoes: 'lead captado através do chat do site',
          interesse: 'Chat online'
        }
      });

      if (error) throw error as any;

      const newLeadId = (data as any)?.leadId ?? (data as any)?.id ?? (data as any)?.ID;
      const newSessionId = await createSession(newLeadId);
      setLeadId(String(newLeadId));
      setSessionId(String(newSessionId));
      setShowLeadForm(false);

      const welcomeMsg: Message = {
        id: Date.now().toString(),
        remetente: 'IA',
        mensagem: `Olá ${leadData.nome}! Sou a assistente virtual da Dra. Nicole. Como posso ajudá-lo hoje?`,
        data_envio: new Date().toISOString()
      };
      setMessages([welcomeMsg]);
      await saveMessage('IA', welcomeMsg.mensagem);

    } catch (error) {
      console.error('Erro ao criar lead:', error);
      toast({
        title: "Erro",
        description: "Não foi possível iniciar o chat. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading || !sessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      remetente: 'lead',
      mensagem: inputValue,
      data_envio: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    await saveMessage('lead', inputValue);
    setInputValue("");
    setIsLoading(true);

    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-assistant`;
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          message: inputValue,
          sessionId: sessionId,
          leadName: leadData.nome,
        }),
      });

      const data = await response.json();

      if (data.reply) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          remetente: 'IA',
          mensagem: data.reply,
          data_envio: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiMessage]);
        await saveMessage('IA', data.reply);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-28 right-6 w-96 h-[600px] bg-background border border-border rounded-lg shadow-2xl flex flex-col z-50 animate-fade-in">
      <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Chat Online</h3>
          <p className="text-xs opacity-90">Dra. Nicole - Harmonização Facial</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-primary-foreground hover:bg-primary-foreground/20"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {showLeadForm ? (
        <div className="flex-1 p-6 flex flex-col justify-center">
          <h4 className="text-lg font-semibold mb-4">Olá! Vamos começar?</h4>
          <p className="text-sm text-muted-foreground mb-6">
            Para iniciar a conversa, por favor preencha seus dados:
          </p>
          <form onSubmit={handleLeadSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Seu nome"
                value={leadData.nome}
                onChange={(e) => setLeadData({ ...leadData, nome: e.target.value })}
                required
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Seu e-mail"
                value={leadData.email}
                onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="Seu telefone"
                value={leadData.telefone}
                onChange={(e) => setLeadData({ ...leadData, telefone: maskPhoneBR(e.target.value) })}
                maxLength={16}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Iniciar Conversa
            </Button>
          </form>
        </div>
      ) : (
        <>
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.remetente === 'lead' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.remetente === 'lead'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{msg.mensagem}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {new Date(msg.data_envio).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !inputValue.trim()}
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPopup;
