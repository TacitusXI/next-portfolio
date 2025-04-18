import { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Inline script that runs immediately to rewrite asset paths */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Patch all Next.js asset URLs to be relative for IPFS compatibility
              (function() {
                // Override the fetch function to fix URLs
                const originalFetch = window.fetch;
                window.fetch = function(url, options) {
                  if (typeof url === 'string' && url.startsWith('/_next/')) {
                    url = '.' + url;
                  }
                  return originalFetch.call(this, url, options);
                };

                // Create a custom element prototype method to intercept setting src and href attributes
                const originalsetAttribute = Element.prototype.setAttribute;
                Element.prototype.setAttribute = function(name, value) {
                  if ((name === 'src' || name === 'href') && 
                      typeof value === 'string' && 
                      value.startsWith('/_next/')) {
                    value = '.' + value;
                  }
                  originalSetAttribute.call(this, name, value);
                };

                // Patch the document.write method
                const originalDocumentWrite = document.write;
                document.write = function(html) {
                  if (typeof html === 'string') {
                    html = html.replace(/([src|href])="\\/_next\\//g, '$1="./_next/');
                  }
                  originalDocumentWrite.call(this, html);
                };
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