'use client';

import { signUpAction } from '@/app/action';
import { FormMessage, Message } from '@/components/form-message';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';

interface RegisterFormProps {
  searchParams: Message;
}

export default function RegisterForm({ searchParams }: RegisterFormProps) {
  const { t } = useTranslation();

  if ('message' in searchParams) {
    return (
      <div className='flex h-screen w-full flex-1 items-center justify-center gap-2 p-4 sm:max-w-md'>
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <form className='mx-auto flex min-w-64 flex-col'>
      <h1 className='text-2xl font-medium'>{t.register}</h1>
      <p className='text text-sm text-foreground'>
        Vous avez déjà un compte ?{' '}
        <Link className='font-medium text-primary underline' href='/login'>
          {t.login}
        </Link>
      </p>
      <div className='mt-8 flex flex-col gap-2 [&>input]:mb-3'>
        <Label htmlFor='firstName'>{t.firstName}</Label>
        <Input name='firstName' placeholder='Jean' required />
        <Label htmlFor='lastName'>{t.lastName}</Label>
        <Input name='lastName' placeholder='Dupont' required />
        <Label htmlFor='email'>{t.email}</Label>
        <Input name='email' placeholder='you@example.com' required />
        <Label htmlFor='password'>{t.password}</Label>
        <Input
          type='password'
          name='password'
          placeholder='Your password'
          minLength={6}
          required
        />
        <Button formAction={signUpAction}>{t.register}</Button>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
} 