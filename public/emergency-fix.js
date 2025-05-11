(function() {
  // Immediately run a direct fix for the problematic font
  const PROBLEMATIC_FONT = 'a34f9d1faa5f3315-s.p.woff2';
  const PROBLEMATIC_PATH = '_next/static/css/_next/static/media';
  const FIXED_PATH = '_next/static/media';
  
  // Store whether we've already created the font style
  window.__fixedFontStyle = false;
  
  // Function to check if a font URL exists
  function checkFontUrl(url) {
    return new Promise((resolve) => {
      const request = new XMLHttpRequest();
      request.open('HEAD', url, true);
      request.onreadystatechange = function() {
        if (request.readyState === 4) {
          resolve(request.status === 200);
        }
      };
      request.send();
    });
  }
  
  // Function to add a custom font style that includes all possible paths
  async function addEmergencyFontStyle() {
    if (window.__fixedFontStyle) return;
    window.__fixedFontStyle = true;
    
    // Create a list of possible font locations to try
    const fontPaths = [
      './fonts/' + PROBLEMATIC_FONT,
      './_next/static/media/' + PROBLEMATIC_FONT,
      './' + PROBLEMATIC_FONT,
      '_next/static/media/' + PROBLEMATIC_FONT
    ];
    
    // Try each path and find one that works
    let workingPath = null;
    for (const path of fontPaths) {
      const exists = await checkFontUrl(path);
      if (exists) {
        workingPath = path;
        console.log('Found working font path:', path);
        break;
      }
    }
    
    // If none found, just use the first one
    if (!workingPath) {
      workingPath = fontPaths[0];
    }
    
    // Add a new style with the font face
    const style = document.createElement('style');
    style.textContent = `
      /* Emergency font fix for Inter font */
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url("${workingPath}") format('woff2');
      }
    `;
    document.head.appendChild(style);
    
    // Create font preload links for all paths
    fontPaths.forEach(path => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = path;
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
    
    // Final resort - create the font directory and manually fetch and store the font
    if (!workingPath) {
      fetch('https://fonts.googleapis.com/css2?family=Inter&display=swap')
        .then(response => response.text())
        .then(css => {
          const fallbackStyle = document.createElement('style');
          fallbackStyle.textContent = css;
          document.head.appendChild(fallbackStyle);
        })
        .catch(err => {
          console.error('Failed to fetch fallback font:', err);
        });
    }
  }
  
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
    
    // Fix stylesheet links with doubled paths
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.includes('_next/static/css')) {
        // We need to check the CSS content
        fetch(href)
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch stylesheet');
            }
            return response.text();
          })
          .then(cssText => {
            if (cssText.includes(PROBLEMATIC_PATH)) {
              // Create a fixed version
              const fixedCss = cssText.split(PROBLEMATIC_PATH).join(FIXED_PATH);
              
              // Add as a style tag
              const style = document.createElement('style');
              style.textContent = fixedCss;
              document.head.appendChild(style);
              
              // Disable the original
              link.disabled = true;
            }
          })
          .catch(error => {
            console.error('Error processing stylesheet:', error);
          });
      }
    });
    
    // Add emergency font style with font path check
    addEmergencyFontStyle();
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
  setTimeout(fixAllElements, 3000);
})(); 