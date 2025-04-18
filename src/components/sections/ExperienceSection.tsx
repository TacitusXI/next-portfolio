'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useBackground } from '../effects/BackgroundProvider';
import { experiences } from '@/data/content';
import { FaFilePdf, FaExternalLinkAlt, FaTimes, FaSearch } from 'react-icons/fa';

const ExperienceContainer = styled.section`
  padding: 8rem 2rem;
  position: relative;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  margin-bottom: 4rem;
  text-align: center;
  background: linear-gradient(135deg, rgb(115, 74, 253) 0%, rgb(49, 164, 253) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const TabsContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 3rem;
  gap: 1rem;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const Tab = styled.button<{ $isActive: boolean }>`
  padding: 0.8rem 1.5rem;
  background: ${props => props.$isActive ? 'rgba(49, 164, 253, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.$isActive ? 'rgb(49, 164, 253)' : 'rgba(255, 255, 255, 0.7)'};
  border: 1px solid ${props => props.$isActive ? 'rgb(49, 164, 253)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  min-width: fit-content;
  
  &:hover {
    background: rgba(115, 74, 253, 0.1);
    color: ${props => props.$isActive ? 'rgb(115, 74, 253)' : 'rgba(255, 255, 255, 0.9)'};
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem 1rem;
    font-size: 0.95rem;
  }
`;

const TimelinesContainer = styled.div`
  position: relative;
`;

const Timeline = styled(motion.div)<{ isVisible: boolean }>`
  display: ${props => props.isVisible ? 'block' : 'none'};
`;

const TimelineItem = styled(motion.div)`
  display: flex;
  margin-bottom: 4rem;
  position: relative;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 210px;
    top: 0;
    bottom: -4rem;
    width: 2px;
    background: linear-gradient(to bottom, rgb(115, 74, 253), rgb(49, 164, 253));
    
    @media (max-width: 768px) {
      left: 24px;
    }
  }
  
  &:last-child::before {
    bottom: 0;
  }
`;

const TimelineDate = styled.div`
  width: 180px;
  padding-right: 30px;
  text-align: right;
  font-size: 0.9rem;
  font-weight: 600;
  color: rgb(49, 164, 253);
  padding-top: 4px;
  
  @media (max-width: 768px) {
    width: auto;
    text-align: left;
    padding-left: 50px;
    margin-bottom: 0.5rem;
  }
`;

const TimelineDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgb(115, 74, 253);
  margin-right: 30px;
  margin-top: 1px;
  position: relative;
  z-index: 1;
  box-shadow: 0 0 0 4px rgba(115, 74, 253, 0.2);
  flex-shrink: 0;
  
  /* Centering the dot on the timeline */
  position: relative;
  left: -5px; /* Half the width of the dot */
  
  @media (max-width: 768px) {
    display: none; /* Hide the dot on mobile */
  }
`;

const TimelineContent = styled.div`
  flex: 1;
  padding: 1.5rem;
  background: rgba(10, 10, 20, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    margin-left: 50px; /* Ensure consistent spacing from timeline on mobile */
  }
  
  &:hover {
    background: rgba(10, 10, 20, 0.8);
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }
`;

const CertificateContent = styled(TimelineContent)`
  display: flex;
  flex-direction: column;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    gap: 1.5rem;
  }
  
  @media (max-width: 768px) {
    margin-left: 50px; /* Ensure consistent spacing from timeline on mobile */
  }
`;

const CertificateImageContainer = styled.div`
  width: 100%;
  height: 180px;
  position: relative;
  margin-bottom: 1.5rem;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid rgba(115, 74, 253, 0.3);
  background: rgba(15, 15, 25, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(115, 74, 253, 0.3);
  }
  
  @media (min-width: 768px) {
    width: 220px;
    min-width: 220px;
    height: 150px;
    margin-bottom: 0;
  }
`;

const CertificateImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const CertificatePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(15, 15, 25, 0.8);
`;

const PdfIcon = styled(FaFilePdf)`
  font-size: 2.5rem;
  color: rgba(115, 74, 253, 0.8);
  margin-bottom: 0.5rem;
`;

const ViewButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(115, 74, 253, 0.2);
  border: 1px solid rgba(115, 74, 253, 0.3);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  
  &:hover {
    background: rgba(115, 74, 253, 0.3);
    color: white;
  }
`;

const CertificateDetails = styled.div`
  flex: 1;
`;

const CertificateId = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 0.5rem;
  font-family: monospace;
`;

const TimelineTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: white;
  text-shadow: 0 0 5px rgba(115, 74, 253, 0.5);
`;

const TimelineSubtitle = styled.h4`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  margin-bottom: 1rem;
  
  span {
    color: rgb(49, 164, 253);
  }
`;

const TimelineDescription = styled.p`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
`;

const AchievementsList = styled.ul`
  margin-top: 1.5rem;
  padding-left: 0;
  list-style-type: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AchievementItem = styled.li`
  margin-bottom: 0.75rem;
  padding-left: 1.5rem;
  position: relative;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  
  &::before {
    content: '→';
    position: absolute;
    left: 0;
    color: rgb(115, 74, 253);
  }
  
  &:hover {
    color: white;
    text-shadow: 0 0 8px rgba(49, 164, 253, 0.5);
  }
`;

const SkillsList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
  list-style-type: none;
  padding: 0;
`;

const SkillItem = styled.li`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(49, 164, 253, 0.1);
  border: 1px solid rgba(49, 164, 253, 0.2);
  padding: 0.2rem 0.8rem;
  border-radius: 30px;
`;

// Modal overlay for PDF preview
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled(motion.div)`
  width: 100%;
  max-width: min(1000px, 90vw);
  max-height: 90vh;
  background: rgba(15, 15, 25, 0.9);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(115, 74, 253, 0.3);
  box-shadow: 0 0 30px rgba(115, 74, 253, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const CertificateImageView = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
`;

const ZoomableImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
  
  /* For certificates with white backgrounds */
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(15, 15, 25, 0.8);
  border: 1px solid rgba(115, 74, 253, 0.3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  
  &:hover {
    background: rgba(115, 74, 253, 0.2);
    transform: scale(1.1);
  }
`;

const LoadingIndicator = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  background: rgba(15, 15, 25, 0.9);
  
  svg {
    font-size: 2.5rem;
    color: rgba(115, 74, 253, 0.8);
    margin-bottom: 1rem;
    animation: pulse 1.5s infinite;
  }
  
  @keyframes pulse {
    0% { opacity: 0.6; transform: scale(0.95); }
    50% { opacity: 1; transform: scale(1.05); }
    100% { opacity: 0.6; transform: scale(0.95); }
  }
`;

// Add verification button
const VerifyButton = styled(ViewButton)`
  margin-top: 0.5rem;
  background: rgba(49, 164, 253, 0.2);
  border: 1px solid rgba(49, 164, 253, 0.3);
  
  &:hover {
    background: rgba(49, 164, 253, 0.3);
  }
`;

// Update interface to make certificateId optional
interface Certificate {
  id: number;
  date: string;
  title: string;
  institution: string;
  certificateId?: string;
  verifyUrl?: string;
  description: string;
  skills: string[];
  imagePath: string | null;
}

export default function ExperienceSection() {
  const { setBackgroundType, setIntensity, setColorScheme } = useBackground();
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const [activeTab, setActiveTab] = useState('work');
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageZoom, setImageZoom] = useState(1);
  const [imageRatio, setImageRatio] = useState({ width: 3, height: 2 }); // Default ratio
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
      
      // Change background when scrolling to Experience section
      setBackgroundType('digital');
      setIntensity(65);
      setColorScheme('blue');
    }
  }, [inView, controls, setBackgroundType, setIntensity, setColorScheme]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };
  
  const tabs = [
    { id: 'work', name: 'Work Experience' },
    { id: 'education', name: 'Certifications' }
  ];
  
  const certifications: Certificate[] = [
    {
      id: 1,
      date: '2023',
      title: 'CS50x',
      institution: 'Harvard University',
      certificateId: 'b33fa552-f15f-4ad2-951e-476acffff2e6',
      verifyUrl: 'https://certificates.cs50.io/b33fa552-f15f-4ad2-951e-476acffff2e6.pdf?size=letter',
      description: 'Completed ten problem sets, nine labs, and one final project covering computer science fundamentals, data structures, algorithms, and web development.',
      skills: ['Computer Science', 'C', 'Python', 'SQL', 'Web Development'],
      imagePath: '/images/certificates/CS50x.webp'
    },
    {
      id: 2,
      date: 'April 10, 2023',
      title: 'Algorithmic Trading & Technical Analysis',
      institution: 'Moralis Academy',
      description: 'Comprehensive training on trading analysis, strategy development, Pinescript, risk management, JavaScript trading, automation, and exchange API setup.',
      skills: ['Trading Analysis', 'Pinescript', 'JavaScript Trading', 'Risk Management', 'Exchange APIs'],
      imagePath: '/images/certificates/leskov-Algorithmic-Trading-amp-Technical-Analysis-Algorithmic-Trading-Technical-Analysis-v3-Moralis-Academy.webp'
    },
    {
      id: 3,
      date: 'May 17, 2022',
      title: 'Ethereum Smart Contract Security',
      institution: 'Moralis Academy',
      description: 'Advanced course covering DAO and Parity hack replication, security mindset, Solidity best practices, contract design, and secure contract patterns including upgradable, proxy, and pausable contracts.',
      skills: ['Smart Contract Security', 'Solidity', 'Hack Prevention', 'Upgradable Contracts'],
      imagePath: '/images/certificates/Ivan-Lieskov-Ethereum-Smart-Contract-Security-Ethereum-Smart-Contract-Security-Moralis-Moralis-Academy.webp'
    },
    {
      id: 4,
      date: 'May 15, 2022',
      title: 'Ethereum Smart Contract Programming 201',
      institution: 'Moralis Academy',
      description: 'Advanced smart contract development with Truffle, unit testing, ERC standards, migrations, OpenZeppelin contracts, and testnet deployment.',
      skills: ['Truffle', 'Unit Testing', 'ERC Standards', 'OpenZeppelin', 'Testnet Development'],
      imagePath: '/images/certificates/Ivan-Lieskov-Ethereum-Smart-Contract-Programming-201-Ethereum-Smart-Contract-Programming-201-Moralis-Moralis-Academy.webp'
    },
    {
      id: 5,
      date: 'May 6, 2022',
      title: 'Chainlink Programming',
      institution: 'Moralis Academy',
      description: 'Specialized training on oracles, smart contract integration with Chainlink, node operation, oracle testing, verifiable randomness, and building Chainlink projects.',
      skills: ['Oracles', 'Chainlink', 'Smart Contracts', 'Verifiable Randomness'],
      imagePath: '/images/certificates/Ivan-Lieskov-Chainlink-Programming-101-Chainlink-101-Moralis-Moralis-Academy.webp'
    },
    {
      id: 6,
      date: 'April 23, 2022',
      title: 'Ethereum Smart Contract Programming 101',
      institution: 'Moralis Academy',
      description: 'Foundational course on Solidity basics including arrays, structs, mappings, data location, error handling, inheritance, visibility, events, and external calls.',
      skills: ['Solidity', 'Smart Contracts', 'Error Handling', 'Events'],
      imagePath: '/images/certificates/Ivan-Lieskov-Ethereum-Smart-Contract-Programming-101-Ethereum-Smart-Contract-Programming-101-Moralis-Moralis-Academy.webp'
    },
    {
      id: 7,
      date: 'April 22, 2022',
      title: 'Ethereum DAPP Programming',
      institution: 'Moralis Academy',
      description: 'Comprehensive training on Ethereum DApp development using Truffle, Ganache, NFT marketplace development, token creation, frontend development, Metamask integration, and Web3.js.',
      skills: ['Truffle', 'Ganache', 'NFT Marketplace', 'Web3.js', 'MetaMask'],
      imagePath: '/images/certificates/Ivan-Lieskov-Build-an-NFT-Marketplace-Ethereum-Dapp-Programming-Moralis-Moralis-Academy.webp'
    },
    {
      id: 8,
      date: 'January - April 2022',
      title: 'Blockchain Developer Bootcamp',
      institution: 'Dapp University',
      certificateId: 'cert_fsjxv9bl',
      description: 'Intensive 3-month bootcamp started at the beginning of 2022, covering blockchain fundamentals, smart contract development, decentralized application architecture, and deployment.',
      skills: ['Blockchain', 'Smart Contracts', 'DApp Development', 'Solidity'],
      imagePath: '/images/certificates/certificate-of-completion-for-blockchain-developer-bootcamp.webp'
    },
    {
      id: 9,
      date: 'April 11, 2022',
      title: 'Ethereum 101',
      institution: 'Moralis Academy',
      description: 'Introduction to Ethereum Virtual Machine (EVM), Ethereum basics, token standards, account model, decentralized applications, and smart contract fundamentals.',
      skills: ['Ethereum', 'EVM', 'Token Standards', 'Smart Contracts'],
      imagePath: '/images/certificates/Ivan-Lieskov-Ethereum-101-Ethereum-101-Moralis-Moralis-Academy.webp'
    },
  ];
  
  // Add function to handle certificate click
  const handleCertificateClick = (imagePath: string | null) => {
    if (imagePath) {
      setSelectedCertificate(imagePath);
      setIsLoading(true);
      // Disable scrolling on body when modal is open
      document.body.style.overflow = 'hidden';
    }
  };
  
  // Add function to close modal
  const handleCloseModal = () => {
    setSelectedCertificate(null);
    setImageZoom(1); // Reset zoom when closing
    // Re-enable scrolling
    document.body.style.overflow = 'auto';
  };
  
  // Handle image load with proper sizing
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    const { naturalWidth, naturalHeight } = target;
    
    // Calculate and set aspect ratio based on natural dimensions
    setImageRatio({ 
      width: naturalWidth, 
      height: naturalHeight 
    });
    
    setIsLoading(false);
  };
  
  // Toggle zoom on image click
  const handleImageClick = () => {
    setImageZoom(imageZoom === 1 ? 1.5 : 1);
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  return (
    <>
      <ExperienceContainer id="experience" ref={ref}>
        <ContentWrapper className="content-section-enhanced">
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            variants={{
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.8 }}
            className="cyberpunk-section-title cyberpunk-title-md"
            data-text="Execute.Career_Protocols"
            data-mobile-text="Experience"
          >
            Execute.Career_Protocols
          </SectionTitle>
          
          <TabsContainer
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            variants={{
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {tabs.map(tab => (
              <Tab
                key={tab.id}
                $isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="neotech-button"
              >
                {tab.name}
              </Tab>
            ))}
          </TabsContainer>
          
          <TimelinesContainer>
            <Timeline 
              isVisible={activeTab === 'work'}
              variants={containerVariants}
              initial="hidden"
              animate={activeTab === 'work' ? 'visible' : 'hidden'}
            >
              {experiences.map((experience, index) => (
                <TimelineItem key={index} variants={itemVariants}>
                  <TimelineDate>{experience.period}</TimelineDate>
                  <TimelineDot />
                  <TimelineContent className="neotech-border">
                    <TimelineTitle>{experience.title}</TimelineTitle>
                    <TimelineSubtitle>
                      <span>{experience.company}</span>
                    </TimelineSubtitle>
                    <TimelineDescription>{experience.description}</TimelineDescription>
                    
                    <AchievementsList>
                      {experience.achievements.map((achievement: string) => (
                        <AchievementItem key={achievement}>
                          {achievement}
                        </AchievementItem>
                      ))}
                    </AchievementsList>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
            
            <Timeline 
              isVisible={activeTab === 'education'}
              variants={containerVariants}
              initial="hidden"
              animate={activeTab === 'education' ? 'visible' : 'hidden'}
            >
              {certifications.map((certificate) => (
                <TimelineItem key={certificate.id} variants={itemVariants}>
                  <TimelineDate>{certificate.date}</TimelineDate>
                  <TimelineDot />
                  <CertificateContent className="neotech-border">
                    <CertificateImageContainer 
                      onClick={() => handleCertificateClick(certificate.imagePath)}
                    >
                      {certificate.imagePath ? (
                        <CertificateImage 
                          style={{ backgroundImage: `url(${certificate.imagePath})` }} 
                        />
                      ) : (
                        <CertificatePlaceholder>
                          <PdfIcon style={{ opacity: 0.5 }} />
                          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>No certificate</span>
                        </CertificatePlaceholder>
                      )}
                    </CertificateImageContainer>
                    
                    <CertificateDetails>
                      <TimelineTitle>{certificate.title}</TimelineTitle>
                      <TimelineSubtitle>
                        <span>{certificate.institution}</span>
                      </TimelineSubtitle>
                      {certificate.certificateId && (
                        <CertificateId>ID: {certificate.certificateId}</CertificateId>
                      )}
                      <TimelineDescription>{certificate.description}</TimelineDescription>
                      
                      <SkillsList>
                        {certificate.skills.map((skill, i) => (
                          <SkillItem key={i} className="neotech-text">{skill}</SkillItem>
                        ))}
                      </SkillsList>
                      
                      {certificate.verifyUrl && (
                        <VerifyButton 
                          as="a" 
                          href={certificate.verifyUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Verify Certificate <FaExternalLinkAlt size={12} />
                        </VerifyButton>
                      )}
                    </CertificateDetails>
                  </CertificateContent>
                </TimelineItem>
              ))}
            </Timeline>
          </TimelinesContainer>
        </ContentWrapper>
      </ExperienceContainer>
      
      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedCertificate && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                aspectRatio: `${imageRatio.width}/${imageRatio.height}`,
                height: 'auto' // Let height be determined by aspect ratio
              }}
            >
              <CloseButton onClick={handleCloseModal} aria-label="Close certificate preview">
                <FaTimes />
              </CloseButton>
              
              <CertificateImageView>
                {!isLoading && (
                  <FaSearch 
                    style={{ 
                      position: 'absolute', 
                      bottom: '1rem', 
                      right: '1rem', 
                      color: 'white', 
                      background: 'rgba(0,0,0,0.5)', 
                      padding: '8px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      zIndex: 5
                    }} 
                    onClick={handleImageClick}
                  />
                )}
                
                <ZoomableImage 
                  src={selectedCertificate}
                  alt="Certificate"
                  style={{ transform: `scale(${imageZoom})` }}
                  onClick={handleImageClick}
                  onLoad={handleImageLoad}
                />
              </CertificateImageView>
              
              {isLoading && (
                <LoadingIndicator>
                  <PdfIcon />
                  <p>Loading certificate...</p>
                </LoadingIndicator>
              )}
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </>
  );
} 