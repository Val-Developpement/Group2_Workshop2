'use server';

import { encodedRedirect } from '@/utils/utils';
import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';


export const signUpAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString();
  const last_name = formData.get('lastName')?.toString();
  const first_name = formData.get('firstName')?.toString();
  const password = formData.get('password')?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get('origin');

  if (!email || !password) {
    return encodedRedirect(
      'error',
      '/register',
      'Email and password are required',
    );
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,

    options: {
      data: {
        first_name,
        last_name,
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  const user = data.user;
  console.log(user);

  if (!user) {
    return encodedRedirect('error', '/register', 'User creation failed');
  }

  // 🔹 Étape 2 : Création du profil utilisateur dans la table "profiles"
  const { error: profileError } = await supabase.from('profiles').insert([
    {
      id: user.id, // Associer le profil à l'ID de l'utilisateur Supabase
      first_name: first_name,
      last_name: last_name,
      email: email,
      isAdmin: false, // Par défaut, les nouveaux utilisateurs ne sont pas admin
    },
  ]);

  if (profileError) {
    console.error(profileError.code + ' ' + profileError.message);
    return encodedRedirect('error', '/register', profileError.message);
  }

  if (error) {
    console.error(error.code + ' ' + error.message);
    return encodedRedirect('error', '/register', error.message);
  } else {
    return encodedRedirect(
      'success',
      '/profile',
      'Merci de vous être inscrit. Veuillez vous connecter.',
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect('error', '/login', error.message);
  }

  return redirect('/profile');
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect('/login');
};