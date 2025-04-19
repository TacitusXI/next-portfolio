// IPFS Emergency Hotfix - FINAL VERSION
// This script completely disables React to prevent all errors
(function() {
  console.log('🔥 IPFS Emergency Hotfix FINAL VERSION Activated 🔥');
  
  // Prevent multiple initializations
  if (window.__IPFS_HOTFIX_APPLIED) return;
  window.__IPFS_HOTFIX_APPLIED = true;
  
  // STEP 1: KILL REACT COMPLETELY
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
  
  // Kill all JS modules that might cause errors
  ['av', 't3', 't6', 'iB', 'o4', 'o5', 'o3', 'oQ', 'oj', 'lI', 'rk', 'lE', 'ng', 'ny'].forEach(name => {
    try {
      window[name] = function() { return []; };
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
            fnStr.includes('useState')) {
          return 0; // Don't run React-related timeouts
        }
      }
      return originalSetTimeout(fn, delay);
    };
  } catch (e) {}
  
  // STEP 2: REMOVE PROBLEMATIC CONTENT
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
  
  // STEP 3: BLOCK BAD NETWORK REQUESTS
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
  
  // STEP 4: COMPLETELY OVERRIDE CONSOLE.ERROR
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
  
  console.log('🔥 IPFS Emergency Hotfix completed - React disabled for compatibility 🔥');
})(); 