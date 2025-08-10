# TACITVS Audit System

A comprehensive audit publishing system that handles PDF generation, IPFS upload, blockchain anchoring, and web deployment in a single command.

## Features

🔒 **Cryptographic Verification**
- SHA-256 hash calculation
- Blockchain anchoring (Base/Polygon/Arbitrum)
- IPFS distributed storage
- OpenTimestamps Bitcoin proofs

📄 **Professional PDF Generation**
- Dark mode for digital viewing
- Light mode for printing/annotation
- Classical typography with TACITVS branding
- QR codes for verification and contact

🌐 **Web Integration**
- Dynamic Next.js routes (`/audit/<slug>`)
- Download buttons for all versions
- Copyable hashes and transaction links
- Explorer integration

## Quick Start

### 1. Create an Audit Configuration

Create a configuration file for your audit:

```json
{
  "protocol_name": "YourProtocol",
  "date": "2024-01-08",
  "protocol_description": "Description of the protocol being audited",
  "commit_hash": "git-commit-hash",
  "scope": "./src/\n|-- Contract.sol",
  "roles": "- Owner: Description\n- User: Description",
  "audit_objective": "Comprehensive security review...",
  "issues": {
    "high": 2,
    "medium": 1,
    "low": 0,
    "info": 1
  },
  "key_risks": "- Risk 1\n- Risk 2",
  "top_recommendations": "1. Recommendation 1\n2. Recommendation 2",
  "findings": {
    "high": "LaTeX formatted findings...",
    "medium": "LaTeX formatted findings...",
    "low": "LaTeX formatted findings...",
    "info": "LaTeX formatted findings..."
  }
}
```

### 2. Generate and Publish Audit

Run the complete workflow:

```bash
# Full publication (PDF + IPFS + Blockchain + Deploy)
./audits/audit-publisher.sh your-protocol-v1 --config path/to/config.json

# PDF generation only (for testing)
./audits/audit-publisher.sh your-protocol-v1 --config path/to/config.json --dry-run

# Skip specific steps
./audits/audit-publisher.sh your-protocol-v1 --config path/to/config.json --skip-blockchain
```

### 3. View Your Audit

Visit: `https://tacitvs.eth.limo/audit/your-protocol-v1`

## Directory Structure

```
audits/
├── templates/              # Template files
│   ├── tacitvs-classical.latex   # LaTeX template
│   ├── tacitus-favicon.png       # Logo
│   └── report-template.md        # Markdown template
├── generated/              # Generated audit reports
│   └── <slug>/            # Individual audit directories
│       ├── config.json    # Audit configuration
│       ├── report.md      # Generated markdown
│       ├── report-*.pdf   # Generated PDFs
│       └── metadata.json  # Publication metadata
├── audit-publisher.sh     # Main publication script
├── process-template.js    # Template processor
└── test-audit.sh         # Test script
```

## Configuration Options

### Audit Publisher Script

```bash
./audits/audit-publisher.sh <slug> [options]

Options:
  --config FILE       Path to audit configuration file
  --network NETWORK   Blockchain network (base, polygon, arbitrum)
  --skip-ipfs         Skip IPFS upload
  --skip-blockchain   Skip blockchain anchoring
  --skip-ots          Skip OpenTimestamps
  --dry-run          Generate PDF only, skip publishing
  --help             Show help message
```

### Environment Variables

```bash
# IPFS Configuration
export IPFS_GATEWAY="https://ipfs.io/ipfs"

# Blockchain Configuration
export BLOCKCHAIN_NETWORK="base"

# Smart Contract Configuration (implement these)
export PROOF_CONTRACT_ADDRESS="0x..."
export PRIVATE_KEY="0x..."
export RPC_URL="https://..."
```

## Dependencies

### Required Tools

```bash
# LaTeX for PDF generation
sudo apt-get install texlive-xetex texlive-latex-extra

# Pandoc for document conversion
sudo apt-get install pandoc

# IPFS for distributed storage
curl -sSL https://dist.ipfs.io/go-ipfs/v0.17.0/go-ipfs_v0.17.0_linux-amd64.tar.gz | tar -xz
sudo mv go-ipfs/ipfs /usr/local/bin/

# OpenTimestamps (optional)
pip install opentimestamps-client
```

### Node.js Packages

The template processor uses built-in Node.js modules only.

## Smart Contract Integration

To enable blockchain anchoring, implement a `ProofOfAudit` smart contract:

```solidity
pragma solidity ^0.8.0;

contract ProofOfAudit {
    mapping(bytes32 => string) public proofs;
    
    function anchor(bytes32 hash, string memory uri) external {
        proofs[hash] = uri;
        emit AuditAnchored(hash, uri, msg.sender, block.timestamp);
    }
    
    event AuditAnchored(bytes32 hash, string uri, address auditor, uint256 timestamp);
}
```

## Examples

### Example 1: Basic Usage

```bash
# Create configuration
cat > audit-config.json << EOF
{
  "protocol_name": "MyProtocol",
  "audit_objective": "Security review of core contracts",
  "issues": {"high": 1, "medium": 2, "low": 0, "info": 1},
  ...
}
EOF

# Generate and publish
./audits/audit-publisher.sh myprotocol-v1 --config audit-config.json
```

### Example 2: Testing Workflow

```bash
# Test with provided example
./audits/test-audit.sh
```

### Example 3: Custom Network

```bash
# Use Polygon network
./audits/audit-publisher.sh myprotocol-v1 \
  --config audit-config.json \
  --network polygon
```

## Output

After successful execution, you'll get:

1. **PDF Reports**: Dark mode, light mode, and final versions
2. **Metadata**: JSON file with all verification data
3. **IPFS Hash**: Distributed storage identifier
4. **Transaction Hash**: Blockchain anchor proof
5. **Web Page**: Accessible at `/audit/<slug>`

## Troubleshooting

### Common Issues

1. **LaTeX errors**: Ensure all required packages are installed
2. **IPFS failures**: Check IPFS daemon is running (`ipfs daemon`)
3. **Missing dependencies**: Run `./audits/audit-publisher.sh --help` to see requirements

### Debug Mode

Add debug output to scripts:

```bash
set -x  # Enable debug mode
```

## Security Considerations

1. **Private Keys**: Never commit private keys to version control
2. **IPFS Privacy**: Remember that IPFS content is public
3. **Blockchain Costs**: Consider gas prices for anchoring transactions
4. **Verification**: Always verify generated hashes match uploaded content

## Contributing

1. Test changes with `./audits/test-audit.sh`
2. Ensure all dependencies are documented
3. Follow the existing code style
4. Update this README for new features