import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET - Récupérer un article par ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

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
        statut,
        published_at,
        created_at,
        updated_at,
        vues,
        meta_description,
        meta_keywords,
        profiles!auteur_id (
          first_name,
          last_name
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération de l\'article:', error);
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(article);

  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un article
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }

    // Vérifier les permissions admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('isAdmin')
      .eq('id', user.id)
      .single();

    if (!profile?.isAdmin) {
      return NextResponse.json(
        { error: 'Permissions administrateur requises' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      titre,
      contenu,
      extrait,
      image_url,
      image_alt,
      categorie,
      tags,
      statut,
      meta_description,
      meta_keywords
    } = body;

    // Validation des données
    if (!titre || !contenu) {
      return NextResponse.json(
        { error: 'Le titre et le contenu sont requis' },
        { status: 400 }
      );
    }

    // Récupérer l'article existant
    const { data: existingArticle, error: fetchError } = await supabase
      .from('articles')
      .select('slug, statut')
      .eq('id', id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      );
    }

    // Générer un nouveau slug si le titre a changé
    let newSlug = existingArticle.slug;
    if (titre) {
      newSlug = titre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      // Vérifier l'unicité du slug si il a changé
      if (newSlug !== existingArticle.slug) {
        const { data: slugExists } = await supabase
          .from('articles')
          .select('id')
          .eq('slug', newSlug)
          .neq('id', id)
          .single();

        if (slugExists) {
          return NextResponse.json(
            { error: 'Un article avec ce titre existe déjà' },
            { status: 409 }
          );
        }
      }
    }

    // Préparer les données de mise à jour
    const updateData: any = {
      titre,
      slug: newSlug,
      contenu,
      extrait,
      image_url,
      image_alt,
      categorie,
      tags,
      statut,
      meta_description,
      meta_keywords
    };

    // Si on publie un brouillon, ajouter published_at
    if (statut === 'publie' && existingArticle.statut === 'brouillon') {
      updateData.published_at = new Date().toISOString();
    }

    // Mettre à jour l'article
    const { data: article, error } = await supabase
      .from('articles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour de l\'article:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour de l\'article' },
        { status: 500 }
      );
    }

    return NextResponse.json(article);

  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un article
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }

    // Vérifier les permissions admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('isAdmin')
      .eq('id', user.id)
      .single();

    if (!profile?.isAdmin) {
      return NextResponse.json(
        { error: 'Permissions administrateur requises' },
        { status: 403 }
      );
    }

    // Supprimer l'article
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la suppression de l\'article:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la suppression de l\'article' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Article supprimé avec succès' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
} 