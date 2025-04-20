import './globals.css';
import type { Metadata } from 'next';
import { Inter, Orbitron, Space_Mono, JetBrains_Mono, Rajdhani } from 'next/font/google';
import StyledComponentsRegistry from '@/lib/registry';

// Define fonts with Next.js optimization
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-orbitron',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-mono',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

const rajdhani = Rajdhani({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-rajdhani',
});

// Combine font variables
const fonts = `${inter.variable} ${orbitron.variable} ${spaceMono.variable} ${jetbrainsMono.variable} ${rajdhani.variable}`;

export const metadata: Metadata = {
  title: 'Ivan Leskov | Blockchain & Web3 Engineer',
  description: 'Solidity developer with focus on smart contract architecture and secure blockchain applications',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" style={{ overflowX: 'hidden' }} className={fonts}>
      <head>
        <link rel="icon" href="./images/tacitus-favicon.webp" />
        <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className} style={{ overflowX: 'hidden' }}>
        <StyledComponentsRegistry>
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
