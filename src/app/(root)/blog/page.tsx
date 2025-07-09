'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Eye, User } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Article {
  id: string;
  titre: string;
  slug: string;
  extrait: string;
  image_url: string | null;
  image_alt: string | null;
  categorie: string;
  published_at: string;
  vues: number;
  profiles: {
    first_name: string;
    last_name: string;
  }[] | null;
}

function BlogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const categorie = searchParams.get('categorie') || '';
  const search = searchParams.get('search') || '';
  const itemsPerPage = 9;

  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  const supabase = createClient();

  // Fonction pour charger les articles
  const loadArticles = async () => {
    try {
      setLoading(true);
      
      // Construction de la query
      let query = supabase
        .from('articles')
        .select(`
          id,
          titre,
          slug,
          extrait,
          image_url,
          image_alt,
          categorie,
          published_at,
          vues,
          profiles!auteur_id (
            first_name,
            last_name
          )
        `, { count: 'exact' })
        .eq('statut', 'publie')
        .order('published_at', { ascending: false });

      // Filtres
      if (categorie && categorie !== 'all') {
        query = query.eq('categorie', categorie);
      }

      if (search) {
        query = query.or(`titre.ilike.%${search}%,extrait.ilike.%${search}%`);
      }

      // Pagination
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to);

      const { data: articlesData, error, count: totalCount } = await query;

      if (error) {
        console.error('Erreur lors de la récupération des articles:', error);
        return;
      }

      setArticles(articlesData || []);
      setCount(totalCount || 0);

      // Récupération des catégories pour le filtre
      const { data: categoriesData } = await supabase
        .from('articles')
        .select('categorie')
        .eq('statut', 'publie')
        .not('categorie', 'is', null);

      const uniqueCategories = [...new Set(categoriesData?.map(c => c.categorie) || [])] as string[];
      setCategories(uniqueCategories);

    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les articles au montage et quand les paramètres changent
  useEffect(() => {
    loadArticles();
  }, [page, categorie, search]);

  const totalPages = Math.ceil(count / itemsPerPage);

  // Fonctions de navigation
  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    params.delete('page'); // Reset page
    router.push(`/blog?${params.toString()}`);
  };

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') {
      params.delete('categorie');
    } else {
      params.set('categorie', value);
    }
    params.delete('page'); // Reset page
    router.push(`/blog?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mx-auto mb-4"></div>
          <p>Chargement des articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🐾 Blog Conseils & Actualités
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Découvrez nos conseils d'experts pour prendre soin de vos compagnons à quatre pattes
        </p>
      </div>

      {/* Filtres */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <Input
            placeholder="Rechercher un article..."
            defaultValue={search}
            className="w-full md:w-64"
            name="search"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const value = (e.target as HTMLInputElement).value;
                handleSearch(value);
              }
            }}
          />
          <Select value={categorie || "all"} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-gray-500">
          {count} article{count > 1 ? 's' : ''} trouvé{count > 1 ? 's' : ''}
        </div>
      </div>

      {/* Articles */}
      {articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Aucun article trouvé.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {articles.map((article) => (
            <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                {article.image_url ? (
                  <Image
                    src={article.image_url}
                    alt={article.image_alt || article.titre}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Pas d'image</span>
                  </div>
                )}
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{article.categorie}</Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <Eye className="w-4 h-4 mr-1" />
                    {article.vues}
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-2">{article.titre}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-3">{article.extrait}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="w-4 h-4 mr-1" />
                    {article.profiles && article.profiles.length > 0 
                      ? `${article.profiles[0].first_name} ${article.profiles[0].last_name}`
                      : 'Auteur inconnu'
                    }
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(article.published_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <Link href={`/blog/${article.slug}`} className="block mt-4">
                  <Button className="w-full">Lire l'article</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.set('page', (page - 1).toString());
              router.push(`/blog?${params.toString()}`);
            }}
          >
            Précédent
          </Button>
          
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === page ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set('page', pageNum.toString());
                  router.push(`/blog?${params.toString()}`);
                }}
              >
                {pageNum}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.set('page', (page + 1).toString());
              router.push(`/blog?${params.toString()}`);
            }}
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
}

function BlogPageFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mx-auto mb-4"></div>
        <p>Chargement du blog...</p>
      </div>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<BlogPageFallback />}>
      <BlogContent />
    </Suspense>
  );
} 