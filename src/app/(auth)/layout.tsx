
import { Inter, Lexend } from 'next/font/google';
import clsx from 'clsx';
import Header from '@/components/Header';

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
      )}
      suppressHydrationWarning
    >
      <body className='flex flex-col '>
     
<UserProvider>
          <CartProvider>
            <Header />
            <div className="flex h-screen w-screen items-center justify-center overflow-hidden">
  <div className="w-full max-w-md px-4">
    {children}
  </div>
</div>
          </CartProvider>
          
          </UserProvider>
        
      </body>
    </html>
  );
}