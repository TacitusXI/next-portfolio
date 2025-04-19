const fs = require('fs');
const path = require('path');

// Configuration
const outputDir = './out';

// Function to recursively find all HTML files
const findHtmlFiles = (dir) => {
  let results = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      results = results.concat(findHtmlFiles(fullPath));
    } else if (item.endsWith('.html')) {
      results.push(fullPath);
    } else if (item.endsWith('.js') || item.endsWith('.css')) {
      // Also process JS and CSS files
      results.push(fullPath);
    }
  }
  
  return results;
};

// Function to fix asset paths in files
const fixAssetPaths = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  const fileExt = path.extname(filePath);
  
  // Fix different path patterns
  if (fileExt === '.html' || fileExt === '.js' || fileExt === '.css') {
    // Fix nested _next paths first (important to do this before other replacements)
    content = content.replace(/(\/_next\/[^"']*?)(\/_next\/)/g, '$1/');
    content = content.replace(/(_next\/[^"']*?)(_next\/)/g, '$1');
    
    // Fix all /_next/ paths (important: must be first to catch most patterns)
    content = content.replace(/(\"|\'|\`|\(|\s|=)(\/\_next\/)/g, '$1./_next/');
    
    // Fix https://ipfs.io/_next/ paths
    content = content.replace(/(https:\/\/ipfs\.io)(\/\_next\/)/g, '.$2');
    
    // Fix https://ipfs.tech/_next/ paths
    content = content.replace(/(https:\/\/ipfs\.tech)(\/\_next\/)/g, '.$2');
    
    // Fix ipfs.io IPFS gateways with CIDs
    content = content.replace(/(https:\/\/ipfs\.io\/ipfs\/[a-zA-Z0-9]+)(\/\_next\/)/g, '.$2');
    
    // Fix other known IPFS gateway patterns
    content = content.replace(/(https:\/\/[a-zA-Z0-9\.\-]+\.on-fleek\.app)(\/\_next\/)/g, '.$2');
    
    // Fix asset preloading
    content = content.replace(/(as=\\?"(script|style|font|image)\\?".*?href=\\?")(\/\_next\/)/g, '$1./_next/');
    
    // Fix any remaining absolute paths to _next that weren't caught
    content = content.replace(/([^\."])(\/\_next\/)/g, '$1./_next/');
    
    // Special case for JSON data
    content = content.replace(/"(\/\_next\/[^"]+)"/g, '"./_next/$1"');
    
    // Fix API references
    content = content.replace(/(['"])(\/api\/[^'"]*?)(['"])/g, '$1./api/$2$3');
    content = content.replace(/(https:\/\/ipfs\.tech\/api\/github)/g, './api/github');
    content = content.replace(/(https:\/\/ipfs\.io\/api\/github)/g, './api/github');
    
    // Fix RSC requests
    content = content.replace(/(['"])(\/\?_rsc=[^'"]*?)(['"])/g, '$1./$2$3');
    content = content.replace(/(https:\/\/ipfs\.tech\/index\.txt\?_rsc=)/g, './index.txt?_rsc=');
    content = content.replace(/(https:\/\/ipfs\.io\/index\.txt\?_rsc=)/g, './index.txt?_rsc=');
    
    // Fix image paths in public directory
    content = content.replace(/(src=["'])(\/images\/)/g, '$1./images/');
    content = content.replace(/(src=["'])(\/profile\.jpg)/g, '$1./profile.jpg');
    
    // Fix preloaded fonts that have nested paths
    content = content.replace(/(href=["'][^"']*?\/_next\/static\/media\/[^"']+\.)(woff2|woff|ttf)(["'])/g, 
      '$1$2$3 onerror="this.onerror=null; this.href=this.href.replace(\'/_next/\', \'./_next/\')"');
  }
  
  // Write fixed content back to file
  fs.writeFileSync(filePath, content);
  console.log(`Fixed asset paths in ${filePath}`);
};

// Function to create a static API endpoint for GitHub data
const createStaticApiEndpoints = () => {
  console.log('Creating static API endpoints');
  
  // Create directory structure
  const apiDir = path.join(outputDir, 'api');
  const githubApiDir = path.join(apiDir, 'github');
  
  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir);
  }
  
  if (!fs.existsSync(githubApiDir)) {
    fs.mkdirSync(githubApiDir);
  }
  
  // Create a static GitHub API response
  const staticGithubData = {
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
      weeks: Array.from({ length: 52 }, () => ({
        count: Math.floor(Math.random() * 10)
      }))
    }
  };
  
  // Write the static data to the API endpoint
  fs.writeFileSync(path.join(githubApiDir, 'index.html'), JSON.stringify(staticGithubData));
  fs.writeFileSync(path.join(githubApiDir, 'index.json'), JSON.stringify(staticGithubData));
  
  // Create a .json file in the root directory for RSC compatibility
  fs.writeFileSync(path.join(outputDir, 'index.txt'), 'OK');
  
  console.log('Created static API endpoints');
};

// Function to create an _ipfs directory with fixes
const createIpfsCompatibleFiles = () => {
  console.log('Creating client-side IPFS fix script');
  
  // Create an extremely simplified fix script that avoids complex JavaScript patterns
  const fixScript = `
  // Simple IPFS Asset Path Fixer
  (function() {
    // ------------------------------------------
    // Very simple font file fix
    // ------------------------------------------
    function fixFonts() {
      // Fix font paths in CSS
      document.querySelectorAll('link[href*="_next/static/css/"]').forEach(function(style) {
        var href = style.getAttribute('href');
        if (href && href.indexOf('_next/static/css/_next/static/media/') !== -1) {
          style.setAttribute('href', href.replace('_next/static/css/_next/static/media/', '_next/static/media/'));
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
          // Fix absolute paths
          css = css.replace(/url\\(["']?\\/_next\\//g, 'url("./_next/');
          // Fix nested paths
          css = css.replace(/_next\\/static\\/css\\/_next\\/static\\/media\\//g, '_next/static/media/');
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
      
      // Fix background images
      document.querySelectorAll('[style*="background"]').forEach(function(el) {
        if (el.style.backgroundImage && el.style.backgroundImage.indexOf('/images/') !== -1) {
          var urlMatch = el.style.backgroundImage.match(/url\\(["']?([^'"\\)]+)["']?\\)/);
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
  `;
  
  // Save the fix script to a file
  fs.writeFileSync(path.join(outputDir, '_ipfs-fixes.js'), fixScript);
  
  // Copy the more advanced IPFS hotfix script
  fs.copyFileSync('ipfs-hotfix-final.js', path.join(outputDir, 'ipfs-hotfix-final.js'));
  console.log('Copied ipfs-hotfix-final.js to output directory');
  
  const ipfsDir = path.join(outputDir, '_ipfs');
  if (!fs.existsSync(ipfsDir)) {
    fs.mkdirSync(ipfsDir);
  }
  
  fs.writeFileSync(path.join(ipfsDir, 'ipfs-fix.js'), fixScript);
  console.log('Created simplified IPFS fix script at _ipfs/ipfs-fix.js');
  
  // Creating a dedicated navigation fix script
  const navFixScript = `
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
  `;
  
  fs.writeFileSync(path.join(ipfsDir, 'ipfs-nav-fix.js'), navFixScript);
  console.log('Created IPFS navigation fix script at _ipfs/ipfs-nav-fix.js');
  
  // Create a very simple service worker that just handles the critical paths
  const serviceWorkerCode = `
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
    
    // Handle navigation requests to prevent redirects to ipfs.tech
    if (url.hostname === 'ipfs.io' || url.hostname === 'ipfs.tech') {
      // For navigation to /github or other internal pages
      const pathsToIntercept = ['/github', '/projects', '/skills', '/experience'];
      
      for (const navPath of pathsToIntercept) {
        if (url.pathname === navPath || url.pathname === navPath + '/') {
          event.respondWith(
            fetch('./' + navPath.substring(1) + '/index.html')
              .catch(function() {
                return fetch('./' + navPath.substring(1))
                  .catch(function() {
                    return fetch('./'); // Fallback to index
                  });
              })
          );
          return;
        }
      }
    }
    
    // For hash navigation within the site that might be redirecting
    if (url.hash && (url.pathname === '/' || url.pathname === '')) {
      event.respondWith(
        fetch('./' + (url.hash ? '#' + url.hash : ''))
          .catch(function() {
            return fetch('./');
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
  `;
  
  fs.writeFileSync(path.join(outputDir, 'ipfs-sw.js'), serviceWorkerCode);
  console.log('Created simplified service worker at ipfs-sw.js');
  
  // Add both scripts to all HTML files
  const htmlFiles = findHtmlFiles(outputDir).filter(file => file.endsWith('.html'));
  htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    
    // Add emergency hotfix script first
    if (!content.includes('ipfs-hotfix-final.js')) {
      content = content.replace('<head>', '<head><script src="./ipfs-hotfix-final.js"></script>');
      modified = true;
    }
    
    // Add navigation fix script
    if (!content.includes('ipfs-nav-fix.js')) {
      content = content.replace('<head>', '<head><script src="./_ipfs/ipfs-nav-fix.js"></script>');
      modified = true;
    }
    
    // Then add the main IPFS fix script
    if (!content.includes('ipfs-fix.js')) {
      content = content.replace('<head>', '<head><script src="./_ipfs/ipfs-fix.js"></script>');
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(file, content);
      console.log(`Added IPFS fix scripts to ${file}`);
    }
  });
  
  console.log('Created IPFS compatibility files');
};

// Function to fix asset filenames with special prefixes
const fixAssetFilenames = () => {
  const staticDir = path.join(outputDir, '_next', 'static');
  if (!fs.existsSync(staticDir)) return;
  
  // Fix font files with problematic paths
  const cssDir = path.join(staticDir, 'css');
  const mediaDir = path.join(staticDir, 'media');
  
  if (fs.existsSync(mediaDir)) {
    const mediaFiles = fs.readdirSync(mediaDir);
    mediaFiles.forEach(file => {
      // Copy font files to css directory for easier relative access
      if (file.endsWith('.woff2') || file.endsWith('.woff') || file.endsWith('.ttf')) {
        if (!fs.existsSync(cssDir)) {
          fs.mkdirSync(cssDir, { recursive: true });
        }
        
        const sourceFile = path.join(mediaDir, file);
        const destFile = path.join(cssDir, file);
        
        try {
          fs.copyFileSync(sourceFile, destFile);
          console.log(`Copied ${file} to css directory for better font access`);
        } catch (err) {
          console.error(`Failed to copy ${file}:`, err.message);
        }
      }
    });
  }
  
  // Copy public images to root for accessibility
  const publicImagesDir = path.join(outputDir, 'images');
  if (fs.existsSync(publicImagesDir)) {
    console.log('Copying key images to root for better accessibility');
    
    // List of critical images that should be directly accessible
    ['profile.jpg'].forEach(filename => {
      const sourcePaths = [
        path.join(publicImagesDir, filename),
        path.join(outputDir, 'public', 'images', filename),
        path.join(outputDir, 'public', filename)
      ];
      
      let sourceFile = null;
      for (const srcPath of sourcePaths) {
        if (fs.existsSync(srcPath)) {
          sourceFile = srcPath;
          break;
        }
      }
      
      if (sourceFile) {
        const destFile = path.join(outputDir, filename);
        try {
          fs.copyFileSync(sourceFile, destFile);
          console.log(`Copied ${filename} to root directory for better image access`);
        } catch (err) {
          console.error(`Failed to copy ${filename}:`, err.message);
        }
      }
    });
  }
};

// Function to fix _next directory structure
const fixNextDirectory = () => {
  const nextDir = path.join(outputDir, '_next');
  if (!fs.existsSync(nextDir)) return;
  
  console.log('Creating .next symlink for better compatibility');
  
  // Create a .next directory symlink to _next for better compatibility
  const dotNextDir = path.join(outputDir, '.next');
  if (!fs.existsSync(dotNextDir)) {
    try {
      fs.symlinkSync('_next', dotNextDir, 'dir');
      console.log('Created .next symlink successfully');
    } catch (error) {
      console.error('Failed to create symlink:', error.message);
      // If symlink fails, try creating a directory with files
      try {
        fs.mkdirSync(dotNextDir);
        // Create a simple redirect script
        fs.writeFileSync(path.join(dotNextDir, 'index.html'), 
          '<meta http-equiv="refresh" content="0;url=../_next/">'
        );
        console.log('Created .next redirect instead');
      } catch (err) {
        console.error('Failed to create fallback directory:', err.message);
      }
    }
  }
};

// Function to create standalone fallback resources
const createFallbackResources = () => {
  console.log('Creating fallback resources');
  
  // Identify and inject our hotfix script into HTML files
  const htmlFiles = findHtmlFiles(outputDir);
  
  for (const htmlFile of htmlFiles) {
    if (path.extname(htmlFile) !== '.html') continue;
    
    let content = fs.readFileSync(htmlFile, 'utf8');
    
    // Add our IPFS hotfix script to the head of each HTML file
    if (!content.includes('ipfs-hotfix-final.js')) {
      content = content.replace('<head>', '<head><script src="./ipfs-hotfix-final.js"></script>');
      fs.writeFileSync(htmlFile, content);
      console.log(`Added hotfix script to ${htmlFile}`);
    }
  }
  
  // Create a basic fallback for the font file
  const fontDir = path.join(outputDir, '_next', 'static', 'media');
  if (!fs.existsSync(fontDir)) {
    fs.mkdirSync(fontDir, { recursive: true });
  }
  
  // Create music directory for audio files
  const musicDir = path.join(outputDir, 'music');
  if (!fs.existsSync(musicDir)) {
    fs.mkdirSync(musicDir, { recursive: true });
    
    // Create a placeholder MP3 file for tacitus1.mp3
    // This is just a small MP3 file with silence
    const placeholderMP3 = 'SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAAFmAD///////////////////////////////////////////8AAAA8TEFNRTMuMTAwAgAAAAAAAAAAABRAJAhXQQAAgAAABZjrTJuiAAAAAAAAAAAAAAAAAAAA//sQxAADwAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQxBYAAANIAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQxCoAAANIAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQxDYAAANIAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
    
    fs.writeFileSync(path.join(musicDir, 'tacitus1.mp3'), Buffer.from(placeholderMP3, 'base64'));
    console.log('Created placeholder MP3 file for tacitus1.mp3');
  }
  
  // Try to find any music files in the workspace and copy them to the music directory
  try {
    const publicDir = path.join(process.cwd(), 'public');
    const possibleMusicDirs = [
      path.join(publicDir, 'music'),
      path.join(publicDir, 'audio'),
      path.join(publicDir, 'assets', 'music'),
      path.join(publicDir, 'assets', 'audio'),
      path.join(process.cwd(), 'assets', 'music'),
      path.join(process.cwd(), 'assets', 'audio')
    ];
    
    for (const dir of possibleMusicDirs) {
      if (fs.existsSync(dir)) {
        console.log(`Found music directory: ${dir}`);
        
        // Copy all audio files to the output music directory
        const files = fs.readdirSync(dir);
        for (const file of files) {
          if (file.endsWith('.mp3') || file.endsWith('.wav') || file.endsWith('.ogg')) {
            const sourceFile = path.join(dir, file);
            const destFile = path.join(musicDir, file);
            
            fs.copyFileSync(sourceFile, destFile);
            console.log(`Copied music file: ${file}`);
          }
        }
        
        break;
      }
    }
  } catch (err) {
    console.error('Error copying music files:', err.message);
  }
  
  // Try to find the Inter font file
  let interFontFile = null;
  const possibleFontFiles = findHtmlFiles(outputDir).filter(file => 
    file.includes('static/media') && (file.endsWith('.woff2') || file.endsWith('.woff'))
  );
  
  if (possibleFontFiles.length > 0) {
    interFontFile = possibleFontFiles[0];
    const fontFilename = path.basename(interFontFile);
    
    // Copy the font to multiple locations for better accessibility
    [
      path.join(outputDir, fontFilename),
      path.join(outputDir, '_next', fontFilename),
      path.join(outputDir, '_next', 'static', fontFilename)
    ].forEach(destPath => {
      try {
        fs.copyFileSync(interFontFile, destPath);
        console.log(`Copied font to ${destPath} for better access`);
      } catch (err) {
        console.error(`Failed to copy font to ${destPath}:`, err.message);
      }
    });
  }
  
  // Add standalone font loading script
  const fontFixScript = `
  // Font loading fix
  (function() {
    function checkAndFixFonts() {
      // Find any font that failed to load and fix its path
      document.querySelectorAll('link[rel="preload"][as="font"]').forEach(link => {
        if (!link.dataset.fixed) {
          // Create a new link with a fixed path
          const newLink = document.createElement('link');
          newLink.rel = 'preload';
          newLink.as = 'font';
          newLink.type = 'font/' + (link.href.endsWith('.woff2') ? 'woff2' : 'woff');
          newLink.crossOrigin = 'anonymous';
          
          // Try different relative paths
          if (link.href.indexOf('/_next/static/media/') !== -1) {
            const fontName = link.href.split('/').pop();
            newLink.href = './_next/static/media/' + fontName;
          } else {
            newLink.href = './' + link.href.split('/').pop();
          }
          
          newLink.dataset.fixed = 'true';
          document.head.appendChild(newLink);
          console.log('Added fallback font link:', newLink.href);
        }
      });
      
      // Also fix style tags that reference fonts
      document.querySelectorAll('style').forEach(style => {
        if (!style.dataset.fixed && style.textContent.indexOf('@font-face') !== -1) {
          // Avoid using regex completely - instead use string operations
          let newContent = style.textContent;
          
          // Replace all instances of /_next/static/media/ with ./_next/static/media/
          if (newContent.includes('/_next/static/media/')) {
            newContent = newContent.split('/_next/static/media/').join('./_next/static/media/');
          }
          
          // Fix nested paths in CSS
          if (newContent.includes('_next/static/css/_next/static/media/')) {
            newContent = newContent.split('_next/static/css/_next/static/media/').join('_next/static/media/');
          }
          
          // Apply the changes if content was modified
          if (newContent !== style.textContent) {
            style.textContent = newContent;
            style.dataset.fixed = 'true';
            console.log('Fixed paths in style tag using safe string operations');
          }
        }
      });
      
      // Special fix for the specific font file causing 404s
      const specialFontName = 'a34f9d1faa5f3315-s.p.woff2';
      
      // Add specific link for the problematic font
      const fontLink = document.createElement('link');
      fontLink.rel = 'preload';
      fontLink.as = 'font';
      fontLink.type = 'font/woff2';
      fontLink.crossOrigin = 'anonymous';
      fontLink.href = './_next/static/media/' + specialFontName;
      document.head.appendChild(fontLink);
      
      // Also try alternative font paths
      [
        './_next/' + specialFontName,
        './' + specialFontName
      ].forEach(path => {
        const altLink = document.createElement('link');
        altLink.rel = 'preload';
        altLink.as = 'font';
        altLink.type = 'font/woff2';
        altLink.crossOrigin = 'anonymous';
        altLink.href = path;
        document.head.appendChild(altLink);
      });
    }
    
    // Run the fix after everything has loaded
    if (document.readyState === 'complete') {
      checkAndFixFonts();
    } else {
      window.addEventListener('load', checkAndFixFonts);
    }
    
    // Add additional check for TacitusFM
    const checkTacitusFM = () => {
      // Fix any audio elements that might be trying to load from ipfs.io/music
      document.querySelectorAll('audio[src*="ipfs.io/music"], [src*="ipfs.io/music"]').forEach(audio => {
        const newSrc = './music/' + audio.src.substring(audio.src.lastIndexOf('/') + 1);
        audio.src = newSrc;
      });
      
      // Specific fix for tacitus1.mp3
      document.querySelectorAll('audio[src*="tacitus1.mp3"], [src*="tacitus1.mp3"]').forEach(audio => {
        audio.src = './music/tacitus1.mp3';
      });
    };
    
    // Run this check immediately and after load
    checkTacitusFM();
    window.addEventListener('load', checkTacitusFM);
    
    // Direct fix for GitHub API
    window.GITHUB_DATA = {
      user: { login: "TacitusXI", name: "Ivan Leskov" },
      repos: [],
      contributions: { totalCount: 0, weeks: [] }
    };
    
    // Override fetch for GitHub API
    const origFetch = window.fetch;
    window.fetch = function(url, options) {
      const urlStr = typeof url === 'string' ? url : url?.url || '';
      
      if (urlStr.includes('/api/github') || urlStr.includes('github.com/')) {
        console.log('Intercepting GitHub API request:', urlStr);
        return Promise.resolve(new Response(
          JSON.stringify(window.GITHUB_DATA),
          { headers: { 'Content-Type': 'application/json' } }
        ));
      }
      
      return origFetch.apply(this, arguments);
    };
  })();
  `;
  
  // Create service worker file with a more direct approach
  const serviceWorkerCode = `
  // Service worker to intercept requests
  self.addEventListener('fetch', function(event) {
    const url = new URL(event.request.url);
    
    // Handle font files
    if (url.pathname.endsWith('.woff2') || url.pathname.endsWith('.woff') || url.pathname.endsWith('.ttf')) {
      // Extract just the filename
      const fontFilename = url.pathname.split('/').pop();
      
      event.respondWith(
        fetch('./_next/static/media/' + fontFilename)
          .catch(function() { return fetch('./_next/' + fontFilename); })
          .catch(function() { return fetch('./' + fontFilename); })
          .catch(function(err) {
            console.warn('Font not found:', fontFilename);
            return new Response('Font not found', { status: 404 });
          })
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
    
    // Handle GitHub API specifically
    if (url.pathname.includes('/api/github')) {
      const githubData = {
        user: { login: "TacitusXI", name: "Ivan Leskov" },
        repos: [],
        contributions: { totalCount: 0, weeks: [] }
      };
      
      event.respondWith(
        new Response(JSON.stringify(githubData), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      );
      return;
    }
    
    // Handle music files specifically
    if (url.pathname.includes('/music/')) {
      event.respondWith(
        fetch('./music/' + url.pathname.substring(url.pathname.lastIndexOf('/') + 1))
          .catch(function(err) {
            console.warn('Failed to load music file:', url.pathname);
            return new Response('Audio not found', { status: 404 });
          })
      );
      return;
    }
    
    // Special case for tacitus1.mp3
    if (url.pathname.includes('tacitus1.mp3')) {
      event.respondWith(
        fetch('./music/tacitus1.mp3')
          .catch(function(err) {
            console.warn('Failed to load tacitus1.mp3');
            return new Response('Audio not found', { status: 404 });
          })
      );
      return;
    }
    
    // Handle project images
    if (url.pathname.startsWith('/images/projects/')) {
      event.respondWith(
        fetch('./images/projects/' + url.pathname.substring('/images/projects/'.length))
          .catch(function(err) {
            console.warn('Failed to load project image:', url.pathname);
            return fetch('./_next/static/media/' + url.pathname.split('/').pop());
          })
      );
      return;
    }
    
    // Handle all other image files
    if (url.pathname.startsWith('/images/')) {
      event.respondWith(
        fetch('./images/' + url.pathname.substring('/images/'.length))
          .catch(function(err) {
            console.warn('Failed to load image:', url.pathname);
            return fetch('.' + url.pathname);
          })
      );
      return;
    }
  });
  `;
  
  fs.writeFileSync(path.join(outputDir, 'sw.js'), serviceWorkerCode);
  console.log('Created service worker for font request interception');
  
  console.log('Created fallback resources');
};

// Main function
const main = () => {
  console.log('Starting post-build IPFS path fix');
  
  // Find all HTML, JS, and CSS files
  const filesToProcess = findHtmlFiles(outputDir);
  console.log(`Found ${filesToProcess.length} files to process`);
  
  // Create static API endpoints first
  createStaticApiEndpoints();
  
  // Process each file
  for (const file of filesToProcess) {
    fixAssetPaths(file);
  }
  
  // Fix asset filenames
  fixAssetFilenames();
  
  // Create standalone fallback resources
  createFallbackResources();
  
  // Create IPFS-specific files
  createIpfsCompatibleFiles();
  
  // Fix _next directory structure
  fixNextDirectory();
  
  console.log('Finished fixing asset paths');
};

// Run the script
main(); 