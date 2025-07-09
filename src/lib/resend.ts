// Configuration Resend pour l'envoi d'emails
// Décommentez et configurez quand vous installez Resend

import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set in environment variables');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Configuration des emails
export const EMAIL_CONFIG = {
  from: 'onboarding@resend.dev', // Domaine vérifié par défaut de Resend
  to: process.env.CONTACT_EMAIL || 'contact@apetwithaplan.com',
};

// Template pour l'email de contact
export function generateContactEmailHTML(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  animalType?: string;
  animalName?: string;
  submittedAt: string;
}) {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nouveau message de contact - A Pet with a Plan</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #84cc16 0%, #65a30d 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🐾 A Pet with a Plan</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px;">Nouveau message de contact</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 25px; border-left: 5px solid #84cc16;">
        <h2 style="color: #84cc16; margin-top: 0; font-size: 22px;">Informations du contact</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555; width: 120px;">Nom :</td>
            <td style="padding: 8px 0;">${data.firstName} ${data.lastName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Email :</td>
            <td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #84cc16; text-decoration: none;">${data.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Téléphone :</td>
            <td style="padding: 8px 0;">${data.phone || 'Non renseigné'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Animal :</td>
            <td style="padding: 8px 0;">${data.animalName || 'Non renseigné'} ${data.animalType ? `(${data.animalType})` : ''}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Sujet :</td>
            <td style="padding: 8px 0; font-weight: bold; color: #84cc16;">${data.subject}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Date :</td>
            <td style="padding: 8px 0;">${data.submittedAt}</td>
          </tr>
        </table>
      </div>
      
      <div style="background: white; padding: 25px; border-radius: 10px; border: 2px solid #e5e7eb; margin-bottom: 25px;">
        <h2 style="color: #84cc16; margin-top: 0; font-size: 22px;">Message</h2>
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #84cc16;">
          <p style="margin: 0; white-space: pre-wrap; font-size: 16px; line-height: 1.6;">${data.message}</p>
        </div>
      </div>
      
      <div style="background: #1f2937; color: white; padding: 20px; border-radius: 10px; text-align: center;">
        <p style="margin: 0; font-size: 14px;">
          📧 Répondre à ce message : 
          <a href="mailto:${data.email}" style="color: #84cc16; text-decoration: none; font-weight: bold;">${data.email}</a>
        </p>
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #9ca3af;">
          Message envoyé depuis le site A Pet with a Plan
        </p>
      </div>
    </body>
    </html>
  `;
}

// Template pour l'email de confirmation à l'utilisateur
export function generateConfirmationEmailHTML(data: {
  firstName: string;
  lastName: string;
  subject: string;
}) {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmation de votre message - A Pet with a Plan</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #84cc16 0%, #65a30d 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🐾 A Pet with a Plan</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px;">Merci pour votre message !</p>
      </div>
      
      <div style="padding: 25px;">
        <h2 style="color: #84cc16; margin-top: 0;">Bonjour ${data.firstName} ${data.lastName},</h2>
        
        <p style="font-size: 16px; margin-bottom: 20px;">
          Nous avons bien reçu votre message concernant : <strong>"${data.subject}"</strong>
        </p>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #84cc16; margin: 20px 0;">
          <p style="margin: 0; font-size: 16px;">
            ✅ <strong>Notre engagement :</strong> Nous vous répondrons sous 24h maximum
          </p>
        </div>
        
        <p style="font-size: 16px; margin-bottom: 20px;">
          Notre équipe d'experts en bien-être animal va étudier votre demande et vous apporter une réponse personnalisée.
        </p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #84cc16; margin-top: 0;">En cas d'urgence</h3>
          <p style="margin: 0; font-size: 14px; color: #666;">
            Si votre animal présente des signes de détresse ou de maladie, contactez immédiatement votre vétérinaire ou un service d'urgence vétérinaire.
          </p>
        </div>
        
        <p style="font-size: 16px; margin-bottom: 20px;">
          Cordialement,<br>
          <strong>L'équipe A Pet with a Plan</strong>
        </p>
      </div>
      
      <div style="background: #1f2937; color: white; padding: 20px; border-radius: 10px; text-align: center;">
        <p style="margin: 0; font-size: 14px;">
          📧 contact@apetwithaplan.com | 📞 +33 1 23 45 67 89
        </p>
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #9ca3af;">
          A Pet with a Plan - Votre partenaire pour le bien-être de votre animal
        </p>
      </div>
    </body>
    </html>
  `;
}

// Fonction pour envoyer l'email de contact
export async function sendContactEmail(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  animalType?: string;
  animalName?: string;
  submittedAt: string;
}) {
  try {
    console.log('📧 Tentative d\'envoi d\'email avec Resend...');
    console.log('Configuration:', { from: EMAIL_CONFIG.from, to: EMAIL_CONFIG.to });
    
    // Email à l'équipe
    const contactEmail = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: [EMAIL_CONFIG.to],
      subject: `Nouveau contact: ${data.subject}`,
      html: generateContactEmailHTML(data),
    });

    console.log('✅ Email équipe envoyé:', contactEmail);

    // Email de confirmation à l'utilisateur
    const confirmationEmail = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: [data.email],
      subject: 'Confirmation de votre message - A Pet with a Plan',
      html: generateConfirmationEmailHTML(data),
    });

    console.log('✅ Email confirmation envoyé:', confirmationEmail);

    return {
      contactEmail: contactEmail.data,
      confirmationEmail: confirmationEmail.data,
    };
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi des emails:', error);
    throw error;
  }
}

// Version de simulation pour le développement
export function simulateEmailSend(data: any) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('📧 Email de contact simulé:', {
        to: 'sohane.chamen@eemi.com',
        subject: `Nouveau contact: ${data.subject}`,
        from: data.email,
        data: data
      });
      
      console.log('📧 Email de confirmation simulé:', {
        to: data.email,
        subject: 'Confirmation de votre message - A Pet with a Plan',
        message: `Bonjour ${data.firstName}, nous avons bien reçu votre message.`
      });
      
      resolve({ success: true });
    }, 1000);
  });
} 