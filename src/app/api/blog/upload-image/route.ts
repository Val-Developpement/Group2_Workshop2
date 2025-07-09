import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non supporté. Utilisez JPEG, PNG, WebP ou GIF.' },
        { status: 400 }
      );
    }

    // Vérifier la taille du fichier (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Le fichier est trop volumineux. Taille maximale: 5MB.' },
        { status: 400 }
      );
    }

    // Générer un nom de fichier unique
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
    const filePath = `articles/${fileName}`;

    // Convertir le fichier en ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload vers Supabase Storage
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Erreur lors de l\'upload:', error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'upload du fichier' },
        { status: 500 }
      );
    }

    // Obtenir l'URL publique
    const { data: publicData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);

    return NextResponse.json({
      url: publicData.publicUrl,
      path: filePath,
      fileName: fileName,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une image
export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');

    if (!filePath) {
      return NextResponse.json(
        { error: 'Chemin du fichier requis' },
        { status: 400 }
      );
    }

    // Supprimer le fichier du storage
    const { error } = await supabase.storage
      .from('blog-images')
      .remove([filePath]);

    if (error) {
      console.error('Erreur lors de la suppression:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la suppression du fichier' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Fichier supprimé avec succès' },
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