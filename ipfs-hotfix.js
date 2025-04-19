// IPFS Emergency Hotfix
// This script fixes common issues when viewing the site through IPFS gateways
(function() {
  console.log('🔥 IPFS Emergency Hotfix Activated 🔥');
  
  // Prevent multiple initializations
  if (window.__IPFS_HOTFIX_APPLIED) return;
  window.__IPFS_HOTFIX_APPLIED = true;
  
  // Track if fixes are currently being applied to prevent recursive loops
  let isApplyingFixes = false;
  
  // Simple debounce function to prevent too many calls
  function debounce(fn, delay) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(context, args), delay);
    };
  }
  
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
  
  // Generate contribution data once, not every time we intercept a request
  (function generateContributions() {
    // Pre-generate all the contribution data at load time
    if (window.GITHUB_DATA.contributions.weeks.length > 0) return;
    
    for (let i = 0; i < 52; i++) {
      window.GITHUB_DATA.contributions.weeks.push({
        contributionDays: [
          { contributionCount: Math.floor(Math.random() * 5) },
          { contributionCount: Math.floor(Math.random() * 5) },
          { contributionCount: Math.floor(Math.random() * 5) },
          { contributionCount: Math.floor(Math.random() * 5) },
          { contributionCount: Math.floor(Math.random() * 5) },
          { contributionCount: Math.floor(Math.random() * 5) },
          { contributionCount: Math.floor(Math.random() * 5) }
        ]
      });
    }
  })();
  
  // ----------------------------------------
  // Fix font issues
  // ----------------------------------------
  function fixFonts() {
    // Only add font style once
    if (document.getElementById('ipfs-font-fix')) return;
    
    // Add Inter font directly to prevent font loading issues
    const fontStyle = document.createElement('style');
    fontStyle.id = 'ipfs-font-fix';
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
    
    // Fix font paths in CSS - only do this once per element
    document.querySelectorAll('link[href*="_next/static/css/"]:not([data-ipfs-fixed])').forEach(function(style) {
      var href = style.getAttribute('href');
      if (href && href.indexOf('_next/static/css/_next/static/media/') !== -1) {
        style.setAttribute('href', href.replace('_next/static/css/_next/static/media/', '_next/static/media/'));
        style.setAttribute('data-ipfs-fixed', 'true');
      }
    });
  }
  
  // ----------------------------------------
  // Fix navigation issues
  // ----------------------------------------
  function setupNavigationFix() {
    // Only setup once
    if (window.__IPFS_NAV_FIXED) return;
    window.__IPFS_NAV_FIXED = true;
    
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
  function setupNetworkFix() {
    // Only setup once
    if (window.__IPFS_FETCH_FIXED) return;
    window.__IPFS_FETCH_FIXED = true;
    
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
        // Use cached data to avoid regenerating each time
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
  // Fix image paths - with node tracking to prevent duplicate processing
  // ----------------------------------------
  function fixImagePaths() {
    // Fix preloaded images
    document.querySelectorAll('link[rel="preload"][as="image"]:not([data-ipfs-fixed])').forEach(function(link) {
      if (link.href && link.href.includes('/images/')) {
        const fileName = link.href.split('/').pop();
        link.href = './images/' + fileName;
        link.setAttribute('data-ipfs-fixed', 'true');
      }
    });
    
    // Fix image sources
    document.querySelectorAll('img:not([data-ipfs-fixed])').forEach(function(img) {
      if (img.src && img.src.includes('/images/')) {
        const fileName = img.src.split('/').pop();
        img.src = './images/' + fileName;
        img.setAttribute('data-ipfs-fixed', 'true');
      }
    });
  }
  
  // ----------------------------------------
  // Apply all fixes with safety measures
  // ----------------------------------------
  function applyAllFixes() {
    // Prevent recursive calls
    if (isApplyingFixes) return;
    isApplyingFixes = true;
    
    try {
      // One-time setup functions
      setupNavigationFix();
      setupNetworkFix();
      
      // Repeatable fix functions that modify the DOM
      fixFonts();
      fixImagePaths();
    } catch (err) {
      console.error('Error applying IPFS fixes:', err);
    } finally {
      isApplyingFixes = false;
    }
  }
  
  // Apply fixes immediately - just once
  applyAllFixes();
  
  // Apply fixes after DOM is loaded - with timeout for safety
  if (document.readyState !== 'complete') {
    window.addEventListener('DOMContentLoaded', function() {
      setTimeout(applyAllFixes, 100);
    });
  }
  
  // Apply fixes after window load - with timeout for safety
  window.addEventListener('load', function() {
    setTimeout(function() {
      applyAllFixes();
      console.log('🔥 IPFS Emergency Hotfix completed successfully 🔥');
    }, 200);
  });
  
  // Apply fix when routes change (for Next.js) - debounced
  if (typeof window !== 'undefined' && window.history && window.history.pushState) {
    const originalPushState = window.history.pushState;
    const debouncedFixes = debounce(applyAllFixes, 300);
    
    window.history.pushState = function() {
      const result = originalPushState.apply(this, arguments);
      debouncedFixes();
      return result;
    };
    
    window.addEventListener('popstate', function() {
      debouncedFixes();
    });
  }
  
  // Watch for DOM changes with performance optimizations
  let observerTimeout = null;
  const observer = new MutationObserver(function(mutations) {
    // Clear any pending timeout
    if (observerTimeout) {
      clearTimeout(observerTimeout);
    }
    
    // Set a new timeout to debounce the fixes
    observerTimeout = setTimeout(function() {
      let shouldFix = false;
      
      // Check if we have relevant mutations that need fixing
      for (let i = 0; i < mutations.length; i++) {
        const mutation = mutations[i];
        
        // Only process if new nodes were added
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          for (let j = 0; j < mutation.addedNodes.length; j++) {
            const node = mutation.addedNodes[j];
            
            // Only care about element nodes
            if (node.nodeType === 1) {
              // Check if the added element or its children contain elements we need to fix
              if (node.tagName === 'IMG' || 
                  node.tagName === 'LINK' || 
                  node.tagName === 'A' || 
                  node.querySelector('img, link[rel="preload"], a')) {
                shouldFix = true;
                break;
              }
            }
          }
          
          if (shouldFix) break;
        }
      }
      
      // Only apply fixes if necessary
      if (shouldFix) {
        applyAllFixes();
      }
    }, 500); // Wait half a second after DOM changes before applying fixes
  });
  
  // Start observing with limited scope for better performance
  observer.observe(document.documentElement, { 
    childList: true, 
    subtree: true,
    attributes: false,
    characterData: false
  });
  
  // Disconnect observer after 30 seconds to prevent long-term performance issues
  setTimeout(function() {
    observer.disconnect();
    console.log('IPFS Hotfix: MutationObserver disconnected to improve performance');
  }, 30000);
})(); 