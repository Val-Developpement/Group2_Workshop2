"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Check, X, Shield, Cookie } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const COOKIE_CONSENT_KEY = "apwap_cookie_consent";
const COOKIE_PREFERENCES_KEY = "apwap_cookie_preferences";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Toujours activé
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà donné son consentement
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);

    if (!consent) {
      setShowBanner(true);
    }

    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };

    setPreferences(allAccepted);
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(allAccepted));
    setShowBanner(false);

    // Ici vous pouvez initialiser vos services de tracking
    initializeTrackingServices(allAccepted);
  };

  const acceptSelected = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(preferences));
    setShowBanner(false);
    setShowSettings(false);

    // Ici vous pouvez initialiser vos services de tracking
    initializeTrackingServices(preferences);
  };

  const rejectAll = () => {
    const minimalPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };

    setPreferences(minimalPreferences);
    localStorage.setItem(COOKIE_CONSENT_KEY, "rejected");
    localStorage.setItem(
      COOKIE_PREFERENCES_KEY,
      JSON.stringify(minimalPreferences)
    );
    setShowBanner(false);
  };

  const initializeTrackingServices = (prefs: CookiePreferences) => {
    // Analytics (Google Analytics, etc.)
    if (prefs.analytics) {
      // Initialiser Google Analytics
      console.log("Analytics activé");
    }

    // Marketing (Facebook Pixel, etc.)
    if (prefs.marketing) {
      // Initialiser Facebook Pixel
      console.log("Marketing activé");
    }

    // Préférences (personnalisation)
    if (prefs.preferences) {
      // Sauvegarder les préférences utilisateur
      console.log("Préférences activées");
    }
  };

  if (!showBanner) {
    return null;
  }

  return (
    <>
      {/* Bannière principale */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <Card className="border-0 shadow-none">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Cookie className="h-5 w-5 text-lime-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Respect de votre vie privée
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Nous utilisons des cookies pour améliorer votre expérience,
                    analyser le trafic et personnaliser le contenu. En
                    continuant à naviguer, vous acceptez notre utilisation des
                    cookies.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      RGPD Conforme
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Données Sécurisées
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSettings(true)}
                    className="flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Personnaliser
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={rejectAll}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Refuser
                  </Button>

                  <Button
                    size="sm"
                    onClick={acceptAll}
                    className="flex items-center gap-2 bg-lime-600 hover:bg-lime-700"
                  >
                    <Check className="h-4 w-4" />
                    Accepter tout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal des paramètres */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Paramètres des cookies
            </DialogTitle>
            <DialogDescription>
              Personnalisez vos préférences de cookies pour contrôler votre
              expérience.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Cookies nécessaires */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <Label className="font-medium">Cookies nécessaires</Label>
                <p className="text-sm text-gray-600 mt-1">
                  Essentiels au fonctionnement du site (authentification,
                  panier)
                </p>
              </div>
              <Switch checked={preferences.necessary} disabled />
            </div>

            {/* Cookies analytiques */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <Label className="font-medium">Cookies analytiques</Label>
                <p className="text-sm text-gray-600 mt-1">
                  Nous aident à comprendre comment vous utilisez le site
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
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <Label className="font-medium">Cookies marketing</Label>
                <p className="text-sm text-gray-600 mt-1">
                  Utilisés pour vous proposer des contenus personnalisés
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
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <Label className="font-medium">Cookies de préférences</Label>
                <p className="text-sm text-gray-600 mt-1">
                  Mémorisent vos choix pour personnaliser votre expérience
                </p>
              </div>
              <Switch
                checked={preferences.preferences}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, preferences: checked }))
                }
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowSettings(false)}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={acceptSelected}
              className="flex-1 bg-lime-600 hover:bg-lime-700"
            >
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
