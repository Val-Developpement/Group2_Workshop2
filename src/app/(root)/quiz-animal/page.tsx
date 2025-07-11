"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Heart, Home, Clock, Users, MapPin, Star, Sparkles } from 'lucide-react';

interface QuizData {
  lifestyle: string;
  housing: string;
  experience: string;
  timeAvailable: string;
  budget: string;
  family: string;
  activity: string;
  space: string;
  noise: string;
  grooming: string;
}

interface AnimalMatch {
  type: 'chat' | 'chien';
  breed: string;
  compatibility: number;
  reasons: string[];
  characteristics: string[];
  image: string;
  pros: string[];
  cons: string[];
}

const QUIZ_STEPS = [
  {
    id: 'lifestyle',
    title: 'Votre Style de Vie',
    subtitle: 'Comment décririez-vous votre quotidien ?',
    icon: Heart,
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'housing',
    title: 'Votre Logement',
    subtitle: 'Où vivez-vous actuellement ?',
    icon: Home,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'experience',
    title: 'Votre Expérience',
    subtitle: 'Quelle est votre expérience avec les animaux ?',
    icon: Star,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'timeAvailable',
    title: 'Temps Disponible',
    subtitle: 'Combien de temps pouvez-vous consacrer ?',
    icon: Clock,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'budget',
    title: 'Budget Mensuel',
    subtitle: 'Quel budget prévoyez-vous ?',
    icon: Sparkles,
    color: 'from-purple-500 to-violet-500'
  },
  {
    id: 'family',
    title: 'Composition Familiale',
    subtitle: 'Qui vit avec vous ?',
    icon: Users,
    color: 'from-teal-500 to-cyan-500'
  },
  {
    id: 'activity',
    title: 'Niveau d\'Activité',
    subtitle: 'Quel est votre niveau d\'activité ?',
    icon: MapPin,
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 'space',
    title: 'Espace Disponible',
    subtitle: 'Quelle taille d\'espace avez-vous ?',
    icon: Home,
    color: 'from-indigo-500 to-blue-500'
  },
  {
    id: 'noise',
    title: 'Tolérance au Bruit',
    subtitle: 'Comment gérez-vous le bruit ?',
    icon: Heart,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'grooming',
    title: 'Entretien',
    subtitle: 'Êtes-vous prêt(e) pour l\'entretien ?',
    icon: Sparkles,
    color: 'from-lime-500 to-green-500'
  }
];

const QUIZ_OPTIONS = {
  lifestyle: [
    { value: 'actif', label: 'Très actif', description: 'Sport, sorties fréquentes', emoji: '🏃‍♂️' },
    { value: 'modere', label: 'Modérément actif', description: 'Équilibre travail/loisirs', emoji: '🚶‍♂️' },
    { value: 'calme', label: 'Plutôt calme', description: 'Préfère les activités tranquilles', emoji: '🧘‍♂️' },
    { value: 'casanier', label: 'Casanier', description: 'Adore rester à la maison', emoji: '🏠' }
  ],
  housing: [
    { value: 'appartement', label: 'Appartement', description: 'Sans jardin/balcon', emoji: '🏢' },
    { value: 'appartement-balcon', label: 'Appartement avec balcon', description: 'Petit espace extérieur', emoji: '🏠' },
    { value: 'maison-jardin', label: 'Maison avec jardin', description: 'Espace extérieur sécurisé', emoji: '🏡' },
    { value: 'maison-terrain', label: 'Maison avec grand terrain', description: 'Beaucoup d\'espace', emoji: '🌳' }
  ],
  experience: [
    { value: 'debutant', label: 'Débutant', description: 'Premier animal de compagnie', emoji: '🌱' },
    { value: 'intermediaire', label: 'Intermédiaire', description: 'Quelques expériences', emoji: '📚' },
    { value: 'experimente', label: 'Expérimenté', description: 'Plusieurs animaux élevés', emoji: '🎓' },
    { value: 'expert', label: 'Expert', description: 'Éleveur ou professionnel', emoji: '👨‍⚕️' }
  ],
  timeAvailable: [
    { value: 'peu', label: 'Peu de temps', description: '< 1h par jour', emoji: '⏰' },
    { value: 'modere', label: 'Temps modéré', description: '1-3h par jour', emoji: '🕐' },
    { value: 'beaucoup', label: 'Beaucoup de temps', description: '3-5h par jour', emoji: '🕕' },
    { value: 'disponible', label: 'Très disponible', description: '> 5h par jour', emoji: '🕘' }
  ],
  budget: [
            { value: 'petit', label: 'Budget serré', description: '< 200 AED/mois', emoji: '💰' },
        { value: 'moyen', label: 'Budget moyen', description: '200-400 AED/mois', emoji: '💵' },
        { value: 'confortable', label: 'Budget confortable', description: '400-800 AED/mois', emoji: '💸' },
        { value: 'large', label: 'Budget large', description: '> 800 AED/mois', emoji: '💎' }
  ],
  family: [
    { value: 'seul', label: 'Seul(e)', description: 'Vous vivez seul(e)', emoji: '👤' },
    { value: 'couple', label: 'En couple', description: 'Vous et votre partenaire', emoji: '👫' },
    { value: 'famille-enfants', label: 'Famille avec enfants', description: 'Enfants à la maison', emoji: '👨‍👩‍👧‍👦' },
    { value: 'colocation', label: 'Colocation', description: 'Plusieurs colocataires', emoji: '👥' }
  ],
  activity: [
    { value: 'sedentaire', label: 'Sédentaire', description: 'Préfère les activités calmes', emoji: '📺' },
    { value: 'leger', label: 'Activité légère', description: 'Promenades occasionnelles', emoji: '🚶‍♂️' },
    { value: 'regulier', label: 'Activité régulière', description: 'Sport 2-3x/semaine', emoji: '🏃‍♂️' },
    { value: 'intense', label: 'Très actif', description: 'Sport quotidien', emoji: '🏋️‍♂️' }
  ],
  space: [
    { value: 'petit', label: 'Petit espace', description: '< 30m²', emoji: '🏠' },
    { value: 'moyen', label: 'Espace moyen', description: '30-60m²', emoji: '🏡' },
    { value: 'grand', label: 'Grand espace', description: '60-100m²', emoji: '🏘️' },
    { value: 'tres-grand', label: 'Très grand espace', description: '> 100m²', emoji: '🏰' }
  ],
  noise: [
    { value: 'intolerant', label: 'Intolérant', description: 'Le bruit me dérange', emoji: '🤫' },
    { value: 'sensible', label: 'Sensible', description: 'Préfère le calme', emoji: '😌' },
    { value: 'tolerant', label: 'Tolérant', description: 'Le bruit ne me dérange pas', emoji: '😊' },
    { value: 'indifferent', label: 'Indifférent', description: 'Habitué au bruit', emoji: '😎' }
  ],
  grooming: [
    { value: 'minimal', label: 'Minimal', description: 'Le moins d\'entretien possible', emoji: '✂️' },
    { value: 'occasionnel', label: 'Occasionnel', description: 'Entretien de base', emoji: '🧼' },
    { value: 'regulier', label: 'Régulier', description: 'Prêt(e) pour l\'entretien', emoji: '🛁' },
    { value: 'intensif', label: 'Intensif', description: 'J\'adore chouchouter', emoji: '💅' }
  ]
};

export default function QuizAnimalPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [quizData, setQuizData] = useState<Partial<QuizData>>({});
  const [results, setResults] = useState<AnimalMatch[]>([]);
  const [showResults, setShowResults] = useState(false);

  const currentStepData = QUIZ_STEPS[currentStep];
  const progress = ((currentStep + 1) / QUIZ_STEPS.length) * 100;

  const handleAnswer = (value: string) => {
    const newData = { ...quizData, [currentStepData.id]: value };
    setQuizData(newData);

    if (currentStep < QUIZ_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculer les résultats
      const matches = calculateMatches(newData as QuizData);
      setResults(matches);
      setShowResults(true);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setQuizData({});
    setResults([]);
    setShowResults(false);
  };

  if (showResults) {
    return <QuizResults results={results} onRestart={resetQuiz} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Hero Section */}
      <section className={`bg-gradient-to-r ${currentStepData.color} text-white py-16`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
            <currentStepData.icon className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{fontFamily: 'var(--font-caveat)'}}>
            {currentStepData.title}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-8">
            {currentStepData.subtitle}
          </p>
          
                     <div className="max-w-md mx-auto">
             <div className="flex justify-between items-center mb-2">
               <span className="text-sm text-white/80">Étape {currentStep + 1}</span>
               <span className="text-sm text-white/80">{currentStep + 1}/{QUIZ_STEPS.length}</span>
             </div>
             <Progress value={progress} className="h-2 bg-white/20" />
           </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              Question {currentStep + 1} sur {QUIZ_STEPS.length}
            </CardTitle>
            <CardDescription className="text-lg">
              Sélectionnez la réponse qui vous correspond le mieux
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {QUIZ_OPTIONS[currentStepData.id as keyof typeof QUIZ_OPTIONS]?.map((option, index) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`w-full p-6 text-left rounded-xl border-2 transition-all hover:border-blue-500 hover:shadow-lg group ${
                  quizData[currentStepData.id as keyof QuizData] === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{option.emoji}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600">
                      {option.label}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {option.description}
                    </p>
                  </div>
                  <div className="text-gray-400 group-hover:text-blue-500">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

                 <div className="flex justify-between items-center mt-8">
           <Button
             variant="outline"
             onClick={goBack}
             disabled={currentStep === 0}
             className="flex items-center gap-2"
           >
             <ArrowLeft className="w-4 h-4" />
             Précédent
           </Button>
           
           <div className="flex gap-2">
             {QUIZ_STEPS.map((_, index) => (
               <div
                 key={index}
                 className={`w-3 h-3 rounded-full transition-colors ${
                   index <= currentStep ? 'bg-blue-500' : 'bg-gray-300'
                 }`}
               />
             ))}
           </div>
           
           <div className="w-24" />
         </div>
      </div>
    </div>
  );
}

function QuizResults({ results, onRestart }: { results: AnimalMatch[], onRestart: () => void }) {
  const topMatch = results[0];
  
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
             <section className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-20">
         <div className="max-w-4xl mx-auto px-4 text-center">
           <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
             <Heart className="w-8 h-8" />
           </div>
           <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{fontFamily: 'var(--font-caveat)'}}>
             Votre Compagnon Idéal !
           </h1>
           <p className="text-xl md:text-2xl text-green-100 max-w-2xl mx-auto">
             Basé sur vos réponses, voici l'animal qui vous correspond le mieux
           </p>
         </div>
       </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
                 <Card className="shadow-xl mb-8">
           <CardContent className="p-8">
             <div className="text-center mb-8">
               <div className="text-6xl mb-4">{topMatch.type === 'chat' ? '🐱' : '🐶'}</div>
               <h2 className="text-3xl font-bold text-gray-900 mb-2">{topMatch.breed}</h2>
               <div className="flex items-center justify-center gap-2 mb-4">
                 <span className="text-lg text-gray-600">Compatibilité:</span>
                 <Badge className="bg-green-500 text-white text-lg px-4 py-1">
                   {topMatch.compatibility}% ✨
                 </Badge>
               </div>
             </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-green-600">Pourquoi c'est parfait pour vous :</h3>
                <ul className="space-y-2">
                  {topMatch.reasons.map((reason, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-gray-700">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-blue-600">Caractéristiques :</h3>
                <div className="flex flex-wrap gap-2">
                  {topMatch.characteristics.map((char, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                      {char}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
           {results.slice(1, 3).map((match, index) => (
             <Card key={index} className="shadow-md">
               <CardContent className="p-6">
                 <div className="text-center mb-4">
                   <div className="text-4xl mb-2">{match.type === 'chat' ? '🐱' : '🐶'}</div>
                   <h3 className="text-xl font-semibold">{match.breed}</h3>
                   <Badge variant="outline" className="mt-2">
                     {match.compatibility}% compatible
                   </Badge>
                 </div>
                 <p className="text-gray-600 text-sm text-center">
                   {match.reasons[0]}
                 </p>
               </CardContent>
             </Card>
           ))}
         </div>

                 <div className="text-center space-y-4">
           <Button onClick={onRestart} variant="outline" size="lg">
             Refaire le quiz
           </Button>
           <div className="flex justify-center gap-4">
             <Button className="bg-lime-500 hover:bg-lime-600">
               Voir les {topMatch.type === 'chat' ? 'chats' : 'chiens'} en adoption
             </Button>
             <Button variant="outline">
               Conseils pour débutants
             </Button>
           </div>
         </div>
      </div>
    </div>
  );
}

// Algorithme de calcul des résultats
function calculateMatches(data: QuizData): AnimalMatch[] {
  // Base de données simplifiée des races
  const animalDatabase = [
    {
      type: 'chat' as const,
      breed: 'Chat Européen',
      compatibility: 95,
      reasons: ['Facile à vivre', 'S\'adapte à tous les logements', 'Peu d\'entretien'],
      characteristics: ['Indépendant', 'Affectueux', 'Robuste'],
      image: '',
      pros: ['Peu exigeant', 'Bon pour débuter'],
      cons: ['Peut être distant']
    },
    {
      type: 'chien' as const,
      breed: 'Cavalier King Charles',
      compatibility: 90,
      reasons: ['Très doux', 'Bon avec les enfants', 'Taille adaptée'],
      characteristics: ['Calme', 'Sociable', 'Petit'],
      image: '',
      pros: ['Tempérament équilibré', 'Facile à dresser'],
      cons: ['Besoin de compagnie']
    },
    {
      type: 'chat' as const,
      breed: 'Maine Coon',
      compatibility: 85,
      reasons: ['Très sociable', 'Bon avec les familles', 'Caractère de chien'],
      characteristics: ['Grand', 'Doux', 'Intelligent'],
      image: '',
      pros: ['Très affectueux', 'Bon avec enfants'],
      cons: ['Beaucoup d\'entretien']
    }
  ];

  // Logique de scoring simplifiée
  return animalDatabase
    .map(animal => ({
      ...animal,
      compatibility: Math.floor(Math.random() * 30) + 70 // Simulation
    }))
    .sort((a, b) => b.compatibility - a.compatibility);
} 