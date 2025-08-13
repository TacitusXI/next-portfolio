# Automated Audit System

This system automatically detects new audit reports and makes them available on your portfolio website at `/audit/[slug]`.

## 🚀 Quick Start

The **PasswordStore** audit is already set up as an example and will appear automatically when you build your site.

## 📁 Directory Structure

```
audits/
├── source/                    # Source audit configurations
│   └── passwordstore-v1/      # Example audit
│       └── config.json        # Audit configuration
├── generated/                 # Auto-generated files
│   └── passwordstore-v1/      
│       ├── metadata.json      # Audit metadata
│       └── report.md          # Generated report
├── templates/                 # Templates for generation
│   └── report-template.md     # Markdown template
├── auto-build.js             # Full automation script
└── simple-build.js           # Simple setup script
```

## 🔄 How It Works

### Automatic Process (on every build)
1. **Detection**: Scans `audits/source/` for new audit directories
2. **Generation**: Creates metadata.json and report.md files
3. **Deployment**: Copies files to `public/audits/` for Next.js
4. **Integration**: Updates Next.js routing to include new audits

### Manual Testing
```bash
# Test audit generation
npm run build-audits

# Run development server
npm run dev
# Visit: http://localhost:3000/audit
```

## 📝 Adding New Audits

### 1. Create Source Directory
```bash
mkdir audits/source/my-new-audit-v1
```

### 2. Create Configuration
Create `audits/source/my-new-audit-v1/config.json`:
```json
{
  "protocol_name": "MyProtocol",
  "date": "2024-01-15",
  "protocol_description": "Description of the protocol",
  "commit_hash": "abc123",
  "scope": "Full smart contract audit",
  "roles": "Owner, Users",
  "audit_objective": "Security review",
  "blockchain_network": "base",
  "issues": {
    "high": 0,
    "medium": 1,
    "low": 2,
    "info": 3
  },
  "key_risks": "Main security risks",
  "top_recommendations": "Key recommendations",
  "findings": {
    "high": "High severity findings",
    "medium": "Medium severity findings", 
    "low": "Low severity findings",
    "info": "Informational findings"
  }
}
```

### 3. Optional: Add Custom Report
Create `audits/source/my-new-audit-v1/report.md` with your custom markdown content.

### 4. Build
```bash
npm run build
```

The new audit will automatically appear at `/audit/my-new-audit-v1`!

## 🎯 What Happens on Build

1. **`simple-build.js`** ensures audits are properly configured
2. **Next.js build** generates static pages for each audit
3. **`fix-ipfs-paths.js`** makes paths IPFS-compatible
4. **`fix-audit-paths.js`** ensures audit assets are properly linked

## ✅ Current Status

- ✅ **PasswordStore audit** is configured and ready
- ✅ **Automated detection** on every build
- ✅ **IPFS compatibility** maintained
- ✅ **Development server** working locally

## 🔗 URLs

- **Audit Index**: `/audit`
- **PasswordStore**: `/audit/passwordstore-v1`
- **Public Files**: `/audits/[slug]/metadata.json`

Your audit system is now fully automated! 🎉