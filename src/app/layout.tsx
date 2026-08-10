import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'FED Notes — Frontend Developer Reference',
  description:
    'A premium reference app for frontend developers. Master JavaScript, React, TypeScript, and Next.js with interactive examples.',
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-canvas text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
