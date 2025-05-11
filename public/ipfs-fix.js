// IPFS Asset Path Fixer
(function() {
  // EMERGENCY FIX for specific known font issue
  (function emergencyFontFix() {
    const specificFontFile = 'a34f9d1faa5f3315-s.p.woff2';
    const problematicPath = '/_next/static/css/_next/static/media/' + specificFontFile;
    const fixedPaths = [
      './_next/static/media/' + specificFontFile,
      './fonts/' + specificFontFile,
      './' + specificFontFile
    ];
    
    // Create preload links for all possible font locations
    fixedPaths.forEach(path => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = path;
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
    
    // Fix style tags containing the problematic path
    function fixFontFace() {
      document.querySelectorAll('style').forEach(style => {
        if (style.textContent.includes(problematicPath) || style.textContent.includes('_next/static/css/_next/static/media')) {
          let fixed = style.textContent.replace(
            /_next\/static\/css\/_next\/static\/media\//g, 
            '_next/static/media/'
          );
          
          style.textContent = fixed;
        }
      });
      
      // Create a direct @font-face rule as a fallback
      const fontFace = document.createElement('style');
      fontFace.textContent = `
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: url('./fonts/${specificFontFile}') format('woff2');
        }
      `;
      document.head.appendChild(fontFace);
    }
    
    // Override fetch for CSS files
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
      if (typeof url === 'string' && url.includes('.css')) {
        return originalFetch.apply(this, arguments)
          .then(response => {
            const clonedResponse = response.clone();
            
            clonedResponse.text().then(text => {
              if (text.includes('_next/static/css/_next/static/media')) {
                const fixed = text.replace(
                  /_next\/static\/css\/_next\/static\/media\//g, 
                  '_next/static/media/'
                );
                
                if (fixed !== text) {
                  // Create and inject a style tag with the fixed CSS
                  const style = document.createElement('style');
                  style.textContent = fixed;
                  document.head.appendChild(style);
                  console.log('Fixed doubled paths in CSS at runtime');
                }
              }
            }).catch(() => {});
            
            return response;
          });
      }
      return originalFetch.apply(this, arguments);
    };
    
    // Run immediately
    fixFontFace();
    
    // And again after load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fixFontFace);
    } else {
      fixFontFace();
    }
    
    // And once more after all resources are loaded
    window.addEventListener('load', fixFontFace);
    
    // Try again after a delay
    setTimeout(fixFontFace, 1000);
  })();
  
  // Function to fix asset URLs
  function fixAssetUrl(url) {
    if (typeof url !== 'string') return url;
    
    // Emergency direct fix for the specific problematic font
    if (url.includes('a34f9d1faa5f3315-s.p.woff2')) {
      if (url.includes('/_next/static/css/_next/static/media/')) {
        return url.replace('/_next/static/css/_next/static/media/', '/_next/static/media/');
      }
      return './fonts/a34f9d1faa5f3315-s.p.woff2';
    }
    
    // Fix doubled _next paths in CSS (common issue with font files)
    if (url.includes('/_next/static/css/_next/static/media/')) {
      return url.replace('/_next/static/css/_next/static/media/', '/_next/static/media/');
    }
    
    // Handle direct /_next/ URLs
    if (url.startsWith('/_next/')) {
      return './_next/' + url.substring(7);
    }
    
    // Handle https://ipfs.io/_next/
    if (url.startsWith('https://ipfs.io/_next/')) {
      return './_next/' + url.substring(19);
    }
    
    // Handle https://ipfs.io/ipfs/<CID>/_next/ - using string operations instead of regex
    if (url.indexOf('https://ipfs.io/ipfs/') !== -1 && url.indexOf('/_next/') !== -1) {
      const parts = url.split('/_next/');
      if (parts.length > 1) {
        return './_next/' + parts[1];
      }
    }
    
    // Handle https://ipfs.tech/_next/
    if (url.startsWith('https://ipfs.tech/_next/')) {
      return './_next/' + url.substring(21);
    }
    
    // Handle font file paths - ensure they use the /fonts/ path 
    if (url.includes('.woff2') || url.includes('.woff') || url.includes('.ttf')) {
      // If it's a Next.js generated font path, try multiple paths
      if (url.includes('/_next/static/media/')) {
        const filename = url.split('/').pop();
        // Try fonts directory first, fallback to _next
        return './fonts/' + filename;
      }
      
      // Fix absolute font paths in IPFS context
      if (url.startsWith('/fonts/')) {
        return '.' + url; // Convert /fonts/ to ./fonts/
      }
      
      // Try to extract just the filename for any font URL
      if (url.includes('/')) {
        const filename = url.split('/').pop();
        return './fonts/' + filename;
      }
    }
    
    // Handle images from public directory
    if (url.startsWith('/images/')) {
      return './images/' + url.substring(8);
    }
    
    return url;
  }

  // Override fetch
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    if (arguments.length >= 1 && typeof arguments[0] === 'string') {
      arguments[0] = fixAssetUrl(arguments[0]);
    }
    return originalFetch.apply(this, arguments);
  };

  // Override XMLHttpRequest
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...args) {
    if (typeof url === 'string') {
      arguments[1] = fixAssetUrl(url);
    }
    return originalOpen.apply(this, arguments);
  };

  // Override setAttribute
  const originalSetAttribute = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function(name, value) {
    if ((name === 'src' || name === 'href') && typeof value === 'string') {
      arguments[1] = fixAssetUrl(value);
    }
    return originalSetAttribute.apply(this, arguments);
  };

  // Fix all elements with src or href
  function fixAllElements() {
    // Fix doubled paths in CSS links - specifically targeting the font issue
    document.querySelectorAll('link[rel="stylesheet"]').forEach(el => {
      if (el.href && el.href.includes('/_next/static/css/')) {
        // For stylesheets, we need to check their content
        fetch(el.href)
          .then(response => response.text())
          .then(cssText => {
            if (cssText.includes('_next/static/css/_next/static/media/')) {
              // Create a fixed version of the CSS
              const fixedCss = cssText.replace(
                /_next\/static\/css\/_next\/static\/media\//g, 
                '_next/static/media/'
              );
              
              // Replace the stylesheet if we made changes
              if (fixedCss !== cssText) {
                const style = document.createElement('style');
                style.textContent = fixedCss;
                document.head.appendChild(style);
                // Remove the original stylesheet to avoid conflicts
                el.disabled = true;
              }
            }
          })
          .catch(err => console.warn('Failed to fix CSS:', err));
      }
    });

    // Directly fix href attributes containing the doubled paths
    document.querySelectorAll('[href*="_next/static/css/_next/"]').forEach(el => {
      const href = el.getAttribute('href');
      const fixedHref = href.replace(/_next\/static\/css\/_next\/static\/media\//g, '_next/static/media/');
      el.setAttribute('href', fixedHref);
    });
    
    // Fix preloaded fonts
    document.querySelectorAll('link[rel="preload"][as="font"]').forEach(el => {
      const href = el.getAttribute('href');
      if (href) {
        // Fix doubled paths first
        if (href.includes('/_next/static/css/_next/static/media/')) {
          const fixedHref = href.replace('/_next/static/css/_next/static/media/', '/_next/static/media/');
          el.setAttribute('href', fixedHref);
        }
        
        if (href.includes('/_next/static/media/') && (href.includes('.woff2') || href.includes('.woff'))) {
          const filename = href.split('/').pop();
          el.setAttribute('href', './fonts/' + filename);
        } else if (href.includes('https://ipfs.io/') && href.includes('/_next/')) {
          const parts = href.split('/_next/');
          if (parts.length > 1) {
            el.setAttribute('href', './_next/' + parts[1]);
          }
        } else if (href.startsWith('/fonts/')) {
          // Convert absolute font paths to relative for IPFS environment
          el.setAttribute('href', '.' + href);
        } else if ((href.includes('.woff2') || href.includes('.woff')) && href.includes('/')) {
          // For any font URL, extract filename and try ./fonts/ directory
          const filename = href.split('/').pop();
          el.setAttribute('href', './fonts/' + filename);
        }
      }
    });

    // Fix font face CSS URLs via style tags
    document.querySelectorAll('style').forEach(styleEl => {
      if (styleEl.textContent && styleEl.textContent.includes('@font-face')) {
        let cssText = styleEl.textContent;
        
        // Fix doubled _next paths first
        if (cssText.includes('_next/static/css/_next/static/media/')) {
          cssText = cssText.replace(
            /_next\/static\/css\/_next\/static\/media\//g, 
            '_next/static/media/'
          );
        }
        
        // Fix font paths using string operations to avoid regex issues
        if (cssText.includes('url(') && (cssText.includes('.woff2') || cssText.includes('.woff'))) {
          // Split on url( to process each URL individually
          const segments = cssText.split('url(');
          
          // Process each segment (starting from 1, since 0 is before first url)
          for (let i = 1; i < segments.length; i++) {
            // Check if this is a font file
            if (segments[i].includes('.woff2') || segments[i].includes('.woff') || segments[i].includes('.ttf')) {
              // Find the closing parenthesis for this url()
              const closingIndex = segments[i].indexOf(')');
              if (closingIndex !== -1) {
                // Extract the URL part
                const urlPath = segments[i].substring(0, closingIndex);
                
                // Remove quotes if present
                const cleanPath = urlPath.replace(/["']/g, '');
                
                // Get just the filename
                const filename = cleanPath.split('/').pop();
                
                // Create a new path pointing to ./fonts/
                const newPath = '"./fonts/' + filename + '"';
                
                // Replace the URL in this segment
                segments[i] = segments[i].substring(0, 0) + newPath + segments[i].substring(closingIndex);
              }
            }
          }
          
          // Rejoin all segments
          cssText = segments.join('url(');
          styleEl.textContent = cssText;
        }
      }
    });

    // Fix standard elements with src/href
    document.querySelectorAll('[src], [href]').forEach(el => {
      ['src', 'href'].forEach(attr => {
        if (el.hasAttribute(attr)) {
          const value = el.getAttribute(attr);
          if (value) {
            const fixedValue = fixAssetUrl(value);
            if (value !== fixedValue) {
              el.setAttribute(attr, fixedValue);
            }
          }
        }
      });
    });
    
    // Force reload broken font faces
    if (document.fonts && typeof document.fonts.load === 'function') {
      try {
        // Try to load fonts from multiple possible paths
        document.querySelectorAll('style').forEach(style => {
          if (style.textContent.includes('@font-face') && style.textContent.includes('font-family')) {
            // Extract font names from the CSS
            const fontNameMatches = style.textContent.match(/font-family:\s*['"]([^'"]+)['"]/g);
            if (fontNameMatches) {
              // For each font, try to load it
              fontNameMatches.forEach(match => {
                const fontName = match.replace(/font-family:\s*['"]([^'"]+)['"]/, '$1');
                if (fontName) {
                  document.fonts.load(`1em "${fontName}"`, 'a').then(() => {
                    console.log(`Successfully loaded font: ${fontName}`);
                  }).catch(() => {});
                }
              });
            }
          }
        });
      } catch (e) {
        console.error('Error preloading fonts:', e);
      }
    }
  }

  // Run immediately
  fixAllElements();
  
  // And again after document is loaded
  document.addEventListener('DOMContentLoaded', fixAllElements);
  window.addEventListener('load', fixAllElements);
  
  // Also run after a short delay to catch any dynamically loaded resources
  setTimeout(fixAllElements, 1000);
  setTimeout(fixAllElements, 3000);
  
  // Add MutationObserver to catch dynamically added elements
  const observer = new MutationObserver(function(mutations) {
    let shouldFix = false;
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        shouldFix = true;
      }
    });
    
    if (shouldFix) {
      fixAllElements();
    }
  });
  
  // Start observing the document
  observer.observe(document, { childList: true, subtree: true });
})(); 