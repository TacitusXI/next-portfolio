
  // IPFS Asset Path Fixer
  (function() {
    // Function to fix asset URLs
    function fixAssetUrl(url) {
      if (typeof url !== 'string') return url;
      
      // Fix nested _next paths first
      if (url.indexOf('/_next/') !== -1 && url.indexOf('/_next/', url.indexOf('/_next/') + 7) !== -1) {
        // Use string methods instead of regex where possible
        const firstNextIndex = url.indexOf('/_next/');
        const secondNextIndex = url.indexOf('/_next/', firstNextIndex + 7);
        if (secondNextIndex !== -1) {
          url = url.substring(0, secondNextIndex) + '/' + url.substring(secondNextIndex + 7);
        }
      }
      
      // Handle direct /_next/ URLs
      if (url.startsWith('/_next/')) {
        return './_next/' + url.substring(7);
      }
      
      // Handle https://ipfs.io/_next/
      if (url.startsWith('https://ipfs.io/_next/')) {
        return './_next/' + url.substring(19);
      }
      
      // Handle https://ipfs.io/ipfs/<CID>/_next/
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
      
      // Handle image paths
      if (url.startsWith('/images/')) {
        return './images/' + url.substring(8);
      }
      
      if (url === '/profile.jpg') {
        return './profile.jpg';
      }
      
      // Handle API requests
      if (url.startsWith('/api/')) {
        return './api/' + url.substring(5);
      }
      
      if (url.indexOf('/api/github') !== -1) {
        return './api/github/index.json';
      }
      
      // Handle RSC requests
      if (url.indexOf('?_rsc=') !== -1) {
        return './index.txt?_rsc=' + url.split('?_rsc=')[1];
      }
      
      return url;
    }

    // Override fetch with error handling
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
      if (arguments.length >= 1) {
        const origUrl = arguments[0];
        // Check if origUrl is a string before using string methods
        const isString = typeof origUrl === 'string';
        
        // Only proceed with URL fixing if it's a string
        if (isString) {
          arguments[0] = fixAssetUrl(arguments[0]);
          
          // Special handling for GitHub API or RSC requests that might fail
          if (origUrl.indexOf('/api/github') !== -1 || origUrl.indexOf('?_rsc=') !== -1) {
            return originalFetch.apply(this, arguments).catch(err => {
              console.warn('Fetch error, falling back to static data:', err);
              // For GitHub API, return static data
              if (origUrl.indexOf('/api/github') !== -1) {
                return new Response(JSON.stringify({
                  user: { login: "TacitusXI", name: "Ivan Leskov" },
                  repos: [],
                  contributions: { totalCount: 0, weeks: [] }
                }), {
                  status: 200,
                  headers: { 'Content-Type': 'application/json' }
                });
              }
              // For RSC requests, return basic data
              if (origUrl.indexOf('?_rsc=') !== -1) {
                return new Response('OK', {
                  status: 200,
                  headers: { 'Content-Type': 'text/plain' }
                });
              }
              throw err;
            });
          }
        } else if (origUrl instanceof Request) {
          // Handle Request objects
          const requestUrl = origUrl.url;
          const fixedUrl = fixAssetUrl(requestUrl);
          
          if (fixedUrl !== requestUrl) {
            // Create a new Request with the fixed URL
            arguments[0] = new Request(fixedUrl, origUrl);
          }
        }
      }
      return originalFetch.apply(this, arguments);
    };

    // Fix all elements with src or href
    function fixAllElements() {
      // Fix font and media paths - special case for nested paths
      document.querySelectorAll('[href*="_next/static/css/_next/"]').forEach(el => {
        const href = el.getAttribute('href');
        const fixedHref = href.replace(/_next/static/css/_next/static/media//g, '_next/static/media/');
        el.setAttribute('href', fixedHref);
      });
      
      // Fix preloaded fonts
      document.querySelectorAll('link[rel="preload"][as="font"]').forEach(el => {
        if (el.href.indexOf('/_next/') !== -1) {
          el.href = './' + el.href.substring(el.href.indexOf('_next/'));
        } else if (el.href.indexOf('https://ipfs.io/ipfs/') !== -1 && el.href.indexOf('/_next/') !== -1) {
          const parts = el.href.split('/_next/');
          if (parts.length > 1) {
            el.href = './_next/' + parts[1];
          }
        }
      });

      // Fix images from public directory
      document.querySelectorAll('img[src^="/images/"]').forEach(el => {
        el.src = './images/' + el.src.substring(el.src.indexOf('/images/') + 8);
      });
      
      document.querySelectorAll('img[src="/profile.jpg"]').forEach(el => {
        el.src = './profile.jpg';
      });

      // Fix paths with /_next/
      document.querySelectorAll('[src^="/_next/"], [href^="/_next/"]').forEach(el => {
        const attr = el.hasAttribute('src') ? 'src' : 'href';
        const value = el.getAttribute(attr);
        el.setAttribute(attr, './' + value.substring(1));
      });
      
      // Fix IPFS paths
      document.querySelectorAll('[src^="https://ipfs.io/_next/"], [href^="https://ipfs.io/_next/"]').forEach(el => {
        const attr = el.hasAttribute('src') ? 'src' : 'href';
        const value = el.getAttribute(attr);
        el.setAttribute(attr, './_next/' + value.split('/_next/')[1]);
      });

      // Handle full IPFS gateway URLs with CIDs
      document.querySelectorAll('[src*="ipfs.io/ipfs/"][src*="/_next/"], [href*="ipfs.io/ipfs/"][href*="/_next/"]').forEach(el => {
        const attr = el.hasAttribute('src') ? 'src' : 'href';
        const value = el.getAttribute(attr);
        const parts = value.split('/_next/');
        if (parts.length > 1) {
          el.setAttribute(attr, './_next/' + parts[1]);
        }
      });

      // Fix project images
      document.querySelectorAll('img[data-project-image]').forEach(el => {
        if (el.src.indexOf('/images/projects/') !== -1) {
          el.src = './images/projects/' + el.src.split('/images/projects/')[1];
        }
      });

      // Fix API duplications (prevents ERR_TOO_MANY_REDIRECTS)
      if (window.location.href.indexOf('/api/api/') !== -1) {
        // Replace all links pointing to /api/api/ with /api/
        document.querySelectorAll('a[href*="/api/api/"]').forEach(el => {
          el.href = el.href.replace('/api/api/', '/api/');
        });
        
        // If we're on a duplicated API path, redirect
        if (window.location.pathname.indexOf('/api/api/') === 0) {
          window.location.pathname = window.location.pathname.replace('/api/api/', '/api/');
        }
      }
    }
    
    // Run immediately and again after load
    fixAllElements();
    window.addEventListener('load', fixAllElements);
    
    // Add a MutationObserver to catch dynamically added elements
    const observer = new MutationObserver(mutations => {
      let shouldFix = false;
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldFix = true;
        }
      });
      
      if (shouldFix) {
        fixAllElements();
      }
    });
    
    observer.observe(document.documentElement, { 
      childList: true, 
      subtree: true 
    });
  })();
  