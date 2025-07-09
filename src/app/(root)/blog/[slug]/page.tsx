import { createClient } from '@/utils/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Eye, User, ArrowLeft, Tag } from 'lucide-react';
import { notFound } from 'next/navigation';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Récupération de l'article
  const { data: article, error } = await supabase
    .from('articles')
    .select(`
      id,
      titre,
      slug,
      contenu,
      extrait,
      image_url,
      image_alt,
      categorie,
      tags,
      published_at,
      vues,
      meta_description,
      meta_keywords,
      profiles!auteur_id (
        first_name,
        last_name
      )
    `)
    .eq('slug', slug)
    .eq('statut', 'publie')
    .single();

  if (error || !article) {
    notFound();
  }

  // Incrémenter le compteur de vues
  await supabase
    .from('articles')
    .update({ vues: article.vues + 1 })
    .eq('id', article.id);

  // Récupération d'articles similaires
  const { data: articlesLies } = await supabase
    .from('articles')
    .select(`
      id,
      titre,
      slug,
      extrait,
      image_url,
      image_alt,
      categorie,
      published_at
    `)
    .eq('statut', 'publie')
    .eq('categorie', article.categorie)
    .neq('id', article.id)
    .order('published_at', { ascending: false })
    .limit(3);

  const profiles = article.profiles as { first_name: string; last_name: string; }[] | null;
  const auteur = profiles && profiles.length > 0 ? profiles[0] : null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Bouton retour */}
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/blog">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au blog
          </Link>
        </Button>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Badge variant="default">{article.categorie}</Badge>
            <div className="flex items-center text-sm text-gray-500 gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(article.published_at).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {auteur ? `${auteur.first_name} ${auteur.last_name}` : 'Anonyme'}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {article.vues + 1} vues
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {article.titre}
          </h1>
          
          {article.extrait && (
            <p className="text-xl text-gray-600 leading-relaxed">
              {article.extrait}
            </p>
          )}
        </header>

        {/* Image principale */}
        {article.image_url && (
          <div className="mb-8">
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <Image
                src={article.image_url}
                alt={article.image_alt || article.titre}
                fill
                className="object-cover"
                priority
              />
            </div>
            {article.image_alt && (
              <p className="text-sm text-gray-500 mt-2 text-center italic">
                {article.image_alt}
              </p>
            )}
          </div>
        )}

        {/* Contenu */}
        <div className="prose prose-lg max-w-none mb-8">
          {article.contenu.split('\n').map((paragraph: string, index: number) => (
            <p key={index} className="mb-4 text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Séparateur */}
        <hr className="my-8" />

        {/* Partage et actions */}
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-gray-500">
            Publié le {new Date(article.published_at).toLocaleDateString('fr-FR')}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/blog">
                Voir tous les articles
              </Link>
            </Button>
          </div>
        </div>
      </article>

      {/* Articles liés */}
      {articlesLies && articlesLies.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Articles similaires
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articlesLies.map((articleLie) => (
              <Card key={articleLie.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/blog/${articleLie.slug}`}>
                  <div className="aspect-video relative bg-gray-100">
                    {articleLie.image_url ? (
                      <Image
                        src={articleLie.image_url}
                        alt={articleLie.image_alt || articleLie.titre}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-4xl">📝</span>
                      </div>
                    )}
                  </div>
                </Link>
                <CardContent className="p-4">
                  <Badge variant="secondary" className="mb-2">
                    {articleLie.categorie}
                  </Badge>
                  <h3 className="font-semibold line-clamp-2 hover:text-lime-600 transition-colors">
                    <Link href={`/blog/${articleLie.slug}`}>
                      {articleLie.titre}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                    {articleLie.extrait}
                  </p>
                  <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(articleLie.published_at).toLocaleDateString('fr-FR')}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// Génération des métadonnées pour le SEO
export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from('articles')
    .select('titre, meta_description, meta_keywords, image_url')
    .eq('slug', slug)
    .eq('statut', 'publie')
    .single();

  if (!article) {
    return {
      title: 'Article non trouvé',
    };
  }

  return {
    title: article.titre,
    description: article.meta_description || `Découvrez ${article.titre} sur notre blog conseils animaux`,
    keywords: article.meta_keywords,
    openGraph: {
      title: article.titre,
      description: article.meta_description,
      images: article.image_url ? [article.image_url] : [],
    },
  };
} 