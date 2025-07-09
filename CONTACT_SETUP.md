# Configuration du système de contact avec Resend

## 🚀 Installation rapide

### 1. Installer Resend
```bash
npm install resend
```

### 2. Créer le fichier d'environnement
Créez un fichier `.env.local` à la racine du projet :
```env
# Configuration Resend
RESEND_API_KEY=your_resend_api_key_here
CONTACT_EMAIL=contact@apetwithaplan.com
RESEND_DOMAIN=apetwithaplan.com
```

### 3. Obtenir votre clé API Resend
1. Allez sur [https://resend.com](https://resend.com)
2. Créez un compte ou connectez-vous
3. Allez dans "API Keys" 
4. Créez une nouvelle clé API
5. Copiez la clé dans votre fichier `.env.local`

### 4. Configurer votre domaine (optionnel mais recommandé)
1. Dans Resend, allez dans "Domains"
2. Ajoutez votre domaine (ex: apetwithaplan.com)
3. Suivez les instructions pour configurer les enregistrements DNS
4. Une fois vérifié, vous pourrez envoyer depuis votre domaine

### 5. Activer Resend dans le code
Dans le fichier `src/lib/resend.ts`, décommentez le code Resend (supprimez `/*` et `*/`)

Dans le fichier `src/app/api/contact/route.ts`, remplacez :
```typescript
const { simulateEmailSend } = await import('@/lib/resend');
await simulateEmailSend(emailData);
```

Par :
```typescript
const { sendContactEmail } = await import('@/lib/resend');
await sendContactEmail(emailData);
```

## 📧 Fonctionnalités du système

### Emails envoyés
1. **Email à l'équipe** : Notification de nouveau message avec toutes les informations
2. **Email de confirmation** : Confirmation automatique envoyée à l'utilisateur

### Templates d'email
- Design moderne avec les couleurs de la marque
- Responsive pour mobile et desktop
- Informations complètes sur le contact et l'animal
- Liens de réponse rapide

### Validation
- Champs obligatoires vérifiés
- Format email validé
- Gestion des erreurs complète

## 🔧 Personnalisation

### Modifier les templates
Les templates sont dans `src/lib/resend.ts` :
- `generateContactEmailHTML()` : Email reçu par l'équipe
- `generateConfirmationEmailHTML()` : Email de confirmation

### Changer les emails de destination
Modifiez `CONTACT_EMAIL` dans `.env.local`

### Ajouter des champs
1. Ajoutez le champ dans `src/app/(root)/contact/page.tsx`
2. Mettez à jour les types dans `src/lib/resend.ts`
3. Ajoutez le champ dans les templates HTML

## 🧪 Mode développement

En mode développement (sans Resend configuré), le système utilise une simulation qui affiche les emails dans la console.

## 🔒 Sécurité

- Validation côté serveur
- Sanitisation des données
- Rate limiting recommandé (à implémenter si nécessaire)
- Variables d'environnement pour les clés sensibles

## 📊 Monitoring

Pour surveiller l'envoi d'emails :
1. Connectez-vous à votre dashboard Resend
2. Consultez les logs d'envoi
3. Vérifiez les taux de délivrabilité

## 🆘 Dépannage

### Erreur "RESEND_API_KEY not found"
- Vérifiez que `.env.local` existe
- Redémarrez le serveur de développement

### Emails non reçus
- Vérifiez les logs Resend
- Contrôlez les spams
- Assurez-vous que le domaine est vérifié

### Erreur de validation
- Vérifiez les champs obligatoires
- Contrôlez le format email

## 📞 Support

Pour toute question technique :
- Documentation Resend : [https://resend.com/docs](https://resend.com/docs)
- Support Resend : [https://resend.com/support](https://resend.com/support) 