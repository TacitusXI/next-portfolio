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
                // Function to fix asset URLs
                function fixAssetUrl(url) {
                  if (typeof url !== 'string') return url;
                  
                  // Handle direct /_next/ URLs
                  if (url.startsWith('/_next/')) {
                    return './_next/' + url.substring(7);
                  }
                  
                  // Handle https://ipfs.io/_next/
                  if (url.startsWith('https://ipfs.io/_next/')) {
                    return './_next/' + url.substring(19);
                  }
                  
                  // Handle https://ipfs.io/ipfs/<CID>/_next/
                  const ipfsCidMatch = url.match(/https:\\/\\/ipfs\\.io\\/ipfs\\/[a-zA-Z0-9]+\\/_next\\//);
                  if (ipfsCidMatch) {
                    // Extract the part after _next/
                    const parts = url.split('/_next/');
                    if (parts.length > 1) {
                      return './_next/' + parts[1];
                    }
                  }
                  
                  // Handle https://ipfs.tech/_next/
                  if (url.startsWith('https://ipfs.tech/_next/')) {
                    return './_next/' + url.substring(21);
                  }
                  
                  return url;
                }

                // Override fetch
                const originalFetch = window.fetch;
                window.fetch = function(url, options) {
                  if (arguments.length >= 1) {
                    arguments[0] = fixAssetUrl(arguments[0]);
                  }
                  return originalFetch.apply(this, arguments);
                };

                // Override XMLHttpRequest
                const originalOpen = XMLHttpRequest.prototype.open;
                XMLHttpRequest.prototype.open = function(method, url, ...args) {
                  arguments[1] = fixAssetUrl(url);
                  return originalOpen.apply(this, arguments);
                };

                // Override setAttribute
                const originalSetAttribute = Element.prototype.setAttribute;
                Element.prototype.setAttribute = function(name, value) {
                  if (name === 'src' || name === 'href') {
                    arguments[1] = fixAssetUrl(value);
                  }
                  return originalSetAttribute.apply(this, arguments);
                };

                // Add MutationObserver for dynamic elements
                const observer = new MutationObserver(function(mutations) {
                  mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList') {
                      mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                          // Fix src and href attributes
                          ['src', 'href'].forEach(attr => {
                            if (node.hasAttribute && node.hasAttribute(attr)) {
                              const value = node.getAttribute(attr);
                              const fixedValue = fixAssetUrl(value);
                              if (value !== fixedValue) {
                                node.setAttribute(attr, fixedValue);
                              }
                            }
                          });
                          
                          // Process all elements with src or href
                          const elementsWithAttrs = node.querySelectorAll('[src], [href]');
                          elementsWithAttrs.forEach(el => {
                            ['src', 'href'].forEach(attr => {
                              if (el.hasAttribute(attr)) {
                                const value = el.getAttribute(attr);
                                const fixedValue = fixAssetUrl(value);
                                if (value !== fixedValue) {
                                  el.setAttribute(attr, fixedValue);
                                }
                              }
                            });
                          });
                        }
                      });
                    }
                  });
                });
                
                // Start observing the document
                observer.observe(document, { childList: true, subtree: true });
                
                // Fix all elements on initial load
                document.addEventListener('DOMContentLoaded', function() {
                  const elementsWithAttrs = document.querySelectorAll('[src], [href]');
                  elementsWithAttrs.forEach(el => {
                    ['src', 'href'].forEach(attr => {
                      if (el.hasAttribute(attr)) {
                        const value = el.getAttribute(attr);
                        const fixedValue = fixAssetUrl(value);
                        if (value !== fixedValue) {
                          el.setAttribute(attr, fixedValue);
                        }
                      }
                    });
                  });
                });
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