import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import { Menu } from '@/components/Menu';

import './globals.css';

const dmSans = DM_Sans({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Convert Threads to TikTok style posts',
  description: 'Convert Threads to TikTok style posts',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} antialiased bg-black overflow-hidden`}>
        <div className="h-screen max-w-[420px] mx-auto">
          {children}
          <Menu />
        </div>
      </body>
    </html>
  );
}
