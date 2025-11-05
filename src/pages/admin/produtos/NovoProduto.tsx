import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/admin/Sidebar';
import { Header } from '@/components/admin/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/produtos/ImageUpload';
import { GalleryUpload } from '@/components/produtos/GalleryUpload';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { uploadProdutoImage } from '@/lib/uploadHelpers';
import { toast } from 'sonner';
import { ArrowLeft, FileText, DollarSign, Image as ImageIcon, Search } from 'lucide-react';
import { ProdutoFormData } from '@/types/produto';
import { toZonedTime } from 'date-fns-tz';

const TIMEZONE = 'America/Sao_Paulo';

export default function NovoProduto() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProdutoFormData>({
    Nome: '',
    Slug: '',
    Descricao_Curta: '',
    Descricao_Completa: '',
    Categoria: '',
    Grupo: '',
    Codigo_Externo: '',
    Preco_Padrao: 0,
    Preco_Promocional: 0,
    Preco_Custo: 0,
    Tipo_Estoque: 'Ilimitado',
    Controla_Estoque: 'N',
    Status: 'Disponível',
    Principal_Destaque: false,
    Ordem_exibicao: 1,
    Meta_Title: '',
    Meta_Description: '',
    Observacoes: '',
    Imagem_Principal: null,
    Imagem_Galeria: [],
  });

  useEffect(() => {
    fetchNextOrdem();
  }, []);

  const fetchNextOrdem = async () => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('ordem_exibicao')
        .eq('cliente_id', 3)
        .eq('empresa_id', 3)
        .order('ordem_exibicao', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setFormData(prev => ({ ...prev, Ordem_exibicao: (data.ordem_exibicao || 0) + 1 }));
      }
    } catch (error) {
      // Primeira inserção
    }
  };

  const generateSlug = (nome: string) => {
    return nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNomeChange = (nome: string) => {
    setFormData({ 
      ...formData, 
      Nome: nome, 
      Slug: generateSlug(nome),
      Meta_Title: nome.slice(0, 60)
    });
  };

  const validateForm = () => {
    if (!formData.Nome.trim()) {
      toast.error('Nome do produto é obrigatório');
      return false;
    }
    if (!formData.Slug.trim()) {
      toast.error('Slug é obrigatório');
      return false;
    }
    if (!formData.Descricao_Curta.trim()) {
      toast.error('Descrição curta é obrigatória');
      return false;
    }
    if (formData.Preco_Padrao <= 0) {
      toast.error('Preço padrão deve ser maior que zero');
      return false;
    }
    if (formData.Preco_Promocional && formData.Preco_Promocional >= formData.Preco_Padrao) {
      toast.error('Preço promocional deve ser menor que o preço padrão');
      return false;
    }
    if (!formData.Imagem_Principal) {
      toast.error('Imagem principal é obrigatória');
      return false;
    }
    return true;
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Upload imagem principal
      let imagemPrincipalUrl = '';
      if (formData.Imagem_Principal instanceof File) {
        imagemPrincipalUrl = await uploadProdutoImage(formData.Imagem_Principal);
      }

      // Upload de imagens da galeria
      const galeriaUrls: string[] = [];
      for (const item of formData.Imagem_Galeria) {
        if (item instanceof File) {
          const url = await uploadProdutoImage(item);
          galeriaUrls.push(url);
        } else {
          galeriaUrls.push(item);
        }
      }

      // Verifica colunas opcionalmente presentes no banco externo
      const colExists = async (col: string) => {
        try {
          const { error } = await supabase.from('produtos').select(col).limit(1);
          return !error;
        } catch {
          return false;
        }
      };

      // Campos mínimos (devem existir em qualquer schema)
      const baseRecord: any = {
        cliente_id: 3,
        empresa_id: 3,
        nome: formData.Nome,
        slug: formData.Slug,
        preco_padrao: formData.Preco_Padrao,
        grupo: formData.Grupo || null,
        codigo_externo: formData.Codigo_Externo || null,
      };

      // Inclui campos somente se existirem no schema atual
      if (await colExists('descricao_curta')) baseRecord.descricao_curta = formData.Descricao_Curta;
      if (await colExists('descricao_completa')) baseRecord.descricao_completa = formData.Descricao_Completa || null;
      if (await colExists('categoria')) baseRecord.categoria = formData.Categoria || null;
      if (await colExists('preco_promocional')) baseRecord.preco_promocional = formData.Preco_Promocional || null;
      if (await colExists('preco_custo')) baseRecord.preco_custo = formData.Preco_Custo || null;
      if (await colExists('principal_destaque')) baseRecord.principal_destaque = !!formData.Principal_Destaque;
      if (await colExists('observacoes')) baseRecord.observacoes = formData.Observacoes || null;
      if (await colExists('controla_estoque')) baseRecord.controla_estoque = formData.Controla_Estoque === 'S';
      if (await colExists('vagas_vendidas')) baseRecord.vagas_vendidas = 0;
      if (await colExists('ordem_exibicao')) baseRecord.ordem_exibicao = formData.Ordem_exibicao;
      if (await colExists('imagem_principal')) baseRecord.imagem_principal = imagemPrincipalUrl;
      if (await colExists('imagem_galeria')) baseRecord.imagem_galeria = galeriaUrls;
      if (await colExists('status')) baseRecord.status = isDraft ? 'indisponivel' : 'ativo';
      if (await colExists('meta_title')) baseRecord.meta_title = formData.Meta_Title || formData.Nome;
      if (await colExists('meta_description')) baseRecord.meta_description = formData.Meta_Description || formData.Descricao_Curta;

      let { error } = await supabase.from('produtos').insert([baseRecord]);

      // Fallback defensivo caso o schema mude e gere erro de cache/coluna
      if (error && /schema cache|Could not find/.test(error.message)) {
        // remove campos possivelmente inexistentes e tenta novamente com o mínimo
        const safeRecord: any = { cliente_id: 3, empresa_id: 3, nome: formData.Nome, slug: formData.Slug, preco_padrao: formData.Preco_Padrao };
        ({ error } = await supabase.from('produtos').insert([safeRecord]));
      }

      if (error) throw error;

      toast.success('✅ Produto criado com sucesso!');
      navigate('/admin/produtos');
    } catch (error: any) {
      toast.error('❌ Erro ao criar produto: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const calcularDesconto = () => {
    if (!formData.Preco_Promocional || formData.Preco_Promocional >= formData.Preco_Padrao) return null;
    const desc = ((formData.Preco_Padrao - formData.Preco_Promocional) / formData.Preco_Padrao) * 100;
    const economia = formData.Preco_Padrao - formData.Preco_Promocional;
    return { percentual: Math.round(desc), economia };
  };

  const desconto = calcularDesconto();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <Header title="Novo Produto" />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/produtos')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <div className="text-sm text-muted-foreground">Produtos {'>'} Novo</div>
            </div>

            <h2 className="text-3xl font-bold mb-6">Novo Produto</h2>

            <Tabs defaultValue="basico" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basico">
                  <FileText className="mr-2 h-4 w-4" />
                  Básico
                </TabsTrigger>
                <TabsTrigger value="precos">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Preços
                </TabsTrigger>
                <TabsTrigger value="imagens">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Imagens
                </TabsTrigger>
                <TabsTrigger value="seo">
                  <Search className="mr-2 h-4 w-4" />
                  SEO
                </TabsTrigger>
              </TabsList>

              {/* ABA BÁSICO */}
              <TabsContent value="basico" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Identificação</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="nome">Nome do Produto *</Label>
                      <Input
                        id="nome"
                        placeholder="Ex: Lentes Naturais Hiper-Realistas"
                        value={formData.Nome}
                        onChange={(e) => handleNomeChange(e.target.value)}
                        maxLength={100}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {formData.Nome.length}/100 caracteres
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="slug">Slug *</Label>
                      <Input
                        id="slug"
                        placeholder="lentes-naturais-hiper-realistas"
                        value={formData.Slug}
                        onChange={(e) => setFormData({ ...formData, Slug: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Apenas letras minúsculas, números e hífens
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="categoria">Categoria</Label>
                        <Input
                          id="categoria"
                          placeholder="Ex: Odontologia"
                          value={formData.Categoria}
                          onChange={(e) => setFormData({ ...formData, Categoria: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="grupo">Grupo</Label>
                        <Input
                          id="grupo"
                          placeholder="Ex: Lentes Dentais"
                          value={formData.Grupo}
                          onChange={(e) => setFormData({ ...formData, Grupo: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="codigo">Código Externo</Label>
                      <Input
                        id="codigo"
                        placeholder="Código do fornecedor ou referência interna"
                        value={formData.Codigo_Externo}
                        onChange={(e) => setFormData({ ...formData, Codigo_Externo: e.target.value })}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Descrições</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="descricao-curta">Descrição Curta *</Label>
                      <Textarea
                        id="descricao-curta"
                        rows={2}
                        maxLength={200}
                        placeholder="Resumo que aparece no card do produto"
                        value={formData.Descricao_Curta}
                        onChange={(e) => {
                          setFormData({ ...formData, Descricao_Curta: e.target.value });
                          if (!formData.Meta_Description) {
                            setFormData(prev => ({ ...prev, Meta_Description: e.target.value.slice(0, 160) }));
                          }
                        }}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {formData.Descricao_Curta.length}/200 caracteres
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="descricao-completa">Descrição Completa</Label>
                      <Textarea
                        id="descricao-completa"
                        rows={8}
                        maxLength={2000}
                        placeholder="Detalhes completos do procedimento, o que inclui, benefícios..."
                        value={formData.Descricao_Completa}
                        onChange={(e) => setFormData({ ...formData, Descricao_Completa: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {formData.Descricao_Completa.length}/2000 caracteres
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="observacoes">Observações</Label>
                      <Textarea
                        id="observacoes"
                        rows={3}
                        placeholder="Restrições, pré-requisitos, informações internas..."
                        value={formData.Observacoes}
                        onChange={(e) => setFormData({ ...formData, Observacoes: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Apenas para uso interno</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Status do Produto *</Label>
                      <RadioGroup value={formData.Status} onValueChange={(v: any) => setFormData({ ...formData, Status: v })}>
                        <div className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Disponível" id="disponivel" />
                            <Label htmlFor="disponivel" className="font-normal cursor-pointer">
                              Disponível
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Indisponível" id="indisponivel" />
                            <Label htmlFor="indisponivel" className="font-normal cursor-pointer">
                              Indisponível
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Produto em Destaque</Label>
                        <p className="text-xs text-muted-foreground">
                          Produtos em destaque aparecem no topo com badge especial
                        </p>
                      </div>
                      <Switch
                        checked={formData.Principal_Destaque}
                        onCheckedChange={(checked) => setFormData({ ...formData, Principal_Destaque: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ABA PREÇOS */}
              <TabsContent value="precos" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Precificação</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="preco-padrao">Preço Padrão *</Label>
                        <Input
                          id="preco-padrao"
                          type="number"
                          min="0.01"
                          step="0.01"
                          placeholder="0,00"
                          value={formData.Preco_Padrao || ''}
                          onChange={(e) => setFormData({ ...formData, Preco_Padrao: parseFloat(e.target.value) || 0 })}
                        />
                        <p className="text-xs text-muted-foreground mt-1">Preço normal</p>
                      </div>

                      <div>
                        <Label htmlFor="preco-promocional">Preço Promocional</Label>
                        <Input
                          id="preco-promocional"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0,00"
                          value={formData.Preco_Promocional || ''}
                          onChange={(e) => setFormData({ ...formData, Preco_Promocional: parseFloat(e.target.value) || 0 })}
                        />
                        <p className="text-xs text-muted-foreground mt-1">Deixe vazio se não houver promoção</p>
                      </div>

                      <div>
                        <Label htmlFor="preco-custo">Preço de Custo</Label>
                        <Input
                          id="preco-custo"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0,00"
                          value={formData.Preco_Custo || ''}
                          onChange={(e) => setFormData({ ...formData, Preco_Custo: parseFloat(e.target.value) || 0 })}
                        />
                        <p className="text-xs text-muted-foreground mt-1">Apenas controle interno</p>
                      </div>
                    </div>

                    {desconto && (
                      <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          💰 Preview de Preço na Loja
                        </h4>
                        <div className="space-y-1 text-sm">
                          <p>De: <span className="line-through">R$ {formData.Preco_Padrao.toFixed(2)}</span></p>
                          <p className="text-lg font-bold text-green-700 dark:text-green-400">
                            Por: R$ {formData.Preco_Promocional?.toFixed(2)}
                          </p>
                          <p>Economia: R$ {desconto.economia.toFixed(2)} ({desconto.percentual}% OFF)</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Controle de Estoque</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Tipo de Estoque *</Label>
                      <RadioGroup 
                        value={formData.Tipo_Estoque} 
                        onValueChange={(v: any) => setFormData({ ...formData, Tipo_Estoque: v })}
                      >
                        <div className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Ilimitado" id="ilimitado" />
                            <Label htmlFor="ilimitado" className="font-normal cursor-pointer">
                              Ilimitado
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Limitado" id="limitado" />
                            <Label htmlFor="limitado" className="font-normal cursor-pointer">
                              Limitado
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    {formData.Tipo_Estoque === 'Limitado' && (
                      <>
                        <div className="flex items-center justify-between">
                          <Label>Ativar controle de estoque</Label>
                          <Switch
                            checked={formData.Controla_Estoque === 'S'}
                            onCheckedChange={(checked) => setFormData({ ...formData, Controla_Estoque: checked ? 'S' : 'N' })}
                          />
                        </div>

                        <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm">
                          ⚠️ O estoque será controlado conforme as vendas
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ABA IMAGENS */}
              <TabsContent value="imagens" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Imagens do Produto</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ImageUpload
                      label="Imagem Principal"
                      required
                      value={formData.Imagem_Principal}
                      onChange={(file) => setFormData({ ...formData, Imagem_Principal: file })}
                    />
                    
                    <GalleryUpload
                      value={formData.Imagem_Galeria}
                      onChange={(files) => setFormData({ ...formData, Imagem_Galeria: files })}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ABA SEO */}
              <TabsContent value="seo" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>SEO</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="meta-title">Meta Title</Label>
                      <Input
                        id="meta-title"
                        maxLength={60}
                        placeholder="Auto-preenchido com Nome do Produto"
                        value={formData.Meta_Title}
                        onChange={(e) => setFormData({ ...formData, Meta_Title: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {formData.Meta_Title.length}/60 caracteres
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="meta-description">Meta Description</Label>
                      <Textarea
                        id="meta-description"
                        rows={3}
                        maxLength={160}
                        placeholder="Auto-preenchido com Descrição Curta"
                        value={formData.Meta_Description}
                        onChange={(e) => setFormData({ ...formData, Meta_Description: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {formData.Meta_Description.length}/160 caracteres
                      </p>
                    </div>

                    {formData.Meta_Title && formData.Meta_Description && (
                      <div className="p-4 border rounded-lg bg-muted/30">
                        <h4 className="text-xs font-medium text-muted-foreground mb-2">Preview do Google:</h4>
                        <div className="space-y-1">
                          <div className="text-blue-600 text-lg">{formData.Meta_Title}</div>
                          <div className="text-xs text-green-700">
                            nicoleguedesodonto.com.br › {formData.Slug}
                          </div>
                          <div className="text-sm text-muted-foreground">{formData.Meta_Description}</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ordem de Exibição</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="ordem">Ordem de Exibição *</Label>
                      <Input
                        id="ordem"
                        type="number"
                        min="1"
                        value={formData.Ordem_exibicao}
                        onChange={(e) => setFormData({ ...formData, Ordem_exibicao: parseInt(e.target.value) || 1 })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Define a posição do produto na loja (1 = primeiro)
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Botões de Ação */}
            <div className="sticky bottom-0 bg-background border-t p-4 flex gap-2 justify-end mt-6">
              <Button variant="outline" onClick={() => navigate('/admin/produtos')}>
                Cancelar
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSubmit(true)}
                disabled={loading}
              >
                Salvar como Rascunho
              </Button>
              <Button
                onClick={() => handleSubmit(false)}
                disabled={loading}
                className="bg-[#97624b] hover:bg-[#7d5340]"
              >
                {loading ? 'Criando...' : 'Criar Produto'}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
