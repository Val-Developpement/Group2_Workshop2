"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Cookie,
  Shield,
  Settings,
  Eye,
  Target,
  Heart,
  Save,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const COOKIE_PREFERENCES_KEY = "apwap_cookie_preferences";

export default function CookiesPage() {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);
  

  const handleSavePreferences = async () => {
    setIsLoading(true);

    try {
      localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(preferences));

      // Ici vous pouvez initialiser/désactiver les services selon les préférences
      initializeTrackingServices(preferences);

      toast.success("Préférences sauvegardées avec succès !");
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde des préférences");
    } finally {
      setIsLoading(false);
    }
  };

  const resetPreferences = () => {
    const defaultPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    setPreferences(defaultPreferences);
    localStorage.setItem(
      COOKIE_PREFERENCES_KEY,
      JSON.stringify(defaultPreferences)
    );
    toast.success("Préférences réinitialisées");
  };

  const initializeTrackingServices = (prefs: CookiePreferences) => {
    // Analytics
    if (prefs.analytics) {
      console.log("Analytics activé");
      // Initialiser Google Analytics, etc.
    } else {
      console.log("Analytics désactivé");
      // Désactiver Google Analytics, etc.
    }

    // Marketing
    if (prefs.marketing) {
      console.log("Marketing activé");
      // Initialiser Facebook Pixel, etc.
    } else {
      console.log("Marketing désactivé");
      // Désactiver Facebook Pixel, etc.
    }

    // Préférences
    if (prefs.preferences) {
      console.log("Préférences activées");
      // Sauvegarder les préférences utilisateur
    } else {
      console.log("Préférences désactivées");
      // Supprimer les préférences sauvegardées
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-lime-100 rounded-full mb-6">
            <Cookie className="w-8 h-8 text-lime-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Politique de Cookies
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nous respectons votre vie privée. Découvrez comment nous utilisons
            les cookies et gérez vos préférences.
          </p>
        </div>

        {/* Informations générales */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-lime-600" />
              Notre engagement RGPD
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Chez APWAP, nous nous engageons à protéger votre vie privée et à
              respecter le Règlement Général sur la Protection des Données
              (RGPD). Nos cookies sont utilisés de manière transparente et vous
              gardez le contrôle total sur vos données.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-lime-100 text-lime-800">
                RGPD Conforme
              </Badge>
              <Badge variant="outline">Données Sécurisées</Badge>
              <Badge variant="outline">Contrôle Total</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Gestionnaire de préférences */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-lime-600" />
              Gérer vos préférences
            </CardTitle>
            <CardDescription>
              Personnalisez vos préférences de cookies selon vos besoins
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Cookies nécessaires */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-gray-600" />
                  <Label className="font-medium text-gray-900">
                    Cookies nécessaires
                  </Label>
                </div>
                <p className="text-sm text-gray-600">
                  Essentiels au fonctionnement du site (authentification,
                  panier, sécurité). Ces cookies ne peuvent pas être désactivés.
                </p>
              </div>
              <Switch checked={preferences.necessary} disabled />
            </div>

            {/* Cookies analytiques */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <Label className="font-medium text-gray-900">
                    Cookies analytiques
                  </Label>
                </div>
                <p className="text-sm text-gray-600">
                  Nous aident à comprendre comment vous utilisez le site pour
                  l'améliorer.
                </p>
              </div>
              <Switch
                checked={preferences.analytics}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, analytics: checked }))
                }
              />
            </div>

            {/* Cookies marketing */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-red-600" />
                  <Label className="font-medium text-gray-900">
                    Cookies marketing
                  </Label>
                </div>
                <p className="text-sm text-gray-600">
                  Utilisés pour vous proposer des contenus et offres
                  personnalisés.
                </p>
              </div>
              <Switch
                checked={preferences.marketing}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, marketing: checked }))
                }
              />
            </div>

            {/* Cookies de préférences */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-4 w-4 text-purple-600" />
                  <Label className="font-medium text-gray-900">
                    Cookies de préférences
                  </Label>
                </div>
                <p className="text-sm text-gray-600">
                  Mémorisent vos choix pour personnaliser votre expérience.
                </p>
              </div>
              <Switch
                checked={preferences.preferences}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, preferences: checked }))
                }
              />
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleSavePreferences}
                disabled={isLoading}
                className="flex items-center gap-2 bg-lime-600 hover:bg-lime-700"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Sauvegarder les préférences
              </Button>

              <Button
                variant="outline"
                onClick={resetPreferences}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Réinitialiser
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Détails techniques */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Détails techniques des cookies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Cookies de session
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  Stockés temporairement et supprimés à la fermeture du
                  navigateur.
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Authentification utilisateur</li>
                  <li>• Panier d'achat</li>
                  <li>• Préférences de navigation</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Cookies persistants
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  Conservés sur votre appareil pour une durée limitée.
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Préférences de langue</li>
                  <li>• Paramètres d'affichage</li>
                  <li>• Consentement aux cookies</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Cookies tiers
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  Placés par des services externes (analytics, réseaux sociaux).
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Google Analytics (analytics)</li>
                  <li>• Facebook Pixel (marketing)</li>
                  <li>• Stripe (paiements)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations légales */}
        <Card>
          <CardHeader>
            <CardTitle>Informations légales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Vos droits</h4>
              <p className="text-sm text-gray-600">
                Conformément au RGPD, vous avez le droit de :
              </p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4 mt-2">
                <li>• Accéder à vos données personnelles</li>
                <li>• Rectifier vos données</li>
                <li>• Supprimer vos données</li>
                <li>• Limiter le traitement</li>
                <li>• Porter vos données</li>
                <li>• Vous opposer au traitement</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Contact</h4>
              <p className="text-sm text-gray-600">
                Pour toute question concernant nos cookies ou la protection de
                vos données, contactez-nous à :{" "}
                <a
                  href="mailto:privacy@apetwithaplan.com"
                  className="text-lime-600 hover:underline"
                >
                  privacy@apetwithaplan.com
                </a>
              </p>
            </div>

            <div className="text-xs text-gray-500 pt-4 border-t">
              <p>
                Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
