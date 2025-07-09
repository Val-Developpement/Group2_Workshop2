"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SignalerMaltraitancePage() {
  const [formData, setFormData] = useState({
    // Informations du signaleur
    signaleur_prenom: '',
    signaleur_nom: '',
    signaleur_email: '',
    signaleur_telephone: '',
    signaleur_adresse: '',
    
    // Informations sur l'animal
    animal_type: '',
    animal_nom: '',
    animal_race: '',
    animal_age: '',
    animal_description: '',
    
    // Informations sur la maltraitance
    type_maltraitance: '',
    gravite: '',
    description_maltraitance: '',
    frequence: '',
    duree_estimee: '',
    
    // Localisation
    lieu_maltraitance: '',
    adresse_precise: '',
    ville: '',
    code_postal: '',
    
    // Responsable présumé
    responsable_nom: '',
    responsable_description: '',
    relation_animal: '',
    
    // Témoins et preuves
    temoins_presents: false,
    temoins_description: '',
    preuves_disponibles: false,
    preuves_description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/signaler-maltraitance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          signaleur_prenom: '',
          signaleur_nom: '',
          signaleur_email: '',
          signaleur_telephone: '',
          signaleur_adresse: '',
          animal_type: '',
          animal_nom: '',
          animal_race: '',
          animal_age: '',
          animal_description: '',
          type_maltraitance: '',
          gravite: '',
          description_maltraitance: '',
          frequence: '',
          duree_estimee: '',
          lieu_maltraitance: '',
          adresse_precise: '',
          ville: '',
          code_postal: '',
          responsable_nom: '',
          responsable_description: '',
          relation_animal: '',
          temoins_presents: false,
          temoins_description: '',
          preuves_disponibles: false,
          preuves_description: '',
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-500 to-orange-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{fontFamily: 'var(--font-caveat)'}}>
            Signaler une maltraitance
          </h1>
          <p className="text-xl md:text-2xl text-orange-100 max-w-2xl mx-auto">
            Votre signalement peut sauver une vie. Chaque animal mérite protection et respect.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Informations importantes */}
        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Informations importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-orange-800">
            <div className="flex items-start space-x-2">
              <span className="text-orange-600">•</span>
              <span><strong>Urgence vitale :</strong> En cas de danger immédiat, contactez la police (17) ou la gendarmerie</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-orange-600">•</span>
              <span><strong>Confidentialité :</strong> Vos informations sont protégées et traitées avec la plus grande discrétion</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-orange-600">•</span>
              <span><strong>Suivi :</strong> Vous recevrez une confirmation et serez informé des actions entreprises</span>
            </div>
          </CardContent>
        </Card>

        {/* Formulaire de signalement */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Formulaire de signalement
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Plus vous fournirez d'informations, plus nous pourrons agir efficacement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Informations du signaleur */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  Vos informations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="signaleur_prenom" className="text-sm font-semibold text-gray-700">
                      Prénom *
                    </Label>
                    <Input
                      id="signaleur_prenom"
                      name="signaleur_prenom"
                      value={formData.signaleur_prenom}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signaleur_nom" className="text-sm font-semibold text-gray-700">
                      Nom *
                    </Label>
                    <Input
                      id="signaleur_nom"
                      name="signaleur_nom"
                      value={formData.signaleur_nom}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="signaleur_email" className="text-sm font-semibold text-gray-700">
                      Email *
                    </Label>
                    <Input
                      id="signaleur_email"
                      name="signaleur_email"
                      type="email"
                      value={formData.signaleur_email}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signaleur_telephone" className="text-sm font-semibold text-gray-700">
                      Téléphone
                    </Label>
                    <Input
                      id="signaleur_telephone"
                      name="signaleur_telephone"
                      type="tel"
                      value={formData.signaleur_telephone}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Informations sur l'animal */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  Informations sur l'animal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="animal_type" className="text-sm font-semibold text-gray-700">
                      Type d'animal *
                    </Label>
                    <select
                      id="animal_type"
                      name="animal_type"
                      value={formData.animal_type}
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Sélectionnez</option>
                      <option value="chien">Chien</option>
                      <option value="chat">Chat</option>
                      <option value="oiseau">Oiseau</option>
                      <option value="rongeur">Rongeur</option>
                      <option value="reptile">Reptile</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="animal_nom" className="text-sm font-semibold text-gray-700">
                      Nom (si connu)
                    </Label>
                    <Input
                      id="animal_nom"
                      name="animal_nom"
                      value={formData.animal_nom}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="animal_race" className="text-sm font-semibold text-gray-700">
                      Race/Espèce
                    </Label>
                    <Input
                      id="animal_race"
                      name="animal_race"
                      value={formData.animal_race}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="animal_age" className="text-sm font-semibold text-gray-700">
                      Âge approximatif
                    </Label>
                    <Input
                      id="animal_age"
                      name="animal_age"
                      value={formData.animal_age}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="Ex: 2 ans, chiot, adulte..."
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="animal_description" className="text-sm font-semibold text-gray-700">
                    Description de l'animal
                  </Label>
                  <Textarea
                    id="animal_description"
                    name="animal_description"
                    value={formData.animal_description}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1"
                    placeholder="Couleur, taille, signes distinctifs..."
                  />
                </div>
              </div>

              {/* Informations sur la maltraitance */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  Détails de la maltraitance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type_maltraitance" className="text-sm font-semibold text-gray-700">
                      Type de maltraitance *
                    </Label>
                    <select
                      id="type_maltraitance"
                      name="type_maltraitance"
                      value={formData.type_maltraitance}
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Sélectionnez</option>
                      <option value="violences_physiques">Violences physiques</option>
                      <option value="negligence">Négligence</option>
                      <option value="abandon">Abandon</option>
                      <option value="conditions_detention">Mauvaises conditions de détention</option>
                      <option value="privation_soins">Privation de soins</option>
                      <option value="privation_nourriture">Privation de nourriture/eau</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="gravite" className="text-sm font-semibold text-gray-700">
                      Gravité *
                    </Label>
                    <select
                      id="gravite"
                      name="gravite"
                      value={formData.gravite}
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Sélectionnez</option>
                      <option value="faible">Faible</option>
                      <option value="moyenne">Moyenne</option>
                      <option value="elevee">Élevée</option>
                      <option value="critique">Critique</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description_maltraitance" className="text-sm font-semibold text-gray-700">
                    Description détaillée *
                  </Label>
                  <Textarea
                    id="description_maltraitance"
                    name="description_maltraitance"
                    value={formData.description_maltraitance}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="mt-1"
                    placeholder="Décrivez précisément ce que vous avez observé..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="frequence" className="text-sm font-semibold text-gray-700">
                      Fréquence
                    </Label>
                    <select
                      id="frequence"
                      name="frequence"
                      value={formData.frequence}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Sélectionnez</option>
                      <option value="ponctuelle">Ponctuelle</option>
                      <option value="reguliere">Régulière</option>
                      <option value="constante">Constante</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="duree_estimee" className="text-sm font-semibold text-gray-700">
                      Durée estimée
                    </Label>
                    <Input
                      id="duree_estimee"
                      name="duree_estimee"
                      value={formData.duree_estimee}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="Ex: depuis 1 mois, plusieurs années..."
                    />
                  </div>
                </div>
              </div>

              {/* Localisation */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  Localisation
                </h3>
                <div>
                  <Label htmlFor="lieu_maltraitance" className="text-sm font-semibold text-gray-700">
                    Lieu de la maltraitance *
                  </Label>
                  <Input
                    id="lieu_maltraitance"
                    name="lieu_maltraitance"
                    value={formData.lieu_maltraitance}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                    placeholder="Ex: domicile, jardin, chenil, rue..."
                  />
                </div>
                <div>
                  <Label htmlFor="adresse_precise" className="text-sm font-semibold text-gray-700">
                    Adresse précise
                  </Label>
                  <Input
                    id="adresse_precise"
                    name="adresse_precise"
                    value={formData.adresse_precise}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="Numéro, rue, bâtiment..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ville" className="text-sm font-semibold text-gray-700">
                      Ville *
                    </Label>
                    <Input
                      id="ville"
                      name="ville"
                      value={formData.ville}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="code_postal" className="text-sm font-semibold text-gray-700">
                      Code postal
                    </Label>
                    <Input
                      id="code_postal"
                      name="code_postal"
                      value={formData.code_postal}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Responsable présumé */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  Responsable présumé
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="responsable_nom" className="text-sm font-semibold text-gray-700">
                      Nom (si connu)
                    </Label>
                    <Input
                      id="responsable_nom"
                      name="responsable_nom"
                      value={formData.responsable_nom}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="relation_animal" className="text-sm font-semibold text-gray-700">
                      Relation avec l'animal
                    </Label>
                    <select
                      id="relation_animal"
                      name="relation_animal"
                      value={formData.relation_animal}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Sélectionnez</option>
                      <option value="proprietaire">Propriétaire</option>
                      <option value="gardien">Gardien</option>
                      <option value="voisin">Voisin</option>
                      <option value="inconnu">Inconnu</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="responsable_description" className="text-sm font-semibold text-gray-700">
                    Description du responsable
                  </Label>
                  <Textarea
                    id="responsable_description"
                    name="responsable_description"
                    value={formData.responsable_description}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1"
                    placeholder="Apparence, comportement observé..."
                  />
                </div>
              </div>

              {/* Témoins et preuves */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  Témoins et preuves
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="temoins_presents"
                        name="temoins_presents"
                        checked={formData.temoins_presents}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <Label htmlFor="temoins_presents" className="text-sm font-semibold text-gray-700">
                        Y a-t-il des témoins ?
                      </Label>
                    </div>
                    {formData.temoins_presents && (
                      <Textarea
                        id="temoins_description"
                        name="temoins_description"
                        value={formData.temoins_description}
                        onChange={handleInputChange}
                        rows={3}
                        className="mt-1"
                        placeholder="Noms, contacts des témoins..."
                      />
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="preuves_disponibles"
                        name="preuves_disponibles"
                        checked={formData.preuves_disponibles}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <Label htmlFor="preuves_disponibles" className="text-sm font-semibold text-gray-700">
                        Avez-vous des preuves ?
                      </Label>
                    </div>
                    {formData.preuves_disponibles && (
                      <Textarea
                        id="preuves_description"
                        name="preuves_description"
                        value={formData.preuves_description}
                        onChange={handleInputChange}
                        rows={3}
                        className="mt-1"
                        placeholder="Photos, vidéos, documents..."
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Messages de statut */}
              {submitStatus === 'success' && (
                <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  ✅ Votre signalement a été enregistré avec succès ! Nous vous contacterons sous 24h.
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  ❌ Une erreur s'est produite. Veuillez réessayer ou nous contacter directement.
                </div>
              )}

              {/* Bouton d'envoi */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 text-lg"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Envoi en cours...
                  </>
                ) : (
                  'Envoyer le signalement'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 