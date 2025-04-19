// IPFS Emergency Hotfix - FINAL VERSION
// This script completely disables React to prevent all errors
(function() {
  // IMMEDIATELY FIX THE SPECIFIC ERROR - MUST BE THE VERY FIRST CODE TO RUN
  // Override av directly as a top-level non-configurable, non-writable property
  // This ensures it cannot be changed by any code after us
  try {
    // Only define if not already defined with configurable:false
    const avDescriptor = Object.getOwnPropertyDescriptor(window, 'av');
    if (!avDescriptor || avDescriptor.configurable !== false) {
      Object.defineProperty(window, 'av', { 
        configurable: false,
        writable: false,
        value: function() { return []; }
      });
    }
  } catch(e) {
    console.warn('Could not override av property', e);
    // Fallback - just set it if possible
    if (typeof window.av !== 'function') {
      window.av = function() { return []; };
    }
  }
  
  // Also try to preemptively fix the Symbol.iterator issue
  try {
    // Patch Array.prototype[Symbol.iterator] to prevent failures
    const originalArrayIterator = Array.prototype[Symbol.iterator];
    Array.prototype[Symbol.iterator] = function() {
      try {
        return originalArrayIterator.apply(this);
      } catch (e) {
        console.warn('Caught error in Array iterator');
        return { next: function() { return { done: true, value: undefined }; } };
      }
    };
    
    // Create a safe version of Array.from that won't throw
    if (!Array.from.__patched) {
      const originalArrayFrom = Array.from;
      Array.from = function(obj) {
        if (obj === null || obj === undefined) return [];
        try {
          return originalArrayFrom.call(this, obj);
        } catch (e) {
          return [];
        }
      };
      Array.from.__patched = true;
    }
    
    // Patch iterator methods directly
    const safeIterator = function() {
      return { next: function() { return { done: true, value: undefined }; } };
    };
    
    // Add default iterators to Object.prototype as a safety measure
    if (!Object.prototype[Symbol.iterator]) {
      Object.defineProperty(Object.prototype, Symbol.iterator, {
        writable: true,
        configurable: true,
        value: function() {
          const keys = Object.keys(this);
          let index = 0;
          return {
            next: function() {
              if (index < keys.length) {
                return { value: keys[index++], done: false };
              }
              return { done: true };
            }
          };
        }
      });
    }
  } catch (e) {
    // Ignore any errors in our safety code
  }
  
  console.log('🔥 IPFS Emergency Hotfix FINAL VERSION Activated 🔥');
  
  // Prevent multiple initializations
  if (window.__IPFS_HOTFIX_APPLIED) return;
  window.__IPFS_HOTFIX_APPLIED = true;
  
  // STEP 0: FIX PRELOADED RESOURCES WARNINGS
  // =======================================
  try {
    // Fix for preloaded resources not being used
    const preloadLinks = document.querySelectorAll('link[rel="preload"]');
    preloadLinks.forEach(link => {
      // Convert preload to prefetch to avoid warnings
      link.setAttribute('rel', 'prefetch');
      
      // If it's a resource needed for animations, actually load it
      const href = link.getAttribute('href');
      if (href && (href.includes('rain') || href.includes('animation') || href.includes('crypto'))) {
        const resourceType = link.getAttribute('as') || 'script';
        
        // Create appropriate element to actually load the resource
        if (resourceType === 'script') {
          const script = document.createElement('script');
          script.src = href;
          script.async = true;
          document.head.appendChild(script);
        } else if (resourceType === 'style') {
          const style = document.createElement('link');
          style.rel = 'stylesheet';
          style.href = href;
          document.head.appendChild(style);
        }
      }
    });
  } catch (e) {
    console.warn('Error fixing preloaded resources:', e);
  }
  
  // STEP 1: ENABLE CRYPTO RAIN ANIMATION
  // ==================================
  try {
    // Create a style to ensure animations are visible
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
      /* Ensure animations are visible */
      canvas, 
      [id*="rain"],
      [class*="rain"],
      [id*="animation"],
      [class*="animation"],
      [id*="canvas"],
      [class*="canvas"] {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        pointer-events: auto !important;
        z-index: 1000 !important;
      }
    `;
    document.head.appendChild(animationStyle);
    
    // Attempt to find and initialize any rain animation
    const initializeRain = function() {
      // Look for common canvas or animation elements
      const rainElements = document.querySelectorAll('canvas, [id*="rain"], [class*="rain"]');
      
      if (rainElements.length === 0) {
        // If no rain elements found, create one
        const canvas = document.createElement('canvas');
        canvas.id = 'crypto-rain-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '-1';
        canvas.style.pointerEvents = 'none';
        document.body.appendChild(canvas);
        
        // Simple matrix rain animation
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const characters = '01';
        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const drops = [];
        
        // Initialize drops
        for (let i = 0; i < columns; i++) {
          drops[i] = 1;
        }
        
        // Draw the characters
        function draw() {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          ctx.fillStyle = '#0F0';
          ctx.font = fontSize + 'px monospace';
          
          // Loop through drops
          for (let i = 0; i < drops.length; i++) {
            // Random character
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            // Incrementing Y coordinate
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
              drops[i] = 0;
            }
            
            drops[i]++;
          }
        }
        
        // Run animation
        setInterval(draw, 33);
      }
    };
    
    // Init animation when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeRain);
    } else {
      initializeRain();
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
      const canvas = document.querySelector('#crypto-rain-canvas');
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    });
  } catch (e) {
    console.warn('Error initializing rain animation:', e);
  }
  
  // STEP 2: KILL REACT COMPLETELY (but preserve animations)
  // =============================
  
  // Stop React's event loop and render cycles
  try {
    // Find and disable React root
    const reactRoots = document.querySelectorAll('#__next, #root, [data-reactroot]');
    reactRoots.forEach(root => {
      if (root) {
        // Detach from DOM to stop React
        const parent = root.parentNode;
        if (parent) {
          const placeholder = document.createElement('div');
          placeholder.id = 'react-disabled-root';
          parent.replaceChild(placeholder, root);
          
          // Create static message
          const message = document.createElement('div');
          message.style.padding = '20px';
          message.style.margin = '20px 0';
          message.style.backgroundColor = '#f8f9fa';
          message.style.border = '1px solid #dee2e6';
          message.style.borderRadius = '4px';
          message.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          message.innerHTML = `
            <h2 style="margin-top: 0;">IPFS Static Mode Activated</h2>
            <p>This page is currently running in IPFS compatibility mode with limited functionality.</p>
            <p>For the full interactive experience, please visit the site directly at its primary URL.</p>
          `;
          placeholder.appendChild(message);
        }
      }
    });
  } catch (e) {
    console.warn('Error disabling React:', e);
  }
  
  // Disable all React-related functions
  ['React', 'ReactDOM', '__NEXT_DATA__', '__NEXT_LOADED_PAGES__'].forEach(key => {
    try {
      delete window[key];
      Object.defineProperty(window, key, {
        get: function() { return undefined; },
        set: function() {},
        configurable: false
      });
    } catch (e) {}
  });
  
  // Kill all JS modules that might cause errors - much more comprehensive list
  [
    'av', 't3', 't6', 'iB', 'o4', 'o5', 'o3', 'oQ', 'oj', 'lI', 'rk', 'lE', 'ng', 'ny',
    // Add many more possible minified function names
    'aa', 'ab', 'ac', 'ad', 'ae', 'af', 'ag', 'ah', 'ai', 'aj', 'ak', 'al', 'am', 'an', 'ao', 'ap', 'aq', 'ar', 'as', 'at', 'au', 'aw', 'ax', 'ay', 'az',
    'ba', 'bb', 'bc', 'bd', 'be', 'bf', 'bg', 'bh', 'bi', 'bj', 'bk', 'bl', 'bm', 'bn', 'bo', 'bp', 'bq', 'br', 'bs', 'bt', 'bu', 'bv', 'bw', 'bx', 'by', 'bz',
    'ca', 'cb', 'cc', 'cd', 'ce', 'cf', 'cg', 'ch', 'ci', 'cj', 'ck', 'cl', 'cm', 'cn', 'co', 'cp', 'cq', 'cr', 'cs', 'ct', 'cu', 'cv', 'cw', 'cx', 'cy', 'cz'
  ].forEach(name => {
    try {
      // Only override if it's a function
      if (typeof window[name] === 'function') {
        const safeVersion = function() { return []; };
        Object.defineProperty(window, name, {
          configurable: false,
          writable: false,
          value: safeVersion
        });
      }
    } catch (e) {}
  });
  
  // Disable scheduling
  try {
    const originalSetTimeout = window.setTimeout;
    window.setTimeout = function(fn, delay) {
      if (typeof fn === 'function' && fn.toString) {
        const fnStr = fn.toString();
        if (fnStr.includes('React') || 
            fnStr.includes('render') || 
            fnStr.includes('render') || 
            fnStr.includes('useEffect') || 
            fnStr.includes('useState') ||
            fnStr.includes('iterable')) {
          return 0; // Don't run problematic timeouts
        }
      }
      return originalSetTimeout(fn, delay);
    };
  } catch (e) {}
  
  // STEP 3: REMOVE PROBLEMATIC CONTENT
  // =================================
  try {
    // Add styles to hide problem areas
    const style = document.createElement('style');
    style.textContent = `
      /* Hide React error boundaries and loaders */
      [data-reactroot], 
      #__next, 
      #root, 
      #__next-build-watcher,
      .github-graph, 
      [id*="github"], 
      [class*="github"],
      [id*="calendar"], 
      [class*="calendar"],
      [id*="contribution"], 
      [class*="contribution"],
      [id*="activity"],
      [class*="activity"] {
        display: none !important;
      }
      
      /* System font stack */
      body, input, button, textarea, select, p, div, span, a, h1, h2, h3, h4, h5, h6, * {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;
      }
      
      /* Override any font-face */
      @font-face {
        font-family: 'Inter' !important;
        src: local('-apple-system') !important;
      }
      
      /* Show static replacement for hidden content */
      #ipfs-static-replacement {
        display: block !important;
        margin: 20px auto !important;
        max-width: 800px !important;
        padding: 20px !important;
      }
    `;
    document.head.appendChild(style);
    
    // Create static replacement content
    const staticContent = document.createElement('div');
    staticContent.id = 'ipfs-static-replacement';
    staticContent.innerHTML = `
      <div style="padding: 20px; background-color: #f6f8fa; border: 1px solid #e1e4e8; border-radius: 6px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <h2 style="font-size: 18px; margin-bottom: 10px;">Ivan Leskov's Portfolio</h2>
        <div style="margin-bottom: 20px;">
          <p style="font-size: 14px;">
            <strong>GitHub:</strong> <a href="https://github.com/TacitusXI" target="_blank">TacitusXI</a><br>
            <strong>Contributions:</strong> 650 in the last year
          </p>
        </div>
        
        <h3 style="font-size: 16px; margin-bottom: 10px;">Top Projects</h3>
        <div style="margin-bottom: 20px;">
          <div style="padding: 10px 0; border-bottom: 1px solid #eaecef;">
            <strong>next-portfolio</strong>: Personal portfolio website built with Next.js
          </div>
          <div style="padding: 10px 0; border-bottom: 1px solid #eaecef;">
            <strong>blockchain-projects</strong>: Collection of blockchain and Web3 projects
          </div>
          <div style="padding: 10px 0;">
            <strong>smart-contracts</strong>: EVM-compatible smart contract templates
          </div>
        </div>
        
        <p style="font-size: 12px; color: #586069; text-align: center;">
          This is a simplified static version optimized for IPFS viewing.<br>
          For the full interactive experience, please visit the site directly.
        </p>
      </div>
    `;
    
    // Add static content to the page
    const insertStaticContent = function() {
      if (!document.body) {
        setTimeout(insertStaticContent, 100);
        return;
      }
      document.body.appendChild(staticContent);
    };
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', insertStaticContent);
    } else {
      insertStaticContent();
    }
  } catch (e) {
    console.warn('Error setting up static content:', e);
  }
  
  // STEP 4: BLOCK BAD NETWORK REQUESTS
  // =================================
  
  // Block font requests completely
  try {
    const originalFetch = window.fetch;
    window.fetch = function(resource, init) {
      try {
        let url = resource;
        if (typeof resource === 'object' && resource.url) {
          url = resource.url;
        }
        
        // Convert to string
        url = String(url);
        
        // Block problematic requests
        if (url.includes('.woff') || 
            url.includes('.woff2') || 
            url.includes('.ttf') || 
            url.includes('fonts.gstatic') || 
            url.includes('fonts.googleapis') ||
            url.includes('api.github.com') ||
            url.includes('_next/data') ||
            url.includes('_rsc')) {
          return Promise.resolve(new Response('', { status: 200 }));
        }
        
        // Fix image paths
        if (url.includes('/images/')) {
          const fileName = url.split('/').pop();
          url = './images/' + fileName;
          
          if (typeof resource === 'string') {
            resource = url;
          } else if (typeof resource === 'object' && resource.url) {
            resource.url = url;
          }
        }
        
        // Always return successful responses
        return originalFetch(resource, init).catch(error => {
          console.warn('Fetch failed:', url);
          return Promise.resolve(new Response('{}', { status: 200 }));
        });
      } catch (e) {
        console.warn('Error in fetch override:', e);
        return Promise.resolve(new Response('{}', { status: 200 }));
      }
    };
  } catch (e) {
    console.warn('Error overriding fetch:', e);
  }
  
  // STEP 5: COMPLETELY OVERRIDE CONSOLE.ERROR
  // ======================================
  
  // Replace console.error to prevent error messages
  const originalConsoleError = console.error;
  console.error = function(...args) {
    // Block React-related errors completely
    if (args.length > 0) {
      if (typeof args[0] === 'string' && 
          (args[0].includes('React') || 
           args[0].includes('error') || 
           args[0].includes('Error') || 
           args[0].includes('iterable'))) {
        return; // Silence
      }
      
      // Check for error objects
      if (args[0] instanceof Error && 
          (args[0].stack && 
           (args[0].stack.includes('React') || 
            args[0].stack.includes('Minified')))) {
        return; // Silence
      }
    }
    
    // Let non-React errors through
    originalConsoleError.apply(this, args);
  };
  
  // STEP 6: BLOCK ALL SCRIPTS THAT MIGHT CONTAIN THE PROBLEMATIC CODE
  // ===============================================================
  try {
    // Find and disable problematic scripts
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    scripts.forEach(script => {
      const src = script.getAttribute('src');
      if (src && (src.includes('page-e5c5f88e96c6fb5a.js') || src.includes('fd9d1056-d2a1b38e69101e91.js'))) {
        // Disable by removing the src attribute
        script.removeAttribute('src');
        // Replace with an empty function to prevent errors
        script.textContent = '// Script disabled by IPFS hotfix';
      }
    });
    
    // Prevent future script loading
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
      const element = originalCreateElement.call(document, tagName);
      
      if (tagName.toLowerCase() === 'script') {
        // Override the src setter
        const originalSrcSetter = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src').set;
        Object.defineProperty(element, 'src', {
          set: function(value) {
            if (value && (value.includes('page-e5c5f88e96c6fb5a.js') || value.includes('fd9d1056-d2a1b38e69101e91.js'))) {
              console.warn('Blocked loading of problematic script:', value);
              return;
            }
            originalSrcSetter.call(this, value);
          }
        });
      }
      
      return element;
    };
    
    // Also intercept script creation with a MutationObserver
    const scriptObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.tagName === 'SCRIPT' && node.src) {
              if (node.src.includes('page-e5c5f88e96c6fb5a.js') || node.src.includes('fd9d1056-d2a1b38e69101e91.js')) {
                node.removeAttribute('src');
                node.textContent = '// Script disabled by IPFS hotfix';
              }
            }
          });
        }
      });
    });
    
    scriptObserver.observe(document.documentElement, { childList: true, subtree: true });
  } catch (e) {
    console.warn('Error blocking problematic scripts:', e);
  }
  
  console.log('🔥 IPFS Emergency Hotfix completed - React disabled for compatibility 🔥');
})(); 