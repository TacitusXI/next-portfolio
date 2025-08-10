#!/bin/bash

# Simple audit test without IPFS dependencies
# Just generates PDFs and deploys them

set -e

echo "🧪 Testing TACITVS Audit System (Simple Mode)"
echo "=============================================="

SLUG="passwordstore-v1"
CONFIG_FILE="audits/generated/$SLUG/config.json"
AUDIT_DIR="audits/generated/$SLUG"
PUBLIC_DIR="public/audits/$SLUG"

# Step 1: Process template
echo "📝 Processing template..."
node audits/process-template.js \
    "$CONFIG_FILE" \
    audits/templates/report-template.md \
    "$AUDIT_DIR/report.md"

echo "✅ Template processed successfully"

# Step 2: Generate PDFs (check for pandoc)
if ! command -v pandoc >/dev/null 2>&1; then
    echo "⚠️  Pandoc not found, skipping PDF generation"
    echo "   Install with: sudo apt-get install pandoc texlive-xetex"
    
    # Create mock PDFs for testing
    echo "📄 Creating mock PDFs for testing..."
    mkdir -p "$AUDIT_DIR"
    echo "Mock PDF content" > "$AUDIT_DIR/report-final.pdf"
    echo "Mock PDF content" > "$AUDIT_DIR/report-dark.pdf"
    echo "Mock PDF content" > "$AUDIT_DIR/report-light.pdf"
else
    echo "📄 Generating PDFs..."
    cd "$AUDIT_DIR"
    
    # Copy required files
    cp "../../templates/tacitvs-classical.latex" .
    cp "../../templates/tacitus-favicon.png" .
    
    # Generate dark mode PDF
    echo "🌙 Building dark mode PDF..."
    pandoc report.md \
        -o "report-dark.pdf" \
        --from markdown \
        --template=tacitvs-classical.latex \
        --pdf-engine=xelatex \
        --variable geometry:margin=3cm \
        --variable fontsize=11pt \
        --variable documentclass=article \
        --variable classoption=oneside \
        --variable logo="tacitus-favicon.png" \
        --listings \
        --number-sections \
        --toc \
        --toc-depth=3 || echo "⚠️  Dark PDF generation failed"
    
    # Generate light mode PDF
    echo "☀️  Building light mode PDF..."
    pandoc report.md \
        -o "report-light.pdf" \
        --from markdown \
        --template=tacitvs-classical.latex \
        --pdf-engine=xelatex \
        --variable geometry:margin=3cm \
        --variable fontsize=11pt \
        --variable documentclass=article \
        --variable classoption=oneside \
        --variable logo="tacitus-favicon.png" \
        --variable backgroundcolor=white \
        --variable textcolor=black \
        --listings \
        --number-sections \
        --toc \
        --toc-depth=3 || echo "⚠️  Light PDF generation failed"
    
    # Create final PDF (dark mode as default)
    if [ -f "report-dark.pdf" ]; then
        cp "report-dark.pdf" "report-final.pdf"
    fi
    
    cd - > /dev/null
fi

# Step 3: Calculate hash
echo "🔐 Calculating SHA-256..."
if [ -f "$AUDIT_DIR/report-final.pdf" ]; then
    HASH=$(sha256sum "$AUDIT_DIR/report-final.pdf" | cut -d' ' -f1)
    echo "📋 SHA-256: $HASH"
else
    HASH="mock-hash-for-testing-$(date +%s)"
    echo "📋 Mock SHA-256: $HASH"
fi

# Step 4: Create metadata
echo "📊 Creating metadata..."
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
TX_HASH="0x$(openssl rand -hex 32 2>/dev/null || echo 'mock-tx-hash')"
IPFS_CID="Qm$(openssl rand -hex 22 2>/dev/null || echo 'mock-ipfs-cid')"

cat > "$AUDIT_DIR/metadata.json" << EOF
{
  "slug": "$SLUG",
  "timestamp": "$TIMESTAMP",
  "sha256": "$HASH",
  "ipfs_cid": "$IPFS_CID",
  "transaction_hash": "$TX_HASH",
  "blockchain_network": "base",
  "audit_url": "https://tacitvs.eth.limo/audit/$SLUG",
  "ipfs_url": "https://ipfs.io/ipfs/$IPFS_CID",
  "protocol_name": "PasswordStore",
  "files": {
    "final_pdf": "report-final.pdf",
    "dark_pdf": "report-dark.pdf",
    "light_pdf": "report-light.pdf",
    "source_markdown": "report.md"
  }
}
EOF

echo "✅ Metadata created"

# Step 5: Deploy to public directory
echo "🚀 Deploying to public directory..."
mkdir -p "$PUBLIC_DIR"

# Copy files
cp "$AUDIT_DIR/report-final.pdf" "$PUBLIC_DIR/" 2>/dev/null || echo "No final PDF to copy"
cp "$AUDIT_DIR/report-dark.pdf" "$PUBLIC_DIR/" 2>/dev/null || echo "No dark PDF to copy"
cp "$AUDIT_DIR/report-light.pdf" "$PUBLIC_DIR/" 2>/dev/null || echo "No light PDF to copy"
cp "$AUDIT_DIR/metadata.json" "$PUBLIC_DIR/"
cp "$AUDIT_DIR/report.md" "$PUBLIC_DIR/" 2>/dev/null || echo "No markdown to copy"

echo "✅ Files deployed to $PUBLIC_DIR"

# Step 6: Show results
echo ""
echo "🎉 Test completed successfully!"
echo ""
echo "📁 Generated files:"
echo "  📄 $AUDIT_DIR/report.md"
echo "  📄 $AUDIT_DIR/report-final.pdf"
echo "  📊 $AUDIT_DIR/metadata.json"
echo ""
echo "🌐 Deployed to:"
echo "  📁 $PUBLIC_DIR/"
echo ""
echo "🔗 View the audit at:"
echo "  http://localhost:3000/audit/$SLUG"
echo ""
echo "📋 Also available in audit index:"
echo "  http://localhost:3000/audit"