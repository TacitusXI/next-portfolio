import { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Add a script that rewrites asset URLs at runtime for IPFS compatibility */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Function to fix asset paths for IPFS
                function fixIPFSAssetPaths() {
                  // Find all script and link elements
                  const scripts = document.querySelectorAll('script[src^="/_next/"]');
                  const links = document.querySelectorAll('link[href^="/_next/"]');
                  
                  // Fix script src attributes
                  scripts.forEach(script => {
                    const src = script.getAttribute('src');
                    if (src && src.startsWith('/_next/')) {
                      script.setAttribute('src', '.' + src);
                    }
                  });
                  
                  // Fix link href attributes
                  links.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && href.startsWith('/_next/')) {
                      link.setAttribute('href', '.' + href);
                    }
                  });
                }
                
                // Run on DOMContentLoaded
                document.addEventListener('DOMContentLoaded', fixIPFSAssetPaths);
              })();
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 