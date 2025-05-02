import { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preload main font file */}
        <link 
          rel="preload" 
          href="/fonts/a34f9d1faa5f3315-s.p.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
        
        {/* Our early-running fix script - must be loaded first */}
        <script src="/fix.js" />
        
        {/* Add inline styles for font loading for immediate use */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Basic font definition that will be enhanced by the script */
            @font-face {
              font-family: '__Inter_Fallback';
              font-style: normal;
              font-weight: 100 900;
              font-display: swap;
              src: url('/fonts/a34f9d1faa5f3315-s.p.woff2') format('woff2');
            }
          `
        }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 