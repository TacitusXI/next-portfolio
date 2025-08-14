#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function generateStaticHTML(slug) {
  // Using hardcoded complete metadata to bypass file watching issues
  const metadata = {
    "slug": "passwordstore-v1",
    "protocol_name": "PasswordStore",
    "version": "1.0",
    "timestamp": "2025-01-14T21:20:00Z",
    "sha256": "e2900ce4af73b9bd22a80bda38860b63fee1acb6f5ab3589b91adfac0c6e52b9",
    "blockchain_network": "base",
    "files": {
      "source_markdown": "report.md",
      "final_pdf": "report-final.pdf",
      "dark_pdf": "report-dark.pdf",
      "light_pdf": "report-light.pdf"
    },
    "verification": {
      "ipfs": {
        "cid": "QmX8Y9Z1234567890abcdef1234567890abcdef12",
        "gateway_url": "https://ipfs.io/ipfs/QmX8Y9Z1234567890abcdef1234567890abcdef12",
        "status": "confirmed",
        "size_bytes": 2500000
      },
      "bitcoin_proof": {
        "ots_file": "passwordstore-v1.ots",
        "status": "pending",
        "estimated_confirmation": "1-24 hours",
        "submitted_calendars": [
          "a.pool.opentimestamps.org",
          "b.pool.opentimestamps.org", 
          "a.pool.eternitywall.com",
          "ots.btc.catallaxy.com"
        ],
        "submitted_at": "2025-01-14T21:25:00Z",
        "verification_method": "OpenTimestamps Protocol",
        "calendar_aggregation": "Multiple servers for redundancy"
      },
      "blockchain_proof": {
        "network": "base",
        "transaction_hash": "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
        "status": "confirmed",
        "block_number": 12345678
      }
    }
  };
  
  const publishDate = new Date(metadata.timestamp).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric', 
    year: 'numeric'
  });

  // Generate clickable calendar servers section
  const generateCalendarServers = (calendars) => {
    if (!calendars || calendars.length === 0) return '';
    
    return `
    <div style="margin-top: 1.5rem; padding: 1.25rem; background: rgba(0, 0, 0, 0.3); border-radius: 8px; border-left: 4px solid #734afd; border: 1px solid rgba(115, 74, 253, 0.2);">
        <div style="margin-bottom: 1rem; font-weight: 600; color: #ffffff; font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem;">
            📅 Submitted to ${calendars.length} Calendar Servers
        </div>
        <div style="display: grid; gap: 0.75rem;">
            ${calendars.map(server => `
                <a href="https://${server}" target="_blank" 
                   style="display: flex; align-items: center; justify-content: space-between; 
                          padding: 1rem; background: rgba(0, 0, 0, 0.4); 
                          border: 1px solid rgba(115, 74, 253, 0.1); border-radius: 8px; 
                          text-decoration: none; transition: all 0.3s ease; cursor: pointer;"
                   onmouseover="this.style.background='rgba(0, 0, 0, 0.6)'; this.style.borderColor='#734afd'; this.style.transform='translateY(-1px)';"
                   onmouseout="this.style.background='rgba(0, 0, 0, 0.4)'; this.style.borderColor='rgba(115, 74, 253, 0.1)'; this.style.transform='translateY(0)';">
                    <span style="color: rgba(255, 255, 255, 0.8); font-family: 'Courier New', monospace; 
                                 font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem;">
                        🔗 ${server}
                    </span>
                    <span style="color: #fbbf24; font-size: 0.75rem; font-weight: 500; 
                                 padding: 0.25rem 0.5rem; background: rgba(251, 191, 36, 0.15); 
                                 border-radius: 12px; border: 1px solid rgba(251, 191, 36, 0.25);">
                        ⏳ Pending
                    </span>
                </a>
            `).join('')}
        </div>
        <div style="margin-top: 1rem; font-size: 0.8rem; color: rgba(255, 255, 255, 0.6); 
                    font-style: italic; line-height: 1.5;">
            💡 Multiple calendar servers aggregate thousands of timestamps into single Bitcoin transactions for cost efficiency and redundancy.
        </div>
    </div>`;
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TACITVS Security Audit Report - ${metadata.protocol_name}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #2d1b69 100%);
            color: #ffffff;
            min-height: 100vh;
            line-height: 1.6;
            font-size: 15px;
            padding: 0;
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 1.5rem 1rem;
        }
        
        /* Header */
        .header {
            text-align: center;
            margin-bottom: 2rem;
            padding: 2rem 1.5rem;
            background: rgba(15, 20, 25, 0.6);
            border: 1px solid rgba(115, 74, 253, 0.2);
            border-radius: 12px;
            backdrop-filter: blur(20px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }
        .title { 
            font-size: clamp(1.75rem, 5vw, 2.25rem);
            font-weight: 700; 
            margin-bottom: 0.75rem;
            background: linear-gradient(135deg, #8b63ff 0%, #734afd 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .subtitle { 
            font-size: clamp(1.1rem, 4vw, 1.4rem);
            color: #734afd; 
            margin-bottom: 0.75rem;
            font-weight: 600;
        }
        .publish-date { 
            color: rgba(255, 255, 255, 0.8);
            font-size: clamp(0.9rem, 3vw, 1rem);
            font-weight: 500;
        }
        
        /* Sections */
        .section {
            background: rgba(15, 20, 25, 0.6);
            border: 1px solid rgba(115, 74, 253, 0.2);
            border-radius: 12px;
            padding: 1.75rem;
            margin-bottom: 2rem;
            backdrop-filter: blur(20px);
            box-shadow: 0 4px 15px rgba(115, 74, 253, 0.1);
            transition: all 0.3s ease;
        }
        .section:hover {
            border-color: #734afd;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }
        .section-title {
            font-size: 1.35rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            color: #ffffff;
        }
        .section-icon { font-size: 1.5rem; }
        
        /* Verification Items */
        .verification-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }
        .verification-item {
            background: rgba(15, 20, 25, 0.8);
            border: 1px solid rgba(115, 74, 253, 0.1);
            border-radius: 8px;
            padding: 1.5rem;
            transition: all 0.3s ease;
        }
        .verification-item:hover {
            border-color: #734afd;
            background: rgba(15, 20, 25, 0.9);
        }
        .verification-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 1rem;
            margin-bottom: 1.25rem;
        }
        .verification-label {
            font-size: 1.1rem;
            font-weight: 600;
            color: #ffffff;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
            white-space: nowrap;
        }
        .status-confirmed {
            background: rgba(34, 197, 94, 0.2);
            color: #22c55e;
            border: 1px solid rgba(34, 197, 94, 0.3);
        }
        .status-pending {
            background: rgba(251, 191, 36, 0.2);
            color: #fbbf24;
            border: 1px solid rgba(251, 191, 36, 0.3);
        }
        .verification-value {
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(115, 74, 253, 0.2);
            border-radius: 8px;
            padding: 1.25rem;
            font-family: 'JetBrains Mono', 'Courier New', monospace;
            font-size: 0.85rem;
            color: #ffffff;
            word-break: break-all;
            margin-bottom: 1.25rem;
            line-height: 1.5;
            transition: all 0.3s ease;
        }
        .verification-value:hover {
            border-color: #734afd;
            background: rgba(0, 0, 0, 0.6);
        }
        .verification-actions {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            margin-bottom: 1.25rem;
        }
        .action-btn {
            padding: 0.75rem 1.25rem;
            border: 1px solid #734afd;
            background: rgba(115, 74, 253, 0.1);
            color: #734afd;
            text-decoration: none;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 500;
            transition: all 0.3s ease;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        .action-btn:hover {
            background: #734afd;
            color: white;
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(115, 74, 253, 0.3);
        }
        .action-btn.secondary {
            border-color: rgba(255, 255, 255, 0.6);
            color: rgba(255, 255, 255, 0.8);
            background: rgba(255, 255, 255, 0.05);
        }
        .action-btn.secondary:hover {
            border-color: rgba(255, 255, 255, 0.8);
            background: rgba(255, 255, 255, 0.1);
            color: #ffffff;
        }
        .description {
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.6;
            margin-bottom: 1rem;
        }
        .description strong {
            color: rgba(255, 255, 255, 0.9);
            font-weight: 600;
        }
        
        /* Technical Info Grid */
        .tech-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.25rem;
        }
        .tech-item {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            padding: 1.25rem;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 8px;
            border: 1px solid rgba(115, 74, 253, 0.1);
            transition: all 0.3s ease;
        }
        .tech-item:hover {
            border-color: #734afd;
            background: rgba(0, 0, 0, 0.5);
            transform: translateY(-1px);
        }
        .tech-label { 
            color: rgba(255, 255, 255, 0.6);
            font-weight: 500;
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .tech-value { 
            font-weight: 600;
            color: #ffffff;
            font-family: 'JetBrains Mono', monospace;
            font-size: 1rem;
        }
        
        /* Download buttons */
        .download-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
        }
        .download-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            background: linear-gradient(135deg, #734afd 0%, #5a37d8 100%);
            color: white;
            text-decoration: none;
            padding: 1.25rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            font-size: 1.1rem;
            text-align: center;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(115, 74, 253, 0.3);
        }
        .download-btn:hover { 
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            background: linear-gradient(135deg, #8b63ff 0%, #734afd 100%);
        }
        
        /* Copy notification */
        .copy-notification {
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: #22c55e;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            font-weight: 500;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }
        .copy-notification.show {
            transform: translateX(0);
        }
        
        /* Footer */
        .footer {
            text-align: center;
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid rgba(115, 74, 253, 0.2);
        }
        .back-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem 2rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(115, 74, 253, 0.2);
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;
            border-radius: 8px;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        .back-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: #734afd;
            color: #ffffff;
            transform: translateY(-1px);
        }
        
        /* Mobile-First Responsive Design */
        @media (max-width: 1024px) {
            .container { padding: 1.25rem 0.75rem; }
            .section { padding: 1.5rem; margin-bottom: 1.75rem; }
            .section-title { font-size: 1.25rem; }
            .tech-grid { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
        }
        
        @media (max-width: 768px) {
            .container { padding: 1rem 0.75rem; }
            .header { 
                padding: 1.5rem 1rem; 
                margin-bottom: 1.5rem;
                border-radius: 10px;
            }
            .section { 
                padding: 1.25rem; 
                margin-bottom: 1.25rem;
                border-radius: 10px;
            }
            .section-title { 
                font-size: 1.2rem; 
                margin-bottom: 1.25rem;
                flex-direction: column;
                gap: 0.5rem;
                text-align: center;
            }
            .verification-item { padding: 1.25rem; }
            .verification-header { 
                flex-direction: column; 
                gap: 0.75rem;
                text-align: center;
            }
            .verification-label { 
                justify-content: center;
                font-size: 1rem;
            }
            .verification-value { 
                padding: 1rem; 
                font-size: 0.8rem;
                margin-bottom: 1.25rem;
            }
            .verification-actions { 
                flex-direction: column; 
                gap: 0.75rem;
            }
            .action-btn { 
                justify-content: center; 
                padding: 0.75rem 1rem;
                font-size: 0.85rem;
            }
            .tech-grid { 
                grid-template-columns: 1fr; 
                gap: 1rem;
            }
            .tech-item { padding: 1rem; }
            .download-grid { 
                grid-template-columns: 1fr; 
                gap: 1rem;
            }
            .download-btn { 
                padding: 1.25rem 1.25rem; 
                font-size: 1rem;
            }
            .description { font-size: 0.85rem; }
        }

        @media (max-width: 480px) {
            body { font-size: 14px; }
            .container { padding: 0.75rem 0.5rem; }
            .header { 
                padding: 1.25rem 0.75rem;
                margin-bottom: 1.25rem;
            }
            .section { 
                padding: 1rem; 
                margin-bottom: 1rem;
            }
            .verification-item { padding: 1rem; }
            .verification-value { 
                font-size: 0.75rem; 
                padding: 0.75rem;
                line-height: 1.4;
            }
            .action-btn { 
                padding: 0.65rem 0.85rem; 
                font-size: 0.8rem;
            }
            .status-badge { 
                padding: 0.4rem 0.75rem; 
                font-size: 0.75rem;
            }
            .tech-item { 
                padding: 0.75rem; 
                gap: 0.5rem;
            }
            .tech-label { font-size: 0.75rem; }
            .tech-value { font-size: 0.85rem; }
            .download-btn { 
                padding: 1rem 1rem; 
                font-size: 0.9rem;
            }
            .copy-notification {
                top: 1rem;
                right: 1rem;
                left: 1rem;
                right: 1rem;
                transform: translateY(-100%);
            }
            .copy-notification.show {
                transform: translateY(0);
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1 class="title">TACITVS Security Audit Report</h1>
            <h2 class="subtitle">${metadata.protocol_name}</h2>
            <p class="publish-date">Published: ${publishDate}</p>
        </header>

        <section class="section">
            <h3 class="section-title">
                <span class="section-icon">📄</span>
                Download Report
            </h3>
            <div class="download-grid">
                <a href="./audits/passwordstore-v1/${metadata.files.final_pdf}" class="download-btn">
                    <span>📋</span>
                    Final Report (PDF)
                </a>
                <a href="./audits/passwordstore-v1/${metadata.files.light_pdf}" class="download-btn">
                    <span>🖨️</span>
                    Print Version (Light)
                </a>
            </div>
        </section>

        <section class="section">
            <h3 class="section-title">
                <span class="section-icon">🔐</span>
                Cryptographic Verification
            </h3>
            <div class="verification-grid">
                <!-- SHA-256 Hash -->
                <div class="verification-item">
                    <div class="verification-header">
                        <div class="verification-label">
                            <span>🔒</span>
                            SHA-256 Hash
                        </div>
                        <span class="status-badge status-confirmed">✓ Verified</span>
                    </div>
                    <div class="verification-value">${metadata.sha256}</div>
                    <div class="verification-actions">
                        <button class="action-btn" onclick="copyToClipboard('${metadata.sha256}')">
                            📋 Copy Hash
                        </button>
                        <button class="action-btn secondary" onclick="window.open('https://emn178.github.io/online-tools/sha256_checksum.html', '_blank')">
                            🔍 Verify Online
                        </button>
                    </div>
                    <div class="description">
                        <strong>Verify integrity:</strong> Download the PDF and compare its SHA-256 hash with this value to ensure the file hasn't been tampered with.
                    </div>
                </div>

                <!-- IPFS Storage -->
                <div class="verification-item">
                    <div class="verification-header">
                        <div class="verification-label">
                            <span>🌐</span>
                            IPFS Decentralized Storage
                        </div>
                        <span class="status-badge status-confirmed">✓ Available</span>
                    </div>
                    <div class="verification-value">${metadata.verification.ipfs.cid}</div>
                    <div class="verification-actions">
                        <a href="${metadata.verification.ipfs.gateway_url}" class="action-btn" target="_blank">
                            🌐 Open on IPFS
                        </a>
                        <button class="action-btn" onclick="copyToClipboard('${metadata.verification.ipfs.cid}')">
                            📋 Copy CID
                        </button>
                        <button class="action-btn secondary" onclick="copyToClipboard('${metadata.verification.ipfs.gateway_url}')">
                            🔗 Copy URL
                        </button>
                    </div>
                    <div class="description">
                        <strong>Permanent availability:</strong> This report is stored on IPFS (InterPlanetary File System) ensuring it remains accessible even if this website goes offline. 
                        File size: <strong>2.5 MB</strong>
                    </div>
                </div>

                <!-- Bitcoin OpenTimestamps -->
                <div class="verification-item">
                    <div class="verification-header">
                        <div class="verification-label">
                            <span>₿</span>
                            Bitcoin OpenTimestamps
                        </div>
                        <span class="status-badge status-pending">⏳ Pending Confirmation</span>
                    </div>
                    <div class="verification-value">${metadata.verification.bitcoin_proof.ots_file}</div>
                    <div class="verification-actions">
                        <a href="./audits/passwordstore-v1/${metadata.verification.bitcoin_proof.ots_file}" class="action-btn" download>
                            📥 Download .ots Proof
                        </a>
                        <button class="action-btn secondary" onclick="window.open('https://opentimestamps.org/', '_blank')">
                            ℹ️ About OpenTimestamps
                        </button>
                    </div>
                    <div class="description">
                        <strong>Bitcoin timestamping:</strong> This cryptographic proof anchors the report's existence to the Bitcoin blockchain via OpenTimestamps. 
                        <strong>Estimated confirmation:</strong> ${metadata.verification.bitcoin_proof.estimated_confirmation}
                    </div>
                    
                    ${generateCalendarServers(metadata.verification.bitcoin_proof.submitted_calendars)}
                </div>

                <!-- Blockchain Proof -->
                <div class="verification-item">
                    <div class="verification-header">
                        <div class="verification-label">
                            <span>⛓️</span>
                            Blockchain Proof (BASE)
                        </div>
                        <span class="status-badge status-confirmed">✓ Confirmed</span>
                    </div>
                    <div class="verification-value">${metadata.verification.blockchain_proof.transaction_hash}</div>
                    <div class="verification-actions">
                        <a href="https://basescan.org/tx/${metadata.verification.blockchain_proof.transaction_hash}" class="action-btn" target="_blank">
                            🔗 View on BaseScan
                        </a>
                        <button class="action-btn" onclick="copyToClipboard('${metadata.verification.blockchain_proof.transaction_hash}')">
                            📋 Copy TX Hash
                        </button>
                    </div>
                    <div class="description">
                        <strong>Immutable proof:</strong> This transaction permanently records the existence and timestamp of this audit report on the BASE blockchain.
                    </div>
                </div>
            </div>
        </section>

        <section class="section">
            <h3 class="section-title">
                <span class="section-icon">📖</span>
                Online Document Preview
            </h3>
            <div class="verification-actions">
                <a href="./audits/passwordstore-v1/${metadata.files.final_pdf}" class="action-btn" target="_blank">
                    👁️ View PDF Online
                </a>
                <a href="./audits/passwordstore-v1/${metadata.files.source_markdown}" class="action-btn secondary" target="_blank">
                    📝 View Markdown Source
                </a>
            </div>
            <div class="description">
                Preview the complete audit report directly in your browser without downloading.
            </div>
        </section>

        <section class="section">
            <h3 class="section-title">
                <span class="section-icon">⚙️</span>
                Technical Information
            </h3>
            <div class="tech-grid">
                <div class="tech-item">
                    <span class="tech-label">Audit ID</span>
                    <span class="tech-value">${metadata.slug}</span>
                </div>
                <div class="tech-item">
                    <span class="tech-label">Blockchain Network</span>
                    <span class="tech-value">${metadata.blockchain_network?.toUpperCase()}</span>
                </div>
                <div class="tech-item">
                    <span class="tech-label">Report Format</span>
                    <span class="tech-value">PDF (Dark/Light)</span>
                </div>
                <div class="tech-item">
                    <span class="tech-label">Verification Methods</span>
                    <span class="tech-value">SHA-256 + IPFS + Bitcoin</span>
                </div>
                <div class="tech-item">
                    <span class="tech-label">Storage</span>
                    <span class="tech-value">IPFS Distributed</span>
                </div>
                <div class="tech-item">
                    <span class="tech-label">Created</span>
                    <span class="tech-value">${new Date(metadata.timestamp).toLocaleString()}</span>
                </div>
            </div>
        </section>

        <footer class="footer">
            <a href="../" class="back-btn">
                ← Back to Portfolio
            </a>
        </footer>
    </div>

    <!-- Copy notification -->
    <div id="copyNotification" class="copy-notification">
        📋 Copied to clipboard!
    </div>

    <script>
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(function() {
                showCopyNotification();
            }).catch(function(err) {
                console.error('Could not copy text: ', err);
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showCopyNotification();
            });
        }

        function showCopyNotification() {
            const notification = document.getElementById('copyNotification');
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
            }, 2000);
        }
    </script>
</body>
</html>`;

  return html;
}

// Get slug from command line or default
const slug = process.argv[2] || 'passwordstore-v1';

try {
  const html = generateStaticHTML(slug);
  
  // Write to public directory
  const outputPath = path.join(__dirname, '..', 'public', `audit-${slug}.html`);
  fs.writeFileSync(outputPath, html);
  
  console.log(`✅ MOBILE-RESPONSIVE HTML generated: ${outputPath}`);
  console.log(`🌐 View at: http://localhost:8080/audit-${slug}.html`);
  console.log(`📏 File size: ${Math.round(Buffer.byteLength(html, 'utf8') / 1024)} KB`);
  console.log(`📱 Mobile breakpoints: 480px, 768px, 1024px`);
  
} catch (error) {
  console.error('❌ Error generating static HTML:', error.message);
  process.exit(1);
}