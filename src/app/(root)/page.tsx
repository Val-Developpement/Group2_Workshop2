import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// import Footer from '@/components/Footer'; // Footer supprimé ici
    
export default function Home() {
  return (
    <>
      <main className="min-h-screen">
        {/* Hero Section avec vidéo de fond */}
        <section className="relative h-[70vh] md:h-screen flex items-center justify-center overflow-hidden">
          {/* Vidéo de fond */}
          <video
            className="absolute inset-0 w-full h-full object-cover z-0"
            src="/puppy.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          {/* Overlay sombre */}
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          {/* Contenu texte */}
          <div className="relative z-20 flex flex-col items-center justify-center w-full h-full text-center px-4">
            <h2 className="text-3xl md:text-5xl font-bold text-lime-300 mb-4 tracking-wider" style={{fontFamily: 'var(--font-caveat)'}}>
              Bienvenue sur APwAP !
            </h2>
            <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-6 drop-shadow-lg" style={{fontFamily: 'var(--font-caveat)'}}>
              Le bonheur <span className="text-lime-200">à quatre pattes</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto font-semibold" style={{fontFamily: 'var(--font-inter)'}}>
              Ici, chaque chien remue la queue et chaque chat ronronne de plaisir.<br/>
              Découvre des conseils, des services et des histoires pour rendre ton compagnon heureux, chaque jour !
            </p>
            <Button size="lg" className="bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold px-8 py-4 text-lg md:text-xl shadow-lg transition-transform hover:scale-105" style={{fontFamily: 'var(--font-inter)'}}>
              Découvrir la sélection
            </Button>
          </div>
        </section>

        {/* Section fun facts "Le savais-tu ?" */}
        <section className="py-12 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-blue-700">Le savais-tu ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:scale-105 transition-transform duration-300 shadow-lg border-l-4 border-yellow-400">
                <CardContent className="flex items-center gap-4 p-6">
                  <span className="text-4xl">🐶</span>
                  <span className="text-gray-700 font-medium">Un chien peut comprendre jusqu'à 250 mots et gestes !</span>
                </CardContent>
              </Card>
              <Card className="hover:scale-105 transition-transform duration-300 shadow-lg border-l-4 border-pink-400">
                <CardContent className="flex items-center gap-4 p-6">
                  <span className="text-4xl">🐱</span>
                  <span className="text-gray-700 font-medium">Un chat passe en moyenne 70% de sa vie à dormir... la belle vie !</span>
                </CardContent>
              </Card>
              <Card className="hover:scale-105 transition-transform duration-300 shadow-lg border-l-4 border-blue-400">
                <CardContent className="flex items-center gap-4 p-6">
                  <span className="text-4xl">🐾</span>
                  <span className="text-gray-700 font-medium">Le ronronnement du chat a des vertus apaisantes, même pour les humains !</span>
                </CardContent>
              </Card>
              <Card className="hover:scale-105 transition-transform duration-300 shadow-lg border-l-4 border-green-400">
                <CardContent className="flex items-center gap-4 p-6">
                  <span className="text-4xl">🦴</span>
                  <span className="text-gray-700 font-medium">Un chien heureux remue la queue... mais attention, pas toujours pour dire bonjour !</span>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Framework 360° revisité avec mascottes et animations */}
        <section className="py-20 bg-gradient-to-r from-blue-50 to-pink-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 animate-fade-in">
                Notre Framework 360°
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Une approche holistique, joyeuse et colorée du bien-être animal !
              </p>
              <div className="w-24 h-1 bg-pink-400 mx-auto mt-6"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Alimentation */}
              <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-lg bg-white/80">
                <CardHeader className="bg-gradient-to-br from-yellow-300 to-yellow-400 text-yellow-900 rounded-t-lg flex items-center gap-2">
                  <span className="text-3xl animate-wiggle">🍽️</span>
                  <CardTitle>Alimentation</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <CardDescription className="text-gray-700 mb-4">
                    Des repas adaptés, variés et gourmands pour chaque museau !
                  </CardDescription>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Quantité et qualité sur-mesure</li>
                    <li>• Plaisir de manger</li>
                    <li>• Respect des besoins de chacun</li>
                  </ul>
                </CardContent>
              </Card>
              {/* Exercice */}
              <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-lg bg-white/80">
                <CardHeader className="bg-gradient-to-br from-green-300 to-green-400 text-green-900 rounded-t-lg flex items-center gap-2">
                  <span className="text-3xl animate-bounce">🏃‍♂️</span>
                  <CardTitle>Exercice</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <CardDescription className="text-gray-700 mb-4">
                    Bouger, jouer, explorer : l’aventure au quotidien !
                  </CardDescription>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Activité physique adaptée</li>
                    <li>• Jeux et stimulation mentale</li>
                    <li>• Moments de complicité</li>
                  </ul>
                </CardContent>
              </Card>
              {/* Santé */}
              <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-lg bg-white/80">
                <CardHeader className="bg-gradient-to-br from-red-300 to-red-400 text-red-900 rounded-t-lg flex items-center gap-2">
                  <span className="text-3xl animate-pulse">🏥</span>
                  <CardTitle>Santé</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <CardDescription className="text-gray-700 mb-4">
                    Prendre soin du corps et de l’esprit, c’est la base du bonheur !
                  </CardDescription>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Prévention et suivi</li>
                    <li>• Conseils personnalisés</li>
                    <li>• Bien-être global</li>
                  </ul>
                </CardContent>
              </Card>
              {/* Comportement */}
              <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-lg bg-white/80">
                <CardHeader className="bg-gradient-to-br from-blue-300 to-blue-400 text-blue-900 rounded-t-lg flex items-center gap-2">
                  <span className="text-3xl animate-wiggle2">🧠</span>
                  <CardTitle>Comportement</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <CardDescription className="text-gray-700 mb-4">
                    Comprendre, rassurer, éduquer… toujours dans la bonne humeur !
                  </CardDescription>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Communication positive</li>
                    <li>• Gestion du stress</li>
                    <li>• Socialisation</li>
                  </ul>
                </CardContent>
              </Card>
              {/* Environnement */}
              <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-lg bg-white/80">
                <CardHeader className="bg-gradient-to-br from-purple-300 to-purple-400 text-purple-900 rounded-t-lg flex items-center gap-2">
                  <span className="text-3xl animate-bounce">🏠</span>
                  <CardTitle>Environnement</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <CardDescription className="text-gray-700 mb-4">
                    Un cocon douillet et stimulant pour chaque boule de poils !
                  </CardDescription>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Espace de vie adapté</li>
                    <li>• Sécurité et confort</li>
                    <li>• Stimulation sensorielle</li>
                  </ul>
                </CardContent>
              </Card>
              {/* Relation */}
              <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-lg bg-white/80">
                <CardHeader className="bg-gradient-to-br from-pink-300 to-pink-400 text-pink-900 rounded-t-lg flex items-center gap-2">
                  <span className="text-3xl animate-wiggle">❤️</span>
                  <CardTitle>Relation</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <CardDescription className="text-gray-700 mb-4">
                    Le lien unique humain-animal, c’est notre super-pouvoir !
                  </CardDescription>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Confiance et respect</li>
                    <li>• Moments de qualité</li>
                    <li>• Complicité au quotidien</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section fun */}
        <section className="py-20 bg-gradient-to-r from-pink-400 to-blue-400 text-white animate-fade-in">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 drop-shadow-lg">
              Prêt à faire sourire votre compagnon ? 😺🐶
            </h2>
            <p className="text-xl mb-8 text-blue-50">
              Rejoignez la communauté APwAP et découvrez une nouvelle façon de prendre soin de votre animal, dans la joie et la bonne humeur !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-pink-600 hover:bg-gray-100 px-8 py-3 shadow-md transition-transform hover:scale-105">
                Commencer l’aventure
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-pink-600 px-8 py-3 transition-transform hover:scale-105">
                En savoir plus
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

// Animations custom Tailwind à ajouter dans tailwind.config.js :
// 'bounce-slow', 'bounce-slow2', 'wiggle', 'wiggle2', 'fade-in'