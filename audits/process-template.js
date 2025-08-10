#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Process audit template with configuration data
 * Usage: node process-template.js <config.json> <template.md> <output.md>
 */

function processTemplate(configPath, templatePath, outputPath) {
    try {
        // Read configuration
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        
        // Read template
        let template = fs.readFileSync(templatePath, 'utf8');
        
        // Replace placeholders with config values
        template = template.replace(/\{\{PROTOCOL_NAME\}\}/g, config.protocol_name || 'Unknown Protocol');
        template = template.replace(/\{\{DATE\}\}/g, config.date || new Date().toISOString().split('T')[0]);
        template = template.replace(/\{\{PROTOCOL_DESCRIPTION\}\}/g, config.protocol_description || 'Protocol description not provided.');
        template = template.replace(/\{\{COMMIT_HASH\}\}/g, config.commit_hash || 'Not specified');
        template = template.replace(/\{\{SCOPE\}\}/g, config.scope || 'Scope not defined');
        template = template.replace(/\{\{ROLES\}\}/g, config.roles || 'Roles not defined');
        template = template.replace(/\{\{AUDIT_OBJECTIVE\}\}/g, config.audit_objective || 'Comprehensive security review');
        
        // Replace issue counts
        const issues = config.issues || {};
        template = template.replace(/\{\{HIGH_COUNT\}\}/g, issues.high || 0);
        template = template.replace(/\{\{MEDIUM_COUNT\}\}/g, issues.medium || 0);
        template = template.replace(/\{\{LOW_COUNT\}\}/g, issues.low || 0);
        template = template.replace(/\{\{INFO_COUNT\}\}/g, issues.info || 0);
        
        const totalCount = (issues.high || 0) + (issues.medium || 0) + (issues.low || 0) + (issues.info || 0);
        template = template.replace(/\{\{TOTAL_COUNT\}\}/g, totalCount);
        
        // Replace findings content
        template = template.replace(/\{\{KEY_RISKS\}\}/g, config.key_risks || 'Key risks to be analyzed.');
        template = template.replace(/\{\{TOP_RECOMMENDATIONS\}\}/g, config.top_recommendations || 'Recommendations to be provided.');
        template = template.replace(/\{\{HIGH_FINDINGS\}\}/g, config.findings?.high || 'No high severity findings.');
        template = template.replace(/\{\{MEDIUM_FINDINGS\}\}/g, config.findings?.medium || 'No medium severity findings.');
        template = template.replace(/\{\{LOW_FINDINGS\}\}/g, config.findings?.low || 'No low severity findings.');
        template = template.replace(/\{\{INFO_FINDINGS\}\}/g, config.findings?.info || 'No informational findings.');
        
        // Write processed template
        fs.writeFileSync(outputPath, template, 'utf8');
        
        console.log(`✅ Template processed successfully: ${outputPath}`);
        
    } catch (error) {
        console.error(`❌ Error processing template: ${error.message}`);
        process.exit(1);
    }
}

// Command line usage
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length !== 3) {
        console.error('Usage: node process-template.js <config.json> <template.md> <output.md>');
        process.exit(1);
    }
    
    const [configPath, templatePath, outputPath] = args;
    processTemplate(configPath, templatePath, outputPath);
}

module.exports = { processTemplate };