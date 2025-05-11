(function() {
  // Immediately run a direct fix for the problematic font
  const PROBLEMATIC_FONT = 'a34f9d1faa5f3315-s.p.woff2';
  const PROBLEMATIC_PATH = '_next/static/css/_next/static/media';
  const FIXED_PATH = '_next/static/media';
  
  // Function to check and fix any paths containing the problematic pattern
  function fixElement(el) {
    if (!el || !el.getAttribute) return;
    
    ['src', 'href'].forEach(attr => {
      if (el.hasAttribute(attr)) {
        const value = el.getAttribute(attr);
        if (value && typeof value === 'string') {
          // Fix doubled _next paths
          if (value.indexOf(PROBLEMATIC_PATH) !== -1) {
            const fixed = value.split(PROBLEMATIC_PATH).join(FIXED_PATH);
            el.setAttribute(attr, fixed);
          }
          
          // Fix specific problematic font
          if (value.indexOf(PROBLEMATIC_FONT) !== -1) {
            el.setAttribute(attr, './fonts/' + PROBLEMATIC_FONT);
            // Create a backup copy with a different path
            const backup = document.createElement(el.tagName);
            for (const a of el.attributes) {
              backup.setAttribute(a.name, a.value);
            }
            backup.setAttribute(attr, './_next/static/media/' + PROBLEMATIC_FONT);
            el.parentNode.appendChild(backup);
          }
        }
      }
    });
  }
  
  // Function to fix all elements in the document
  function fixAllElements() {
    // Fix all elements with src or href
    document.querySelectorAll('[src], [href]').forEach(fixElement);
    
    // Fix style tags with @font-face
    document.querySelectorAll('style').forEach(style => {
      if (!style.textContent) return;
      
      if (style.textContent.indexOf('@font-face') !== -1 && 
          style.textContent.indexOf(PROBLEMATIC_PATH) !== -1) {
        // Replace problematic path without using regex
        let content = style.textContent;
        content = content.split(PROBLEMATIC_PATH).join(FIXED_PATH);
        style.textContent = content;
      }
      
      // Ensure we have Inter font declaration
      if (style.textContent.indexOf('@font-face') !== -1 && 
          style.textContent.indexOf(PROBLEMATIC_FONT) !== -1) {
        // Add a direct fallback to the fonts directory
        const fontFace = document.createElement('style');
        fontFace.textContent = `
          @font-face {
            font-family: 'Inter';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url('./fonts/${PROBLEMATIC_FONT}') format('woff2');
          }
        `;
        document.head.appendChild(fontFace);
      }
    });
    
    // Ensure we have preload links for the font
    const existingPreloads = Array.from(document.querySelectorAll('link[rel="preload"]'))
      .filter(link => link.href && link.href.indexOf(PROBLEMATIC_FONT) !== -1);
    
    if (existingPreloads.length === 0) {
      const fontPaths = [
        './fonts/' + PROBLEMATIC_FONT,
        './_next/static/media/' + PROBLEMATIC_FONT,
        './' + PROBLEMATIC_FONT
      ];
      
      fontPaths.forEach(path => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = path;
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
    }
    
    // Fix any inline scripts that might contain problematic regex
    document.querySelectorAll('script').forEach(script => {
      if (script.id === 'emergency-fix') return; // Don't modify ourselves
      
      if (script.textContent && 
          script.textContent.indexOf('fontFaceDeclaration') !== -1 && 
          script.textContent.indexOf('replace(') !== -1) {
        // This might be the problematic script with regex syntax errors
        // Disable it to prevent syntax errors
        script.textContent = `
          // Original script disabled by emergency fix due to regex issues
          console.log('Problematic script with regex detected and disabled');
        `;
      }
    });
  }
  
  // Run the fix immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixAllElements);
  } else {
    fixAllElements();
  }
  
  // Run again after window load
  window.addEventListener('load', fixAllElements);
  
  // And once more after a short delay
  setTimeout(fixAllElements, 1000);
})(); 