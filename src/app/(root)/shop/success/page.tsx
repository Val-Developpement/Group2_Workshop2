'use client';

import { useEffect, useState, useCallback } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingBag, Home, Package } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { OrderWithItems } from '@/types/orders';

export default function SuccessPage() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetails = useCallback(async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const { orders } = await response.json();
        
        if (orders && orders.length > 0) {
          setOrder(orders[0]);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la commande:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearCart();

    if (sessionId) {
      fetchOrderDetails();
    } else {
      setLoading(false);
    }
  }, [sessionId, fetchOrderDetails]); 

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de votre commande...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Commande confirmée !
            </h1>
            <p className="text-gray-600">
              Merci pour votre achat. Votre commande a été traitée avec succès.
            </p>
          </div>

          {order && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Package className="h-5 w-5 text-lime-600" />
                <h3 className="font-semibold">Détails de la commande</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Numéro de commande:</span>
                  <p className="font-medium">{order.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <div>
                  <span className="text-gray-600">Montant total:</span>
                  <p className="font-medium">{(order.total_amount / 100).toFixed(2)}€</p>
                </div>
                <div>
                  <span className="text-gray-600">Statut:</span>
                  <p className="font-medium capitalize">{order.status}</p>
                </div>
                <div>
                  <span className="text-gray-600">Date:</span>
                  <p className="font-medium">{new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
              
              {order.order_items && order.order_items.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Articles commandés:</h4>
                  <div className="space-y-2">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <span>{item.name} x{item.quantity}</span>
                        <span className="font-medium">{(item.price * item.quantity / 100).toFixed(2)}€</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">
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