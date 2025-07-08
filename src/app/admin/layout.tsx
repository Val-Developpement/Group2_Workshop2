import { Inter, Lexend } from 'next/font/google';
import clsx from 'clsx';
import Header from '@/components/Header';
import AdminProtected from '@/components/AdminProtected';
import { UserProvider } from '@/contexts/UserContext';
import '@/styles/tailwind.css';
import AdminLayout from '@/components/AdminLayout';


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
            <AdminProtected>
              <AdminLayout>
              {children}
              </AdminLayout>
            </AdminProtected>
  
          </UserProvider>
        
      </body>
    </html>
  );
}