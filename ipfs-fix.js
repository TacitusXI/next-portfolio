// Simple IPFS Asset Path Fixer
(function() {
  // ------------------------------------------
  // Very simple font file fix
  // ------------------------------------------
  function fixFonts() {
    // A more aggressive font loading approach
    console.log('Applying aggressive font fix');
    
    // 1. Remove problematic font CSS that might be causing redirects
    document.querySelectorAll('style').forEach(function(style) {
      if (style.textContent.includes('@font-face') && style.textContent.includes('url(')) {
        // Store original for reference
        const original = style.textContent;
        
        // Attempt to extract font-family names to reuse
        const fontFamilyMatch = original.match(/font-family:\s*['"]([^'"]+)['"]/);
        const fontFamily = fontFamilyMatch ? fontFamilyMatch[1] : 'Inter var';
        
        // Create a simplified font face definition
        const simplifiedFontCSS = `
          @font-face {
            font-family: '${fontFamily}';
            font-style: normal;
            font-weight: 100 900;
            font-display: swap;
            src: url('./_next/static/media/a34f9d1faa5f3315-s.p.woff2') format('woff2');
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
          }
        `;
        
        // Replace complex font loading with simplified version
        style.textContent = style.textContent.replace(
          /@font-face\s*\{[^}]*url\([^)]+\)[^}]*\}/g, 
          simplifiedFontCSS
        );
      }
    });

    // 2. Inject additional style tag with direct font paths
    const additionalFontStyle = document.createElement('style');
    additionalFontStyle.textContent = `
      @font-face {
        font-family: 'Inter var';
        font-style: normal;
        font-weight: 100 900;
        font-display: swap;
        src: url('./_next/static/media/a34f9d1faa5f3315-s.p.woff2') format('woff2');
      }
    `;
    document.head.appendChild(additionalFontStyle);

    // 3. Try multiple font locations with preload
    const fontLocations = [
      './_next/static/media/a34f9d1faa5f3315-s.p.woff2',
      './a34f9d1faa5f3315-s.p.woff2',
      './_next/a34f9d1faa5f3315-s.p.woff2'
    ];
    
    fontLocations.forEach(function(location) {
      var fontLink = document.createElement('link');
      fontLink.rel = 'preload';
      fontLink.href = location;
      fontLink.as = 'font';
      fontLink.type = 'font/woff2';
      fontLink.setAttribute('crossorigin', 'anonymous');
      document.head.appendChild(fontLink);
    });
    
    // 4. Create fallback font style to prevent layout shifts if font fails to load
    const fallbackStyle = document.createElement('style');
    fallbackStyle.textContent = `
      body {
        font-family: 'Inter var', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      }
    `;
    document.head.appendChild(fallbackStyle);
    
    // Fix font paths in CSS for links
    document.querySelectorAll('link[href*="_next/static/css/"]').forEach(function(link) {
      var href = link.getAttribute('href');
      if (href && href.indexOf('_next/static/css/_next/static/media/') !== -1) {
        link.setAttribute('href', href.replace('_next/static/css/_next/static/media/', '_next/static/media/'));
      }
    });
    
    // Fix font references in style tags
    document.querySelectorAll('style').forEach(function(style) {
      if (style.textContent.indexOf('@font-face') !== -1 || style.textContent.indexOf('url(') !== -1) {
        var css = style.textContent;
        // Fix absolute paths - using unescaped regex
        css = css.replace(/url\(["']?\/_next\//g, 'url("./_next/');
        // Fix nested paths
        css = css.replace(/_next\/static\/css\/_next\/static\/media\//g, '_next/static/media/');
        style.textContent = css;
      }
    });
  }

  // ------------------------------------------
  // Simple path correction for assets
  // ------------------------------------------
  function fixAllPaths() {
    // Fix images
    document.querySelectorAll('img').forEach(function(img) {
      if (img.src.indexOf('/images/') !== -1) {
        img.src = './images/' + img.src.split('/images/').pop();
      }
    });
    
    // Fix all links
    document.querySelectorAll('a').forEach(function(a) {
      // Extract hostname and pathname from link
      var href = a.getAttribute('href');
      if (!href) return;
      
      // Handle absolute URLs 
      if (href.startsWith('http')) {
        try {
          var url = new URL(href);
          
          // Fix IPFS gateway links
          if (url.hostname === 'ipfs.io' || url.hostname === 'ipfs.tech') {
            // Instead of redirecting to IPFS, keep within our site
            // If it's a fragment/hash link to another section
            if (url.pathname === '/' && url.hash) {
              a.href = url.hash; // Just use the hash part for local navigation
            } else {
              // If it has a path, make it relative to our site
              a.href = '.' + url.pathname + url.hash;
            }
          }
        } catch (e) {
          console.error('Error fixing link:', href, e);
        }
      }
      
      // Fix internal navigation links that might be causing redirects
      if (href.startsWith('/') && !href.startsWith('/_next/') && !href.startsWith('/api/')) {
        a.href = '.' + href;
      }
      
      // Prevent hash links from navigating to external sites
      if (href.startsWith('#')) {
        // Ensure hash links stay within the page
        a.addEventListener('click', function(e) {
          e.preventDefault();
          var targetId = href.substring(1);
          var targetElement = document.getElementById(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }
          // Update URL hash without navigation
          window.history.pushState(null, '', href);
        });
      }
    });
    
    // Fix all scripts and styles with src/href
    document.querySelectorAll('[src], [href]').forEach(function(el) {
      var attr = el.hasAttribute('src') ? 'src' : 'href';
      var val = el.getAttribute(attr);
      
      if (val) {
        // Fix absolute _next paths
        if (val.startsWith('/_next/')) {
          el.setAttribute(attr, './_next/' + val.substring(7));
        }
        
        // Fix IPFS gateway URLs
        if (val.indexOf('https://ipfs.io/_next/') !== -1) {
          el.setAttribute(attr, './_next/' + val.split('/_next/')[1]);
        }
        
        // Fix IPFS CID URLs
        if (val.indexOf('/ipfs/') !== -1 && val.indexOf('/_next/') !== -1) {
          el.setAttribute(attr, './_next/' + val.split('/_next/')[1]);
        }
      }
    });
    
    // Fix background images - fixed regex
    document.querySelectorAll('[style*="background"]').forEach(function(el) {
      if (el.style.backgroundImage && el.style.backgroundImage.indexOf('/images/') !== -1) {
        var urlMatch = el.style.backgroundImage.match(/url\(['"]?([^'"\)]+)['"]?\)/);
        if (urlMatch && urlMatch[1]) {
          var imgPath = urlMatch[1];
          if (imgPath.startsWith('/images/')) {
            el.style.backgroundImage = 'url("./images/' + imgPath.substring(8) + '")';
          }
        }
      }
    });
  }
  
  // ------------------------------------------
  // Fix API endpoints and prevent redirect loops
  // ------------------------------------------
  function fixApiEndpoints() {
    // Prevent API redirect loops
    if (window.location.pathname.indexOf('/api/api/') !== -1) {
      window.location.pathname = window.location.pathname.replace('/api/api/', '/api/');
      return;
    }
    
    // Provide default data to prevent "m is not iterable" error
    if (!window.GITHUB_DATA) {
      // Static GitHub API data
      window.GITHUB_DATA = {
        user: {
          login: "TacitusXI",
          name: "Ivan Leskov",
          avatar_url: "./profile.jpg",
          html_url: "https://github.com/TacitusXI",
          public_repos: 20,
          followers: 5,
          following: 10
        },
        repos: [
          {
            name: "next-portfolio",
            html_url: "https://github.com/TacitusXI/next-portfolio",
            description: "Personal portfolio website built with Next.js",
            stargazers_count: 5,
            forks_count: 2,
            language: "TypeScript"
          },
          {
            name: "blockchain-projects",
            html_url: "https://github.com/TacitusXI/blockchain-projects",
            description: "Collection of blockchain and Web3 projects",
            stargazers_count: 12,
            forks_count: 4,
            language: "Solidity"
          },
          {
            name: "smart-contracts",
            html_url: "https://github.com/TacitusXI/smart-contracts",
            description: "EVM-compatible smart contract templates and examples",
            stargazers_count: 8,
            forks_count: 3,
            language: "Solidity"
          }
        ],
        contributions: {
          totalCount: 650,
          weeks: []
        }
      };
      
      // Generate weeks data as an array to fix "not iterable" error
      window.GITHUB_DATA.contributions.weeks = [];
      for (var i = 0; i < 52; i++) {
        window.GITHUB_DATA.contributions.weeks.push({
          count: Math.floor(Math.random() * 10)
        });
      }
    }
    
    // Override fetch for GitHub API
    var originalFetch = window.fetch;
    window.fetch = function(resource, init) {
      var url = resource;
      if (typeof resource === 'object' && resource.url) {
        url = resource.url;
      }
      
      // Convert to string
      url = String(url);
      
      // Handle GitHub API requests
      if (url.indexOf('/api/github') !== -1) {
        return Promise.resolve(new Response(
          JSON.stringify(window.GITHUB_DATA),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }
        ));
      }
      
      // Handle RSC requests
      if (url.indexOf('?_rsc=') !== -1) {
        return Promise.resolve(new Response(
          'OK',
          {
            status: 200,
            headers: { 'Content-Type': 'text/plain' }
          }
        ));
      }
      
      // Fix paths for other requests
      if (typeof resource === 'string') {
        if (resource.startsWith('/_next/')) {
          resource = './_next/' + resource.substring(7);
        } else if (resource.indexOf('/ipfs/') !== -1 && resource.indexOf('/_next/') !== -1) {
          resource = './_next/' + resource.split('/_next/')[1];
        }
      }
      
      return originalFetch(resource, init);
    };
  }
  
  // ------------------------------------------
  // Fix music player
  // ------------------------------------------
  function fixMusicPlayer() {
    document.querySelectorAll('audio, [src*=".mp3"], [src*=".wav"], [src*=".ogg"]').forEach(function(audio) {
      if (audio.src && audio.src.indexOf('music') !== -1) {
        var filename = audio.src.substring(audio.src.lastIndexOf('/') + 1);
        audio.src = './music/' + filename;
      }
      
      if (audio.src && audio.src.indexOf('tacitus1.mp3') !== -1) {
        audio.src = './music/tacitus1.mp3';
      }
    });
  }
  
  // ------------------------------------------
  // Initialize fixes
  // ------------------------------------------
  // Run fixes immediately
  fixFonts();
  fixAllPaths();
  fixApiEndpoints();
  fixMusicPlayer();
  
  // Also run after load
  window.addEventListener('load', function() {
    fixFonts();
    fixAllPaths();
    fixMusicPlayer();
  });
  
  // Watch for DOM changes
  var observer = new MutationObserver(function(mutations) {
    var shouldFix = false;
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        shouldFix = true;
      }
    });
    
    if (shouldFix) {
      fixAllPaths();
      fixMusicPlayer();
    }
  });
  
  observer.observe(document.documentElement, { childList: true, subtree: true });
  
  // Add simple service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('./ipfs-sw.js').catch(function(err) {
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }
  
  console.log('IPFS fixes applied');
})(); 