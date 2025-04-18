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
  
  // Create a clientside-fix.js file that can be included on IPFS gateways
  const fixScript = `
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
        const fixedHref = href.replace(/_next\/static\/css\/_next\/static\/media\//g, '_next/static/media/');
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

      // Fix project images more aggressively - target all images in projects section
      document.querySelectorAll('.project img, [data-project] img, [data-project-image]').forEach(el => {
        // Check if the image is a relative or absolute path to the projects directory
        if (el.src.includes('/images/projects/')) {
          el.src = './images/projects/' + el.src.split('/images/projects/').pop();
        }
      });
      
      // Fix specifically the sc-kEzwgR hOcaMd elements (project cards)
      document.querySelectorAll('.sc-kEzwgR.hOcaMd, .sc-kEzwgR, .hOcaMd').forEach(el => {
        // Check background image style
        if (el.style && el.style.backgroundImage) {
          if (el.style.backgroundImage.includes('/images/')) {
            const bgUrl = el.style.backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
            if (bgUrl && bgUrl[1]) {
              const newUrl = bgUrl[1].replace(/^\/images\//, './images/');
              el.style.backgroundImage = 'url(\'' + newUrl + '\')';
            }
          }
        }
        
        // Also check for img children
        el.querySelectorAll('img').forEach(img => {
          if (img.src.includes('/images/')) {
            img.src = img.src.replace(/^https?:\/\/[^\/]+\/images\//, './images/');
            img.src = img.src.replace(/^\/images\//, './images/');
          }
        });
        
        // Check for background-image in inline style
        if (el.getAttribute('style') && el.getAttribute('style').includes('background-image')) {
          const style = el.getAttribute('style');
          if (style.includes('/images/')) {
            const newStyle = style.replace(/(url\(['"]?)\/images\//g, '$1./images/');
            el.setAttribute('style', newStyle);
          }
        }
      });
      
      // Fix music player - target audio elements and music files
      document.querySelectorAll('audio, [src*=".mp3"], [src*=".wav"], [src*=".ogg"]').forEach(el => {
        if (el.src && el.src.startsWith('/')) {
          el.src = '.' + el.src;
        }
      });
      
      // Special fix for TacitusFM component
      document.querySelectorAll('#music-player, .music-player, [id*="music"], [class*="music"], div[id*="tacitus-fm"], div[class*="tacitus-fm"], div[id*="TacitusFM"], div[class*="TacitusFM"]').forEach(el => {
        // Fix audio elements inside the music player
        el.querySelectorAll('audio, source').forEach(audioEl => {
          if (audioEl.src && audioEl.src.startsWith('/')) {
            audioEl.src = '.' + audioEl.src;
          } else if (audioEl.src && audioEl.src.includes('/ipfs/')) {
            const parts = audioEl.src.split('/ipfs/');
            if (parts.length > 1 && parts[1].includes('/')) {
              const subParts = parts[1].split('/');
              if (subParts.length > 1) {
                audioEl.src = './' + subParts.slice(1).join('/');
              }
            }
          }
        });
        
        // Check for data-* attributes that might contain audio sources
        Array.from(el.attributes).forEach(attr => {
          if (attr.name.startsWith('data-') && typeof attr.value === 'string') {
            if (attr.value.startsWith('/') && 
                (attr.value.endsWith('.mp3') || attr.value.endsWith('.wav') || attr.value.endsWith('.ogg'))) {
              el.setAttribute(attr.name, '.' + attr.value);
            }
          }
        });
      });
      
      // Fix navbar links to prevent external redirects
      document.querySelectorAll('nav a, header a, .navbar a, .nav-link').forEach(el => {
        // Don't modify external links (those starting with http that aren't IPFS gateways)
        if (el.href && (el.href.includes('ipfs.tech') || el.href.includes('ipfs.io'))) {
          // Extract the path from the URL
          const url = new URL(el.href);
          const path = url.pathname;
          
          // If it's an internal path, make it relative
          if (!path.startsWith('http')) {
            el.href = '.' + (path.startsWith('/') ? path : '/' + path);
          }
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
      
      // Fix GitHub API redirect issue
      document.querySelectorAll('[href*="/api/github"], [src*="/api/github"]').forEach(el => {
        const attr = el.hasAttribute('src') ? 'src' : 'href';
        el.setAttribute(attr, './api/github/index.json');
      });
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
  `;
  
  const ipfsDir = path.join(outputDir, '_ipfs');
  if (!fs.existsSync(ipfsDir)) {
    fs.mkdirSync(ipfsDir);
  }
  
  fs.writeFileSync(path.join(ipfsDir, 'ipfs-fix.js'), fixScript);
  console.log('Created IPFS fix script at _ipfs/ipfs-fix.js');
  
  // Add the script to all HTML files and make it execute BEFORE other scripts
  const htmlFiles = findHtmlFiles(outputDir).filter(file => file.endsWith('.html'));
  htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('ipfs-fix.js')) {
      // Insert at the start of the head to ensure it loads first
      content = content.replace('<head>', '<head><script src="./_ipfs/ipfs-fix.js"></script>');
      fs.writeFileSync(file, content);
      console.log(`Added IPFS fix script to ${file}`);
    }
  });
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
  
  // Create a basic fallback for the font file
  const fontDir = path.join(outputDir, '_next', 'static', 'media');
  if (!fs.existsSync(fontDir)) {
    fs.mkdirSync(fontDir, { recursive: true });
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
          // Fix the problematic regex - this was causing the "Invalid regular expression flags" error
          let newContent = style.textContent;
          
          // Replace URL patterns without using complex regex
          if (newContent.includes('url(') && newContent.includes('/_next/static/media/')) {
            newContent = newContent.split('url(').map(part => {
              if (!part.includes('/_next/static/media/')) return part;
              return part.replace('/_next/static/media/', './_next/static/media/');
            }).join('url(');
          }
          
          // Fix nested paths in CSS (this was causing 404s)
          newContent = newContent.replace(/_next\/static\/css\/_next\/static\/media\//g, '_next/static/media/');
          
          if (newContent !== style.textContent) {
            style.textContent = newContent;
            style.dataset.fixed = 'true';
            console.log('Fixed font paths in style tag');
          }
        }
      });
    }
    
    // Run the fix after everything has loaded
    if (document.readyState === 'complete') {
      checkAndFixFonts();
    } else {
      window.addEventListener('load', checkAndFixFonts);
    }
  })();
  `;
  
  // Add this script to all HTML files
  const htmlFiles = findHtmlFiles(outputDir).filter(file => file.endsWith('.html'));
  htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace('</head>', `<script>${fontFixScript}</script></head>`);
    
    // Add a service worker for intercepting font requests
    const swScript = `
    <script>
    // Register service worker to fix font loading issues
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').then(registration => {
          console.log('ServiceWorker registration successful');
        }).catch(err => {
          console.log('ServiceWorker registration failed: ', err);
        });
      });
    }
    </script>
    `;
    
    // Add service worker script before closing body tag
    content = content.replace('</body>', `${swScript}</body>`);
    fs.writeFileSync(file, content);
  });
  
  // Create service worker file
  const serviceWorkerCode = `
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
    
    // Handle GitHub API specifically
    if (url.pathname.includes('/api/github')) {
      event.respondWith(
        fetch('./api/github/index.json')
          .catch(() => {
            // Return a basic JSON response if file not found
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
    if (url.pathname.endsWith('.mp3') || url.pathname.endsWith('.wav') || url.pathname.endsWith('.ogg')) {
      if (url.pathname.startsWith('/')) {
        const newUrl = new URL('.' + url.pathname, url.origin);
        event.respondWith(fetch(newUrl));
        return;
      }
    }
    
    // Handle project images (specific for the sc-kEzwgR hOcaMd class)
    if (url.pathname.startsWith('/images/projects/')) {
      event.respondWith(
        fetch('./images/projects/' + url.pathname.substring('/images/projects/'.length))
          .catch(err => {
            console.warn('Failed to load project image:', url.pathname, err);
            // Try other paths as fallback
            return fetch('./_next/static/media/' + url.pathname.split('/').pop());
          })
      );
      return;
    }
    
    // Handle all other image files
    if (url.pathname.startsWith('/images/') && 
        (url.pathname.endsWith('.jpg') || url.pathname.endsWith('.jpeg') || 
         url.pathname.endsWith('.png') || url.pathname.endsWith('.gif') || 
         url.pathname.endsWith('.webp') || url.pathname.endsWith('.svg'))) {
      
      event.respondWith(
        fetch('./images/' + url.pathname.substring('/images/'.length))
          .catch(err => {
            console.warn('Failed to load image:', url.pathname, err);
            // Try other paths as fallback
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