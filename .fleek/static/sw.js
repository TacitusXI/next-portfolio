
  // Service worker to intercept font requests
  self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Handle font files with problematic paths
    if (url.pathname.includes('_next/static/css/_next/static/media') && 
        (url.pathname.endsWith('.woff2') || url.pathname.endsWith('.woff') || url.pathname.endsWith('.ttf'))) {
      
      // Redirect to correct path
      const correctPath = url.pathname.replace('/_next/static/css/_next/static/media/', '/_next/static/media/');
      const newUrl = new URL(correctPath, url.origin);
      
      event.respondWith(
        fetch(newUrl)
          .catch(() => fetch('./_next/static/media/' + url.pathname.split('/').pop()))
      );
      return;
    }
    
    // Handle API redirects
    if (url.pathname.startsWith('/api/api/')) {
      const correctPath = url.pathname.replace('/api/api/', '/api/');
      const newUrl = new URL(correctPath, url.origin);
      
      event.respondWith(fetch(newUrl));
      return;
    }
  });
  