import { useState } from "react";
import { MapPin, Phone, Mail, Instagram, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { submitLead, type LeadData } from "@/lib/supabase";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    interesse: "",
    observacoes: "",
  });

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers
        .replace(/^(\d{2})(\d)/g, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData({ ...formData, telefone: formatted });
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!formData.nome || !formData.telefone || !formData.email || !formData.interesse) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(formData.email)) {
      toast({
        title: "E-mail inválido",
        description: "Por favor, insira um e-mail válido.",
        variant: "destructive",
      });
      return;
    }

    const phoneNumbers = formData.telefone.replace(/\D/g, "");
    if (phoneNumbers.length < 10) {
      toast({
        title: "Telefone inválido",
        description: "Por favor, insira um telefone válido.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const leadData: LeadData = {
        site_url: "nicoleguedesodonto.com.br",
        lead_nome: formData.nome,
        lead_telefone: "55" + phoneNumbers,
        lead_email: formData.email,
        lead_interest: formData.interesse,
        lead_obs: formData.observacoes || undefined,
      };

      await submitLead(leadData);

      toast({
        title: "Solicitação enviada com sucesso!",
        description: "Em breve entraremos em contato com você.",
      });

      // Reset form
      setFormData({
        nome: "",
        telefone: "",
        email: "",
        interesse: "",
        observacoes: "",
      });
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro ao enviar sua solicitação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const infoItems = [
    {
      icon: MapPin,
      title: "Endereço",
      content: "Av. Aniello Pratice, 50 - Jardim Santa Francisca, Guarulhos/SP",
    },
    {
      icon: Phone,
      title: "WhatsApp",
      content: "(11) 95190-3402",
      link: "https://wa.me/5511951903402",
    },
    {
      icon: Mail,
      title: "E-mail",
      content: "contato@nicoleguedesodonto.com.br",
      link: "mailto:contato@nicoleguedesodonto.com.br",
    },
    {
      icon: Instagram,
      title: "Instagram",
      content: "@dra.nicoleguedess",
      link: "https://instagram.com/dra.nicoleguedess",
    },
    {
      icon: Clock,
      title: "Horário",
      content: "Seg a Sex: 9h às 18h | Sáb: 9h às 13h",
    },
  ];

  return (
    <section id="contato" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
            Entre em Contato
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Agende sua avaliação e dê o primeiro passo para transformar seu sorriso
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Form */}
          <div className="animate-fade-in">
            <h3 className="text-2xl font-display font-semibold text-foreground mb-6">
              Agende sua avaliação
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Seu nome completo"
                  required
                />
              </div>

              <div>
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={handlePhoneChange}
                  placeholder="(11) 95190-3402"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="interesse">Interesse *</Label>
                <Select
                  value={formData.interesse}
                  onValueChange={(value) => setFormData({ ...formData, interesse: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu interesse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lentes Naturais">Lentes Naturais</SelectItem>
                    <SelectItem value="Clareamento">Clareamento</SelectItem>
                    <SelectItem value="Harmonização Facial">Harmonização Facial</SelectItem>
                    <SelectItem value="Preenchimento Labial">Preenchimento Labial</SelectItem>
                    <SelectItem value="Bioestimuladores">Bioestimuladores</SelectItem>
                    <SelectItem value="Toxina Botulínica">Toxina Botulínica</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Conte-nos mais sobre suas expectativas (opcional)"
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-terracota hover:bg-terracota/90 text-terracota-foreground"
              >
                {isSubmitting ? "Enviando..." : "Enviar solicitação"}
              </Button>
            </form>
          </div>

          {/* Info */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-2xl font-display font-semibold text-foreground mb-6">
              Informações de Contato
            </h3>
            
            <div className="space-y-4">
              {infoItems.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">{item.title}</p>
                    {item.link ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-smooth"
                      >
                        {item.content}
                      </a>
                    ) : (
                      <p className="text-muted-foreground">{item.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="mt-8">
              <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/10 via-accent/5 to-rose-light/10 shadow-soft flex items-center justify-center">
                <div className="text-center p-6">
                  <MapPin className="w-12 h-12 text-primary mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium">
                    Mapa do Google aqui
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Av. Aniello Pratice, 50 - Guarulhos/SP
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
