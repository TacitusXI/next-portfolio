#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building Next.js app for IPFS deployment...');

// 1. Ensure we have the right configuration
console.log('✅ Checking Next.js configuration...');
const nextConfig = path.join(process.cwd(), 'next.config.js');
const configContent = fs.readFileSync(nextConfig, 'utf8');

if (!configContent.includes("assetPrefix: './'")) {
  console.log('⚠️ Your next.config.js does not have assetPrefix set to "./". Adding it...');
  const updatedConfig = configContent.replace(
    /assetPrefix\s*:\s*['"]\/['"]/,
    "assetPrefix: './'"
  );
  fs.writeFileSync(nextConfig, updatedConfig);
  console.log('✅ Updated next.config.js with IPFS-friendly asset prefix');
}

// 2. Clean previous builds
console.log('🧹 Cleaning previous builds...');
try {
  if (fs.existsSync(path.join(process.cwd(), 'out'))) {
    fs.rmSync(path.join(process.cwd(), 'out'), { recursive: true, force: true });
  }
  console.log('✅ Previous build directory cleaned');
} catch (error) {
  console.error('❌ Failed to clean build directory:', error);
}

// 3. Build the Next.js app
console.log('🏗️ Building Next.js app...');
try {
  execSync('next build', { stdio: 'inherit' });
  console.log('✅ Next.js build completed');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}

// 4. Run the fix-ipfs-paths script
console.log('🔧 Running IPFS path fix script...');
try {
  require('./fix-ipfs-paths.js');
  console.log('✅ IPFS path fixes applied');
} catch (error) {
  console.error('❌ Failed to apply IPFS fixes:', error);
}

// 5. Add a friendly message to the root
console.log('📝 Adding a README to the build...');
const readmePath = path.join(process.cwd(), 'out', 'README.md');
const readmeContent = `# Portfolio Website for IPFS

This website has been built specifically for IPFS deployment.

## Features

- All assets use relative paths starting with "./"
- Special handling for font files and problematic paths
- Client-side fallback for API and data loading
- Service worker for handling tricky font and API paths

## Deployment

This build is ready to be deployed to IPFS directly.
Just upload the contents of this directory to your IPFS node or service like:

- IPFS Desktop
- Pinata
- Fleek
- Infura

No additional configuration is needed!
`;

fs.writeFileSync(readmePath, readmeContent);
console.log('✅ README.md added to the build');

// 6. Verify build
console.log('🔍 Verifying build for IPFS compatibility...');
let issues = 0;

// Check for absolute paths
const htmlFiles = findHtmlFiles(path.join(process.cwd(), 'out'));
for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  
  // Look for problematic absolute paths
  const absolutePaths = [
    /src="\/[^"]+"/g,
    /href="\/[^"]+"/g,
    /url\(\/[^)]+\)/g
  ];
  
  let fileHasIssues = false;
  for (const pattern of absolutePaths) {
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      if (!fileHasIssues) {
        console.log(`⚠️ Found potential issues in ${path.relative(process.cwd(), file)}:`);
        fileHasIssues = true;
      }
      console.log(`  - ${matches.length} instances of ${pattern}`);
      issues++;
    }
  }
}

// Final message
if (issues > 0) {
  console.log(`⚠️ Found ${issues} potential issues that may affect IPFS compatibility`);
  console.log('   Consider running "node fix-ipfs-paths.js" again to fix them');
} else {
  console.log('✅ No obvious IPFS compatibility issues found');
}

console.log('🎉 Build complete! Your IPFS-ready site is in the "out" directory');
console.log('   You can now upload the contents of the "out" directory to IPFS');

// Helper function to find HTML files
function findHtmlFiles(dir) {
  let results = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      results = results.concat(findHtmlFiles(fullPath));
    } else if (item.endsWith('.html') || item.endsWith('.js') || item.endsWith('.css')) {
      results.push(fullPath);
    }
  }
  
  return results;
} 