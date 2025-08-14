'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styled from 'styled-components';

// Styled Components matching your brand
const AuditContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, 
    rgba(0, 5, 20, 0.95) 0%, 
    rgba(15, 23, 42, 0.95) 25%, 
    rgba(30, 41, 59, 0.95) 50%, 
    rgba(15, 23, 42, 0.95) 75%, 
    rgba(0, 5, 20, 0.95) 100%
  );
  position: relative;
  overflow-x: hidden;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 2rem 4rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 4rem 1rem 2rem;
  }
`;

const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 4rem;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const ProtocolName = styled.h2`
  font-size: 1.5rem;
  color: #734afd;
  margin-bottom: 0.5rem;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(115, 74, 253, 0.5);
`;

const PublishDate = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
`;

const SectionCard = styled(motion.div)`
  background: rgba(0, 5, 20, 0.65);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(58, 134, 255, 0.2);
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  
  &:hover {
    border-color: rgba(115, 74, 253, 0.4);
    transform: translateY(-2px);
    transition: all 0.3s ease;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Icon = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DownloadButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #734afd 0%, #3a86ff 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(115, 74, 253, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(115, 74, 253, 0.5);
  }
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const SecondaryButton = styled(DownloadButton)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const HashInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #734afd;
    box-shadow: 0 0 0 2px rgba(115, 74, 253, 0.2);
  }
`;

const CopyButton = styled.button`
  padding: 0.75rem 1rem;
  background: #734afd;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #5c3ed8;
    transform: translateY(-1px);
  }
`;

const ViewButton = styled.a`
  padding: 0.75rem 1rem;
  background: #10b981;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: #059669;
    transform: translateY(-1px);
  }
`;

const IPFSButton = styled.a`
  padding: 0.75rem 1rem;
  background: #8b5cf6;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: #7c3aed;
    transform: translateY(-1px);
  }
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
  
  svg {
    width: 1rem;
    height: 1rem;
  }
`;

interface AuditMetadata {
  slug: string;
  timestamp: string;
  sha256: string;
  protocol_name?: string;
  blockchain_network: string;
  audit_url: string;
  files: {
    final_pdf: string;
    dark_pdf: string;
    light_pdf: string;
    source_markdown: string;
  };
  verification?: {
    ipfs: {
      cid: string;
      gateway_url: string;
      pinned: boolean;
      size_bytes: number;
      status: string;
    };
    hash_verification: {
      algorithm: string;
      hash: string;
      verified: boolean;
    };
    blockchain_proof: {
      network: string;
      contract_address: string;
      transaction_hash: string;
      status: string;
    };
    bitcoin_proof: {
      ots_file: string;
      status: string;
      submitted_calendars?: string[];
      estimated_confirmation?: string;
      submitted_at?: string;
      calendar_aggregation?: string;
      verification_method?: string;
    };
  };
  timestamps?: {
    creation: {
      audit_completed: string;
      report_generated: string;
      description: string;
    };
    verification_chain: {
      ipfs_upload: string;
      bitcoin_submission: string;
      blockchain_anchor: string;
      description: string;
    };
    compliance: {
      format: string;
      source: string;
      accuracy: string;
      immutability: string;
    };
  };
  calendar_servers?: {
    [key: string]: {
      name: string;
      url: string;
      status: string;
      description: string;
    };
  };
}

interface AuditClientProps {
  slug: string;
}

export default function AuditClient({ slug }: AuditClientProps) {
  const [metadata, setMetadata] = useState<AuditMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  


  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        // Use absolute path in development, relative in production (IPFS)
        const basePath = typeof window !== 'undefined' && window.location.hostname === 'localhost' ? '/audits' : '../audits';
        const cacheBuster = `?v=${Date.now()}`;
        const response = await fetch(`${basePath}/${slug}/metadata.json${cacheBuster}`);
        if (!response.ok) {
          throw new Error('Audit not found');
        }
        const data = await response.json();
        setMetadata(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load audit');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchMetadata();
    }
  }, [slug]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getExplorerUrl = (network: string, txHash: string) => {
    const explorers = {
      base: 'https://basescan.org/tx/',
      polygon: 'https://polygonscan.com/tx/',
      arbitrum: 'https://arbiscan.io/tx/',
      ethereum: 'https://etherscan.io/tx/',
    };
    return explorers[network as keyof typeof explorers] + txHash;
  };

  if (loading) {
    return (
      <AuditContainer style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '3rem', 
            height: '3rem', 
            border: '2px solid #734afd', 
            borderTop: '2px solid transparent', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#734afd', fontSize: '1.1rem' }}>Loading audit report...</p>
        </div>
      </AuditContainer>
    );
  }

  if (error || !metadata) {
    return (
      <AuditContainer style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#ef4444', marginBottom: '1rem' }}>
            Audit Not Found
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '2rem', fontSize: '1.1rem' }}>
            {error || 'The requested audit report could not be found.'}
          </p>
          <BackButton href="/">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return Home
          </BackButton>
        </div>
      </AuditContainer>
    );
  }

  return (
    <AuditContainer>
      <ContentWrapper>
        {/* Header */}
        <Header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Title>TACITVS Security Audit Report</Title>
          <ProtocolName>{metadata.protocol_name || metadata.slug}</ProtocolName>
          <PublishDate>
            Published: {new Date(metadata.timestamp).toLocaleDateString()}
          </PublishDate>
        </Header>

        {/* Download Section */}
        <SectionCard
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <SectionTitle>
            <Icon>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </Icon>
            Download Report
          </SectionTitle>
          
          <ButtonGrid>
            <DownloadButton
              href={`/audits/${slug}/${metadata.files.final_pdf}`}
              download
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Final Report (PDF)
            </DownloadButton>
            
            <SecondaryButton
              href={`/audits/${slug}/${metadata.files.light_pdf}`}
              download
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Version (Light)
            </SecondaryButton>
          </ButtonGrid>
        </SectionCard>

        {/* Verification Section */}
        <SectionCard
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SectionTitle>
            <Icon>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </Icon>
            Cryptographic Verification
          </SectionTitle>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* SHA-256 Hash */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                SHA-256 Hash {metadata.verification?.hash_verification.verified && '✅'}
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <HashInput
                  type="text"
                  value={metadata.verification?.hash_verification.hash || metadata.sha256}
                  readOnly
                />
                <CopyButton onClick={() => copyToClipboard(metadata.verification?.hash_verification.hash || metadata.sha256)}>
                  Copy
                </CopyButton>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '0.25rem' }}>
                Verify this hash matches your downloaded PDF to ensure integrity
              </p>
            </div>

            {/* IPFS */}
            {metadata.verification?.ipfs && (
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                  IPFS Content ID {metadata.verification?.ipfs?.status === 'confirmed' && '🌐'}
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                  <HashInput
                  type="text"
                  value={metadata.verification?.ipfs?.cid || 'Loading...'}
                  readOnly
                />
                <CopyButton onClick={() => copyToClipboard(metadata.verification?.ipfs?.cid || '')}>
                  Copy
                </CopyButton>
                  <IPFSButton
                    href={metadata.verification?.ipfs?.gateway_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    IPFS
                  </IPFSButton>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '0.25rem' }}>
                  Decentralized storage ensuring permanent availability ({metadata.verification?.ipfs?.size_bytes ? Math.round(metadata.verification.ipfs.size_bytes / 1024 / 1024 * 100) / 100 : '...'} MB)
                </p>
              </div>
            )}

            {/* Blockchain Transaction */}
            {metadata.verification?.blockchain_proof && (
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                  Blockchain Proof ({metadata.verification?.blockchain_proof?.network?.toUpperCase() || 'BASE'}) {metadata.verification?.blockchain_proof?.status === 'confirmed' ? '⛓️' : '⏳'}
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <HashInput
                    type="text"
                    value={metadata.verification?.blockchain_proof?.transaction_hash || 'Pending...'}
                    readOnly
                  />
                  {metadata.verification?.blockchain_proof?.transaction_hash && metadata.verification.blockchain_proof.transaction_hash !== 'pending' && (
                    <ViewButton
                      href={getExplorerUrl(metadata.verification?.blockchain_proof?.network || 'base', metadata.verification.blockchain_proof.transaction_hash)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </ViewButton>
                  )}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '0.25rem' }}>
                  {metadata.verification.blockchain_proof.status === 'pending' 
                    ? 'Blockchain anchoring pending - will be completed soon'
                    : 'Immutable on-chain proof of report existence and timestamp'
                  }
                </p>
              </div>
            )}

            {/* Bitcoin OpenTimestamps */}
            {metadata.verification?.bitcoin_proof && (
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                  Bitcoin Timestamp {metadata.verification.bitcoin_proof.status === 'confirmed' ? '₿✅' : '₿⏳'}
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', padding: '0.5rem 1rem', background: 'rgba(255, 165, 0, 0.1)', borderRadius: '6px', border: '1px solid rgba(255, 165, 0, 0.3)' }}>
                    Status: {metadata.verification.bitcoin_proof.status.replace('_', ' ').toUpperCase()}
                  </div>
                  {metadata.verification.bitcoin_proof.ots_file && (
                    <SecondaryButton
                      href={`/audits/${metadata.slug}/${metadata.verification.bitcoin_proof.ots_file}`}
                      download
                    >
                      Download .ots
                    </SecondaryButton>
                  )}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '0.25rem' }}>
                  {metadata.verification.bitcoin_proof.status === 'pending_confirmation' 
                    ? `Bitcoin timestamp submitted to ${metadata.verification.bitcoin_proof.submitted_calendars?.length || 0} calendar servers. ${metadata.verification.bitcoin_proof.estimated_confirmation || 'Confirmation pending'}.`
                    : 'Bitcoin blockchain timestamp provides ultimate immutability proof'
                  }
                </p>
              </div>
            )}
          </div>
        </SectionCard>

        {/* Timestamp Information */}
        {metadata.timestamps && (
          <SectionCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <SectionTitle>
              <Icon>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Icon>
              Audit Timeline & Timestamps
            </SectionTitle>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Creation Timestamps */}
              <div>
                <h3 style={{ color: '#734afd', fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                  Audit Creation
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
                  <div style={{ padding: '1rem', background: 'rgba(115, 74, 253, 0.1)', borderRadius: '8px', border: '1px solid rgba(115, 74, 253, 0.2)' }}>
                    <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500', marginBottom: '0.5rem' }}>
                      Audit Completed
                    </p>
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'Monaco, monospace' }}>
                      {new Date(metadata.timestamps.creation.audit_completed).toLocaleString('en-US', { 
                        timeZone: 'UTC', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit',
                        second: '2-digit',
                        timeZoneName: 'short'
                      })}
                    </p>
                  </div>
                  <div style={{ padding: '1rem', background: 'rgba(58, 134, 255, 0.1)', borderRadius: '8px', border: '1px solid rgba(58, 134, 255, 0.2)' }}>
                    <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500', marginBottom: '0.5rem' }}>
                      Report Generated
                    </p>
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'Monaco, monospace' }}>
                      {new Date(metadata.timestamps.creation.report_generated).toLocaleString('en-US', { 
                        timeZone: 'UTC', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit',
                        second: '2-digit',
                        timeZoneName: 'short'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Verification Chain */}
              <div>
                <h3 style={{ color: '#10b981', fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                  Verification Timeline
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
                  <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500', marginBottom: '0.5rem' }}>
                      🌐 IPFS Upload
                    </p>
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'Monaco, monospace' }}>
                      {new Date(metadata.timestamps.verification_chain.ipfs_upload).toLocaleString('en-US', { 
                        timeZone: 'UTC', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit',
                        second: '2-digit',
                        timeZoneName: 'short'
                      })}
                    </p>
                  </div>
                  <div style={{ padding: '1rem', background: 'rgba(255, 165, 0, 0.1)', borderRadius: '8px', border: '1px solid rgba(255, 165, 0, 0.2)' }}>
                    <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500', marginBottom: '0.5rem' }}>
                      ₿ Bitcoin Submission
                    </p>
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'Monaco, monospace' }}>
                      {new Date(metadata.timestamps.verification_chain.bitcoin_submission).toLocaleString('en-US', { 
                        timeZone: 'UTC', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit',
                        second: '2-digit',
                        timeZoneName: 'short'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Compliance Information */}
              <div>
                <h3 style={{ color: '#f59e0b', fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                  Timestamp Compliance
                </h3>
                <div style={{ padding: '1.5rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
                    <div>
                      <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.25rem' }}>
                        <strong>Format:</strong> {metadata.timestamps.compliance.format}
                      </p>
                      <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.25rem' }}>
                        <strong>Source:</strong> {metadata.timestamps.compliance.source}
                      </p>
                    </div>
                    <div>
                      <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.25rem' }}>
                        <strong>Accuracy:</strong> {metadata.timestamps.compliance.accuracy}
                      </p>
                      <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.25rem' }}>
                        <strong>Immutability:</strong> {metadata.timestamps.compliance.immutability}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>
        )}

        {/* Calendar Servers */}
        {metadata.calendar_servers && (
          <SectionCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <SectionTitle>
              <Icon>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </Icon>
              OpenTimestamps Calendar Servers
            </SectionTitle>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {Object.entries(metadata.calendar_servers).map(([key, server]) => (
                <div 
                  key={key}
                  style={{ 
                    padding: '1.5rem', 
                    background: 'rgba(0, 5, 20, 0.5)', 
                    borderRadius: '8px', 
                    border: '1px solid rgba(58, 134, 255, 0.2)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h4 style={{ color: '#3a86ff', fontSize: '1rem', fontWeight: '600' }}>
                      {server.name}
                    </h4>
                    <div style={{ 
                      padding: '0.25rem 0.75rem', 
                      background: server.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', 
                      color: server.status === 'active' ? '#10b981' : '#ef4444',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {server.status.toUpperCase()}
                    </div>
                  </div>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    {server.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <a 
                      href={server.url}
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        color: '#3a86ff', 
                        textDecoration: 'none', 
                        fontSize: '0.75rem',
                        fontFamily: 'Monaco, monospace',
                        padding: '0.5rem',
                        background: 'rgba(58, 134, 255, 0.1)',
                        borderRadius: '4px',
                        border: '1px solid rgba(58, 134, 255, 0.2)',
                        flex: 1
                      }}
                    >
                      {server.url}
                    </a>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem', lineHeight: '1.5' }}>
                <strong>Calendar Aggregation:</strong> {metadata.verification?.bitcoin_proof?.calendar_aggregation || 'Multiple calendar servers aggregate timestamps in Merkle trees for efficiency and redundancy.'}
              </p>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem', lineHeight: '1.5', marginTop: '0.5rem' }}>
                <strong>Verification:</strong> {metadata.verification?.bitcoin_proof?.verification_method || 'Independent verification using Bitcoin blockchain without relying on calendar servers.'}
              </p>
            </div>
          </SectionCard>
        )}

        {/* Technical Details */}
        <SectionCard
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <SectionTitle>
            <Icon>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Icon>
            Technical Information
          </SectionTitle>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', fontSize: '0.875rem' }}>
            <div>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.25rem' }}>
                <strong>Audit ID:</strong> {metadata.slug}
              </p>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.25rem' }}>
                <strong>Network:</strong> {metadata.blockchain_network.toUpperCase()}
              </p>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.25rem' }}>
                <strong>Report Format:</strong> PDF (Dark/Light themes)
              </p>
            </div>
            <div>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.25rem' }}>
                <strong>Verification:</strong> SHA-256 + Blockchain
              </p>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.25rem' }}>
                <strong>Storage:</strong> IPFS Distributed
              </p>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.25rem' }}>
                <strong>Timestamp:</strong> {new Date(metadata.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <BackButton href="../../">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Portfolio
          </BackButton>
        </div>
      </ContentWrapper>
    </AuditContainer>
  );
}