import { signUpAction } from '@/app/action';
import { FormMessage, Message } from '@/components/form-message';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ('message' in searchParams) {
    return (
      <div className='flex h-screen w-full flex-1 items-center justify-center gap-2 p-4 bg-background'>
        <div className="w-full max-w-xl bg-white border-4 border-black rounded-2xl shadow-2xl p-12 flex flex-col">
          <FormMessage message={searchParams} />
        </div>
      </div>
    );
  }

  return (
    <>

      <form className='mx-auto flex min-w-64 flex-col shadow-2xl rounded-2xl bg-white p-8'>
        <h1 className='text-2xl font-medium'>S'inscrire</h1>
        <p className='text text-sm text-foreground'>
          Vous avez déjà un compte ?{' '}
          <Link className='font-medium text-primary underline' href='/login'>
            Se connecter
          </Link>
        </p>
        <div className='mt-8 flex flex-col gap-2 [&>input]:mb-3'>
          <Label htmlFor='firstName'>Prénom</Label>
          <Input name='firstName' placeholder='Jean' required />
          <Label htmlFor='lastName'>Nom</Label>
          <Input name='lastName' placeholder='Dupont' required />
          <Label htmlFor='email'>Email</Label>
          <Input name='email' placeholder='you@example.com' required />
          <Label htmlFor='password'>Mot de passe</Label>
          <Input
            type='password'
            name='password'
            placeholder='Your password'
            minLength={6}
            required
          />
          <Button formAction={signUpAction} className='bg-lime-500 hover:bg-lime-600 text-white font-semibold px-5 py-2 rounded-lg shadow transition-colors duration-150'>S'inscrire</Button>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </>
  );
}