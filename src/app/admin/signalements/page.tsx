"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/utils/supabase/client';

interface Signalement {
  id: string;
  created_at: string;
  updated_at: string;
  signaleur_prenom: string;
  signaleur_nom: string;
  signaleur_email: string;
  signaleur_telephone?: string;
  animal_type: string;
  animal_nom?: string;
  animal_race?: string;
  type_maltraitance: string;
  gravite: string;
  description_maltraitance: string;
  lieu_maltraitance: string;
  ville: string;
  code_postal?: string;
  responsable_nom?: string;
  statut: string;
  priorite: string;
  temoins_presents: boolean;
  preuves_disponibles: boolean;
  notes_admin?: string;
  traite_par?: string;
}

export default function SignalementsAdminPage() {
  const [signalements, setSignalements] = useState<Signalement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSignalement, setSelectedSignalement] = useState<Signalement | null>(null);
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    loadSignalements();
  }, []);

  const loadSignalements = async () => {
    try {
      const { data, error } = await supabase
        .from('signalements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des signalements:', error);
      } else {
        setSignalements(data || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatut = async (id: string, nouveauStatut: string) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('signalements')
        .update({ 
          statut: nouveauStatut,
          traite_le: new Date().toISOString(),
          notes_admin: notes
        })
        .eq('id', id);

      if (error) {
        console.error('Erreur lors de la mise à jour:', error);
      } else {
        await loadSignalements();
        setSelectedSignalement(null);
        setNotes('');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getPrioriteColor = (priorite: string) => {
    switch (priorite) {
      case 'urgente': return 'bg-red-100 text-red-800 border-red-300';
      case 'haute': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'normale': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'basse': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'nouveau': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'en_cours': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'traité': return 'bg-green-100 text-green-800 border-green-300';
      case 'fermé': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getGraviteColor = (gravite: string) => {
    switch (gravite) {
      case 'critique': return 'bg-red-100 text-red-800 border-red-300';
      case 'elevee': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'moyenne': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'faible': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des signalements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Signalements de maltraitance</h1>
        <p className="text-gray-600">Gérez les signalements reçus et suivez leur traitement</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{signalements.filter(s => s.statut === 'nouveau').length}</div>
            <div className="text-sm text-gray-600">Nouveaux</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{signalements.filter(s => s.statut === 'en_cours').length}</div>
            <div className="text-sm text-gray-600">En cours</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{signalements.filter(s => s.priorite === 'urgente').length}</div>
            <div className="text-sm text-gray-600">Urgents</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">{signalements.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des signalements */}
      <div className="grid gap-4">
        {signalements.map((signalement) => (
          <Card key={signalement.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {signalement.animal_type} - {signalement.lieu_maltraitance}
                  </CardTitle>
                  <CardDescription>
                    Signalé par {signalement.signaleur_prenom} {signalement.signaleur_nom} • {new Date(signalement.created_at).toLocaleDateString('fr-FR')}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={getPrioriteColor(signalement.priorite)}>
                    {signalement.priorite}
                  </Badge>
                  <Badge className={getStatutColor(signalement.statut)}>
                    {signalement.statut}
                  </Badge>
                  <Badge className={getGraviteColor(signalement.gravite)}>
                    {signalement.gravite}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Informations animal</h4>
                  <p className="text-sm text-gray-600">
                    <strong>Type:</strong> {signalement.animal_type}<br/>
                    <strong>Nom:</strong> {signalement.animal_nom || 'Non renseigné'}<br/>
                    <strong>Race:</strong> {signalement.animal_race || 'Non renseigné'}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Localisation</h4>
                  <p className="text-sm text-gray-600">
                    <strong>Lieu:</strong> {signalement.lieu_maltraitance}<br/>
                    <strong>Ville:</strong> {signalement.ville} {signalement.code_postal || ''}
                  </p>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">Type de maltraitance</h4>
                <p className="text-sm text-gray-600">{signalement.type_maltraitance}</p>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  {signalement.description_maltraitance}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  {signalement.temoins_presents && (
                    <Badge variant="outline">Témoins</Badge>
                  )}
                  {signalement.preuves_disponibles && (
                    <Badge variant="outline">Preuves</Badge>
                  )}
                </div>
                <Button
                  onClick={() => setSelectedSignalement(signalement)}
                  variant="outline"
                  size="sm"
                >
                  Traiter
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de traitement */}
      {selectedSignalement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              Traiter le signalement #{selectedSignalement.id.slice(0, 8)}
            </h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold text-gray-700">Contact signaleur</h3>
                <p className="text-sm text-gray-600">
                  {selectedSignalement.signaleur_email}<br/>
                  {selectedSignalement.signaleur_telephone && `Tél: ${selectedSignalement.signaleur_telephone}`}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700">Responsable présumé</h3>
                <p className="text-sm text-gray-600">
                  {selectedSignalement.responsable_nom || 'Non renseigné'}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700">Notes administratives</h3>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ajoutez vos notes sur le traitement de ce signalement..."
                  rows={4}
                />
              </div>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setSelectedSignalement(null)}
                disabled={updating}
              >
                Annuler
              </Button>
              <Button
                onClick={() => updateStatut(selectedSignalement.id, 'en_cours')}
                disabled={updating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Marquer en cours
              </Button>
              <Button
                onClick={() => updateStatut(selectedSignalement.id, 'traité')}
                disabled={updating}
                className="bg-green-600 hover:bg-green-700"
              >
                Marquer traité
              </Button>
              <Button
                onClick={() => updateStatut(selectedSignalement.id, 'fermé')}
                disabled={updating}
                variant="destructive"
              >
                Fermer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 