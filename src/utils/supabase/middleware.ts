import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  try {
    // Met à jour la session si besoin
    const { data: { session }, error } = await supabase.auth.getSession();
    
    // Si pas d'erreur, on continue
    if (error) {
      console.log('Middleware auth error:', error.message);
    }
  } catch (error) {
    // Gestion silencieuse des erreurs de session
    console.log('Middleware session error:', error);
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Appliquer le middleware à toutes les routes sauf les assets statiques.
     * Tu peux adapter ce filtre selon tes besoins.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
