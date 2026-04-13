import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Facility Alpha | AR Interface',
  description: 'Premium AR/VR web application UI',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="font-sans antialiased bg-black text-white overflow-hidden" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
