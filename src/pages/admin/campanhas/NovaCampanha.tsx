import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/admin/Sidebar';
import { Header } from '@/components/admin/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ArrowLeft, FileText, BarChart3, Globe, Copy } from 'lucide-react';
import { CampanhaFormData } from '@/types/campanha';
import { toZonedTime } from 'date-fns-tz';
import { APP_CLIENTE_ID, APP_EMPRESA_ID } from '@/config/app.config';

export default function NovaCampanha() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const TIMEZONE = 'America/Sao_Paulo';

  // Função helper para converter data para timezone de São Paulo
  const toSaoPauloTime = (date: Date) => {
    return toZonedTime(date, TIMEZONE).toISOString();
  };
  const [formData, setFormData] = useState<CampanhaFormData>({
    Nome_campanha: '',
    Slug: '',
    Campanha_Status: 'Agendada',
    Campanha_Tipo: '',
    Descricao: '',
    Data_Inicio: new Date(),
    Data_Fim: new Date(),
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_content: '',
    canal_principal: '',
    plataforma_ads: [],
    Investimento_total: 0,
    url_principal: '',
    publico_alvo: '',
  });

  const generateSlug = (nome: string) => {
    return nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNomeChange = (nome: string) => {
    setFormData({ ...formData, Nome_campanha: nome, Slug: generateSlug(nome) });
  };

  const handlePlatformToggle = (platform: string) => {
    const current = formData.plataforma_ads || [];
    const updated = current.includes(platform)
      ? current.filter(p => p !== platform)
      : [...current, platform];
    setFormData({ ...formData, plataforma_ads: updated });
  };

  const getFullUrl = () => {
    const base = formData.url_principal || '';
    const params = new URLSearchParams();
    if (formData.utm_source) params.append('utm_source', formData.utm_source);
    if (formData.utm_medium) params.append('utm_medium', formData.utm_medium);
    if (formData.utm_campaign) params.append('utm_campaign', formData.utm_campaign);
    if (formData.utm_content) params.append('utm_content', formData.utm_content);
    
    const queryString = params.toString();
    return queryString ? `${base}?${queryString}` : base;
  };

  const validateForm = () => {
    if (!formData.Nome_campanha.trim()) {
      toast.error('Nome da campanha é obrigatório');
      return false;
    }
    if (!formData.Slug.trim()) {
      toast.error('Slug é obrigatório');
      return false;
    }
    if (!formData.Data_Inicio) {
      toast.error('Data de início é obrigatória');
      return false;
    }
    if (!formData.Data_Fim) {
      toast.error('Data de término é obrigatória');
      return false;
    }
    if (new Date(formData.Data_Fim) <= new Date(formData.Data_Inicio)) {
      toast.error('Data de término deve ser maior que data de início');
      return false;
    }
    if (!formData.url_principal.trim()) {
      toast.error('URL principal é obrigatória');
      return false;
    }
    return true;
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.from('campanhas').insert([{
        cliente_id: APP_CLIENTE_ID,
        empresa_id: APP_EMPRESA_ID,
        nome_campanha: formData.Nome_campanha,
        slug: formData.Slug,
        campanha_status: isDraft ? 'Suspensa' : formData.Campanha_Status,
        campanha_tipo: formData.Campanha_Tipo || null,
        descricao: formData.Descricao || null,
        data_inicio: toSaoPauloTime(formData.Data_Inicio),
        data_fim: toSaoPauloTime(formData.Data_Fim),
        utm_source: formData.utm_source || null,
        utm_medium: formData.utm_medium || null,
        utm_campaign: formData.utm_campaign || null,
        utm_content: formData.utm_content || null,
        canal_principal: formData.canal_principal || null,
        plataforma_ads: formData.plataforma_ads?.join(', ') || null,
        investimento_total: formData.Investimento_total,
        url_principal: formData.url_principal,
        publico_alvo: formData.publico_alvo || null,
        ativo: true,
      }]).select();

      if (error) throw error;

      toast.success('✅ Campanha criada com sucesso!');
      navigate('/admin/campanhas');
    } catch (error: any) {
      toast.error('❌ Erro ao criar campanha: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Nova Campanha" />

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 lg:ml-64">
          <div className="max-w-5xl mx-auto">
            {/* Breadcrumb e Botão Voltar */}
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/campanhas')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <div className="text-sm text-muted-foreground">
                Campanhas {'>'} Nova
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-6">Nova Campanha</h2>

            <Tabs defaultValue="basico" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basico">
                  <FileText className="mr-2 h-4 w-4" />
                  Básico
                </TabsTrigger>
                <TabsTrigger value="marketing">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Marketing
                </TabsTrigger>
                <TabsTrigger value="landing">
                  <Globe className="mr-2 h-4 w-4" />
                  Landing Page
                </TabsTrigger>
              </TabsList>

              {/* ABA 1: Informações Básicas */}
              <TabsContent value="basico" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Identificação</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="nome">Nome da Campanha *</Label>
                      <Input
                        id="nome"
                        placeholder="Ex: Black Friday Nicole Guedes 2024"
                        value={formData.Nome_campanha}
                        onChange={(e) => handleNomeChange(e.target.value)}
                        maxLength={100}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {formData.Nome_campanha.length}/100 caracteres
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="slug">Slug *</Label>
                      <Input
                        id="slug"
                        placeholder="black-friday-nicole-2024"
                        value={formData.Slug}
                        onChange={(e) => setFormData({ ...formData, Slug: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Apenas letras minúsculas, números e hífens
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="tipo">Tipo de Campanha</Label>
                      <Select value={formData.Campanha_Tipo} onValueChange={(value) => setFormData({ ...formData, Campanha_Tipo: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Black Friday">Black Friday</SelectItem>
                          <SelectItem value="Lançamento">Lançamento</SelectItem>
                          <SelectItem value="Sazonal">Sazonal</SelectItem>
                          <SelectItem value="Evergreen">Evergreen</SelectItem>
                          <SelectItem value="Flash Sale">Flash Sale</SelectItem>
                          <SelectItem value="Outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Status *</Label>
                      <RadioGroup value={formData.Campanha_Status} onValueChange={(value: any) => setFormData({ ...formData, Campanha_Status: value })}>
                        <div className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Ativo" id="ativo" />
                            <Label htmlFor="ativo" className="font-normal cursor-pointer">Ativo</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Suspensa" id="suspensa" />
                            <Label htmlFor="suspensa" className="font-normal cursor-pointer">Suspensa</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Agendada" id="agendada" />
                            <Label htmlFor="agendada" className="font-normal cursor-pointer">Agendada</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor="descricao">Descrição</Label>
                      <Textarea
                        id="descricao"
                        placeholder="Descreva os objetivos e detalhes da campanha..."
                        value={formData.Descricao}
                        onChange={(e) => setFormData({ ...formData, Descricao: e.target.value })}
                        rows={4}
                        maxLength={500}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {formData.Descricao?.length || 0}/500 caracteres
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Período</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dataInicio">Data de Início *</Label>
                        <Input
                          id="dataInicio"
                          type="datetime-local"
                          value={formData.Data_Inicio?.toISOString().slice(0, 16)}
                          onChange={(e) => setFormData({ ...formData, Data_Inicio: new Date(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dataFim">Data de Término *</Label>
                        <Input
                          id="dataFim"
                          type="datetime-local"
                          value={formData.Data_Fim?.toISOString().slice(0, 16)}
                          onChange={(e) => setFormData({ ...formData, Data_Fim: new Date(e.target.value) })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ABA 2: Tracking e Marketing */}
              <TabsContent value="marketing" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>UTM Parameters</CardTitle>
                    <p className="text-sm text-muted-foreground">Use estes parâmetros para rastrear a origem do tráfego</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="utmSource">UTM Source</Label>
                      <Input
                        id="utmSource"
                        placeholder="instagram, google, facebook, email"
                        value={formData.utm_source}
                        onChange={(e) => setFormData({ ...formData, utm_source: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">De onde vem o tráfego</p>
                    </div>

                    <div>
                      <Label htmlFor="utmMedium">UTM Medium</Label>
                      <Input
                        id="utmMedium"
                        placeholder="cpc, social, email, stories"
                        value={formData.utm_medium}
                        onChange={(e) => setFormData({ ...formData, utm_medium: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Tipo de mídia</p>
                    </div>

                    <div>
                      <Label htmlFor="utmCampaign">UTM Campaign</Label>
                      <Input
                        id="utmCampaign"
                        placeholder="black_friday_2024"
                        value={formData.utm_campaign}
                        onChange={(e) => setFormData({ ...formData, utm_campaign: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Nome da campanha nos anúncios</p>
                    </div>

                    <div>
                      <Label htmlFor="utmContent">UTM Content</Label>
                      <Input
                        id="utmContent"
                        placeholder="video_dra_nicole, banner_azul"
                        value={formData.utm_content}
                        onChange={(e) => setFormData({ ...formData, utm_content: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Variação do criativo (opcional)</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Canais e Plataformas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Canal Principal</Label>
                      <Select value={formData.canal_principal} onValueChange={(value) => setFormData({ ...formData, canal_principal: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o canal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Redes Sociais Pagas">Redes Sociais Pagas</SelectItem>
                          <SelectItem value="Google Ads">Google Ads</SelectItem>
                          <SelectItem value="Orgânico">Orgânico</SelectItem>
                          <SelectItem value="Email">Email</SelectItem>
                          <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                          <SelectItem value="Influencer">Influencer</SelectItem>
                          <SelectItem value="Outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Plataformas de Anúncio</Label>
                      <div className="space-y-2 mt-2">
                        {['Google Ads', 'Meta Ads (Facebook/Instagram)', 'TikTok Ads', 'LinkedIn Ads', 'Outro'].map((platform) => (
                          <div key={platform} className="flex items-center space-x-2">
                            <Checkbox
                              id={platform}
                              checked={formData.plataforma_ads?.includes(platform)}
                              onCheckedChange={() => handlePlatformToggle(platform)}
                            />
                            <Label htmlFor={platform} className="font-normal cursor-pointer">
                              {platform}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Investimento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="investimento">Investimento Total</Label>
                      <Input
                        id="investimento"
                        type="number"
                        placeholder="0,00"
                        value={formData.Investimento_total}
                        onChange={(e) => setFormData({ ...formData, Investimento_total: parseFloat(e.target.value) || 0 })}
                        step="0.01"
                        min="0"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Quanto será investido em mídia paga</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ABA 3: Landing Page e Público */}
              <TabsContent value="landing" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>URL da Campanha</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="url">URL Principal *</Label>
                      <Input
                        id="url"
                        type="url"
                        placeholder="https://nicoleguedesodonto.com.br/black-friday"
                        value={formData.url_principal}
                        onChange={(e) => setFormData({ ...formData, url_principal: e.target.value })}
                      />
                    </div>

                    {getFullUrl() && (
                      <div className="bg-muted border border-dashed rounded-lg p-4">
                        <Label className="text-sm font-semibold mb-2 block">URL Completa:</Label>
                        <p className="text-xs font-mono break-all mb-3">{getFullUrl()}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(getFullUrl());
                            toast.success('URL copiada!');
                          }}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copiar URL
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Público-Alvo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="publico">Descrição do Público</Label>
                      <Textarea
                        id="publico"
                        placeholder="Ex: Mulheres 25-45 anos, interessadas em estética, renda média-alta, região de Guarulhos/SP"
                        value={formData.publico_alvo}
                        onChange={(e) => setFormData({ ...formData, publico_alvo: e.target.value })}
                        rows={6}
                        maxLength={1000}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Descreva o perfil do público que você quer atingir ({formData.publico_alvo?.length || 0}/1000)
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Footer com Ações */}
            <div className="flex gap-4 justify-end mt-8 pb-8 border-t pt-6 sticky bottom-0 bg-background z-10 shadow-lg">
              <Button variant="outline" onClick={() => navigate('/admin/campanhas')} disabled={loading}>
                Cancelar
              </Button>
              <Button variant="outline" onClick={() => handleSubmit(true)} disabled={loading}>
                Salvar como Rascunho
              </Button>
              <Button
                onClick={() => handleSubmit(false)}
                disabled={loading}
                className="bg-terracota hover:bg-terracota/90 text-terracota-foreground"
              >
                {loading ? 'Criando...' : 'Criar Campanha'}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
