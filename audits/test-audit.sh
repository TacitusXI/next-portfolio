#!/bin/bash

# Test script for the audit system
# This will test the PDF generation without blockchain components

set -e

echo "🧪 Testing TACITVS Audit System"
echo "==============================="

# Test the template processor
echo "📝 Testing template processor..."
node audits/process-template.js \
    audits/generated/passwordstore-v1/config.json \
    audits/templates/report-template.md \
    audits/generated/passwordstore-v1/report.md

echo "✅ Template processed successfully"

# Test dry run of audit publisher (PDF generation only)
echo "📄 Testing PDF generation..."
./audits/audit-publisher.sh passwordstore-v1 \
    --config audits/generated/passwordstore-v1/config.json \
    --dry-run

echo "✅ Test completed successfully!"
echo ""
echo "📋 Generated files:"
echo "  📁 audits/generated/passwordstore-v1/report.md"
echo "  📁 audits/generated/passwordstore-v1/report-final.pdf"
echo "  📁 audits/generated/passwordstore-v1/report-dark.pdf"
echo "  📁 audits/generated/passwordstore-v1/report-light.pdf"
echo ""
echo "🌐 To view the audit page, start the Next.js dev server and visit:"
echo "   http://localhost:3000/audit/passwordstore-v1"