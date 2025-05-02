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
    if (url.includes('.woff2') || url.includes('.woff')) {
      // If it's a Next.js generated font path, fix it to use our /fonts/ directory
      if (url.includes('/_next/static/media/')) {
        const filename = url.split('/').pop();
        return '/fonts/' + filename;
      }
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
        if (href.includes('/_next/static/media/') && href.includes('.woff2')) {
          const filename = href.split('/').pop();
          el.setAttribute('href', '/fonts/' + filename);
        } else if (href.includes('https://ipfs.io/') && href.includes('/_next/')) {
          const parts = href.split('/_next/');
          if (parts.length > 1) {
            el.setAttribute('href', './_next/' + parts[1]);
          }
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
  }

  // Run immediately
  fixAllElements();
  
  // And again after document is loaded
  document.addEventListener('DOMContentLoaded', fixAllElements);
  
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