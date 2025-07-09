import { Inter, Lexend } from 'next/font/google';
import clsx from 'clsx';
import Header from '@/components/Header';
import { Caveat } from 'next/font/google';

import { UserProvider } from '@/contexts/UserContext';
import { CartProvider } from '@/contexts/CartContext';
import '@/styles/tailwind.css';


const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  adjustFontFallback: true,
});

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
  adjustFontFallback: true,
});

const caveat = Caveat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-caveat',
  weight: ['400', '700'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='en'
      className={clsx(
        'dark:bg-blue h-full scroll-smooth antialiased',
        inter.variable,
        lexend.variable,
        caveat.variable,
      )}
      suppressHydrationWarning
    >
      <body className='flex flex-col '>
        
          <UserProvider>

            <CartProvider>
              <Header />
              {children}
            </CartProvider>

          </UserProvider>
        
      </body>
    </html>
  );
}