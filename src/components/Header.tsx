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
        await supabase.auth.signOut();
        router.push('/login');
      } finally {
        setIsSigningOut(false);
      }
    };

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 w-full z-50 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo modernisé */}
        <Link href="/" className="flex items-center gap-2 text-3xl font-extrabold text-lime-600 tracking-tight select-none">
          <span className="text-4xl">🐾</span>
          <span style={{fontFamily: 'var(--font-caveat)'}}>APwAP</span>
        </Link>

        {/* Navigation links */}
        <div className="hidden md:flex space-x-8 text-lg font-semibold">
          <Link href="/" className="text-gray-800 hover:text-lime-600 transition-colors hover:underline underline-offset-8">Accueil</Link>
          <Link href="/shop" className="text-gray-800 hover:text-lime-600 transition-colors hover:underline underline-offset-8">Boutique</Link>
          <Link href="/contact" className="text-gray-800 hover:text-lime-600 transition-colors hover:underline underline-offset-8">Contact</Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Panier */}
          <a href="#" className="relative group">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-gray-800 group-hover:text-lime-600 transition-colors"
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
          </a>

          {/* Connexion / Profil */}
          {loading ? (
            <Button variant='outline' disabled className="rounded-full px-6 py-2 text-lg bg-lime-100 text-lime-700">
              Chargement...
            </Button>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className="rounded-full px-6 py-2 text-lg bg-lime-100 text-lime-700">
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
                      <DropdownMenuItem className='cursor-pointer'>
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
            <Button variant='default' className="rounded-full bg-lime-500 hover:bg-lime-600 text-white px-8 py-2 text-lg font-bold shadow-md transition-transform hover:scale-105" onClick={() => router.push('/login')}>
              Se connecter
            </Button>
          )}
        </div>

        {/* Burger menu mobile */}
        <div className="md:hidden flex items-center">
          {/* À compléter si besoin d'un menu mobile */}
        </div>
      </div>
    </nav>
  )
}
