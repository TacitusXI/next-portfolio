'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { personalInfo } from '@/data/content';
import { useBackground } from '../effects/BackgroundProvider';
import Link from 'next/link';

const HeroContainer = styled.section`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding-top: 0;

  @media (max-width: 768px) {
    height: auto;
    min-height: 100vh;
    padding-top: 80px; /* Add navbar height as padding to prevent overlay */
    padding-bottom: 2rem;
    align-items: flex-start;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  padding: 0 2rem;
  z-index: 1;

  @media (max-width: 768px) {
    padding-top: 2rem; /* Reduce this since we're adding padding to container */
  }
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
  margin-bottom: 1rem;
  color: white;
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
  
  span {
    color: white;
    -webkit-text-fill-color: white;
    filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
  }
`;

const Subtitle = styled(motion.h2)`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  max-width: 700px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const TypedText = styled.span`
  color: white;
  position: relative;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(72, 191, 255, 0.3);
  
  &::after {
    content: '|';
    animation: blink 1s infinite;
    color: white;
  }
  
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
`;

const ButtonContainer = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const PrimaryButton = styled(motion.a)`
  padding: 0.8rem 2rem;
  background: linear-gradient(135deg, rgb(49, 164, 253) 0%, rgb(115, 74, 253) 100%);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  box-shadow: 0 4px 15px rgba(58, 134, 255, 0.4);
`;

const SecondaryButton = styled(motion.a)`
  padding: 0.8rem 2rem;
  background: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #3a86ff;
  }
`;

const StatsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  margin-top: 3rem;
  margin-bottom: 2.5rem;
  background: rgba(10, 12, 18, 0.7);
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  border-top: 1px solid rgba(72, 191, 255, 0.4);
  border-bottom: 1px solid rgba(72, 191, 255, 0.4);
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
  
  @media (max-width: 768px) {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
`;

const StatValue = styled.div`
  font-size: 2.8rem;
  font-weight: 800;
  color: rgb(72, 191, 255);
  font-family: 'Chakra Petch', sans-serif;
  text-shadow: 0 0 8px rgba(72, 191, 255, 0.5);
  margin-bottom: 0.5rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -0.3rem;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 2px;
    background: rgba(72, 191, 255, 0.6);
  }
  
  @media (max-width: 768px) {
    font-size: 2.4rem;
  }
  
  @media (max-width: 500px) {
    font-size: 2rem;
  }
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 1px;
  max-width: 140px;
  line-height: 1.4;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
  position: relative;
  transition: all 0.3s ease;
  text-align: center;
  border-right: 1px solid rgba(72, 191, 255, 0.1);
  
  &:last-child {
    border-right: none;
  }
  
  background: rgba(10, 12, 18, 0.2);
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(72, 191, 255, 0.05) 0%, 
      rgba(115, 74, 253, 0.08) 100%
    );
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: -1;
  }
  
  &:hover {
    background: rgba(10, 12, 18, 0.3);
    
    &::after {
      opacity: 1;
    }
    
    ${StatValue} {
      text-shadow: 0 0 15px rgba(72, 191, 255, 0.8);
    }
  }
  
  @media (max-width: 900px) {
    border-bottom: 1px solid rgba(72, 191, 255, 0.1);
    &:nth-child(even) {
      border-right: none;
    }
    &:nth-child(3), &:nth-child(4) {
      border-bottom: none;
    }
  }
  
  @media (max-width: 500px) {
    border-right: none;
    border-bottom: 1px solid rgba(72, 191, 255, 0.1);
    &:last-child {
      border-bottom: none;
    }
    padding: 1.2rem 0.75rem;
    &:nth-child(3) {
      border-bottom: 1px solid rgba(72, 191, 255, 0.1);
    }
  }
`;

export default function HeroSection() {
  const [typedText, setTypedText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typeDelay, setTypeDelay] = useState(150);
  const [githubContributions, setGithubContributions] = useState(0);
  
  const { setBackgroundType, setIntensity, setColorScheme } = useBackground();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  
  useEffect(() => {
    const fetchGithubData = async () => {
      try {
        // First try to get data from sessionStorage (which GitHubSection may have populated)
        const storedData = sessionStorage.getItem('githubData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (parsedData && parsedData.totalContributions) {
            setGithubContributions(parsedData.totalContributions);
            return;
          }
        }
        
        // If no data in storage, fetch directly
        const response = await fetch('/api/github');
        
        if (!response.ok) {
          console.error('Failed to fetch GitHub data');
          return;
        }
        
        const data = await response.json();
        if (data && data.totalContributions) {
          setGithubContributions(data.totalContributions);
          // Store for other components to use
          sessionStorage.setItem('githubData', JSON.stringify(data));
        }
      } catch (err) {
        console.error('Error fetching GitHub data:', err);
      }
    };

    fetchGithubData();
  }, []);
  
  useEffect(() => {
    const phrases = [
      'Blockchain Developer',
      'Smart Contract Engineer',
      'Web3 Enthusiast',
      'DeFi Specialist'
    ];
    
    const timer = setTimeout(() => {
      // Logic for typing effect
      if (!isDeleting) {
        // Typing
        if (currentCharIndex < phrases[currentPhraseIndex].length) {
          setTypedText(phrases[currentPhraseIndex].substring(0, currentCharIndex + 1));
          setCurrentCharIndex(currentCharIndex + 1);
          setTypeDelay(100);
        } else {
          // Start deleting after a pause
          setIsDeleting(true);
          setTypeDelay(800);
        }
      } else {
        // Deleting
        if (currentCharIndex > 0) {
          setTypedText(phrases[currentPhraseIndex].substring(0, currentCharIndex - 1));
          setCurrentCharIndex(currentCharIndex - 1);
          setTypeDelay(50);
        } else {
          // Move to next phrase
          setIsDeleting(false);
          setCurrentPhraseIndex((currentPhraseIndex + 1) % phrases.length);
          setTypeDelay(300);
        }
      }
    }, typeDelay);
    
    return () => clearTimeout(timer);
  }, [currentCharIndex, currentPhraseIndex, isDeleting, typeDelay]);
  
  useEffect(() => {
    if (inView) {
      // Set digital rain background for hero section
      setBackgroundType('digital');
      setIntensity(70);
      setColorScheme('green');
    }
  }, [inView, setBackgroundType, setIntensity, setColorScheme]);
  
  const animationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8 }
    }
  };
  
  return (
    <HeroContainer id="home" ref={ref}>
      <ContentWrapper className="content-section-enhanced">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          <Title 
            variants={animationVariants}
            className="cyberpunk-title cyberpunk-title-lg"
            data-text={`Hi, I'm ${personalInfo.name}`}
          >
            Hi, I&apos;m {personalInfo.name}
          </Title>
          
          <Subtitle
            variants={animationVariants}
            className="enhanced-text"
          >
            I&apos;m a <TypedText>{typedText}</TypedText>
            <br />
            <div style={{ 
              display: 'block', 
              marginTop: '0.8rem', 
              fontWeight: 500, 
              color: 'white',
              textShadow: 'none'
            }}>
              <div style={{ display: 'flex', marginBottom: '0.5rem', alignItems: 'center' }}>
                <span style={{ 
                  color: 'white', 
                  marginRight: '0.5rem',
                  textShadow: 'none',
                  filter: 'none'
                }}>•</span>
                <span style={{ color: 'white', textShadow: 'none' }}>
                  Focused on blockchain security and reliable infrastructure
                </span>
              </div>
              <div style={{ display: 'flex', marginBottom: '0.5rem', alignItems: 'center' }}>
                <span style={{ 
                  color: 'white', 
                  marginRight: '0.5rem',
                  textShadow: 'none',
                  filter: 'none'
                }}>•</span>
                <span style={{ color: 'white', textShadow: 'none' }}>
                  Building resilient DeFi protocols and identifying vulnerabilities
                </span>
              </div>
              <div style={{ display: 'flex', marginBottom: '0.5rem', alignItems: 'center' }}>
                <span style={{ 
                  color: 'white', 
                  marginRight: '0.5rem',
                  textShadow: 'none',
                  filter: 'none'
                }}>•</span>
                <span style={{ color: 'white', textShadow: 'none' }}>
                  Bringing 8+ years of finance expertise to Web3
                </span>
              </div>
            </div>
          </Subtitle>
          
          <ButtonContainer
            variants={animationVariants}
          >
            <Link href="#projects" passHref legacyBehavior>
              <PrimaryButton 
                as="a"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cyberpunk-button"
              >
                View My Work
              </PrimaryButton>
            </Link>
            
            <Link href="#contact" passHref legacyBehavior>
              <SecondaryButton 
                as="a"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cyberpunk-button"
              >
                Contact Me
              </SecondaryButton>
            </Link>
          </ButtonContainer>
          
          <StatsContainer
            variants={animationVariants}
            className="cyberpunk-container"
          >
            <StatItem>
              <StatValue>3+</StatValue>
              <StatLabel>Years Building Web3 Solutions</StatLabel>
            </StatItem>
            
            <StatItem>
              <StatValue>8+</StatValue>
              <StatLabel>Years in Finance</StatLabel>
            </StatItem>
            
            <StatItem>
              <StatValue>{githubContributions > 0 ? githubContributions : '4000+' }</StatValue>
              <StatLabel>Contributions in the last year</StatLabel>
            </StatItem>
            
            <StatItem>
              <StatValue>20+</StatValue>
              <StatLabel>finished projects</StatLabel>
            </StatItem>
          </StatsContainer>
        </motion.div>
      </ContentWrapper>
    </HeroContainer>
  );
} 