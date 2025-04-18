// Simple service worker for IPFS compatibility
self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);
  
  // Handle font files
  if (url.pathname.endsWith('.woff2') || url.pathname.endsWith('.woff') || url.pathname.endsWith('.ttf')) {
    event.respondWith(
      fetch('./_next/static/media/' + url.pathname.split('/').pop())
        .catch(function() {
          return fetch('./' + url.pathname.split('/').pop());
        })
    );
    return;
  }
  
  // Fix API redirects
  if (url.pathname.startsWith('/api/api/')) {
    event.respondWith(
      fetch('./api/' + url.pathname.substring('/api/api/'.length))
    );
    return;
  }
  
  // Handle GitHub API
  if (url.pathname.includes('/api/github')) {
    event.respondWith(
      fetch('./api/github/index.json')
        .catch(function() {
          return new Response(JSON.stringify({
            user: { login: "TacitusXI", name: "Ivan Leskov" },
            repos: [],
            contributions: { totalCount: 0, weeks: [] }
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }
  
  // Handle music files
  if (url.pathname.includes('tacitus1.mp3')) {
    event.respondWith(
      fetch('./music/tacitus1.mp3')
        .catch(function() {
          return Response.error();
        })
    );
    return;
  }
  
  // Handle project images
  if (url.pathname.startsWith('/images/')) {
    event.respondWith(
      fetch('./images/' + url.pathname.substring('/images/'.length))
        .catch(function() {
          return Response.error();
        })
    );
    return;
  }
  
  // Fix _next paths
  if (url.pathname.startsWith('/_next/')) {
    event.respondWith(
      fetch('./_next/' + url.pathname.substring('/_next/'.length))
        .catch(function() {
          return fetch(event.request);
        })
    );
    return;
  }
}); 