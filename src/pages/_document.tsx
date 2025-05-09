import { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Early script to check query parameters */}
        <script dangerouslySetInnerHTML={{
          __html: `
            // Check if we should bypass the ipfs-fix.js
            window.bypassIpfsFix = new URLSearchParams(window.location.search).get('bypass_ipfs_fix') === 'true';
            console.log('Bypass IPFS fix:', window.bypassIpfsFix);
            
            // Intercept script loading if needed
            if (window.bypassIpfsFix) {
              console.log('Intercepting problematic scripts');
              var originalCreateElement = document.createElement;
              document.createElement = function(tagName) {
                var element = originalCreateElement.apply(document, arguments);
                
                if (tagName.toLowerCase() === 'script') {
                  // Intercept setting src attribute
                  var originalSetAttribute = element.setAttribute;
                  element.setAttribute = function(name, value) {
                    if (name === 'src' && typeof value === 'string' && value.indexOf('ipfs-fix.js') !== -1) {
                      console.log('Prevented loading of problematic script:', value);
                      // Don't set the src attribute for problematic scripts
                      return;
                    }
                    return originalSetAttribute.apply(this, arguments);
                  };
                }
                
                return element;
              };
            }
          `
        }} />
        
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