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
  

  if (!user) {
    return encodedRedirect('error', '/register', 'User creation failed');
  }

 
  const { error: profileError } = await supabase.from('profiles').insert([
    {
      id: user.id, 
      first_name: first_name,
      last_name: last_name,
      email: email,
      isAdmin: false, 
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