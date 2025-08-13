#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Automated Audit Builder
 * This script automatically detects new audit reports and generates all necessary files
 */

const SCRIPT_DIR = __dirname;
const SOURCE_DIR = path.join(SCRIPT_DIR, 'source');
const GENERATED_DIR = path.join(SCRIPT_DIR, 'generated');
const PUBLIC_DIR = path.join(SCRIPT_DIR, '..', 'public', 'audits');
const NEXT_AUDIT_PAGE = path.join(SCRIPT_DIR, '..', 'src', 'app', 'audit', '[slug]', 'page.tsx');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log(`📁 Created directory: ${dirPath}`, 'blue');
  }
}

function getAuditSources() {
  ensureDirectoryExists(SOURCE_DIR);
  
  const sources = [];
  const items = fs.readdirSync(SOURCE_DIR);
  
  for (const item of items) {
    const itemPath = path.join(SOURCE_DIR, item);
    if (fs.statSync(itemPath).isDirectory()) {
      const configPath = path.join(itemPath, 'config.json');
      const reportPath = path.join(itemPath, 'report.md');
      
      if (fs.existsSync(configPath)) {
        sources.push({
          slug: item,
          sourceDir: itemPath,
          configPath,
          reportPath: fs.existsSync(reportPath) ? reportPath : null
        });
      }
    }
  }
  
  return sources;
}

function processAudit(audit) {
  log(`🔄 Processing audit: ${audit.slug}`, 'yellow');
  
  const outputDir = path.join(GENERATED_DIR, audit.slug);
  ensureDirectoryExists(outputDir);
  
  try {
    // Read config
    const config = JSON.parse(fs.readFileSync(audit.configPath, 'utf8'));
    
    // Generate metadata
    const metadata = {
      slug: audit.slug,
      timestamp: new Date().toISOString(),
      sha256: generateSHA256(audit.configPath), // Simple hash for demo
      protocol_name: config.protocol_name || audit.slug,
      blockchain_network: config.blockchain_network || 'base',
      audit_url: `https://tacitvs.eth.limo/audit/${audit.slug}`,
      files: {
        final_pdf: 'report-final.pdf',
        dark_pdf: 'report-dark.pdf',
        light_pdf: 'report-light.pdf',
        source_markdown: 'report.md'
      }
    };
    
    // Write metadata
    const metadataPath = path.join(outputDir, 'metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    log(`✅ Generated metadata: ${metadataPath}`, 'green');
    
    // Process template if report.md exists in source
    if (audit.reportPath) {
      const outputReportPath = path.join(outputDir, 'report.md');
      fs.copyFileSync(audit.reportPath, outputReportPath);
      log(`✅ Copied report: ${outputReportPath}`, 'green');
    } else {
      // Generate from template
      const templatePath = path.join(SCRIPT_DIR, 'templates', 'report-template.md');
      const outputReportPath = path.join(outputDir, 'report.md');
      
      if (fs.existsSync(templatePath)) {
        try {
          const { processTemplate } = require('./process-template.js');
          processTemplate(audit.configPath, templatePath, outputReportPath);
          log(`✅ Generated report from template: ${outputReportPath}`, 'green');
        } catch (error) {
          log(`⚠️  Template processing failed: ${error.message}`, 'yellow');
          // Create a basic report
          const basicReport = `# ${config.protocol_name || audit.slug} Security Audit\n\nAudit report generated automatically.\n\nPlease update this report with detailed findings.`;
          fs.writeFileSync(outputReportPath, basicReport);
          log(`✅ Created basic report: ${outputReportPath}`, 'green');
        }
      }
    }
    
    // Copy other assets from source
    const sourceFiles = fs.readdirSync(audit.sourceDir);
    for (const file of sourceFiles) {
      if (file.endsWith('.pdf') || file.endsWith('.png') || file.endsWith('.jpg')) {
        const sourcePath = path.join(audit.sourceDir, file);
        const destPath = path.join(outputDir, file);
        fs.copyFileSync(sourcePath, destPath);
        log(`✅ Copied asset: ${file}`, 'green');
      }
    }
    
    // Copy to public directory for Next.js
    const publicAuditDir = path.join(PUBLIC_DIR, audit.slug);
    ensureDirectoryExists(PUBLIC_DIR);
    ensureDirectoryExists(publicAuditDir);
    
    // Copy all generated files to public
    const generatedFiles = fs.readdirSync(outputDir);
    for (const file of generatedFiles) {
      const sourcePath = path.join(outputDir, file);
      const destPath = path.join(publicAuditDir, file);
      fs.copyFileSync(sourcePath, destPath);
    }
    
    log(`✅ Audit ${audit.slug} processed successfully`, 'green');
    return audit.slug;
    
  } catch (error) {
    log(`❌ Error processing audit ${audit.slug}: ${error.message}`, 'red');
    return null;
  }
}

function generateSHA256(filePath) {
  // Simple hash generation for demo - in real implementation you'd use crypto
  const content = fs.readFileSync(filePath, 'utf8');
  return require('crypto').createHash('sha256').update(content).digest('hex');
}

function updateNextJSStaticGeneration(auditSlugs) {
  log(`🔄 Updating Next.js static generation...`, 'yellow');
  
  try {
    let pageContent = fs.readFileSync(NEXT_AUDIT_PAGE, 'utf8');
    
    // Find and replace the auditSlugs array
    const oldPattern = /const auditSlugs = \[[\s\S]*?\];/;
    const newAuditSlugs = auditSlugs.map(slug => `    '${slug}'`).join(',\n');
    const newPattern = `const auditSlugs = [\n${newAuditSlugs},\n  ];`;
    
    pageContent = pageContent.replace(oldPattern, newPattern);
    
    fs.writeFileSync(NEXT_AUDIT_PAGE, pageContent);
    log(`✅ Updated Next.js static generation with ${auditSlugs.length} audits`, 'green');
    
  } catch (error) {
    log(`⚠️  Could not update Next.js page: ${error.message}`, 'yellow');
  }
}

function updateAuditIndexPage(auditSlugs) {
  log(`🔄 Updating audit index page...`, 'yellow');
  
  try {
    const indexPagePath = path.join(SCRIPT_DIR, '..', 'src', 'app', 'audit', 'page.tsx');
    let pageContent = fs.readFileSync(indexPagePath, 'utf8');
    
    // Update the knownAudits array
    const oldPattern = /const knownAudits = \[[\s\S]*?\];/;
    const newAuditsList = auditSlugs.map(slug => `'${slug}'`).join(', ');
    const newPattern = `const knownAudits = [${newAuditsList}];`;
    
    pageContent = pageContent.replace(oldPattern, newPattern);
    
    fs.writeFileSync(indexPagePath, pageContent);
    log(`✅ Updated audit index page`, 'green');
    
  } catch (error) {
    log(`⚠️  Could not update audit index page: ${error.message}`, 'yellow');
  }
}

function createPasswordStoreExample() {
  log(`🔄 Creating PasswordStore example...`, 'yellow');
  
  const passwordstoreDir = path.join(SOURCE_DIR, 'passwordstore-v1');
  ensureDirectoryExists(passwordstoreDir);
  
  const configPath = path.join(passwordstoreDir, 'config.json');
  
  if (!fs.existsSync(configPath)) {
    const exampleConfig = {
      protocol_name: "PasswordStore",
      date: "2024-01-15",
      protocol_description: "A simple password storage smart contract for secure credential management.",
      commit_hash: "abc123def456",
      scope: "Core password storage functionality and access controls",
      roles: "Owner, Users",
      audit_objective: "Comprehensive security review of password storage mechanisms",
      blockchain_network: "base",
      issues: {
        high: 0,
        medium: 2,
        low: 1,
        info: 3
      },
      key_risks: "Unauthorized access to stored passwords, potential storage vulnerabilities",
      top_recommendations: "Implement additional access controls and encryption layers",
      findings: {
        high: "No critical vulnerabilities identified.",
        medium: "Access control mechanisms could be strengthened. Consider implementing role-based permissions.",
        low: "Minor optimization opportunities in gas usage patterns.",
        info: "Documentation could be enhanced. Consider adding comprehensive inline comments. Event emission patterns could be optimized."
      }
    };
    
    fs.writeFileSync(configPath, JSON.stringify(exampleConfig, null, 2));
    log(`✅ Created PasswordStore example config`, 'green');
  }
  
  return fs.existsSync(configPath);
}

function main() {
  log('🚀 Starting Automated Audit Builder', 'bright');
  log('=' .repeat(50), 'blue');
  
  // Create example if no audits exist
  const sources = getAuditSources();
  if (sources.length === 0) {
    log('📝 No audit sources found, creating PasswordStore example...', 'cyan');
    createPasswordStoreExample();
  }
  
  // Get updated sources
  const updatedSources = getAuditSources();
  log(`📊 Found ${updatedSources.length} audit source(s)`, 'blue');
  
  const processedSlugs = [];
  
  // Process each audit
  for (const audit of updatedSources) {
    const slug = processAudit(audit);
    if (slug) {
      processedSlugs.push(slug);
    }
  }
  
  // Update Next.js configuration
  if (processedSlugs.length > 0) {
    updateNextJSStaticGeneration(processedSlugs);
    updateAuditIndexPage(processedSlugs);
  }
  
  log('=' .repeat(50), 'blue');
  log(`✅ Audit build completed! Processed ${processedSlugs.length} audit(s)`, 'green');
  
  if (processedSlugs.length > 0) {
    log(`📋 Generated audits: ${processedSlugs.join(', ')}`, 'cyan');
    log(`🌐 Audits will be available at: /audit/[slug]`, 'cyan');
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main, processAudit, getAuditSources };