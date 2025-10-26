import { useState, useEffect, useRef } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { supabase } from "@/lib/supabase";
import { useToast } from "./ui/use-toast";

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

  const createSession = async (newLeadId: string) => {
    const { data, error } = await supabase
      .from('Conversas_sessao')
      .insert({
        lead_id: newLeadId,
        canal: 'site',
        origem: 'chat',
        status_sessao: 'ativa',
        Cliente_ID: 2
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar sessão:', error);
      throw error;
    }

    return data.ID;
  };

  const saveMessage = async (remetente: 'lead' | 'IA', mensagem: string) => {
    if (!sessionId) return;

    await supabase
      .from('Conversas_Historico')
      .insert({
        sessao_id: sessionId,
        remetente,
        tipo_mensagem: 'texto',
        mensagem,
        message: mensagem,
        origem: 'site',
        cliente_id: 2
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
      const { data: lead, error } = await supabase
        .from('Leads_Cadastro')
        .insert({
          Nome: leadData.nome,
          Email: leadData.email,
          Telefone: leadData.telefone,
          canal_origem: 'site',
          origem_url: window.location.href,
          status: 'novo',
          observacoes: 'lead captado através do chat do site',
          interesse: 'Chat online',
          Cliente_ID: 2
        })
        .select()
        .single();

      if (error) throw error;

      const newSessionId = await createSession(lead.ID);
      setLeadId(lead.ID);
      setSessionId(newSessionId);
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
      const response = await fetch(
        `https://sunccjukvrximjiqzdkm.supabase.co/functions/v1/chat-assistant`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1bmNjanVrdnJ4aW1qaXF6ZGttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNzMyODUsImV4cCI6MjA3NDg0OTI4NX0.Xt68Jol4GQ-GeL7g4z_wmm6ui81BIpTNJmNO7WhR_7E`
          },
          body: JSON.stringify({
            message: inputValue,
            sessionId: sessionId,
            leadName: leadData.nome
          })
        }
      );

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
                placeholder="Seu telefone"
                value={leadData.telefone}
                onChange={(e) => setLeadData({ ...leadData, telefone: e.target.value })}
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
