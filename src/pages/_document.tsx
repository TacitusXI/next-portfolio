import { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preload font to ensure it's available */}
        <link 
          rel="preload" 
          href="/fonts/a34f9d1faa5f3315-s.p.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
        
        {/* IPFS path fixing script - no regex */}
        <script src="/path-fix.js" />
        
        {/* Font specific fixing */}
        <script src="/font-fix.js" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 