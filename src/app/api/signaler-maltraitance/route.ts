import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    // Validation des champs requis
    const { 
      signaleur_prenom, 
      signaleur_nom, 
      signaleur_email, 
      animal_type, 
      type_maltraitance, 
      gravite, 
      description_maltraitance, 
      lieu_maltraitance, 
      ville 
    } = body;
    
    if (!signaleur_prenom || !signaleur_nom || !signaleur_email || !animal_type || 
        !type_maltraitance || !gravite || !description_maltraitance || !lieu_maltraitance || !ville) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signaleur_email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    // Déterminer la priorité automatiquement basée sur la gravité
    let priorite = 'normale';
    switch (gravite) {
      case 'critique':
        priorite = 'urgente';
        break;
      case 'elevee':
        priorite = 'haute';
        break;
      case 'moyenne':
        priorite = 'normale';
        break;
      case 'faible':
        priorite = 'basse';
        break;
    }

    // Préparer les données pour la base de données
    const signalementData = {
      // Informations du signaleur
      signaleur_prenom,
      signaleur_nom,
      signaleur_email,
      signaleur_telephone: body.signaleur_telephone || null,
      signaleur_adresse: body.signaleur_adresse || null,
      
      // Informations sur l'animal
      animal_type,
      animal_nom: body.animal_nom || null,
      animal_race: body.animal_race || null,
      animal_age: body.animal_age || null,
      animal_description: body.animal_description || null,
      
      // Informations sur la maltraitance
      type_maltraitance,
      gravite,
      description_maltraitance,
      frequence: body.frequence || null,
      duree_estimee: body.duree_estimee || null,
      
      // Localisation
      lieu_maltraitance,
      adresse_precise: body.adresse_precise || null,
      ville,
      code_postal: body.code_postal || null,
      
      // Responsable présumé
      responsable_nom: body.responsable_nom || null,
      responsable_description: body.responsable_description || null,
      relation_animal: body.relation_animal || null,
      
      // Témoins et preuves
      temoins_presents: body.temoins_presents || false,
      temoins_description: body.temoins_description || null,
      preuves_disponibles: body.preuves_disponibles || false,
      preuves_description: body.preuves_description || null,
      
      // Statut et priorité
      statut: 'nouveau',
      priorite: priorite,
    };

    console.log('💾 Tentative de sauvegarde du signalement...');
    console.log('Données:', signalementData);

    // Insérer dans Supabase
    const { data, error } = await supabase
      .from('signalements')
      .insert([signalementData])
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur Supabase:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la sauvegarde du signalement' },
        { status: 500 }
      );
    }

    console.log('✅ Signalement sauvegardé:', data);

    // Envoyer une notification email (optionnel)
    try {
      await sendNotificationEmail(data);
    } catch (emailError) {
      console.error('⚠️ Erreur envoi email de notification:', emailError);
      // On continue même si l'email échoue
    }

    return NextResponse.json(
      { 
        message: 'Signalement enregistré avec succès',
        id: data.id,
        priorite: data.priorite
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('❌ Erreur lors du traitement du signalement:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors du traitement du signalement' },
      { status: 500 }
    );
  }
}

// Fonction pour envoyer une notification email
async function sendNotificationEmail(signalement: any) {
  try {
    const { simulateEmailSend } = await import('@/lib/resend');
    
    const emailData = {
      firstName: 'Équipe',
      lastName: 'APwAP',
      email: 'admin@apetwithaplan.com',
      subject: `🚨 NOUVEAU SIGNALEMENT - ${signalement.gravite.toUpperCase()}`,
      message: `
NOUVEAU SIGNALEMENT DE MALTRAITANCE

📋 INFORMATIONS GÉNÉRALES
- ID: ${signalement.id}
- Priorité: ${signalement.priorite.toUpperCase()}
- Gravité: ${signalement.gravite.toUpperCase()}
- Date: ${new Date(signalement.created_at).toLocaleString('fr-FR')}

👤 SIGNALEUR
- Nom: ${signalement.signaleur_prenom} ${signalement.signaleur_nom}
- Email: ${signalement.signaleur_email}
- Téléphone: ${signalement.signaleur_telephone || 'Non renseigné'}

🐾 ANIMAL CONCERNÉ
- Type: ${signalement.animal_type}
- Nom: ${signalement.animal_nom || 'Non renseigné'}
- Race: ${signalement.animal_race || 'Non renseigné'}
- Âge: ${signalement.animal_age || 'Non renseigné'}

🚨 MALTRAITANCE
- Type: ${signalement.type_maltraitance}
- Fréquence: ${signalement.frequence || 'Non renseigné'}
- Description: ${signalement.description_maltraitance}

📍 LOCALISATION
- Lieu: ${signalement.lieu_maltraitance}
- Adresse: ${signalement.adresse_precise || 'Non renseigné'}
- Ville: ${signalement.ville} ${signalement.code_postal || ''}

👥 RESPONSABLE PRÉSUMÉ
- Nom: ${signalement.responsable_nom || 'Non renseigné'}
- Relation: ${signalement.relation_animal || 'Non renseigné'}

📝 TÉMOINS ET PREUVES
- Témoins: ${signalement.temoins_presents ? 'Oui' : 'Non'}
- Preuves: ${signalement.preuves_disponibles ? 'Oui' : 'Non'}

⚠️ ACTION REQUISE: Consultez le panel admin pour traiter ce signalement.
      `,
      submittedAt: new Date().toLocaleString('fr-FR')
    };

    await simulateEmailSend(emailData);
    console.log('📧 Email de notification envoyé');
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    throw error;
  }
} 