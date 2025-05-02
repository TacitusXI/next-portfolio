// Simple path fixing for IPFS environment - No regex used
(function() {
  function fixUrl(url) {
    if (typeof url !== 'string') return url;
    
    // Handle _next paths
    if (url.startsWith('/_next/')) {
      return './_next/' + url.substring(7);
    }
    
    // Handle ipfs.io paths
    if (url.indexOf('https://ipfs.io/_next/') === 0) {
      return './_next/' + url.substring(19);
    }
    
    // Handle CID paths
    if (url.indexOf('https://ipfs.io/ipfs/') !== -1 && url.indexOf('/_next/') !== -1) {
      const parts = url.split('/_next/');
      if (parts.length > 1) {
        return './_next/' + parts[1];
      }
    }
    
    // Handle font paths
    if (url.indexOf('.woff2') !== -1 || url.indexOf('.woff') !== -1) {
      if (url.indexOf('/_next/static/media/') !== -1) {
        const parts = url.split('/');
        const filename = parts[parts.length - 1];
        return './fonts/' + filename;
      }
      
      // Handle absolute font paths
      if (url.indexOf('/fonts/') === 0) {
        return '.' + url;
      }
    }
    
    // Handle images
    if (url.indexOf('/images/') === 0) {
      return '.' + url;
    }
    
    return url;
  }
  
  // Fix all elements on page
  function fixAllElements() {
    // Fix fonts
    var fontLinks = document.querySelectorAll('link[rel="preload"][as="font"]');
    for (var i = 0; i < fontLinks.length; i++) {
      var el = fontLinks[i];
      var href = el.getAttribute('href');
      if (href) {
        var fixedHref = fixUrl(href);
        if (fixedHref !== href) {
          el.setAttribute('href', fixedHref);
        }
      }
    }
    
    // Fix all src/href attributes
    var elementsWithAttrs = document.querySelectorAll('[src], [href]');
    for (var i = 0; i < elementsWithAttrs.length; i++) {
      var el = elementsWithAttrs[i];
      
      // Check src
      if (el.hasAttribute('src')) {
        var src = el.getAttribute('src');
        var fixedSrc = fixUrl(src);
        if (fixedSrc !== src) {
          el.setAttribute('src', fixedSrc);
        }
      }
      
      // Check href
      if (el.hasAttribute('href')) {
        var href = el.getAttribute('href');
        var fixedHref = fixUrl(href);
        if (fixedHref !== href) {
          el.setAttribute('href', fixedHref);
        }
      }
    }
    
    // Fix stylesheet URLs
    var styles = document.querySelectorAll('style');
    for (var i = 0; i < styles.length; i++) {
      var style = styles[i];
      if (style.textContent && style.textContent.indexOf('@font-face') !== -1) {
        var cssText = style.textContent;
        
        // Replace font URLs without using regex
        if (cssText.indexOf('url(/fonts/') !== -1) {
          cssText = cssText.split('url(/fonts/').join('url(./fonts/');
          style.textContent = cssText;
        }
      }
    }
  }
  
  // Run immediately
  fixAllElements();
  
  // Run again when DOM is loaded
  document.addEventListener('DOMContentLoaded', fixAllElements);
  
  // Override fetch
  var originalFetch = window.fetch;
  window.fetch = function(url, options) {
    if (arguments.length >= 1 && typeof arguments[0] === 'string') {
      arguments[0] = fixUrl(arguments[0]);
    }
    return originalFetch.apply(this, arguments);
  };
  
  // Override setAttribute
  var originalSetAttribute = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function(name, value) {
    if ((name === 'src' || name === 'href') && typeof value === 'string') {
      arguments[1] = fixUrl(value);
    }
    return originalSetAttribute.apply(this, arguments);
  };
  
  // Watch for new elements
  var observer = new MutationObserver(function(mutations) {
    var shouldFix = false;
    for (var i = 0; i < mutations.length; i++) {
      if (mutations[i].type === 'childList' && mutations[i].addedNodes.length > 0) {
        shouldFix = true;
        break;
      }
    }
    
    if (shouldFix) {
      fixAllElements();
    }
  });
  
  observer.observe(document, { childList: true, subtree: true });
})(); 