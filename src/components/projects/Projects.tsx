'use client';

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaGithub, FaStar, FaCodeBranch, FaCode, FaExternalLinkAlt } from 'react-icons/fa';

const ProjectsSection = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 2rem;
  margin: 3rem 0;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: white;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 30px;
`;

const ProjectCard = styled(motion.div)`
  background: rgba(0, 10, 30, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ProjectHeader = styled.div`
  padding: 25px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const ProjectIcon = styled.div`
  font-size: 2rem;
  color: #3b82f6;
  margin-bottom: 15px;
`;

const ProjectTitle = styled.h3`
  color: #3b82f6;
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const ProjectPeriod = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin-bottom: 15px;
`;

const ProjectContent = styled.div`
  padding: 25px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ProjectDescription = styled.p`
  line-height: 1.6;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.9);
`;

const RepoInfoBox = styled.div`
  display: flex;
  gap: 15px;
  margin: 15px 0;
  padding: 10px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
`;

const RepoStat = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  
  svg {
    color: #3b82f6;
  }
`;

const TopicTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const TopicTag = styled(motion.span)`
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.9rem;
  cursor: default;

  &:hover {
    background: rgba(59, 130, 246, 0.2);
  }
`;

const LanguageDot = styled.span<{ color: string }>`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-right: 5px;
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: 15px;
  margin-top: auto;
  padding-top: 20px;
`;

const ProjectLink = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #3b82f6;
  text-decoration: none;
  padding: 8px 16px;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(59, 130, 246, 0.1);
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
  }
`;

const SectionDescription = styled.p`
  font-size: 1.1rem;
  color: #e0e0e0;
  margin-bottom: 2rem;
  line-height: 1.6;
  max-width: 800px;
`;

// GitHub language to color mapping
const languageColors: Record<string, string> = {
  "HTML": "#e34c26",
  "CSS": "#563d7c",
  "JavaScript": "#f1e05a",
  "TypeScript": "#3178c6",
  "Solidity": "#aa6746",
  "Clarity": "#2a52be",
  "Python": "#3572A5"
};

const projectsData = [
  {
    title: "Tacitus Swap",
    period: "Jan 2023 - Present",
    description: "A sophisticated fork of Uniswap with custom Tacitus implementations, featuring an enhanced user interface with modern design elements. The platform incorporates a distinctive digital rain animation for a cyberpunk aesthetic, while maintaining the robust trading functionality of the original DEX. Supports multiple chains and token swaps with optimized transaction processing.",
    icon: <FaCode />,
    githubInfo: {
      stars: 4,
      forks: 1,
      languages: [
        { name: "TypeScript", percentage: 78.5 },
        { name: "JavaScript", percentage: 14.3 },
        { name: "CSS", percentage: 5.7 },
        { name: "Solidity", percentage: 1.5 }
      ],
      topics: [
        "defi", "uniswap", "dex", "ethereum", "web3", 
        "smart-contracts", "amm", "liquidity-pool", "decentralized-exchange"
      ]
    },
    features: [
      "Multi-chain support",
      "Enhanced cyberpunk UI with digital rain effects",
      "Advanced swap routing algorithms",
      "Liquidity provision optimization",
      "Tacitus-specific token integration"
    ],
    links: {
      github: "https://github.com/TacitusXI/tacitus-swap",
      live: "https://tacitus-swap.vercel.app/"
    }
  },
  {
    title: "TechnoirClub Marketplace",
    period: "Jan 2022 - Mar 2023",
    description: "A collection of unique NFT mutant robots featuring an interactive frontend interface and marketplace. Each robot can be modified and reassembled to create entirely new configurations using interchangeable parts, offering over 999 trillion potential combinations for collectors and enthusiasts.",
    icon: <FaCode />,
    githubInfo: {
      stars: 2,
      forks: 0,
      languages: [
        { name: "HTML", percentage: 64.8 },
        { name: "JavaScript", percentage: 19.5 },
        { name: "Solidity", percentage: 9.8 },
        { name: "CSS", percentage: 5.9 }
      ],
      topics: [
        "coverage-testing", "solidity", "ethereum-contract", "ethereum-dapp", 
        "nft", "smart-contract", "nft-marketplace", "nft-collection"
      ]
    },
    features: [
      "Interactive 3D robot customization",
      "Real-time price calculations",
      "Metamask integration",
      "IPFS storage for NFT metadata",
      "Smart contract-based ownership"
    ],
    links: {
      github: "https://github.com/TacitusXI/TechnoirClub-Marketplace"
    }
  },
  {
    title: "LeskoDEX",
    period: "Nov 2021 - Mar 2023",
    description: "LeskoDEX is a decentralized exchange (DEX) featuring a decentralized order book and a custom ERC-20 ESKO token. Users can seamlessly connect via Metamask to trade the ETH/ESKO pair. The platform includes an integrated charting tool for comprehensive technical analysis.",
    icon: <FaCode />,
    githubInfo: {
      stars: 3,
      forks: 0,
      languages: [
        { name: "Solidity", percentage: 65.3 },
        { name: "JavaScript", percentage: 25.2 },
        { name: "CSS", percentage: 9.5 }
      ],
      topics: [
        "dex", "defi", "erc20-token", "decentralized-exchange", 
        "ethereum", "trading", "metamask", "web3"
      ]
    },
    features: [
      "Decentralized order book",
      "Custom ERC-20 token",
      "Real-time price charts",
      "Advanced trading features",
      "Automated market making"
    ],
    links: {
      github: "https://github.com/TacitusXI/LeskoDEX"
    }
  },
  {
    title: "LIQUID-DEX",
    period: "Dec 2023 - Jan 2024",
    description: "LIQUID Decentralized Exchange: Built on the Stacks ecosystem for STX/LIQ trading, utilizing the LIQUID SIP010 token and developed in Clarity for enhanced security. Users can connect, trade, and manage liquidity with advanced wallet integration and comprehensive trading features.",
    icon: <FaCode />,
    githubInfo: {
      stars: 1,
      forks: 0,
      languages: [
        { name: "TypeScript", percentage: 75.3 },
        { name: "Clarity", percentage: 20.3 },
        { name: "JavaScript", percentage: 3.8 },
        { name: "CSS", percentage: 0.6 }
      ],
      topics: [
        "smart-contracts", "swap", "dex", "stacks", "clarity", 
        "clarinet", "stx", "defi", "liquidity-pool"
      ]
    },
    features: [
      "Stacks blockchain integration",
      "SIP010 token standard",
      "Advanced security features",
      "Liquidity management",
      "Cross-chain compatibility"
    ],
    links: {
      github: "https://github.com/TacitusXI/LIQUID-DEX"
    }
  }
];

const Projects: React.FC = () => {
  return (
    <ProjectsSection>
      <SectionTitle>Featured Projects</SectionTitle>
      <SectionDescription>
        A collection of my notable projects showcasing my expertise in blockchain development,
        decentralized applications, and smart contract implementation.
      </SectionDescription>
      
      <ProjectsGrid>
        {projectsData.map((project, index) => (
          <ProjectCard
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            whileHover={{ y: -10 }}
          >
            <ProjectHeader>
              <ProjectIcon>{project.icon}</ProjectIcon>
              <ProjectTitle>{project.title}</ProjectTitle>
              <ProjectPeriod>{project.period}</ProjectPeriod>
            </ProjectHeader>
            
            <ProjectContent>
              <ProjectDescription>{project.description}</ProjectDescription>
              
              <RepoInfoBox>
                <RepoStat>
                  <FaStar />
                  {project.githubInfo.stars} stars
                </RepoStat>
                <RepoStat>
                  <FaCodeBranch />
                  {project.githubInfo.forks} forks
                </RepoStat>
              </RepoInfoBox>
              
              <div>
                <h4 style={{ color: '#3b82f6', marginBottom: '10px', fontSize: '1rem' }}>Languages:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
                  {project.githubInfo.languages.map((language, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: 'white' }}>
                      <LanguageDot color={languageColors[language.name] || '#858585'} />
                      {language.name} {language.percentage}%
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 style={{ color: '#3b82f6', marginBottom: '10px', fontSize: '1rem' }}>Topics:</h4>
                <TopicTags>
                  {project.githubInfo.topics.slice(0, 5).map((topic, i) => (
                    <TopicTag
                      key={i}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {topic}
                    </TopicTag>
                  ))}
                </TopicTags>
              </div>
              
              <ProjectLinks>
                {project.links.github && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ProjectLink 
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaGithub /> {project.links.githubV1 ? 'v2 (Foundry)' : 'GitHub'}
                    </ProjectLink>
                  </motion.div>
                )}
                
                {project.links.githubV1 && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ProjectLink 
                      href={project.links.githubV1}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaGithub /> v1 (Hardhat)
                    </ProjectLink>
                  </motion.div>
                )}
                
                {project.links.live && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ProjectLink 
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaExternalLinkAlt /> Live Demo
                    </ProjectLink>
                  </motion.div>
                )}
              </ProjectLinks>
            </ProjectContent>
          </ProjectCard>
        ))}
      </ProjectsGrid>
    </ProjectsSection>
  );
};

export default Projects; 