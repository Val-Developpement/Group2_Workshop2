export interface Translations {
  // Navigation
  home: string;
  shop: string;
  blog: string;
  contact: string;
  animalQuiz: string;
  reportCase: string;
  
  // Auth
  login: string;
  register: string;
  logout: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  myAccount: string;
  myProfile: string;
  adminPanel: string;
  
  // Common
  loading: string;
  search: string;
  cancel: string;
  save: string;
  edit: string;
  delete: string;
  back: string;
  next: string;
  previous: string;
  
  // Shop
  cart: string;
  addToCart: string;
  price: string;
  quantity: string;
  total: string;
  checkout: string;
  
  // Blog
  readMore: string;
  publishedOn: string;
  author: string;
  
  // Quiz
  quizTitle: string;
  quizSubtitle: string;
  startQuiz: string;
  results: string;
  
  // Footer
  aboutUs: string;
  services: string;
  navigation: string;
  followUs: string;
  
  // Admin
  dashboard: string;
  users: string;
  products: string;
  categories: string;
  orders: string;
  reports: string;
  
  // Language
  language: string;
  french: string;
  english: string;
  
  // Homepage
  welcomeTitle: string;
  welcomeSubtitle: string;
  welcomeDescription: string;
  discoverShop: string;
  didYouKnow: string;
  didYouKnowSubtitle: string;
  
  // Fun Facts
  dogMemoryTitle: string;
  dogMemoryText: string;
  catSleepTitle: string;
  catSleepText: string;
  purringTitle: string;
  purringText: string;
  tailLanguageTitle: string;
  tailLanguageText: string;
  superSmellTitle: string;
  superSmellText: string;
  
  // Framework 360
  framework360Title: string;
  framework360Subtitle: string;
  
  // Pillars
  nutritionTitle: string;
  nutritionDescription: string;
  nutritionFeature1: string;
  nutritionFeature2: string;
  nutritionFeature3: string;
  
  exerciseTitle: string;
  exerciseDescription: string;
  exerciseFeature1: string;
  exerciseFeature2: string;
  exerciseFeature3: string;
  
  healthTitle: string;
  healthDescription: string;
  healthFeature1: string;
  healthFeature2: string;
  healthFeature3: string;
  
  behaviorTitle: string;
  behaviorDescription: string;
  behaviorFeature1: string;
  behaviorFeature2: string;
  behaviorFeature3: string;
  
  environmentTitle: string;
  environmentDescription: string;
  environmentFeature1: string;
  environmentFeature2: string;
  environmentFeature3: string;
  
  relationshipTitle: string;
  relationshipDescription: string;
  relationshipFeature1: string;
  relationshipFeature2: string;
  relationshipFeature3: string;
  
  frameworkConclusion: string;
  discoverMethod: string;
  
  // CTA Section
  ctaTitle: string;
  ctaDescription: string;
  startAdventure: string;
  learnMore: string;
  
  // Footer Extended
  footerDescription: string;
  contactSupport: string;
  emailLabel: string;
  phoneLabel: string;
  confidentialityNote: string;
  newsletter: string;
  newsletterDescription: string;
  emailPlaceholder: string;
  subscribe: string;
  copyright: string;
  privacyPolicy: string;
  termsOfUse: string;
  cookieManagement: string;
}

export const translations: Record<string, Translations> = {
  fr: {
    // Navigation
    home: 'Accueil',
    shop: 'Boutique',
    blog: 'Blog',
    contact: 'Contact',
    animalQuiz: 'Quiz Animal',
    reportCase: 'Signaler un cas',
    
    // Auth
    login: 'Se connecter',
    register: "S'inscrire",
    logout: 'Déconnexion',
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'Email',
    password: 'Mot de passe',
    myAccount: 'Mon compte',
    myProfile: 'Mon profil',
    adminPanel: 'Panneau Admin',
    
    // Common
    loading: 'Chargement...',
    search: 'Rechercher',
    cancel: 'Annuler',
    save: 'Sauvegarder',
    edit: 'Modifier',
    delete: 'Supprimer',
    back: 'Retour',
    next: 'Suivant',
    previous: 'Précédent',
    
    // Shop
    cart: 'Panier',
    addToCart: 'Ajouter au panier',
    price: 'Prix',
    quantity: 'Quantité',
    total: 'Total',
    checkout: 'Commander',
    
    // Blog
    readMore: 'Lire plus',
    publishedOn: 'Publié le',
    author: 'Auteur',
    
    // Quiz
    quizTitle: 'Quiz Animal',
    quizSubtitle: 'Trouvez votre animal idéal',
    startQuiz: 'Commencer le quiz',
    results: 'Résultats',
    
    // Footer
    aboutUs: 'À propos',
    services: 'Nos services',
    navigation: 'Navigation',
    followUs: 'Suivez-nous',
    
    // Admin
    dashboard: 'Tableau de bord',
    users: 'Utilisateurs',
    products: 'Produits',
    categories: 'Catégories',
    orders: 'Commandes',
    reports: 'Signalements',
    
    // Language
    language: 'Langue',
    french: 'Français',
    english: 'Anglais',
    
    // Homepage
    welcomeTitle: 'Bienvenue sur APwAP !',
    welcomeSubtitle: 'Le bonheur à quatre pattes',
    welcomeDescription: 'Ici, chaque chien remue la queue et chaque chat ronronne de plaisir. Découvre des conseils, des services et des histoires pour rendre ton compagnon heureux, chaque jour !',
    discoverShop: 'Découvrir la boutique',
    didYouKnow: 'Le savais-tu ?',
    didYouKnowSubtitle: 'Des anecdotes surprenantes sur nos compagnons à quatre pattes',
    
    // Fun Facts
    dogMemoryTitle: 'Super-mémoire canine',
    dogMemoryText: 'Un chien peut reconnaître et mémoriser jusqu\'à 250 mots différents. Certains Border Collies peuvent même apprendre plus de 1000 mots !',
    catSleepTitle: 'Maître du sommeil',
    catSleepText: 'Les chats dorment en moyenne 15h par jour. Ils passent donc 70% de leur vie à dormir... et on les envie !',
    purringTitle: 'Ronronnement thérapeutique',
    purringText: 'Le ronronnement du chat vibre entre 20-50 Hz, fréquence qui favorise la guérison des os et réduit le stress chez l\'humain.',
    tailLanguageTitle: 'Langage de la queue',
    tailLanguageText: 'Un chien qui remue la queue vers la droite est content, vers la gauche il est anxieux. La science des émotions canines !',
    superSmellTitle: 'Super-odorat',
    superSmellText: 'Le nez d\'un chien contient 300 millions de récepteurs olfactifs (vs 6 millions chez l\'humain). Il peut sentir une cuillère de sucre dans une piscine !',
    
    // Framework 360
    framework360Title: 'Notre Framework 360°',
    framework360Subtitle: 'Une approche holistique et scientifique du bien-être animal, développée par nos experts pour garantir l\'épanouissement de votre compagnon.',
    
    // Pillars
    nutritionTitle: 'Alimentation',
    nutritionDescription: 'Nutrition personnalisée basée sur l\'âge, la race, l\'activité et les besoins spécifiques de votre animal.',
    nutritionFeature1: 'Analyse nutritionnelle complète',
    nutritionFeature2: 'Recommandations sur-mesure',
    nutritionFeature3: 'Suivi et ajustements',
    
    exerciseTitle: 'Exercice',
    exerciseDescription: 'Programme d\'activité physique et mentale adapté pour maintenir la forme et l\'équilibre psychologique.',
    exerciseFeature1: 'Évaluation de la condition physique',
    exerciseFeature2: 'Exercices ciblés et progressifs',
    exerciseFeature3: 'Stimulation cognitive',
    
    healthTitle: 'Santé',
    healthDescription: 'Suivi médical préventif et coordination avec les professionnels de santé vétérinaire.',
    healthFeature1: 'Prévention et dépistage',
    healthFeature2: 'Coordination vétérinaire',
    healthFeature3: 'Suivi personnalisé',
    
    behaviorTitle: 'Comportement',
    behaviorDescription: 'Analyse comportementale et méthodes d\'éducation positive pour une relation harmonieuse.',
    behaviorFeature1: 'Évaluation comportementale',
    behaviorFeature2: 'Éducation positive',
    behaviorFeature3: 'Résolution de problèmes',
    
    environmentTitle: 'Environnement',
    environmentDescription: 'Optimisation de l\'espace de vie pour créer un environnement sécurisé et stimulant.',
    environmentFeature1: 'Audit de l\'habitat',
    environmentFeature2: 'Aménagements conseillés',
    environmentFeature3: 'Enrichissement environnemental',
    
    relationshipTitle: 'Relation',
    relationshipDescription: 'Renforcement du lien unique humain-animal par la compréhension mutuelle et la communication.',
    relationshipFeature1: 'Communication inter-espèces',
    relationshipFeature2: 'Renforcement du lien',
    relationshipFeature3: 'Moments de qualité',
    
    frameworkConclusion: 'Chaque pilier de notre framework est interconnecté pour garantir une approche complète et efficace.',
    discoverMethod: 'Découvrir notre méthode',
    
    // CTA Section
    ctaTitle: 'Prêt à faire sourire votre compagnon ? 😺🐶',
    ctaDescription: 'Rejoignez la communauté APwAP et découvrez une nouvelle façon de prendre soin de votre animal, dans la joie et la bonne humeur !',
    startAdventure: 'Commencer l\'aventure',
    learnMore: 'En savoir plus',
    
    // Footer Extended
    footerDescription: 'Une vision globale du bien-être physique et émotionnel de votre animal de compagnie. Nous considérons l\'unicité de chaque couple humain-animal pour des recommandations personnalisées.',
    contactSupport: 'Contact & Support',
    emailLabel: 'Email',
    phoneLabel: 'Téléphone',
    confidentialityNote: 'Nous sommes soumis au secret professionnel et garantissons la plus grande discrétion.',
    newsletter: 'Newsletter',
    newsletterDescription: 'Recevez nos conseils et actualités directement dans votre boîte mail',
    emailPlaceholder: 'Votre adresse email',
    subscribe: 'S\'abonner',
    copyright: '© 2024 A Pet with a Plan. Tous droits réservés.',
    privacyPolicy: 'Politique de confidentialité',
    termsOfUse: 'Conditions d\'utilisation',
    cookieManagement: 'Gestion des cookies',
  },
  en: {
    // Navigation
    home: 'Home',
    shop: 'Shop',
    blog: 'Blog',
    contact: 'Contact',
    animalQuiz: 'Animal Quiz',
    reportCase: 'Report a Case',
    
    // Auth
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    password: 'Password',
    myAccount: 'My Account',
    myProfile: 'My Profile',
    adminPanel: 'Admin Panel',
    
    // Common
    loading: 'Loading...',
    search: 'Search',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    
    // Shop
    cart: 'Cart',
    addToCart: 'Add to Cart',
    price: 'Price',
    quantity: 'Quantity',
    total: 'Total',
    checkout: 'Checkout',
    
    // Blog
    readMore: 'Read More',
    publishedOn: 'Published on',
    author: 'Author',
    
    // Quiz
    quizTitle: 'Animal Quiz',
    quizSubtitle: 'Find your ideal pet',
    startQuiz: 'Start Quiz',
    results: 'Results',
    
    // Footer
    aboutUs: 'About Us',
    services: 'Our Services',
    navigation: 'Navigation',
    followUs: 'Follow Us',
    
    // Admin
    dashboard: 'Dashboard',
    users: 'Users',
    products: 'Products',
    categories: 'Categories',
    orders: 'Orders',
    reports: 'Reports',
    
    // Language
    language: 'Language',
    french: 'French',
    english: 'English',
    
    // Homepage
    welcomeTitle: 'Welcome to APwAP!',
    welcomeSubtitle: 'Happiness on four paws',
    welcomeDescription: 'Here, every dog wags its tail and every cat purrs with pleasure. Discover tips, services and stories to make your companion happy, every day!',
    discoverShop: 'Discover the shop',
    didYouKnow: 'Did you know?',
    didYouKnowSubtitle: 'Surprising anecdotes about our four-legged companions',
    
    // Fun Facts
    dogMemoryTitle: 'Canine super-memory',
    dogMemoryText: 'A dog can recognize and memorize up to 250 different words. Some Border Collies can even learn more than 1000 words!',
    catSleepTitle: 'Master of sleep',
    catSleepText: 'Cats sleep an average of 15 hours a day. They therefore spend 70% of their life sleeping... and we envy them!',
    purringTitle: 'Therapeutic purring',
    purringText: 'Cat purring vibrates between 20-50 Hz, a frequency that promotes bone healing and reduces stress in humans.',
    tailLanguageTitle: 'Tail language',
    tailLanguageText: 'A dog that wags its tail to the right is happy, to the left it is anxious. The science of canine emotions!',
    superSmellTitle: 'Super-smell',
    superSmellText: 'A dog\'s nose contains 300 million olfactory receptors (vs 6 million in humans). It can smell a teaspoon of sugar in a swimming pool!',
    
    // Framework 360
    framework360Title: 'Our 360° Framework',
    framework360Subtitle: 'A holistic and scientific approach to animal welfare, developed by our experts to guarantee your companion\'s fulfillment.',
    
    // Pillars
    nutritionTitle: 'Nutrition',
    nutritionDescription: 'Personalized nutrition based on age, breed, activity and specific needs of your animal.',
    nutritionFeature1: 'Complete nutritional analysis',
    nutritionFeature2: 'Custom recommendations',
    nutritionFeature3: 'Monitoring and adjustments',
    
    exerciseTitle: 'Exercise',
    exerciseDescription: 'Physical and mental activity program adapted to maintain fitness and psychological balance.',
    exerciseFeature1: 'Physical condition assessment',
    exerciseFeature2: 'Targeted and progressive exercises',
    exerciseFeature3: 'Cognitive stimulation',
    
    healthTitle: 'Health',
    healthDescription: 'Preventive medical monitoring and coordination with veterinary health professionals.',
    healthFeature1: 'Prevention and screening',
    healthFeature2: 'Veterinary coordination',
    healthFeature3: 'Personalized monitoring',
    
    behaviorTitle: 'Behavior',
    behaviorDescription: 'Behavioral analysis and positive education methods for a harmonious relationship.',
    behaviorFeature1: 'Behavioral assessment',
    behaviorFeature2: 'Positive education',
    behaviorFeature3: 'Problem solving',
    
    environmentTitle: 'Environment',
    environmentDescription: 'Living space optimization to create a secure and stimulating environment.',
    environmentFeature1: 'Habitat audit',
    environmentFeature2: 'Recommended arrangements',
    environmentFeature3: 'Environmental enrichment',
    
    relationshipTitle: 'Relationship',
    relationshipDescription: 'Strengthening the unique human-animal bond through mutual understanding and communication.',
    relationshipFeature1: 'Inter-species communication',
    relationshipFeature2: 'Bond strengthening',
    relationshipFeature3: 'Quality moments',
    
    frameworkConclusion: 'Each pillar of our framework is interconnected to guarantee a complete and effective approach.',
    discoverMethod: 'Discover our method',
    
    // CTA Section
    ctaTitle: 'Ready to make your companion smile? 😺🐶',
    ctaDescription: 'Join the APwAP community and discover a new way to take care of your animal, with joy and good humor!',
    startAdventure: 'Start the adventure',
    learnMore: 'Learn more',
    
    // Footer Extended
    footerDescription: 'A global vision of the physical and emotional well-being of your pet. We consider the uniqueness of each human-animal couple for personalized recommendations.',
    contactSupport: 'Contact & Support',
    emailLabel: 'Email',
    phoneLabel: 'Phone',
    confidentialityNote: 'We are subject to professional secrecy and guarantee the greatest discretion.',
    newsletter: 'Newsletter',
    newsletterDescription: 'Receive our advice and news directly in your mailbox',
    emailPlaceholder: 'Your email address',
    subscribe: 'Subscribe',
    copyright: '© 2024 A Pet with a Plan. All rights reserved.',
    privacyPolicy: 'Privacy Policy',
    termsOfUse: 'Terms of Use',
    cookieManagement: 'Cookie Management',
  },
};

export function getTranslation(locale: string): Translations {
  return translations[locale] || translations.fr;
} 