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
  }
  
  // Write fixed content back to file
  fs.writeFileSync(filePath, content);
  console.log(`Fixed asset paths in ${filePath}`);
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
      
      return url;
    }

    // Override fetch
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
      if (arguments.length >= 1) {
        arguments[0] = fixAssetUrl(arguments[0]);
      }
      return originalFetch.apply(this, arguments);
    };

    // Fix all elements with src or href
    function fixAllElements() {
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
  })();
  `;
  
  const ipfsDir = path.join(outputDir, '_ipfs');
  if (!fs.existsSync(ipfsDir)) {
    fs.mkdirSync(ipfsDir);
  }
  
  fs.writeFileSync(path.join(ipfsDir, 'ipfs-fix.js'), fixScript);
  console.log('Created IPFS fix script at _ipfs/ipfs-fix.js');
  
  // Add the script to the index.html file
  const indexPath = path.join(outputDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    if (!indexContent.includes('ipfs-fix.js')) {
      indexContent = indexContent.replace('</head>', '<script src="./_ipfs/ipfs-fix.js"></script></head>');
      fs.writeFileSync(indexPath, indexContent);
      console.log('Added IPFS fix script to index.html');
    }
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
  
  // Process each file
  for (const file of filesToProcess) {
    fixAssetPaths(file);
  }
  
  // Create IPFS-specific files
  createIpfsCompatibleFiles();
  
  // Fix _next directory structure
  fixNextDirectory();
  
  console.log('Finished fixing asset paths');
};

// Run the script
main(); 