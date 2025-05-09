// Early-loading script to fix issues with IPFS deployments
(function() {
  // Check for special parameters
  var forceFix = window.location.search.indexOf('font_fix=true') !== -1;
  var bypassIpfsFix = window.location.search.indexOf('bypass_ipfs_fix=true') !== -1;
  
  // Set a global variable for other scripts to check
  window.bypassIpfsFix = bypassIpfsFix;
  
  console.log('Fix script loaded. Force fix:', forceFix, 'Bypass IPFS fix:', bypassIpfsFix);
  
  // First, let's try to stop any problematic scripts
  function stopProblematicScripts() {
    // If bypass is true, intercept script creation
    if (bypassIpfsFix && !window.scriptInterceptorInstalled) {
      console.log('Installing script interceptor');
      window.scriptInterceptorInstalled = true;
      
      var originalCreateElement = document.createElement;
      document.createElement = function(tagName) {
        var element = originalCreateElement.apply(document, arguments);
        
        if (tagName.toLowerCase() === 'script') {
          // Intercept setting src attribute
          var originalSetAttribute = element.setAttribute;
          element.setAttribute = function(name, value) {
            if (name === 'src' && typeof value === 'string' && 
                (value.indexOf('ipfs-fix.js') !== -1 || 
                 value.indexOf('/_ipfs/') !== -1)) {
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
    
    // Find and stop the existing ipfs-fix.js script
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
      var script = scripts[i];
      if (script.src && (
          script.src.indexOf('ipfs-fix.js') !== -1 || 
          script.src.indexOf('_ipfs/ipfs-fix.js') !== -1 ||
          script.src.indexOf('/_ipfs/') !== -1)) {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
          console.log('Removed problematic script:', script.src);
        }
      }
    }
    
    // Also stop any inline scripts with regex that might be causing issues
    var inlineScripts = document.querySelectorAll('script:not([src])');
    for (var i = 0; i < inlineScripts.length; i++) {
      var script = inlineScripts[i];
      var content = script.textContent || '';
      
      // Check if it contains both regex and IPFS references
      if (content.indexOf('match(') !== -1 && 
          (content.indexOf('ipfs.io') !== -1 || 
           content.indexOf('/_next/') !== -1 || 
           content.indexOf('/_ipfs/') !== -1)) {
        if (script.parentNode && (forceFix || bypassIpfsFix)) {
          script.parentNode.removeChild(script);
          console.log('Removed potentially problematic inline script with regex');
        }
      }
    }
  }
  
  // Run immediately
  stopProblematicScripts();
  
  // Fix all font paths directly
  function fixFontPaths() {
    // Create style for fonts
    var style = document.createElement('style');
    var fonts = [
      {name: 'a34f9d1faa5f3315-s.p.woff2', range: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC'},
      {name: '55c55f0601d81cf3-s.woff2', range: 'U+0460-052F, U+1C80-1C8A, U+20B4'},
      {name: '26a46d62cd723877-s.woff2', range: 'U+0301, U+0400-045F, U+0490-0491'},
      {name: '97e0cb1ae144a2a9-s.woff2', range: 'U+1F00-1FFF'},
      {name: '581909926a08bbc8-s.woff2', range: 'U+0370-0377, U+037A-037F'},
      {name: 'df0a9ae256c0569c-s.woff2', range: 'U+0102-0103, U+0110-0111'},
      {name: '6d93bde91c0c2823-s.woff2', range: 'U+0100-02BA, U+02BD-02C5'}
    ];
    
    var css = '';
    for (var i = 0; i < fonts.length; i++) {
      var font = fonts[i];
      css += '@font-face {\n';
      css += '  font-family: "__Inter_Fallback";\n';
      css += '  font-style: normal;\n';
      css += '  font-weight: 100 900;\n';
      css += '  font-display: swap;\n';
      css += '  src: url("./fonts/' + font.name + '") format("woff2");\n';
      css += '  unicode-range: ' + font.range + ';\n';
      css += '}\n';
    }
    
    style.textContent = css;
    document.head.appendChild(style);
    
    // Create preload links for fonts
    for (var i = 0; i < fonts.length; i++) {
      var link = document.createElement('link');
      link.rel = 'preload';
      link.href = './fonts/' + fonts[i].name;
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
  }
  
  // Fix asset paths
  function fixAssetPaths() {
    // Fix all existing elements with src or href attributes
    var elements = document.querySelectorAll('[src], [href]');
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      
      if (el.hasAttribute('src')) {
        var src = el.getAttribute('src');
        if (src && typeof src === 'string') {
          // Fix paths
          if (src.indexOf('/_next/') === 0) {
            el.setAttribute('src', './_next/' + src.substring(7));
          } else if (src.indexOf('/fonts/') === 0) {
            el.setAttribute('src', '.' + src);
          } else if (src.indexOf('/images/') === 0) {
            el.setAttribute('src', '.' + src);
          }
        }
      }
      
      if (el.hasAttribute('href')) {
        var href = el.getAttribute('href');
        if (href && typeof href === 'string') {
          // Fix paths
          if (href.indexOf('/_next/') === 0) {
            el.setAttribute('href', './_next/' + href.substring(7));
          } else if (href.indexOf('/fonts/') === 0) {
            el.setAttribute('href', '.' + href);
          } else if (href.indexOf('/images/') === 0) {
            el.setAttribute('href', '.' + href);
          }
        }
      }
    }
  }
  
  // Wait for DOM to be loaded before fixing paths
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      fixFontPaths();
      fixAssetPaths();
      // Run again to catch any scripts added during initial load
      stopProblematicScripts();
    });
  } else {
    fixFontPaths();
    fixAssetPaths();
    // Run again to catch any scripts added during initial load
    stopProblematicScripts();
  }
})(); 