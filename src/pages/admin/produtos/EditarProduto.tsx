import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Sidebar } from '@/components/admin/Sidebar';
import { Header } from '@/components/admin/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageUpload } from '@/components/produtos/ImageUpload';
import { GalleryUpload } from '@/components/produtos/GalleryUpload';
import { supabase } from '@/lib/supabase';
import { uploadProdutoImage, deleteProdutoImage } from '@/lib/uploadHelpers';
import { Produto, ProdutoDB, dbToProduto, ProdutoFormData } from '@/types/produto';
import { toast } from 'sonner';
import { ArrowLeft, FileText, DollarSign, Image as ImageIcon, Search } from 'lucide-react';

export default function EditarProduto() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [produto, setProduto] = useState<Produto | null>(null);
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
    Vagas_Disponiveis: 0,
    Status: 'Disponível',
    Principal_Destaque: false,
    Ordem_exibicao: 1,
    Meta_Title: '',
    Meta_Description: '',
    Observacoes: '',
    Imagem_Principal: null,
    Imagem_Galeria: [],
  });
  const [imagemPrincipalOriginal, setImagemPrincipalOriginal] = useState<string | null>(null);
  const [galeriaOriginal, setGaleriaOriginal] = useState<string[]>([]);

  useEffect(() => {
    fetchProduto();
  }, [id]);

  const fetchProduto = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('id', parseInt(id!))
        .eq('cliente_id', 2)
        .eq('empresa_id', 2)
        .single();

      if (error) throw error;

      const produtoData = dbToProduto(data as ProdutoDB);
      setProduto(produtoData);
      setImagemPrincipalOriginal(produtoData.imagem_principal || null);
      setGaleriaOriginal(produtoData.galeria_imagens || []);

      setFormData({
        Nome: produtoData.nome,
        Slug: produtoData.slug,
        Descricao_Curta: produtoData.descricao_curta || '',
        Descricao_Completa: produtoData.descricao_completa || '',
        Categoria: produtoData.categoria || '',
        Grupo: '',
        Codigo_Externo: '',
        Preco_Padrao: produtoData.preco_padrao,
        Preco_Promocional: produtoData.preco_promocional || 0,
        Preco_Custo: 0,
        Tipo_Estoque: 'Ilimitado',
        Controla_Estoque: produtoData.controlar_estoque ? 'S' : 'N',
        Vagas_Disponiveis: produtoData.vagas_disponiveis || 0,
        Status: produtoData.status === 'ativo' ? 'Disponível' : 'Indisponível',
        Principal_Destaque: false,
        Ordem_exibicao: produtoData.ordem_exibicao || 0,
        Meta_Title: produtoData.meta_title || '',
        Meta_Description: produtoData.meta_description || '',
        Observacoes: '',
        Imagem_Principal: produtoData.imagem_principal || null,
        Imagem_Galeria: produtoData.galeria_imagens || [],
      });
    } catch (error: any) {
      toast.error('Erro ao carregar produto: ' + error.message);
      navigate('/admin/produtos');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.Nome.trim()) {
      toast.error('Nome do produto é obrigatório');
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

  const handleSubmit = async () => {
    if (!validateForm() || !id) return;

    setSaving(true);
    try {
      let imagemPrincipalUrl = typeof formData.Imagem_Principal === 'string' 
        ? formData.Imagem_Principal 
        : '';

      // Upload nova imagem principal se mudou
      if (formData.Imagem_Principal instanceof File) {
        imagemPrincipalUrl = await uploadProdutoImage(formData.Imagem_Principal);
        
        // Deletar imagem antiga
        if (imagemPrincipalOriginal && imagemPrincipalOriginal !== imagemPrincipalUrl) {
          await deleteProdutoImage(imagemPrincipalOriginal);
        }
      }

      // Processar galeria
      const galeriaUrls: string[] = [];
      const imagensParaDeletar: string[] = [];

      // Identificar imagens removidas
      galeriaOriginal.forEach(url => {
        if (!formData.Imagem_Galeria.includes(url)) {
          imagensParaDeletar.push(url);
        }
      });

      // Upload novas imagens e manter existentes
      for (const item of formData.Imagem_Galeria) {
        if (item instanceof File) {
          const url = await uploadProdutoImage(item);
          galeriaUrls.push(url);
        } else if (typeof item === 'string') {
          galeriaUrls.push(item);
        }
      }

      // Deletar imagens removidas
      for (const url of imagensParaDeletar) {
        await deleteProdutoImage(url);
      }

      const { error } = await supabase
        .from('produtos')
        .update({
          nome: formData.Nome,
          slug: formData.Slug,
          descricao_curta: formData.Descricao_Curta,
          descricao_completa: formData.Descricao_Completa || null,
          categoria: formData.Categoria || null,
          preco_padrao: formData.Preco_Padrao,
          preco_promocional: formData.Preco_Promocional || null,
          desconto_percentual: formData.Preco_Promocional 
            ? Math.round(((formData.Preco_Padrao - formData.Preco_Promocional) / formData.Preco_Padrao) * 100)
            : null,
          controlar_estoque: formData.Controla_Estoque === 'S',
          vagas_disponiveis: formData.Controla_Estoque === 'S' ? formData.Vagas_Disponiveis : null,
          ordem_exibicao: formData.Ordem_exibicao,
          imagem_principal: imagemPrincipalUrl,
          galeria_imagens: galeriaUrls.length > 0 ? galeriaUrls : null,
          status: formData.Status === 'Disponível' ? 'ativo' : 'indisponivel',
          meta_title: formData.Meta_Title || formData.Nome,
          meta_description: formData.Meta_Description || formData.Descricao_Curta,
        })
        .eq('id', parseInt(id))
        .eq('cliente_id', 2)
        .eq('empresa_id', 2);

      if (error) throw error;

      toast.success('✅ Produto atualizado com sucesso!');
      navigate('/admin/produtos');
    } catch (error: any) {
      toast.error('❌ Erro ao atualizar produto: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const calcularDesconto = () => {
    if (!formData.Preco_Promocional || formData.Preco_Promocional >= formData.Preco_Padrao) return null;
    const desc = ((formData.Preco_Padrao - formData.Preco_Promocional) / formData.Preco_Padrao) * 100;
    const economia = formData.Preco_Padrao - formData.Preco_Promocional;
    return { percentual: Math.round(desc), economia };
  };

  const desconto = calcularDesconto();

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 ml-64 flex flex-col overflow-hidden">
          <Header title="Editar Produto" />
          <main className="flex-1 overflow-y-auto p-8">
            <div className="max-w-5xl mx-auto space-y-4">
              <Skeleton className="h-8 w-64" />
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
        <Header title={`Editar: ${produto?.nome}`} />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/produtos')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <div className="text-sm text-muted-foreground">Produtos {'>'} Editar</div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Editar Produto</h2>
            </div>

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

              {/* Mesmas abas do NovoProduto, mas com campos preenchidos e slug readonly */}
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
                        value={formData.Nome}
                        onChange={(e) => setFormData({ ...formData, Nome: e.target.value })}
                        maxLength={100}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {formData.Nome.length}/100 caracteres
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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="categoria">Categoria</Label>
                        <Input
                          id="categoria"
                          value={formData.Categoria}
                          onChange={(e) => setFormData({ ...formData, Categoria: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="grupo">Grupo</Label>
                        <Input
                          id="grupo"
                          value={formData.Grupo}
                          onChange={(e) => setFormData({ ...formData, Grupo: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="codigo">Código Externo</Label>
                      <Input
                        id="codigo"
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
                        value={formData.Descricao_Curta}
                        onChange={(e) => setFormData({ ...formData, Descricao_Curta: e.target.value })}
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
                        value={formData.Observacoes}
                        onChange={(e) => setFormData({ ...formData, Observacoes: e.target.value })}
                      />
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
                            <Label htmlFor="disponivel" className="font-normal cursor-pointer">Disponível</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Indisponível" id="indisponivel" />
                            <Label htmlFor="indisponivel" className="font-normal cursor-pointer">Indisponível</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Produto em Destaque</Label>
                        <p className="text-xs text-muted-foreground">
                          Produtos em destaque aparecem no topo
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

              {/* Abas de Preços, Imagens e SEO idênticas ao NovoProduto */}
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
                          value={formData.Preco_Padrao || ''}
                          onChange={(e) => setFormData({ ...formData, Preco_Padrao: parseFloat(e.target.value) || 0 })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="preco-promocional">Preço Promocional</Label>
                        <Input
                          id="preco-promocional"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.Preco_Promocional || ''}
                          onChange={(e) => setFormData({ ...formData, Preco_Promocional: parseFloat(e.target.value) || 0 })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="preco-custo">Preço de Custo</Label>
                        <Input
                          id="preco-custo"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.Preco_Custo || ''}
                          onChange={(e) => setFormData({ ...formData, Preco_Custo: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                    </div>

                    {desconto && (
                      <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <h4 className="font-medium mb-2 flex items-center gap-2">💰 Preview de Preço na Loja</h4>
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
                      <RadioGroup value={formData.Tipo_Estoque} onValueChange={(v: any) => setFormData({ ...formData, Tipo_Estoque: v })}>
                        <div className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Ilimitado" id="ilimitado" />
                            <Label htmlFor="ilimitado" className="font-normal cursor-pointer">Ilimitado</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Limitado" id="limitado" />
                            <Label htmlFor="limitado" className="font-normal cursor-pointer">Limitado</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    {formData.Tipo_Estoque === 'Limitado' && (
                      <div className="flex items-center justify-between">
                        <Label>Ativar controle de estoque</Label>
                        <Switch
                          checked={formData.Controla_Estoque === 'S'}
                          onCheckedChange={(checked) => setFormData({ ...formData, Controla_Estoque: checked ? 'S' : 'N' })}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

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

                    <div className="pt-4 border-t">
                      <GalleryUpload
                        value={formData.Imagem_Galeria}
                        onChange={(files) => setFormData({ ...formData, Imagem_Galeria: files })}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

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
                        value={formData.Meta_Description}
                        onChange={(e) => setFormData({ ...formData, Meta_Description: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {formData.Meta_Description.length}/160 caracteres
                      </p>
                    </div>
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
                onClick={handleSubmit}
                disabled={saving}
                className="bg-[#97624b] hover:bg-[#7d5340]"
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
