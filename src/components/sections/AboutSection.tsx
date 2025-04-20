'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { useBackground } from '../effects/BackgroundProvider';
import { personalInfo, skills } from '@/data/content';

const AboutContainer = styled.section`
  padding: 8rem 2rem;
  position: relative;
  overflow: hidden;
`;

const ContentGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  margin-bottom: 4rem;
  text-align: center;
  background: linear-gradient(135deg, rgb(115, 74, 253) 0%, rgb(49, 164, 253) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ImageContainer = styled(motion.div)`
  position: relative;
  height: 600px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 1024px) {
    height: 500px;
    margin: 0 auto;
    max-width: 400px;
  }
  
  @media (max-width: 768px) {
    height: 400px;
  }
`;

const NFTOverlay = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: rgba(10, 10, 15, 0.85);
  backdrop-filter: blur(10px);
  border-top: 2px solid rgba(115, 74, 253, 0.6);
  color: white;
  z-index: 10;
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  transform: translateY(100%);
  
  ${ImageContainer}:hover & {
    transform: translateY(0);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, 
      rgba(115, 74, 253, 0) 0%,
      rgba(115, 74, 253, 1) 50%,
      rgba(49, 164, 253, 0) 100%
    );
    animation: scanEffect 2s linear infinite;
  }
  
  @keyframes scanEffect {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const NFTBadge = styled.div`
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  color: white;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  width: 120px;
  font-size: 0.65rem;
  letter-spacing: 0.5px;
  box-shadow: none;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(115, 74, 253, 0.8) 0%, rgba(49, 164, 253, 0.8) 100%);
    clip-path: polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%, 15% 50%);
    border: 1px solid rgba(255, 255, 255, 0.2);
    z-index: -1;
  }
  
  &::after {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    bottom: 2px;
    background: rgba(0, 0, 0, 0.4);
    clip-path: polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%, 15% 50%);
    z-index: -1;
  }
  
  &:hover {
    transform: scale(1.05);
    box-shadow: none;
  }
  
  &:hover::after {
    background: linear-gradient(90deg, 
      rgb(115, 74, 253) 0%, 
      rgb(49, 164, 253) 100%);
    opacity: 0.6;
  }
  
  span {
    padding-left: 10px;
  }
`;

const ImageLink = styled.a`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
  cursor: pointer;
`;

const NFTLink = styled.a`
  color: rgb(49, 164, 253);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.5rem;
  
  &:hover {
    color: rgb(115, 74, 253);
    text-decoration: underline;
  }
`;

const ENSLink = styled.a`
  color: rgb(115, 74, 253);
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    text-decoration: underline;
    opacity: 0.9;
  }
`;

const ProfileImage = styled(Image)`
  object-fit: cover;
  transition: transform 0.5s ease;
  
  ${ImageContainer}:hover & {
    transform: scale(1.05);
  }
`;

const GlowOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(58, 134, 255, 0.2) 0%,
    rgba(58, 134, 255, 0) 70%
  );
  pointer-events: none;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, 
      rgba(115, 74, 253, 0) 0%,
      rgba(115, 74, 253, 0.1) 50%,
      rgba(49, 164, 253, 0) 100%
    );
    animation: scanline 3s ease-in-out infinite;
  }
  
  @keyframes scanline {
    0% {
      transform: translateY(-100%);
    }
    50% {
      transform: translateY(100%);
    }
    100% {
      transform: translateY(-100%);
    }
  }
`;

const BioText = styled(motion.p)`
  font-size: 1.1rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
`;

const HighlightText = styled.span`
  color: #3a86ff;
  font-weight: 600;
`;

const TagsContainer = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

const Tag = styled(motion.span)`
  background: rgba(49, 164, 253, 0.15);
  color: rgb(49, 164, 253);
  padding: 0.5rem 1rem;
  border-radius: 30px;
  font-size: 0.9rem;
  border: 1px solid rgba(49, 164, 253, 0.3);
  backdrop-filter: blur(5px);
  
  &:hover {
    background: rgba(115, 74, 253, 0.15);
    border-color: rgba(115, 74, 253, 0.3);
  }
`;

const DetailsList = styled(motion.ul)`
  list-style-type: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled(motion.li)`
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  
  &::before {
    content: '→';
    color: rgb(49, 164, 253);
    margin-right: 0.5rem;
    font-weight: bold;
  }
  
  &:hover::before {
    color: rgb(115, 74, 253);
  }
`;

const DownloadButton = styled(motion.div)`
  background: rgba(30, 30, 30, 0.5);
  color: white;
  font-weight: 600;
  padding: 0.8rem 2rem;
  border-radius: 4px;
  border: 1px solid rgba(58, 134, 255, 0.5);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(5px);
  margin-top: 2rem;
  align-self: flex-start;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: rgba(58, 134, 255, 0.1);
    border-color: rgba(58, 134, 255, 0.8);
    transform: translateY(-3px);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const ProfileColumn = styled(motion.div)`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProfileInfo = styled.div`
  text-align: center;
  margin-top: 1rem;
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const SocialLink = styled(motion.a)`
  color: white;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.2);
  }
`;

const BioColumn = styled(motion.div)`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const BioTextContent = styled.p`
  margin-bottom: 1rem;
`;

// Add a new styled component for the Latin text
const LatinText = styled.span`
  font-family: 'Times New Roman', serif;
  font-style: italic;
  font-weight: 500;
  letter-spacing: 1px;
  display: inline-block;
  position: relative;
  padding: 0 3px;
  
  .first-part {
    color: rgb(115, 74, 253);
  }
  
  .second-part {
    color: rgb(49, 164, 253);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, 
      rgb(115, 74, 253) 0%, 
      rgb(49, 164, 253) 100%);
    opacity: 0.6;
  }
`;

export default function AboutSection() {
  const { setBackgroundType } = useBackground();
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
    if (inView) {
      controls.start('visible');
      
      setBackgroundType('none');
    }
  }, [inView, controls, setBackgroundType]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };
  
  const tagVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: (custom: number) => ({
      scale: 1,
      opacity: 1,
      transition: { delay: 0.3 + custom * 0.1, duration: 0.5 }
    })
  };
  
  const tags = skills.flatMap(category => category.items.slice(0, 3)).slice(0, 8);
  
  return (
    <AboutContainer id="about" ref={ref}>
      <SectionTitle
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
        variants={{
          visible: { opacity: 1, y: 0 }
        }}
        transition={{ duration: 0.8 }}
        className="cyberpunk-section-title cyberpunk-title-md"
        data-text="Human_v1.Interface"
        data-mobile-text="About"
      >
        Human_v1.Interface
      </SectionTitle>
      
      <ContentGrid className="content-section-enhanced">
        <ProfileColumn
          initial={{ opacity: 0, x: -50 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, x: 0 }
          }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <ImageContainer>
            <ProfileImage 
              src="/images/tacitus.webp" 
              alt={personalInfo.name}
              width={400}
              height={600}
              priority
            />
            <GlowOverlay />
            <ImageLink 
              href={`https://etherscan.io/tx/0x47b82ed65cc4aafbf02bb6754b6e36e6361822e36320b9620bd8521aef0e06a3`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View NFT transaction on Etherscan"
            />
            <NFTBadge>
              <span className="neotech-text">NFT VERIFIED</span>
            </NFTBadge>
            <NFTOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <h4 style={{ 
                marginTop: 0, 
                marginBottom: '0.8rem', 
                color: 'rgb(115, 74, 253)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontFamily: 'monospace',
                position: 'relative',
                display: 'inline-block'
              }}>
                NFT_Asset::Authenticated
                <span style={{
                  position: 'absolute',
                  left: '0.5rem',
                  right: 0,
                  top: '0.1rem',
                  display: 'block',
                  transform: 'translateX(-5px)',
                  opacity: 0.5,
                  filter: 'blur(1px)',
                  color: 'rgb(49, 164, 253)'
                }}>NFT_Asset::Authenticated</span>
              </h4>
              <div style={{ 
                padding: '0.5rem 0.8rem',
                background: 'rgba(15, 15, 20, 0.5)',
                border: '1px solid rgba(115, 74, 253, 0.3)',
                borderRadius: '4px',
                marginBottom: '0.8rem'
              }}>
                <p style={{ margin: '0.3rem 0', fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.85)' }}>
                  <span style={{ color: 'rgb(49, 164, 253)' }}>→</span> Blockchain: Ethereum mainnet
                </p>
                <p style={{ margin: '0.3rem 0', fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.85)' }}>
                  <span style={{ color: 'rgb(49, 164, 253)' }}>→</span> Creator: <ENSLink href="https://etherscan.io/address/0x8EF3FB6e99AB797A16E6fa6E72a9534A32aCA709" target="_blank" rel="noopener noreferrer">tacitvs.eth</ENSLink>
                </p>
              </div>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: '0.3rem', 
                fontSize: '0.9rem', 
                fontFamily: 'monospace',
                background: 'rgba(15, 15, 20, 0.5)',
                border: '1px solid rgba(49, 164, 253, 0.3)',
                borderRadius: '4px',
                padding: '0.5rem 0.8rem',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '3px', 
                  height: '100%', 
                  background: 'rgb(115, 74, 253)' 
                }}></div>
                <span style={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  paddingBottom: '0.3rem'
                }}>
                  <span>TX_HASH</span>
                  <span style={{ 
                    color: 'rgb(49, 164, 253)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <span style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      background: 'rgb(0, 220, 130)',
                      boxShadow: '0 0 5px rgb(0, 220, 130)',
                      animation: 'pulse 2s infinite'
                    }}></span>
                    CONFIRMED
                  </span>
                </span>
                <code style={{ 
                  padding: '0.4rem 0',
                  color: 'rgb(49, 164, 253)',
                  wordBreak: 'break-all',
                  fontSize: '0.85rem',
                  letterSpacing: '0.05rem'
                }}>
                  {`0x47b82ed65cc4aafbf02bb6754b6e36e6361822e36320b9620bd8521aef0e06a3`}
                </code>
              </div>
              <NFTLink 
                href={`https://etherscan.io/tx/0x47b82ed65cc4aafbf02bb6754b6e36e6361822e36320b9620bd8521aef0e06a3`}
                target="_blank"
                rel="noopener noreferrer"
                className="neotech-text"
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  VERIFY_ON_CHAIN
                </span>
                <span style={{ fontSize: '1.2rem', marginLeft: '0.25rem' }}>&#8594;</span>
              </NFTLink>
            </NFTOverlay>
          </ImageContainer>
          <ProfileInfo className="enhanced-text">
            <h3>{personalInfo.name}</h3>
            <p className="neotech-text" style={{ fontSize: '0.95rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
              <LatinText>
                <span className="first-part">vel</span> <span className="second-part">TacitusXI</span>
              </LatinText>
            </p>
            <p>{personalInfo.title}</p>
            <p>{personalInfo.location}</p>
            
            <SocialLinks>
              {personalInfo.socials?.map((social: { name: string; url: string; icon: React.ReactNode }) => (
                <SocialLink 
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                </SocialLink>
              ))}
            </SocialLinks>
          </ProfileInfo>
        </ProfileColumn>
        
        <BioColumn
          initial={{ opacity: 0, x: 50 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, x: 0 }
          }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <BioText className="enhanced-text">
            {isClient && (
              <>
                <BioTextContent>
                  I write <HighlightText>smart contracts</HighlightText> that don&apos;t just function — they deliver.
                </BioTextContent>
                <BioTextContent>
                  With 3+ years in blockchain dev and deep hands-on experience in EVM-based ecosystems, 
                  I specialize in building secure, gas-efficient smart contract systems for DeFi protocols, 
                  NFT marketplaces, and decentralized apps.
                </BioTextContent>
                <BioTextContent style={{ marginTop: '1.5rem' }}>
                  <HighlightText>What I bring to the table:</HighlightText>
                </BioTextContent>
              </>
            )}
          </BioText>
          
          {isClient && (
            <DetailsList variants={containerVariants} style={{ marginBottom: '1.5rem' }}>
              <DetailItem variants={itemVariants}>
                Solidity mastery with a focus on architecture, modularity, and upgradeability
              </DetailItem>
              <DetailItem variants={itemVariants}>
                Cross-chain integration know-how (EVM chains, bridges, wallets)
              </DetailItem>
              <DetailItem variants={itemVariants}>
                Strong TypeScript/JavaScript frontend integration
              </DetailItem>
              <DetailItem variants={itemVariants}>
                Optimizing contract performance and mitigating security risks
              </DetailItem>
              <DetailItem variants={itemVariants}>
                Technical reviewer for blockchain publications
              </DetailItem>
            </DetailsList>
          )}
          
          <BioText className="enhanced-text">
            {isClient && (
              <BioTextContent>
                Currently exploring <HighlightText>advanced DeFi mechanics</HighlightText>, 
                on-chain governance patterns, and <HighlightText>ZK-friendly architecture</HighlightText>. 
                Always pushing for smarter, safer, and more composable protocols.
              </BioTextContent>
            )}
          </BioText>
          
          <TagsContainer variants={containerVariants}>
            {tags.map((tag, index) => (
              <Tag
                key={tag}
                variants={tagVariants}
                custom={index}
                className="neotech-text"
              >
                {tag}
              </Tag>
            ))}
          </TagsContainer>
          
          <DownloadButton
            as="a"
            href="./Ivan_Leskov_Web3_Solidity_Engineer.pdf"
            target="_blank"
            rel="noopener noreferrer"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="neotech-button"
            style={{ 
              color: 'white',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem' 
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M12 16l-5-5h3V4h4v7h3l-5 5zm9 4v-2H3v2h18z" />
            </svg>
            Download Resume
          </DownloadButton>
        </BioColumn>
      </ContentGrid>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% {
            opacity: 0.6;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
          100% {
            opacity: 0.6;
            transform: scale(0.8);
          }
        }
      `}} />
    </AboutContainer>
  );
} 