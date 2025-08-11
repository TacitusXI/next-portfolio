const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing audit page paths for IPFS...');

const auditDir = './out/audit';

// Function to fix paths in HTML files
function fixHTMLPaths(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix relative paths to be absolute from IPFS root
  content = content.replace(/href="\.\/_next\//g, 'href="../_next/');
  content = content.replace(/src="\.\/_next\//g, 'src="../_next/');
  content = content.replace(/href="\.\/fonts\//g, 'href="../fonts/');
  content = content.replace(/src="\.\/fonts\//g, 'src="../fonts/');
  content = content.replace(/href="\.\/images\//g, 'href="../images/');
  content = content.replace(/src="\.\/images\//g, 'src="../images/');
  
  // Fix script references
  content = content.replace(/"\.\/fonts\//g, '"../fonts/');
  content = content.replace(/"\.\/images\//g, '"../images/');
  content = content.replace(/"\.\/([^"]+\.css)"/g, '"../$1"');
  content = content.replace(/"\.\/([^"]+\.js)"/g, '"../$1"');
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ Fixed paths in: ${filePath}`);
}

// Process audit directory
if (fs.existsSync(auditDir)) {
  const auditIndexPath = path.join(auditDir, 'index.html');
  if (fs.existsSync(auditIndexPath)) {
    fixHTMLPaths(auditIndexPath);
  }
  
  // Process subdirectories (like passwordstore-v1)
  const items = fs.readdirSync(auditDir);
  for (const item of items) {
    const itemPath = path.join(auditDir, item);
    if (fs.statSync(itemPath).isDirectory()) {
      const subIndexPath = path.join(itemPath, 'index.html');
      if (fs.existsSync(subIndexPath)) {
        fixHTMLPaths(subIndexPath);
      }
    }
  }
}

console.log('🎉 Audit path fixing complete!');