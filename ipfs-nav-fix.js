// IPFS Navigation Fix - Must be included in <head> before other scripts
(function() {
  // This function runs immediately when included in the page
  function fixNavigation() {
    // Check if we're on IPFS
    const isIPFS = window.location.hostname === 'ipfs.io' || 
                   window.location.hostname === 'ipfs.tech' ||
                   window.location.hostname.includes('ipfs');
    
    if (!isIPFS) return; // Only apply fixes on IPFS

    // Intercept all link clicks on the page
    document.addEventListener('click', function(e) {
      // Find if click was on or inside an <a> tag
      let el = e.target;
      while (el && el.tagName !== 'A') {
        el = el.parentNode;
        if (!el || el === document.body) return;
      }
      
      if (!el || !el.href) return;
      
      // For navigation links
      const navPaths = ['/github', '/projects', '/skills', '/experience'];
      const url = new URL(el.href);
      
      // If it's one of our nav links
      if (navPaths.includes(url.pathname) || 
          navPaths.some(path => url.pathname.startsWith(path + '/'))) {
        e.preventDefault(); // Stop the default navigation
        
        // Rewrite to a relative path
        const newPath = '.' + url.pathname;
        console.log('Redirecting navigation to:', newPath);
        window.location.href = newPath;
        return;
      }
      
      // For hash navigation within IPFS site
      if (url.hostname === 'ipfs.io' || url.hostname === 'ipfs.tech') {
        if (url.hash && (url.pathname === '/' || url.pathname === '')) {
          e.preventDefault();
          
          // Extract the target ID from the hash
          const targetId = url.hash.substring(1);
          const targetEl = document.getElementById(targetId);
          
          if (targetEl) {
            // Smooth scroll to element
            targetEl.scrollIntoView({ behavior: 'smooth' });
          } else {
            // Keep us on our site instead of going to ipfs.tech
            window.location.href = '.' + (url.pathname === '/' ? '' : url.pathname) + url.hash;
          }
        }
      }
    }, true); // Use capture to catch events before they reach their targets
  }
  
  // Run immediately and also after DOM is loaded
  fixNavigation();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixNavigation);
  }
  
  // Also reapply when window loads
  window.addEventListener('load', fixNavigation);
})(); 