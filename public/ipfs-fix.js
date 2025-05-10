// IPFS Asset Path Fixer
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
    // Fix preloaded fonts
    document.querySelectorAll('link[rel="preload"][as="font"]').forEach(el => {
      const href = el.getAttribute('href');
      if (href) {
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
        // Try to load Inter font from multiple possible locations
        document.fonts.load('1em "Inter"', 'a').then(() => {
          console.log('Successfully loaded Inter font');
        }).catch(() => {
          console.log('Could not load Inter font from first source, trying alternatives');
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