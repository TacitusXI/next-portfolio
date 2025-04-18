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
      if (url.match(/\/_next\/.*?\/_next\//)) {
        url = url.replace(/(\/_next\/[^"']*?)(\/_next\/)/g, '$1/');
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
      if (url.match(/https:\\/\\/ipfs\\.io\\/ipfs\\/[a-zA-Z0-9]+\\/_next\\//)) {
        const parts = url.split('/_next/');
        if (parts.length > 1) {
          return './_next/' + parts[1];
        }
      }
      
      // Handle https://ipfs.tech/_next/
      if (url.startsWith('https://ipfs.tech/_next/')) {
        return './_next/' + url.substring(21);
      }
      
      // Handle API requests
      if (url.startsWith('/api/')) {
        return './api/' + url.substring(5);
      }
      
      if (url.includes('/api/github')) {
        return './api/github/index.json';
      }
      
      // Handle RSC requests
      if (url.includes('?_rsc=')) {
        return './index.txt?_rsc=' + url.split('?_rsc=')[1];
      }
      
      return url;
    }

    // Override fetch with error handling
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
      if (arguments.length >= 1) {
        const origUrl = arguments[0];
        arguments[0] = fixAssetUrl(arguments[0]);
        
        // Special handling for GitHub API or RSC requests that might fail
        if (origUrl.includes('/api/github') || origUrl.includes('?_rsc=')) {
          return originalFetch.apply(this, arguments).catch(err => {
            console.warn('Fetch error, falling back to static data:', err);
            // For GitHub API, return static data
            if (origUrl.includes('/api/github')) {
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
            if (origUrl.includes('?_rsc=')) {
              return new Response('OK', {
                status: 200,
                headers: { 'Content-Type': 'text/plain' }
              });
            }
            throw err;
          });
        }
      }
      return originalFetch.apply(this, arguments);
    };

    // Fix all elements with src or href
    function fixAllElements() {
      // Fix font and media paths - special case for nested paths
      document.querySelectorAll('[href*="_next/static/css/_next/"]').forEach(el => {
        const href = el.getAttribute('href');
        const fixedHref = href.replace(/(_next\/static\/css\/)_next\//, '$1');
        el.setAttribute('href', fixedHref);
      });
      
      document.querySelectorAll('[src^="/_next/"], [href^="/_next/"]').forEach(el => {
        const attr = el.hasAttribute('src') ? 'src' : 'href';
        const value = el.getAttribute(attr);
        el.setAttribute(attr, './' + value);
      });
      
      document.querySelectorAll('[src^="https://ipfs.io/_next/"], [href^="https://ipfs.io/_next/"]').forEach(el => {
        const attr = el.hasAttribute('src') ? 'src' : 'href';
        const value = el.getAttribute(attr);
        el.setAttribute(attr, './_next/' + value.split('/_next/')[1]);
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
  
  // Add the script to all HTML files
  const htmlFiles = findHtmlFiles(outputDir).filter(file => file.endsWith('.html'));
  htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('ipfs-fix.js')) {
      content = content.replace('</head>', '<script src="./_ipfs/ipfs-fix.js"></script></head>');
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
  
  // Create IPFS-specific files
  createIpfsCompatibleFiles();
  
  // Fix _next directory structure
  fixNextDirectory();
  
  console.log('Finished fixing asset paths');
};

// Run the script
main(); 