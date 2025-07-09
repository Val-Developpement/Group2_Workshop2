'use client';

import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ShoppingCart, X } from 'lucide-react';
import { toast } from 'sonner';

export default function CartDrawer() {
  const { 
    state, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    toggleCart, 
    closeCart, 
    getTotalItems, 
    getTotalPrice 
  } = useCart();

  const handleCheckout = async () => {
    if (state.items.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: state.items.map(item => ({
            productId: item.stripe_product_id,
            quantity: item.quantity,
          })),
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        toast.error("Erreur lors de la création de la session de paiement");
      }
    } catch (error) {
      toast.error("Erreur lors de l'achat");
    }
  };

  return (
    <Drawer open={state.isOpen} onOpenChange={toggleCart} direction="right">
      
      <DrawerContent className="h-full w-[400px] ml-auto">
        
        <div className="w-full h-full">
        <Button
              variant="ghost"
              size="sm"
              onClick={closeCart}
              className="h-8 w-8 p-0 mt-2 ml-2"
            >
              <X className="h-4 w-4" />
            </Button>
          <DrawerHeader className="flex items-center justify-between">
            
            <DrawerTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Mon Panier ({getTotalItems()})
            </DrawerTitle>
          </DrawerHeader>

          <div className="px-4 pb-4">
            {state.items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Votre panier est vide
                </h3>
                <p className="text-gray-600 mb-4">
                  Ajoutez des produits à votre panier pour commencer vos achats.
                </p>
                <Button onClick={closeCart} variant="outline">
                  Continuer les achats
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.name}</h4>
                        <p className="text-gray-600 text-sm">{item.price}€</p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {(item.price * item.quantity).toFixed(2)}€
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total ({getTotalItems()} article{getTotalItems() > 1 ? 's' : ''})</span>
                    <span className="text-xl font-bold">{getTotalPrice().toFixed(2)}€</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={clearCart}
                      className="flex-1"
                    >
                      Vider le panier
                    </Button>
                    <Button
                      onClick={handleCheckout}
                      className="flex-1 bg-lime-500 hover:bg-lime-600 text-white"
                    >
                      Passer la commande
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
} 