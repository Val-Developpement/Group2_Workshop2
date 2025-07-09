'use client';

import Link from "next/link";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
  import { useState } from 'react';
  import { useRouter } from 'next/navigation';
  import { createClient } from '@/utils/supabase/client';
  import { useUser } from '@/contexts/UserContext';
  import { useCart } from '@/contexts/CartContext';
  import { signOutAction } from '@/app/action';
  import CartDrawer from './CartDrawer';
import { ShoppingCart } from "lucide-react";

export default function Header() {
    const supabase = createClient();
    const router = useRouter();
    const { user, loading } = useUser();
    const { getTotalItems, toggleCart } = useCart();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);

    const handleSignOut = async () => {
      setIsSigningOut(true);
      try {
        await signOutAction();
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        
        await supabase.auth.signOut();
        router.push('/login');
      } finally {
        setIsSigningOut(false);
      }
    };

  return (
    <>
      <nav className="bg-white shadow-md px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <Link href="#" className="text-2xl font-bold text-gray-800">APwAP</Link>

          
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">Accueil</Link>
            <Link href="/shop" className="text-gray-600 hover:text-gray-900">Boutique</Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
          </div>

          
          <div className="flex items-center space-x-4">
            
            <button 
              onClick={toggleCart}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              
              <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-gray-900" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {getTotalItems()}
                </span>
              )}
            </button>

            
            {loading ? (
                  <Button variant='outline' disabled>
                    Chargement...
                  </Button>
                ) : user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='outline'>
                        {user.firstName} {user.lastName}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <Link href='/profile' passHref>
                          <DropdownMenuItem className='cursor-pointer'>
                            Mon profil
                          </DropdownMenuItem>
                        </Link>
                        
                        {user.isAdmin && (
                          <Link href='/admin' passHref>
                            <DropdownMenuItem className='cursor-pointe'>
                              Pannel Admin
                            </DropdownMenuItem>
                          </Link>
                        )}
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className='cursor-pointer text-red-600 dark:text-red-400'
                      >
                        {isSigningOut ? 'Déconnexion...' : 'Déconnexion'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button variant='outline' onClick={() => router.push('/login')}>
                    Se connecter
                  </Button>
                )}
          </div>
        </div>
      </nav>
      <CartDrawer />
    </>
  )
}
