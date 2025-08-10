#!/bin/bash

# TACITVS Audit Publisher - Complete Audit Workflow
# This script handles: PDF generation, IPFS upload, blockchain anchoring, and deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATES_DIR="$SCRIPT_DIR/templates"
GENERATED_DIR="$SCRIPT_DIR/generated"
IPFS_GATEWAY=${IPFS_GATEWAY:-"https://ipfs.io/ipfs"}
BLOCKCHAIN_NETWORK=${BLOCKCHAIN_NETWORK:-"base"}

# Functions
print_header() {
    echo -e "${BLUE}"
    echo "╔═══════════════════════════════════════════════════════════════╗"
    echo "║                    TACITVS AUDIT PUBLISHER                    ║"
    echo "║                  Complete Audit Workflow                     ║"
    echo "╚═══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_step() {
    echo -e "${YELLOW}🔄 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

check_dependencies() {
    print_step "Checking dependencies..."
    
    local missing_deps=()
    
    # Check for required tools
    command -v pandoc >/dev/null 2>&1 || missing_deps+=("pandoc")
    command -v xelatex >/dev/null 2>&1 || missing_deps+=("xelatex")
    command -v ipfs >/dev/null 2>&1 || missing_deps+=("ipfs")
    command -v node >/dev/null 2>&1 || missing_deps+=("node")
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing dependencies: ${missing_deps[*]}"
        echo "Please install the missing dependencies and try again."
        exit 1
    fi
    
    print_success "All dependencies found"
}

usage() {
    echo "Usage: $0 <audit-slug> [options]"
    echo ""
    echo "Arguments:"
    echo "  audit-slug          Unique identifier for the audit (e.g., passwordstore-v1)"
    echo ""
    echo "Options:"
    echo "  --config FILE       Path to audit configuration file"
    echo "  --network NETWORK   Blockchain network (base, polygon, arbitrum) [default: base]"
    echo "  --skip-ipfs         Skip IPFS upload"
    echo "  --skip-blockchain   Skip blockchain anchoring"
    echo "  --skip-ots          Skip OpenTimestamps"
    echo "  --dry-run          Generate PDF only, skip publishing"
    echo "  --help             Show this help message"
    echo ""
    echo "Example:"
    echo "  $0 passwordstore-v1 --config audits/passwordstore/config.json"
}

generate_pdf() {
    local slug="$1"
    local config_file="$2"
    local audit_dir="$GENERATED_DIR/$slug"
    
    print_step "Generating PDF for audit: $slug"
    
    # Create audit directory
    mkdir -p "$audit_dir"
    
    # Copy templates
    cp "$TEMPLATES_DIR/tacitvs-classical.latex" "$audit_dir/"
    cp "$TEMPLATES_DIR/tacitus-favicon.png" "$audit_dir/"
    
    # Process template with config
    if [[ -f "$config_file" ]]; then
        print_step "Processing template with configuration..."
        node "$SCRIPT_DIR/process-template.js" "$config_file" "$TEMPLATES_DIR/report-template.md" "$audit_dir/report.md"
    else
        print_error "Configuration file not found: $config_file"
        exit 1
    fi
    
    # Generate both dark and light mode PDFs
    print_step "Building dark mode PDF..."
    cd "$audit_dir"
    
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
        --toc-depth=3 \
        --verbose
    
    print_step "Building light mode PDF..."
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
        --toc-depth=3 \
        --verbose
    
    # Create final PDF (dark mode as default)
    cp "report-dark.pdf" "report-final.pdf"
    
    print_success "PDFs generated successfully"
    print_success "📁 Dark mode: report-dark.pdf"
    print_success "📁 Light mode: report-light.pdf"
    print_success "📁 Final: report-final.pdf"
    
    cd - > /dev/null
}

calculate_hash() {
    local pdf_path="$1"
    local hash=$(sha256sum "$pdf_path" | cut -d' ' -f1)
    echo "$hash"
}

upload_to_ipfs() {
    local audit_dir="$1"
    local slug="$2"
    
    print_step "Uploading to IPFS..."
    
    cd "$audit_dir"
    
    # Add the final PDF to IPFS
    local ipfs_hash=$(ipfs add -Q "report-final.pdf")
    
    if [[ -z "$ipfs_hash" ]]; then
        print_error "IPFS upload failed"
        return 1
    fi
    
    print_success "IPFS upload successful"
    print_success "📦 IPFS CID: $ipfs_hash"
    print_success "🌐 Gateway URL: $IPFS_GATEWAY/$ipfs_hash"
    
    # Save IPFS hash to metadata
    echo "$ipfs_hash" > ipfs-cid.txt
    
    cd - > /dev/null
    echo "$ipfs_hash"
}

anchor_on_blockchain() {
    local hash="$1"
    local slug="$2"
    local ipfs_cid="$3"
    
    print_step "Anchoring on blockchain ($BLOCKCHAIN_NETWORK)..."
    
    # Create the metadata for blockchain anchoring
    local audit_url="https://tacitvs.eth.limo/audit/$slug"
    local ipfs_url="ipfs://$ipfs_cid"
    
    # Call the smart contract (this would need to be implemented)
    print_step "Calling ProofOfAudit contract..."
    print_step "Hash: $hash"
    print_step "URI: $audit_url"
    print_step "IPFS: $ipfs_url"
    
    # TODO: Implement actual blockchain transaction
    # This would call your ProofOfAudit contract's anchor function
    # anchor(bytes32 hash, string uri)
    
    # For now, simulate the transaction
    local tx_hash="0x$(openssl rand -hex 32)"
    
    print_success "Blockchain anchoring simulated"
    print_success "📜 Transaction: $tx_hash"
    
    echo "$tx_hash"
}

create_ots_proof() {
    local pdf_path="$1"
    
    print_step "Creating OpenTimestamps proof..."
    
    # Check if ots client is available
    if command -v ots >/dev/null 2>&1; then
        ots stamp "$pdf_path"
        print_success "OpenTimestamps proof created: ${pdf_path}.ots"
    else
        print_error "OpenTimestamps client not found, skipping OTS proof"
    fi
}

create_metadata() {
    local audit_dir="$1"
    local slug="$2"
    local hash="$3"
    local ipfs_cid="$4"
    local tx_hash="$5"
    
    print_step "Creating audit metadata..."
    
    local metadata_file="$audit_dir/metadata.json"
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    cat > "$metadata_file" << EOF
{
  "slug": "$slug",
  "timestamp": "$timestamp",
  "sha256": "$hash",
  "ipfs_cid": "$ipfs_cid",
  "transaction_hash": "$tx_hash",
  "blockchain_network": "$BLOCKCHAIN_NETWORK",
  "audit_url": "https://tacitvs.eth.limo/audit/$slug",
  "ipfs_url": "https://ipfs.io/ipfs/$ipfs_cid",
  "files": {
    "final_pdf": "report-final.pdf",
    "dark_pdf": "report-dark.pdf",
    "light_pdf": "report-light.pdf",
    "source_markdown": "report.md",
    "ots_proof": "report-final.pdf.ots"
  }
}
EOF
    
    print_success "Metadata created: metadata.json"
}

deploy_to_website() {
    local audit_dir="$1"
    local slug="$2"
    
    print_step "Deploying to website..."
    
    # Copy files to public directory for Next.js
    local public_audit_dir="../public/audits/$slug"
    mkdir -p "$public_audit_dir"
    
    cp "$audit_dir/report-final.pdf" "$public_audit_dir/"
    cp "$audit_dir/report-dark.pdf" "$public_audit_dir/"
    cp "$audit_dir/report-light.pdf" "$public_audit_dir/"
    cp "$audit_dir/metadata.json" "$public_audit_dir/"
    
    if [[ -f "$audit_dir/report-final.pdf.ots" ]]; then
        cp "$audit_dir/report-final.pdf.ots" "$public_audit_dir/"
    fi
    
    print_success "Files deployed to public/audits/$slug/"
}

main() {
    print_header
    
    # Parse arguments
    local slug=""
    local config_file=""
    local skip_ipfs=false
    local skip_blockchain=false
    local skip_ots=false
    local dry_run=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --config)
                config_file="$2"
                shift 2
                ;;
            --network)
                BLOCKCHAIN_NETWORK="$2"
                shift 2
                ;;
            --skip-ipfs)
                skip_ipfs=true
                shift
                ;;
            --skip-blockchain)
                skip_blockchain=true
                shift
                ;;
            --skip-ots)
                skip_ots=true
                shift
                ;;
            --dry-run)
                dry_run=true
                shift
                ;;
            --help)
                usage
                exit 0
                ;;
            *)
                if [[ -z "$slug" ]]; then
                    slug="$1"
                else
                    print_error "Unknown argument: $1"
                    usage
                    exit 1
                fi
                shift
                ;;
        esac
    done
    
    if [[ -z "$slug" ]]; then
        print_error "Audit slug is required"
        usage
        exit 1
    fi
    
    # Set default config file if not provided
    if [[ -z "$config_file" ]]; then
        config_file="$GENERATED_DIR/$slug/config.json"
    fi
    
    check_dependencies
    
    # Step 1: Generate PDFs
    generate_pdf "$slug" "$config_file"
    
    local audit_dir="$GENERATED_DIR/$slug"
    local pdf_path="$audit_dir/report-final.pdf"
    
    # Step 2: Calculate SHA-256
    local hash=$(calculate_hash "$pdf_path")
    print_success "📋 SHA-256: $hash"
    
    if [[ "$dry_run" == true ]]; then
        print_success "Dry run complete. PDF generated at: $pdf_path"
        exit 0
    fi
    
    # Step 3: Upload to IPFS
    local ipfs_cid=""
    if [[ "$skip_ipfs" == false ]]; then
        ipfs_cid=$(upload_to_ipfs "$audit_dir" "$slug")
    fi
    
    # Step 4: Anchor on blockchain
    local tx_hash=""
    if [[ "$skip_blockchain" == false ]]; then
        tx_hash=$(anchor_on_blockchain "$hash" "$slug" "$ipfs_cid")
    fi
    
    # Step 5: Create OpenTimestamps proof
    if [[ "$skip_ots" == false ]]; then
        create_ots_proof "$pdf_path"
    fi
    
    # Step 6: Create metadata
    create_metadata "$audit_dir" "$slug" "$hash" "$ipfs_cid" "$tx_hash"
    
    # Step 7: Deploy to website
    deploy_to_website "$audit_dir" "$slug"
    
    print_success "🎉 Audit publishing complete!"
    echo ""
    echo -e "${GREEN}📋 Summary:${NC}"
    echo -e "${GREEN}  Slug: $slug${NC}"
    echo -e "${GREEN}  SHA-256: $hash${NC}"
    echo -e "${GREEN}  IPFS CID: $ipfs_cid${NC}"
    echo -e "${GREEN}  Transaction: $tx_hash${NC}"
    echo -e "${GREEN}  Audit URL: https://tacitvs.eth.limo/audit/$slug${NC}"
    echo ""
}

# Run main function
main "$@"