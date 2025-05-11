import './globals.css';
import './mobileFix.css';
import './fonts.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import StyledComponentsRegistry from '@/lib/registry';
import Script from 'next/script';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap'
});

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
    <html lang="en" style={{ overflowX: 'hidden' }}>
      <head>
        {/* Google tag (gtag.js) */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-YSR9XMN2EL" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YSR9XMN2EL');
          `}
        </Script>
        <link rel="icon" href="./images/tacitus-favicon.webp" />
      </head>
      <body className={inter.className} style={{ overflowX: 'hidden' }}>
        <StyledComponentsRegistry>
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
