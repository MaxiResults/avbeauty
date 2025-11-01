import { useState, useEffect, useRef } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toZonedTime } from 'date-fns-tz';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

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
  const TIMEZONE = 'America/Sao_Paulo';
  
  // Função helper para converter data para timezone de São Paulo
  const toSaoPauloTime = (date: Date) => {
    return toZonedTime(date, TIMEZONE).toISOString();
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(true);
  const [leadData, setLeadData] = useState({
    nome: "",
    email: "",
    telefone: ""
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Hidrata contexto do chat do armazenamento local
  useEffect(() => {
    try {
      const persistedThread = localStorage.getItem('chat_thread_id');
      const persistedSession = localStorage.getItem('chat_session_id');
      const persistedLead = localStorage.getItem('chat_lead_data');
      if (persistedThread) setThreadId(persistedThread);
      if (persistedSession) setSessionId(persistedSession);
      if (persistedLead) {
        const parsed = JSON.parse(persistedLead);
        // Sempre mostra o formulário se não tiver nome
        if (parsed?.nome && persistedSession) {
          setShowLeadForm(false);
          setLeadData((prev) => ({ ...prev, ...parsed }));
        }
      }
    } catch {}
  }, []);

  // Limpa o localStorage quando o chat for encerrado
  const handleClose = () => {
    try {
      localStorage.removeItem('chat_thread_id');
      localStorage.removeItem('chat_session_id');
      localStorage.removeItem('chat_lead_data');
    } catch {}
    onClose();
  };

  // Rolagem automática até o fim
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isLoading, showLeadForm]);

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

      if (!newSessionId) {
        toast({
          title: "Não foi possível iniciar a sessão",
          description: "Tente novamente em instantes.",
          variant: "destructive",
        });
        return;
      }

      setLeadId(String(newLeadId));
      setSessionId(String(newSessionId));
      setShowLeadForm(false);
      try {
        localStorage.setItem('chat_session_id', String(newSessionId));
        localStorage.setItem('chat_lead_data', JSON.stringify(leadData));
      } catch {}

      const welcomeMsg: Message = {
        id: Date.now().toString(),
        remetente: 'IA',
        mensagem: `Olá ${leadData.nome}! Sou a assistente virtual da Dra. Nicole. Como posso ajudá-lo hoje?`,
        data_envio: toSaoPauloTime(new Date())
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
      data_envio: toSaoPauloTime(new Date())
    };

    setMessages(prev => [...prev, userMessage]);
    await saveMessage('lead', inputValue);
    const messageText = inputValue;
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
          message: messageText,
          sessionId: sessionId,
          leadName: leadData.nome,
          leadEmail: leadData.email,
          leadPhone: leadData.telefone,
          threadId: threadId,
        }),
      });

      const data = await response.json();

      if (data.reply) {
        // Armazenar threadId se for a primeira resposta
        if (data.threadId && !threadId) {
          setThreadId(data.threadId);
          try { localStorage.setItem('chat_thread_id', data.threadId); } catch {}
          console.log("Thread ID armazenado:", data.threadId);
        }

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          remetente: 'IA',
          mensagem: data.reply,
          data_envio: toSaoPauloTime(new Date())
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
    <div className="fixed inset-x-0 bottom-0 md:bottom-28 md:right-6 md:left-auto md:w-[28.8rem] h-[100dvh] md:h-[580px] bg-background border-t md:border md:border-border md:rounded-lg shadow-2xl flex flex-col z-50 animate-fade-in">
      <div className="bg-primary text-primary-foreground p-3 md:p-4 md:rounded-t-lg flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-base md:text-lg">Chat Online</h3>
          <p className="text-xs md:text-sm opacity-90">Dra. Nicole - Harmonização Facial</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Encerrar conversa?</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja encerrar esta conversa? O histórico será perdido.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleClose}>Sim, encerrar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {showLeadForm ? (
        <div className="flex-1 p-3 md:p-4 flex flex-col justify-center">
          <h4 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Olá! Vamos começar?</h4>
          <p className="text-sm text-muted-foreground mb-3 md:mb-4">
            Para iniciar a conversa, por favor preencha seus dados:
          </p>
          <form onSubmit={handleLeadSubmit} className="space-y-3">
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
          <ScrollArea className="flex-1 p-4 chat-scrollbar" ref={scrollRef}>
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
              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          <div className="p-3 md:p-4 border-t border-border">
            <div className="flex gap-2 items-end">
              <Textarea
                placeholder="Digite sua mensagem..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={isLoading}
                rows={2}
                className="resize-none min-h-[60px] md:min-h-[80px]"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !inputValue.trim()}
                size="icon"
                className="mb-1"
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
