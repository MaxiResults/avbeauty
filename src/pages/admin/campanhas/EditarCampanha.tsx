import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, FileText, BarChart3, Globe, Copy } from 'lucide-react';
import { Campanha, CampanhaDB, dbToCampanha, CampanhaFormData } from '@/types/campanha';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditarCampanha() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [campanha, setCampanha] = useState<Campanha | null>(null);
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
  const [ativo, setAtivo] = useState(true);

  useEffect(() => {
    fetchCampanha();
  }, [id]);

  const fetchCampanha = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('campanhas')
        .select('*')
        .eq('id', parseInt(id!))
        .eq('cliente_id', 2)
        .eq('empresa_id', 2)
        .single();

      if (error) throw error;
      
      const campanhaData = dbToCampanha(data as CampanhaDB);
      setCampanha(campanhaData);
      setAtivo(campanhaData.Ativo);

      // Preencher formulário
      setFormData({
        Nome_campanha: campanhaData.Nome_campanha,
        Slug: campanhaData.Slug,
        Campanha_Status: campanhaData.Campanha_Status,
        Campanha_Tipo: campanhaData.Campanha_Tipo || '',
        Descricao: campanhaData.Descricao || '',
        Data_Inicio: new Date(campanhaData.Data_Inicio),
        Data_Fim: new Date(campanhaData.Data_Fim),
        utm_source: campanhaData.utm_source || '',
        utm_medium: campanhaData.utm_medium || '',
        utm_campaign: campanhaData.utm_campaign || '',
        utm_content: campanhaData.utm_content || '',
        canal_principal: campanhaData.canal_principal || '',
        plataforma_ads: campanhaData.plataforma_ads?.split(', ').filter(Boolean) || [],
        Investimento_total: campanhaData.Investimento_total,
        url_principal: campanhaData.url_principal,
        publico_alvo: campanhaData.publico_alvo || '',
      });
    } catch (error: any) {
      toast.error('Erro ao carregar campanha: ' + error.message);
      navigate('/admin/campanhas');
    } finally {
      setLoading(false);
    }
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

  const handleSubmit = async () => {
    if (!validateForm() || !id) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('campanhas')
        .update({
          nome_campanha: formData.Nome_campanha,
          campanha_status: formData.Campanha_Status,
          campanha_tipo: formData.Campanha_Tipo || null,
          descricao: formData.Descricao || null,
          data_inicio: formData.Data_Inicio.toISOString(),
          data_fim: formData.Data_Fim.toISOString(),
          utm_source: formData.utm_source || null,
          utm_medium: formData.utm_medium || null,
          utm_campaign: formData.utm_campaign || null,
          utm_content: formData.utm_content || null,
          canal_principal: formData.canal_principal || null,
          plataforma_ads: formData.plataforma_ads?.join(', ') || null,
          investimento_total: formData.Investimento_total,
          url_principal: formData.url_principal,
          publico_alvo: formData.publico_alvo || null,
          ativo: ativo,
        })
        .eq('id', parseInt(id!))
        .eq('cliente_id', 2)
        .eq('empresa_id', 2);

      if (error) throw error;

      toast.success('✅ Campanha atualizada com sucesso!');
      navigate('/admin/campanhas');
    } catch (error: any) {
      toast.error('❌ Erro ao atualizar campanha: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 ml-64 flex flex-col overflow-hidden">
          <Header title="Editar Campanha" />
          <main className="flex-1 overflow-y-auto p-8">
            <div className="max-w-5xl mx-auto space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-96 w-full" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <Header title={`Editar: ${campanha?.Nome_campanha || ''}`} />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            {/* Breadcrumb e Botão Voltar */}
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/campanhas')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <div className="text-sm text-muted-foreground">
                Campanhas {'>'} Editar
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Editar Campanha</h2>
              <div className="flex items-center gap-2">
                <Label htmlFor="ativo-switch">Campanha ativa</Label>
                <Switch
                  id="ativo-switch"
                  checked={ativo}
                  onCheckedChange={setAtivo}
                />
              </div>
            </div>

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
                        onChange={(e) => setFormData({ ...formData, Nome_campanha: e.target.value })}
                        maxLength={100}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {formData.Nome_campanha.length}/100 caracteres
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="slug">Slug (não editável)</Label>
                      <Input
                        id="slug"
                        value={formData.Slug}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        O slug não pode ser alterado após criação
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
                    </div>

                    <div>
                      <Label htmlFor="utmMedium">UTM Medium</Label>
                      <Input
                        id="utmMedium"
                        placeholder="cpc, social, email, stories"
                        value={formData.utm_medium}
                        onChange={(e) => setFormData({ ...formData, utm_medium: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="utmCampaign">UTM Campaign</Label>
                      <Input
                        id="utmCampaign"
                        placeholder="black_friday_2024"
                        value={formData.utm_campaign}
                        onChange={(e) => setFormData({ ...formData, utm_campaign: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="utmContent">UTM Content</Label>
                      <Input
                        id="utmContent"
                        placeholder="video_dra_nicole, banner_azul"
                        value={formData.utm_content}
                        onChange={(e) => setFormData({ ...formData, utm_content: e.target.value })}
                      />
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
                              id={`edit-${platform}`}
                              checked={formData.plataforma_ads?.includes(platform)}
                              onCheckedChange={() => handlePlatformToggle(platform)}
                            />
                            <Label htmlFor={`edit-${platform}`} className="font-normal cursor-pointer">
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
            <div className="flex gap-4 justify-end mt-8 pb-8 border-t pt-6 sticky bottom-0 bg-background">
              <Button variant="outline" onClick={() => navigate('/admin/campanhas')} disabled={saving}>
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={saving}
                className="bg-terracota hover:bg-terracota/90 text-terracota-foreground"
              >
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
