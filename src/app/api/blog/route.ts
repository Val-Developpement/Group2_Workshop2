import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET - Récupérer les articles (avec filtres optionnels)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const categorie = searchParams.get('categorie');
    const statut = searchParams.get('statut') || 'publie';
    const search = searchParams.get('search');
    
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
        tags,
        statut,
        published_at,
        vues,
        profiles!auteur_id (
          first_name,
          last_name
        )
      `, { count: 'exact' })
      .eq('statut', statut)
      .order('published_at', { ascending: false });

    // Filtres
    if (categorie) {
      query = query.eq('categorie', categorie);
    }

    if (search) {
      query = query.or(`titre.ilike.%${search}%,extrait.ilike.%${search}%`);
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: articles, error, count } = await query;

    if (error) {
      console.error('Erreur lors de la récupération des articles:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des articles' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouvel article
export async function POST(request: NextRequest) {
  try {
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
      statut = 'brouillon',
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

    // Génération du slug
    const slug = titre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    // Vérifier l'unicité du slug
    const { data: existingArticle } = await supabase
      .from('articles')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existingArticle) {
      return NextResponse.json(
        { error: 'Un article avec ce titre existe déjà' },
        { status: 409 }
      );
    }

    // Créer l'article
    const articleData = {
      titre,
      slug,
      contenu,
      extrait,
      image_url,
      image_alt,
      categorie,
      tags,
      statut,
      auteur_id: user.id,
      meta_description,
      meta_keywords,
      ...(statut === 'publie' && { published_at: new Date().toISOString() })
    };

    const { data: article, error } = await supabase
      .from('articles')
      .insert([articleData])
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création de l\'article:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la création de l\'article' },
        { status: 500 }
      );
    }

    return NextResponse.json(article, { status: 201 });

  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
} 