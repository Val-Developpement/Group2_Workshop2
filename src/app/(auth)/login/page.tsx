'use client';

import { signInAction } from '@/app/action';
import { FormMessage, Message } from '@/components/form-message';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login(props: { searchParams: Promise<Message> }) {
  const router = useRouter();

 

  const searchParams = props.searchParams;
  return (
    <div className="flex min-w-64 flex-1 flex-col items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col">
        <h1 className='text-2xl font-medium'>Se connecter</h1>
        <p className='text-sm text-foreground'>
          Vous n'avez pas de compte ?{' '}
          <Link
            className='font-medium text-foreground underline'
            href='/register'
          >
            S'inscrire
          </Link>
        </p>

        <div>
          <form className='mt-8 flex flex-col gap-2 [&>input]:mb-3'>
            <Label htmlFor='email'>Email</Label>
            <Input name='email' placeholder='you@example.com' required />
            <div className='flex items-center justify-between'>
              <Label htmlFor='password'>Mot de passe</Label>
              <Link
                className='text-xs text-foreground underline'
                href='/forgot-password'
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <Input
              type='password'
              name='password'
              placeholder='Your password'
              required
            />
            <Button formAction={signInAction} className='bg-lime-500 hover:bg-lime-600 text-white font-semibold px-5 py-2 rounded-lg shadow transition-colors duration-150'>Se connecter</Button>
          </form>

          <div className='relative mb-5 mt-5 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
            <span className='relative z-10 bg-background px-2 text-muted-foreground'>
              Or continue with
            </span>
          </div>
          <div className='grid grid-cols-3 gap-4'>
            <Button variant='outline' className='w-full' disabled>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                <path
                  d='M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701'
                  fill='currentColor'
                />
              </svg>
              <span className='sr-only'>Se connecter avec Apple</span>
            </Button>
            <Button
              
              variant='outline'
              className='w-full'
              disabled
            >
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                <path
                  d='M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z'
                  fill='currentColor'
                />
              </svg>
              <span className='sr-only'>Se connecter avec Google</span>
            </Button>
            <Button variant='outline' className='w-full' disabled>
              <svg viewBox='0 0 20 20'>
                <path
                  fill='currentColor'
                  d='M11.344,5.71c0-0.73,0.074-1.122,1.199-1.122h1.502V1.871h-2.404c-2.886,0-3.903,1.36-3.903,3.646v1.765h-1.8V10h1.8v8.128h3.601V10h2.403l0.32-2.718h-2.724L11.344,5.71z'
                ></path>
              </svg>
              <span className='sr-only'>Se connecter avec Facebook</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}