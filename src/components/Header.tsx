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
  import { signOutAction } from '@/app/action';

export default function Header() {
    const supabase = createClient();
    const router = useRouter();
    const { user, loading } = useUser();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);

    const handleSignOut = async () => {
      setIsSigningOut(true);
      try {
        await signOutAction();
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        // Fallback: déconnexion côté client
        await supabase.auth.signOut();
        router.push('/login');
      } finally {
        setIsSigningOut(false);
      }
    };

  return (
    <><nav className="bg-white shadow-md px-4 py-3">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      {/* Logo */}
      <Link href="#" className="text-2xl font-bold text-gray-800">APwAP</Link>

      {/* Navigation links */}
      <div className="hidden md:flex space-x-6">
        <Link href="/" className="text-gray-600 hover:text-gray-900">Accueil</Link>
        <Link href="/shop" className="text-gray-600 hover:text-gray-900">Boutique</Link>
        <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4">
        {/* Panier */}
        <a href="#" className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700 hover:text-gray-900"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 7h13L17 13M9 21a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z"
            />
          </svg>
          {/* <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            3
          </span> */}
        </a>

        {/* Connexion */}
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
                    {/* Lien Admin - visible seulement pour les admins */}
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
  </nav></>
  )
}
