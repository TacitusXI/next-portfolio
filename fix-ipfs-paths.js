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
    }
  }
  
  return results;
};

// Function to fix asset paths in HTML files
const fixAssetPaths = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix asset paths in HTML attributes
  content = content.replace(/(?<=(href|src)=")(\/_next\/)/g, './\_next/');
  
  // Fix asset paths in inline scripts and styles
  content = content.replace(/(?<=(["']))\/_next\//g, './\_next/');
  
  // Write fixed content back to file
  fs.writeFileSync(filePath, content);
  console.log(`Fixed asset paths in ${filePath}`);
};

// Main function
const main = () => {
  console.log('Starting post-build IPFS path fix');
  
  // Find all HTML files
  const htmlFiles = findHtmlFiles(outputDir);
  console.log(`Found ${htmlFiles.length} HTML files to process`);
  
  // Process each HTML file
  for (const file of htmlFiles) {
    fixAssetPaths(file);
  }
  
  console.log('Finished fixing asset paths');
};

// Run the script
main(); 