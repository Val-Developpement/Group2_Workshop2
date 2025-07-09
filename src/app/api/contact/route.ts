import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation des champs requis
    const { firstName, lastName, email, subject, message } = body;
    
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    // Préparer les données pour l'email
    const emailData = {
      firstName,
      lastName,
      email,
      phone: body.phone || 'Non renseigné',
      subject,
      message,
      animalType: body.animalType || 'Non renseigné',
      animalName: body.animalName || 'Non renseigné',
      submittedAt: new Date().toLocaleString('fr-FR', {
        timeZone: 'Europe/Paris',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    // Utilisation de Resend pour l'envoi d'emails
    const { sendContactEmail } = await import('@/lib/resend');
    await sendContactEmail(emailData);
    
    return NextResponse.json(
      { message: 'Message envoyé avec succès' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'envoi du message' },
      { status: 500 }
    );
  }
}

