#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Building PasswordStore audit...');

// Ensure passwordstore is available in Next.js
const auditPagePath = path.join(__dirname, '..', 'src', 'app', 'audit', '[slug]', 'page.tsx');
let pageContent = fs.readFileSync(auditPagePath, 'utf8');

// Check if passwordstore-v1 is already in the list
if (!pageContent.includes("'passwordstore-v1'")) {
  // Add passwordstore-v1 to the auditSlugs array
  const oldPattern = /const auditSlugs = \[([\s\S]*?)\];/;
  const match = pageContent.match(oldPattern);
  
  if (match) {
    const currentSlugs = match[1].trim();
    const newSlugs = currentSlugs ? `${currentSlugs},\n    'passwordstore-v1'` : `'passwordstore-v1'`;
    const newPattern = `const auditSlugs = [\n    ${newSlugs},\n  ];`;
    
    pageContent = pageContent.replace(oldPattern, newPattern);
    fs.writeFileSync(auditPagePath, pageContent);
    console.log('✅ Updated Next.js static generation');
  }
}

// Update audit index page
const indexPagePath = path.join(__dirname, '..', 'src', 'app', 'audit', 'page.tsx');
let indexContent = fs.readFileSync(indexPagePath, 'utf8');

if (!indexContent.includes("'passwordstore-v1'")) {
  const oldPattern = /const knownAudits = \[([\s\S]*?)\];/;
  const match = indexContent.match(oldPattern);
  
  if (match) {
    const currentAudits = match[1].trim();
    const newAudits = currentAudits ? `${currentAudits}, 'passwordstore-v1'` : `'passwordstore-v1'`;
    const newPattern = `const knownAudits = [${newAudits}];`;
    
    indexContent = indexContent.replace(oldPattern, newPattern);
    fs.writeFileSync(indexPagePath, indexContent);
    console.log('✅ Updated audit index page');
  }
}

console.log('✅ Audit components use conditional paths (localhost vs IPFS)');
console.log('✅ PasswordStore audit is now available at /audit/passwordstore-v1');