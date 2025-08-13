'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styled from 'styled-components';

// Brand-consistent styled components
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

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #734afd;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px rgba(115, 74, 253, 0.5);
`;

const BadgeContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
`;

const Badge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 5, 20, 0.6);
  border: 1px solid rgba(115, 74, 253, 0.3);
  border-radius: 20px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  backdrop-filter: blur(10px);

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const AuditCard = styled(motion.div)`
  background: rgba(0, 5, 20, 0.65);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(58, 134, 255, 0.2);
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(115, 74, 253, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(115, 74, 253, 0.2);
  }
`;

const CardHeader = styled.div`
  margin-bottom: 1rem;
`;

const ProtocolTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
`;

const CardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const CardDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
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
    width: 1rem;
    height: 1rem;
  }
`;

const SecondaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
  
  svg {
    width: 1rem;
    height: 1rem;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  
  svg {
    width: 4rem;
    height: 4rem;
    color: rgba(255, 255, 255, 0.3);
    margin: 0 auto 1.5rem;
  }
  
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 0.5rem;
  }
  
  p {
    color: rgba(255, 255, 255, 0.6);
  }
`;

interface AuditSummary {
  slug: string;
  timestamp: string;
  protocol_name?: string;
  blockchain_network: string;
  files: {
    final_pdf: string;
  };
}

export default function AuditIndexPage() {
  const [audits, setAudits] = useState<AuditSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAudits = async () => {
      try {
        // In a real implementation, you'd have an API endpoint that lists all audits
        // For now, we'll manually list known audits
        const knownAudits = ['passwordstore-v1']; // Add more as you create them
        
        const auditPromises = knownAudits.map(async (slug) => {
          try {
            const response = await fetch(`./audits/${slug}/metadata.json`);
            if (response.ok) {
              const metadata = await response.json();
              return {
                slug: metadata.slug,
                timestamp: metadata.timestamp,
                protocol_name: metadata.protocol_name,
                blockchain_network: metadata.blockchain_network,
                files: metadata.files
              };
            }
          } catch (error) {
            console.error(`Failed to load audit ${slug}:`, error);
          }
          return null;
        });

        const results = await Promise.all(auditPromises);
        const validAudits = results.filter(audit => audit !== null) as AuditSummary[];
        
        // Sort by timestamp (newest first)
        validAudits.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        setAudits(validAudits);
      } catch (error) {
        console.error('Failed to fetch audits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAudits();
  }, []);

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
          <p style={{ color: '#734afd', fontSize: '1.1rem' }}>Loading audit reports...</p>
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
          <Title>TACITVS Security Audit Reports</Title>
          <Subtitle>Comprehensive security assessments with cryptographic verification</Subtitle>
          
          <BadgeContainer>
            <Badge>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Blockchain Verified
            </Badge>
            <Badge>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
              </svg>
              IPFS Distributed
            </Badge>
            <Badge>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Cryptographically Secured
            </Badge>
          </BadgeContainer>
        </Header>

        {/* Audit List */}
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {audits.length === 0 ? (
            <EmptyState>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3>No Audit Reports Found</h3>
              <p>Audit reports will appear here once they are published and deployed.</p>
            </EmptyState>
          ) : (
            audits.map((audit, index) => (
              <AuditCard
                key={audit.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <CardHeader>
                  <ProtocolTitle>{audit.protocol_name || audit.slug}</ProtocolTitle>
                  <CardMeta>
                    <MetaItem>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(audit.timestamp).toLocaleDateString()}
                    </MetaItem>
                    <MetaItem>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      {audit.blockchain_network.toUpperCase()}
                    </MetaItem>
                    <MetaItem>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {audit.slug}
                    </MetaItem>
                  </CardMeta>
                </CardHeader>
                
                <CardDescription>
                  Comprehensive security audit with blockchain verification and distributed storage.
                </CardDescription>
                
                <ButtonContainer>
                  <PrimaryButton href={`/audit/${audit.slug}`}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Report
                  </PrimaryButton>
                  
                  <SecondaryButton
                    href={`./audits/${audit.slug}/${audit.files.final_pdf}`}
                    download
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                  </SecondaryButton>
                </ButtonContainer>
              </AuditCard>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <BackButton href="../">
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