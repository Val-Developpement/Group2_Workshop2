'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
       
        const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          setLoading(false);
          return;
        }
        
        if (!currentUser) {  
          setLoading(false);
          return;
        }

        const {
          data: profile,
          error: profileError,
        } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle();  

        if (profileError) {
          console.error('Erreur lors de la récupération du profil :', profileError);
          setLoading(false);
          return;
        }

        let userProfile = profile;

        if (!userProfile) {
          

         
          const { data: insertedProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: currentUser.id,
              first_name: currentUser.user_metadata?.full_name?.split(' ')[0] ?? '',
              last_name: currentUser.user_metadata?.full_name?.split(' ')[1] ?? '',
              email: currentUser.email,
              isAdmin: false, 
            })
            .select()
            .maybeSingle();

          if (insertError) {
            console.error("Erreur d'insertion de profil :", insertError);
            setLoading(false);
            return;
          }

          userProfile = insertedProfile!;
        }

        
        setUser({
          id: userProfile.id,
          firstName: userProfile.first_name,
          lastName: userProfile.last_name,
          email: userProfile.email,
          isAdmin: userProfile.isAdmin || false,
        });
      } catch (error) {
        console.error('Erreur inattendue lors de la récupération du profil :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
