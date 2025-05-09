// Early loader script to prevent regex issues
(function() {
  // Immediately run before anything else
  
  // 1. Check if we're in an IPFS environment
  var isIPFS = 
    window.location.hostname.indexOf('ipfs.io') !== -1 || 
    window.location.hostname.indexOf('fleek.co') !== -1 ||
    window.location.hostname.indexOf('on-fleek.app') !== -1 ||
    window.location.hostname.indexOf('ipfs.dweb.link') !== -1;
  
  if (!isIPFS) {
    // Not in IPFS, do nothing
    return;
  }
  
  console.log('IPFS environment detected - applying preventive measures');
  
  // 2. Intercept and prevent loading of problematic scripts
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
  
  // 3. Create and apply inline font faces immediately
  var style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: '__Inter_Fallback';
      font-style: normal;
      font-weight: 100 900;
      font-display: swap;
      src: url("./fonts/a34f9d1faa5f3315-s.p.woff2") format("woff2");
    }
  `;
  
  // Insert at the beginning of head
  if (document.head) {
    document.head.insertBefore(style, document.head.firstChild);
  } else {
    // If head doesn't exist yet, wait for it
    document.addEventListener('DOMContentLoaded', function() {
      document.head.insertBefore(style, document.head.firstChild);
    });
  }
  
  // 4. Handle resource paths after DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Create a simple path fixer that doesn't use regex
    function fixPath(path) {
      if (typeof path !== 'string') return path;
      
      if (path.indexOf('/_next/') === 0) {
        return './_next/' + path.substring(7);
      } else if (path.indexOf('/fonts/') === 0) {
        return '.' + path;
      } else if (path.indexOf('/images/') === 0) {
        return '.' + path;
      }
      
      return path;
    }
    
    // Fix all elements with src or href attributes
    var elements = document.querySelectorAll('[src], [href]');
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      
      if (el.hasAttribute('src')) {
        var src = el.getAttribute('src');
        var fixedSrc = fixPath(src);
        if (fixedSrc !== src) {
          el.setAttribute('src', fixedSrc);
        }
      }
      
      if (el.hasAttribute('href')) {
        var href = el.getAttribute('href');
        var fixedHref = fixPath(href);
        if (fixedHref !== href) {
          el.setAttribute('href', fixedHref);
        }
      }
    }
  });
})(); 