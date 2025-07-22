"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/useTranslation';
// import Footer from '@/components/Footer'; // Footer supprimé ici
import { useState } from 'react';
    
export default function Home() {
  const { t } = useTranslation();
  
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
              {t.welcomeTitle}
            </h2>
            <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-6 drop-shadow-lg" style={{fontFamily: 'var(--font-caveat)'}}>
              {t.welcomeSubtitle}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto font-semibold" style={{fontFamily: 'var(--font-inter)'}}>
              {t.welcomeDescription}
            </p>
            <Link href="/shop">
              <Button size="lg" className="bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold px-8 py-4 text-lg md:text-xl shadow-lg transition-transform hover:scale-105" style={{fontFamily: 'var(--font-inter)'}}>
                {t.discoverShop}
              </Button>
            </Link>
          </div>
        </section>

        {/* Section carrousel interactif "Le savais-tu ?" */}
        <section className="py-16 bg-gradient-to-r from-blue-50 to-lime-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.didYouKnow}</h2>
              <p className="text-lg text-gray-600">{t.didYouKnowSubtitle}</p>
            </div>
            
            <FunFactsCarousel />
          </div>
        </section>

        {/* Framework 360° revisité avec design professionnel */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-lime-100 rounded-full mb-6">
                <svg className="w-8 h-8 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {t.framework360Title}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t.framework360Subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {/* Alimentation */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-center w-16 h-16 bg-amber-100 rounded-xl mb-6 group-hover:bg-amber-200 transition-colors">
                    <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.nutritionTitle}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {t.nutritionDescription}
                  </p>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-3"></div>
                      {t.nutritionFeature1}
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-3"></div>
                      {t.nutritionFeature2}
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-3"></div>
                      {t.nutritionFeature3}
                    </li>
                  </ul>
                </div>
              </div>

              {/* Exercice */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mb-6 group-hover:bg-blue-200 transition-colors">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.exerciseTitle}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {t.exerciseDescription}
                  </p>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                      {t.exerciseFeature1}
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                      {t.exerciseFeature2}
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                      {t.exerciseFeature3}
                    </li>
                  </ul>
                </div>
              </div>

              {/* Santé */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-xl mb-6 group-hover:bg-red-200 transition-colors">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.healthTitle}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {t.healthDescription}
                  </p>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-3"></div>
                      {t.healthFeature1}
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-3"></div>
                      {t.healthFeature2}
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-3"></div>
                      {t.healthFeature3}
                    </li>
                  </ul>
                </div>
              </div>

              {/* Comportement */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-xl mb-6 group-hover:bg-purple-200 transition-colors">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Comportement</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Analyse comportementale et méthodes d'éducation positive pour une relation harmonieuse.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3"></div>
                      Évaluation comportementale
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3"></div>
                      Éducation positive
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3"></div>
                      Résolution de problèmes
                    </li>
                  </ul>
                </div>
              </div>

              {/* Environnement */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-xl mb-6 group-hover:bg-green-200 transition-colors">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.environmentTitle}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {t.environmentDescription}
                  </p>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                      {t.environmentFeature1}
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                      {t.environmentFeature2}
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                      {t.environmentFeature3}
                    </li>
                  </ul>
                </div>
              </div>

              {/* Relation */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-center w-16 h-16 bg-pink-100 rounded-xl mb-6 group-hover:bg-pink-200 transition-colors">
                    <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.relationshipTitle}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {t.relationshipDescription}
                  </p>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-3"></div>
                      {t.relationshipFeature1}
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-3"></div>
                      {t.relationshipFeature2}
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-3"></div>
                      {t.relationshipFeature3}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Call to action */}
            <div className="text-center">
              <p className="text-lg text-gray-600 mb-8">
                {t.frameworkConclusion}
              </p>
              <Button size="lg" className="bg-lime-500 hover:bg-lime-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all">
                {t.discoverMethod}
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section fun */}
        <section className="py-20 bg-gradient-to-r from-pink-400 to-blue-400 text-white animate-fade-in">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 drop-shadow-lg">
{t.ctaTitle}
            </h2>
            <p className="text-xl mb-8 text-blue-50">
{t.ctaDescription}
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

// Composant Carrousel à ajouter avant la fonction Home
function FunFactsCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useTranslation();
  
  const facts = [
    {
      emoji: "🐶",
      title: t.dogMemoryTitle,
      fact: t.dogMemoryText,
      color: "from-yellow-400 to-orange-400"
    },
    {
      emoji: "🐱", 
      title: t.catSleepTitle,
      fact: t.catSleepText,
      color: "from-pink-400 to-purple-400"
    },
    {
      emoji: "🐾",
      title: t.purringTitle, 
      fact: t.purringText,
      color: "from-blue-400 to-cyan-400"
    },
    {
      emoji: "🦴",
      title: t.tailLanguageTitle,
      fact: t.tailLanguageText,
      color: "from-green-400 to-lime-400"
    },
    {
      emoji: "👃",
      title: t.superSmellTitle,
      fact: t.superSmellText,
      color: "from-red-400 to-pink-400"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % facts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + facts.length) % facts.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative">
      {/* Carrousel principal */}
      <div className="relative overflow-hidden rounded-2xl">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {facts.map((fact, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <div className={`relative bg-gradient-to-r ${fact.color} p-8 md:p-12 rounded-2xl text-white min-h-[300px] flex items-center justify-center`}>
                <div className="text-center max-w-3xl mx-auto">
                  <div className="text-6xl md:text-8xl mb-6">{fact.emoji}</div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4" style={{fontFamily: 'var(--font-caveat)'}}>
                    {fact.title}
                  </h3>
                  <p className="text-lg md:text-xl leading-relaxed font-medium">
                    {fact.fact}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flèches de navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicateurs */}
      <div className="flex justify-center mt-8 space-x-2">
        {facts.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-lime-500 scale-125' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// Animations custom Tailwind à ajouter dans tailwind.config.js :
// 'bounce-slow', 'bounce-slow2', 'wiggle', 'wiggle2', 'fade-in'