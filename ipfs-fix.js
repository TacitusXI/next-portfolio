// Simple IPFS Asset Path Fixer
(function() {
  // ------------------------------------------
  // Very simple font file fix
  // ------------------------------------------
  function fixFonts() {
    // Fix font paths in CSS
    document.querySelectorAll('link[href*="_next/static/css/"]').forEach(function(link) {
      var href = link.getAttribute('href');
      if (href && href.indexOf('_next/static/css/_next/static/media/') !== -1) {
        link.setAttribute('href', href.replace('_next/static/css/_next/static/media/', '_next/static/media/'));
      }
    });

    // Preload the problematic font file directly
    var fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = './_next/static/media/a34f9d1faa5f3315-s.p.woff2';
    fontLink.as = 'font';
    fontLink.type = 'font/woff2';
    fontLink.setAttribute('crossorigin', 'anonymous');
    document.head.appendChild(fontLink);
    
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
      if (a.href.indexOf('ipfs.io') !== -1 || a.href.indexOf('ipfs.tech') !== -1) {
        var url = new URL(a.href);
        a.href = '.' + url.pathname;
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
    
    // Generate weeks data
    for (var i = 0; i < 52; i++) {
      window.GITHUB_DATA.contributions.weeks.push({
        count: Math.floor(Math.random() * 10)
      });
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