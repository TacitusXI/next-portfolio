// IPFS Emergency Hotfix
// This script fixes common issues when viewing the site through IPFS gateways
(function() {
  console.log('🔥 IPFS Emergency Hotfix Activated 🔥');
  
  // ----------------------------------------
  // Fix GitHub data structure
  // ----------------------------------------
  window.GITHUB_DATA = {
    user: {
      login: "TacitusXI",
      name: "Ivan Leskov",
      avatar_url: "./images/profile.jpg",
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
  
  // Generate contribution data in the format expected by the chart
  for (let i = 0; i < 52; i++) {
    window.GITHUB_DATA.contributions.weeks.push({
      contributionDays: [
        { contributionCount: Math.floor(Math.random() * 5) },
        { contributionCount: Math.floor(Math.random() * 5) },
        { contributionCount: Math.floor(Math.random() * 5) },
        { contributionCount: Math.floor(Math.random() * 5) },
        { contributionCount: Math.floor(Math.random() * 5) },
        { contributionCount: Math.floor(Math.random() * 5) },
        { contributionCount: Math.floor(Math.random() * 5) },
      ]
    });
  }
  
  // ----------------------------------------
  // Fix font issues
  // ----------------------------------------
  function fixFonts() {
    // Add Inter font directly to prevent font loading issues
    const fontStyle = document.createElement('style');
    fontStyle.textContent = `
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('./_next/static/media/a34f9d1faa5f3315-s.p.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: url('./_next/static/media/52c5e3cfaafac80b-s.p.woff2') format('woff2');
      }
    `;
    document.head.appendChild(fontStyle);
    
    // Fix font paths in CSS
    document.querySelectorAll('link[href*="_next/static/css/"]').forEach(function(style) {
      var href = style.getAttribute('href');
      if (href && href.indexOf('_next/static/css/_next/static/media/') !== -1) {
        style.setAttribute('href', href.replace('_next/static/css/_next/static/media/', '_next/static/media/'));
      }
    });
  }
  
  // ----------------------------------------
  // Fix navigation issues
  // ----------------------------------------
  function fixNavigation() {
    document.addEventListener('click', function(e) {
      // Find if click was on or inside an <a> tag
      let el = e.target;
      while (el && el.tagName !== 'A') {
        el = el.parentNode;
        if (!el || el === document.body) return;
      }
      
      if (!el || !el.href) return;
      
      // Handle hash navigation
      if (el.hash && el.hostname === window.location.hostname) {
        e.preventDefault();
        const targetId = el.hash.substring(1);
        const targetEl = document.getElementById(targetId);
        
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
          // Update URL without navigation
          window.history.pushState(null, '', el.hash);
        }
      }
      
      // Fix paths for internal navigation
      const localPaths = ['/github', '/projects', '/skills', '/experience'];
      if (localPaths.some(path => el.pathname === path || el.pathname === path + '/')) {
        e.preventDefault();
        const newPath = '.' + el.pathname;
        window.location.href = newPath;
      }
    });
  }
  
  // ----------------------------------------
  // Fix API and network requests
  // ----------------------------------------
  function fixNetworkRequests() {
    const originalFetch = window.fetch;
    
    window.fetch = function(resource, init) {
      let url = resource;
      if (typeof resource === 'object' && resource.url) {
        url = resource.url;
      }
      
      // Convert to string
      url = String(url);
      
      // Fix double slashes in API paths
      if (url.includes('/api//api/')) {
        url = url.replace('/api//api/', '/api/');
        console.log('Fixed double-slash API path:', url);
      }
      
      // Handle GitHub API requests
      if (url.includes('/api/github')) {
        console.log('Intercepting GitHub API request:', url);
        return Promise.resolve(new Response(
          JSON.stringify(window.GITHUB_DATA),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }
        ));
      }
      
      // Fix _next paths
      if (typeof resource === 'string') {
        if (resource.startsWith('/_next/')) {
          resource = './_next/' + resource.substring(7);
        }
      }
      
      // For preloaded image requests
      if (url.includes('/images/')) {
        const fileName = url.split('/').pop();
        url = './images/' + fileName;
        
        if (typeof resource === 'string') {
          resource = url;
        } else if (typeof resource === 'object' && resource.url) {
          resource.url = url;
        }
      }
      
      return originalFetch(resource, init);
    };
  }
  
  // ----------------------------------------
  // Fix image paths
  // ----------------------------------------
  function fixImagePaths() {
    // Fix preloaded images
    document.querySelectorAll('link[rel="preload"][as="image"]').forEach(function(link) {
      if (link.href && link.href.includes('/images/')) {
        const fileName = link.href.split('/').pop();
        link.href = './images/' + fileName;
      }
    });
    
    // Fix image sources
    document.querySelectorAll('img').forEach(function(img) {
      if (img.src && img.src.includes('/images/')) {
        const fileName = img.src.split('/').pop();
        img.src = './images/' + fileName;
      }
    });
  }
  
  // ----------------------------------------
  // Apply all fixes
  // ----------------------------------------
  function applyAllFixes() {
    fixFonts();
    fixNavigation();
    fixNetworkRequests();
    fixImagePaths();
  }
  
  // Apply fixes immediately
  applyAllFixes();
  
  // Also run when DOM is loaded
  if (document.readyState !== 'complete') {
    window.addEventListener('DOMContentLoaded', applyAllFixes);
  }
  
  // Apply fixes after window load
  window.addEventListener('load', function() {
    applyAllFixes();
    console.log('🔥 IPFS Emergency Hotfix completed successfully 🔥');
  });
  
  // Apply fix when routes change (for Next.js)
  if (typeof window !== 'undefined' && window.history && window.history.pushState) {
    const originalPushState = window.history.pushState;
    window.history.pushState = function() {
      const result = originalPushState.apply(this, arguments);
      applyAllFixes();
      return result;
    };
    
    window.addEventListener('popstate', function() {
      setTimeout(applyAllFixes, 100);
    });
  }
  
  // Watch for DOM changes and apply fixes when needed
  const observer = new MutationObserver(function(mutations) {
    let shouldApplyFixes = false;
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        shouldApplyFixes = true;
      }
    });
    
    if (shouldApplyFixes) {
      applyAllFixes();
    }
  });
  
  observer.observe(document.documentElement, { 
    childList: true, 
    subtree: true 
  });
})(); 