import type {Metadata} from 'next';
import { Inter } from 'next/font/google' // Using Inter as a fallback, Geist is preferred
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';

// Using Inter font as specified in the original template, can be replaced by Geist if preferred.
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })


export const metadata: Metadata = {
  title: 'ChronoFlow',
  description: 'Manage your calendar and tasks efficiently with ChronoFlow.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
