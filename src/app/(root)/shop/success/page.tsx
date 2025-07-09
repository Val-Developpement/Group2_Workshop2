'use client';

import { useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingBag, Home } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Vider le panier après un achat réussi
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Commande confirmée !
            </h1>
            <p className="text-gray-600">
              Merci pour votre achat. Votre commande a été traitée avec succès.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Vous recevrez un email de confirmation avec les détails de votre commande.
            </p>
            
            <div className="flex gap-3">
              <Link href="/shop" className="flex-1">
                <Button variant="outline" className="w-full">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Continuer les achats
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Accueil
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}