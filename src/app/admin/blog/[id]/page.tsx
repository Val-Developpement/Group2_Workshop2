'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Upload, X, Save, Eye, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface FormData {
  titre: string;
  contenu: string;
  extrait: string;
  image_url: string;
  image_alt: string;
  categorie: string;
  tags: string[];
  statut: 'brouillon' | 'publie' | 'archive';
  meta_description: string;
  meta_keywords: string;
}

const categories = [
  'Conseils Chiens',
  'Conseils Chats',
  'Santé',
  'Alimentation',
  'Comportement',
  'Actualités',
  'Produits',
  'Autres'
];

interface EditArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditArticlePage({ params }: EditArticlePageProps) {
  const router = useRouter();
  const [articleId, setArticleId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [formData, setFormData] = useState<FormData>({
    titre: '',
    contenu: '',
    extrait: '',
    image_url: '',
    image_alt: '',
    categorie: '',
    tags: [],
    statut: 'brouillon',
    meta_description: '',
    meta_keywords: ''
  });

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const { id } = await params;
        setArticleId(id);
        
        const response = await fetch(`/api/blog/${id}`);
        if (response.ok) {
          const article = await response.json();
          setFormData({
            titre: article.titre || '',
            contenu: article.contenu || '',
            extrait: article.extrait || '',
            image_url: article.image_url || '',
            image_alt: article.image_alt || '',
            categorie: article.categorie || '',
            tags: article.tags || [],
            statut: article.statut || 'brouillon',
            meta_description: article.meta_description || '',
            meta_keywords: article.meta_keywords || ''
          });
        } else {
          toast.error('Article non trouvé');
          router.push('/admin/blog');
        }
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Erreur lors du chargement de l\'article');
        router.push('/admin/blog');
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [params, router]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const response = await fetch('/api/blog/upload-image', {
        method: 'POST',
        body: formDataUpload,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          image_url: data.url,
          image_alt: prev.image_alt || `Image pour ${prev.titre}`
        }));
        toast.success('Image uploadée avec succès');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erreur lors de l\'upload');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'upload');
    } finally {
      setImageUploading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image_url: '',
      image_alt: ''
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titre || !formData.contenu) {
      toast.error('Le titre et le contenu sont requis');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/blog/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Article mis à jour avec succès');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mx-auto mb-4"></div>
          <p>Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/admin/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Modifier l'article</h1>
            <p className="text-gray-600">Modifiez votre article</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/blog/${formData.titre.toLowerCase().replace(/\s+/g, '-')}`} target="_blank">
              <Eye className="w-4 h-4 mr-2" />
              Prévisualiser
            </Link>
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contenu de l'article</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="titre">Titre *</Label>
                  <Input
                    id="titre"
                    value={formData.titre}
                    onChange={(e) => handleInputChange('titre', e.target.value)}
                    placeholder="Titre de l'article"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="extrait">Extrait</Label>
                  <Textarea
                    id="extrait"
                    value={formData.extrait}
                    onChange={(e) => handleInputChange('extrait', e.target.value)}
                    placeholder="Résumé de l'article (affiché dans la liste)"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="contenu">Contenu *</Label>
                  <Textarea
                    id="contenu"
                    value={formData.contenu}
                    onChange={(e) => handleInputChange('contenu', e.target.value)}
                    placeholder="Contenu complet de l'article"
                    rows={15}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Image */}
            <Card>
              <CardHeader>
                <CardTitle>Image principale</CardTitle>
              </CardHeader>
              <CardContent>
                {formData.image_url ? (
                  <div className="space-y-4">
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <Image
                        src={formData.image_url}
                        alt={formData.image_alt}
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div>
                      <Label htmlFor="image_alt">Texte alternatif</Label>
                      <Input
                        id="image_alt"
                        value={formData.image_alt}
                        onChange={(e) => handleInputChange('image_alt', e.target.value)}
                        placeholder="Description de l'image"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      Ajoutez une image principale pour votre article
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={imageUploading}
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      {imageUploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                          Upload en cours...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Choisir une image
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publication */}
            <Card>
              <CardHeader>
                <CardTitle>Publication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="statut">Statut</Label>
                  <Select
                    value={formData.statut}
                    onValueChange={(value: 'brouillon' | 'publie' | 'archive') => handleInputChange('statut', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brouillon">Brouillon</SelectItem>
                      <SelectItem value="publie">Publié</SelectItem>
                      <SelectItem value="archive">Archivé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="categorie">Catégorie</Label>
                  <Select
                    value={formData.categorie}
                    onValueChange={(value) => handleInputChange('categorie', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="flex-1"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sauvegarde...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Sauvegarder
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Nouveau tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    Ajouter
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer">
                      {tag}
                      <X
                        className="w-3 h-3 ml-1"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* SEO */}
            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => handleInputChange('meta_description', e.target.value)}
                    placeholder="Description pour les moteurs de recherche"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="meta_keywords">Mots-clés</Label>
                  <Input
                    id="meta_keywords"
                    value={formData.meta_keywords}
                    onChange={(e) => handleInputChange('meta_keywords', e.target.value)}
                    placeholder="mots-clés, séparés, par, virgules"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
} 