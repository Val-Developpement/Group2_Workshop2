// components/AdminLayout.tsx
'use client';

import { useState } from 'react';
import { Menu, X, Bell, User, Settings, LogOut, Tag, Package, ShoppingCart, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { signOutAction } from '@/app/action';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
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
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold">AdminPanel</h1>
          ) : (
            <h1 className="text-xl font-bold">AP</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-md hover:bg-gray-700"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="mt-6">
            <NavItem href='/admin/users' icon={<User size={18} />} text="Utilisateurs" sidebarOpen={sidebarOpen} />
            <NavItem href='/admin/categories' icon={<Tag size={18} />} text="Catégories"  sidebarOpen={sidebarOpen} />
            <NavItem href='/admin/products' icon={<Package size={18} />} text="Produits"  sidebarOpen={sidebarOpen} />
            <NavItem href='/admin/orders' icon={<ShoppingCart size={18} />} text="Commandes"  sidebarOpen={sidebarOpen} />
            <NavItem href='/admin/blog' icon={<FileText size={18} />} text="Blog"  sidebarOpen={sidebarOpen} />
            <NavItem href='/admin/signalements' icon={<Bell size={18} />} text="Signalements"  sidebarOpen={sidebarOpen} />
          
          {/* Ajoutez d'autres éléments de navigation ici */}
        </nav>

       
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white  shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-4">

            
          <Button variant='outline' onClick={() => router.push('/')}>
                Retour à l'accueil
              </Button>
            
            <div className="flex items-center space-x-4">
            
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
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 ">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({
  icon,
  text,
  active = false,
  sidebarOpen,
  href,
}: {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  sidebarOpen: boolean;
  href: string;
}) {
  return (
    <Link
      className={`flex items-center w-full p-3 ${
        active ? 'bg-gray-900' : 'hover:bg-gray-700'
      }`}
      href={href}
    >
    
      <span>{icon}</span>
      {sidebarOpen && <span className="ml-3">{text}</span>}
      
    </Link>
  );
}