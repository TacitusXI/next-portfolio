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
    width: 100%;
    max-width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
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
  max-width: 800px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    max-width: 100%;
  }
`;

const BulletPoint = styled.div`
  display: flex;
  margin-bottom: 0.8rem;
  align-items: flex-start;
  width: 100%;
  overflow: visible;
  
  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const Bullet = styled.span`
  margin-right: 0.7rem;
  flex-shrink: 0;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    margin-top: 0.15rem;
  }
`;

const BulletContent = styled.span`
  white-space: normal;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: normal;
  hyphens: auto;
  max-width: 100%;
  display: inline-block;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const HackerText = styled.span`
  color: #00ff00;
  position: relative;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
  display: inline-block;
  letter-spacing: 1px;
  /* Prevent mobile layout jumping */
  min-height: 1.2em;
  vertical-align: top;
  contain: layout style;
  will-change: opacity, filter, text-shadow;
  /* Fixed width to prevent text jumping */
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  overflow: hidden;
  min-width: 280px;
  text-align: left;
  
  @media (max-width: 768px) {
    min-width: 220px;
  }
  
  &::before {
    content: attr(data-glitch);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: rgba(0, 255, 0, 0.8);
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    /* Prevent layout shifts */
    contain: layout style;
    will-change: clip;
  }
  
  @keyframes terminal-flicker {
    0%, 100% { 
      opacity: 1;
      text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
    }
    50% { 
      opacity: 0.8;
      text-shadow: 0 0 8px rgba(0, 255, 0, 0.7);
    }
  }
  
  @keyframes data-corruption {
    0% { 
      clip: rect(0, 0, 0, 0);
      opacity: 1;
    }
    5% { 
      clip: rect(0, 9999px, 2px, 0);
      opacity: 0.9;
    }
    10% { 
      clip: rect(2px, 9999px, 4px, 0);
      opacity: 0.8;
    }
    15% { 
      clip: rect(4px, 9999px, 6px, 0);
      opacity: 0.7;
    }
    20% { 
      clip: rect(6px, 9999px, 8px, 0);
      opacity: 0.8;
    }
    25% { 
      clip: rect(0, 0, 0, 0);
      opacity: 1;
    }
    100% { 
      clip: rect(0, 0, 0, 0);
      opacity: 1;
    }
  }
  
  @keyframes matrix-shift {
    0%, 90%, 100% {
      filter: brightness(1);
      text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
    }
    2% {
      filter: brightness(1.2);
      text-shadow: 1px 0 5px rgba(0, 255, 0, 0.7);
    }
    4% {
      filter: brightness(0.8);
      text-shadow: -1px 0 5px rgba(0, 255, 0, 0.3);
    }
    6% {
      filter: brightness(1.1);
      text-shadow: 0 1px 5px rgba(0, 255, 0, 0.6);
    }
    8% {
      filter: brightness(0.9);
      text-shadow: 0 -1px 5px rgba(0, 255, 0, 0.4);
    }
  }
`;

const SubliminalText = styled.span`
  color: #ff0000 !important;
  font-weight: 700;
  font-size: 1em;
  pointer-events: none;
  font-family: inherit;
  letter-spacing: inherit;
  text-shadow: 0 0 8px rgba(255, 0, 0, 0.8) !important;
  animation: subliminal-pulse 0.013s ease-out;
  /* Prevent mobile layout jumping */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: inline-block;
  contain: layout style;
  will-change: opacity, filter;
  
  @keyframes subliminal-pulse {
    0% {
      opacity: 0;
      filter: brightness(1);
    }
    50% {
      opacity: 1;
      filter: brightness(1.2);
    }
    100% {
      opacity: 0;
      filter: brightness(1);
    }
  }
`;

const BookLink = styled.a`
  color: rgb(72, 191, 255);
  text-decoration: none;
  position: relative;
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline;
  word-break: break-word;
  
  &:hover {
    text-shadow: 0 0 8px rgba(72, 191, 255, 0.5);
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
  display: flex;
  flex-direction: column;
  
  span {
    display: block;
    white-space: nowrap;
    text-align: center;
  }
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
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isCorrupting, setIsCorrupting] = useState(false);
  const [corruptedText, setCorruptedText] = useState('');
  const [subliminalText, setSubliminalText] = useState('');
  const [showSubliminal, setShowSubliminal] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [subliminalLog, setSubliminalLog] = useState<string[]>([]);
  const [githubContributions, setGithubContributions] = useState(0);
  
  const phrases = [
    'Security Researcher',
    'Solidity Engineer', 
    'Technical Reviewer'
  ];
  
    // Optimized subliminal messages - focused and effective
    const subliminalMessages = [
      // 1-е лицо (ядро намерения)
      "I_NEED_TACITVS",
      "I_CHOOSE_TACITVS",
      "I_NEED_AUDIT",
      "I_START_NOW",
      "I_DEPLOY_SAFE",
      "I_PROTECT_FUNDS",

      // Действие (конверсия)
      "START_AUDIT",
      "BOOK_AUDIT",
      "INITIATE_AUDIT",
      "MESSAGE_IVAN",
      "SEND_SPECS",
      "GET_REPORT",

      // Авторитет/результат (без воды)
      "TRUSTED_EXPERT",
      "PROVEN_RESULTS",
      "SECURE_DEPLOY",
      "RISK_REDUCED",
      "PATCH_NOW",
      "FIX_VULN",

      // Финансы (без агрессии)
      "APPROVE_BUDGET",
      "SAVE_FUNDS",
      "CUT_RISK",

      // Мягкие социальные
      "OTHERS_TRUST_TACITVS",
      "RECOMMENDED_CHOICE"
    ];
  
  const generateCorruptedText = (text: string) => {
    // Use only ASCII characters with same width in monospace fonts
    const glitchChars = ['@', '#', '$', '%', '&', '*', '?', '!', '|', '~', '^', '+', '=', '<', '>', '/', '\\'];
    return text.split('').map(char => {
      if (char === ' ') return ' '; // Keep spaces as spaces
      return Math.random() < 0.3 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char;
    }).join('');
  };
  
  const { setBackgroundType, setIntensity, setColorScheme } = useBackground();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  
  // Hidden Easter eggs - no autocomplete, access via special object
  useEffect(() => {
    // Store functions in a deeply nested object that won't autocomplete
    const tacitVsCore = {
      sys: {
        debug: {
          matrix: {
            enter: () => {
              setDebugMode(true);
              console.log('🕶️ Welcome to the real world, Neo...');
            },
            exit: () => {
              setDebugMode(false);
              console.log('💊 Back to the illusion...');
            }
          },
          mind: {
            show: () => {
              console.log('🧠 PSYCHOLOGICAL PROGRAMMING LOG:', subliminalLog);
            },
            wipe: () => {
              setSubliminalLog([]);
              console.log('🧹 Memory wiped clean...');
            }
          }
        }
      }
    };
    
    // Attach to window with obscure name
    (window as any)._ = tacitVsCore;
    
    // Helper function (the only one that might show in autocomplete)
    (window as any).help = () => {
        console.log('🔐 TACITVS NEURAL ARSENAL:');
      console.log('_.sys.debug.matrix.enter() - Enter the Matrix');
      console.log('_.sys.debug.matrix.exit() - Exit the Matrix');  
      console.log('_.sys.debug.mind.show() - Show mind control log');
      console.log('_.sys.debug.mind.wipe() - Wipe evidence');
      console.log('help() - Show this message');
    };
    
  }, [subliminalLog]);
  
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
    
    // Listen for storage changes (when GitHubSection updates the data)
    const handleStorageChange = () => {
      const storedData = sessionStorage.getItem('githubData');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          if (parsedData && parsedData.totalContributions) {
            setGithubContributions(parsedData.totalContributions);
          }
        } catch (err) {
          console.error('Error parsing stored GitHub data:', err);
        }
      }
    };
    
    // Add storage event listener
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for a custom event that we can dispatch from GitHubSection
    const handleCustomUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.totalContributions) {
        setGithubContributions(event.detail.totalContributions);
      }
    };
    
    window.addEventListener('githubDataUpdated', handleCustomUpdate as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('githubDataUpdated', handleCustomUpdate as EventListener);
    };
  }, []);
  
  useEffect(() => {
    const hackInterval = setInterval(() => {
      const currentText = phrases[currentPhraseIndex];
      
      // Start corruption
      setIsCorrupting(true);
      
      // Phase 1: Corrupt current text with subliminal flash
      let corruptionCount = 0;
      const corruptionInterval = setInterval(() => {
        // SUBLIMINAL FLASH at frame 3 (24fps = ~42ms exposure)
        if (corruptionCount === 3) {
          const randomSubliminal = subliminalMessages[Math.floor(Math.random() * subliminalMessages.length)];
          setSubliminalText(randomSubliminal);
          setShowSubliminal(true);
          
          // Silent logging for easter eggs
          setSubliminalLog(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${randomSubliminal}`]);
          
          // Flash duration: 13ms for maximum subliminal effect, 2000ms in debug mode
          setTimeout(() => {
            setShowSubliminal(false);
          }, debugMode ? 2000 : 13);
        }
        
        setCorruptedText(generateCorruptedText(currentText));
        corruptionCount++;
        
        if (corruptionCount >= 8) {
          clearInterval(corruptionInterval);
          
          // Phase 2: Switch to next phrase and gradually fix corruption
          const nextIndex = (currentPhraseIndex + 1) % phrases.length;
          const nextText = phrases[nextIndex];
          setCurrentPhraseIndex(nextIndex);
          
          let fixCount = 0;
          const fixInterval = setInterval(() => {
            // SECOND SUBLIMINAL FLASH during reconstruction
            if (fixCount === 2) {
              const randomSubliminal = subliminalMessages[Math.floor(Math.random() * subliminalMessages.length)];
              setSubliminalText(randomSubliminal);
              setShowSubliminal(true);
              
              // Silent logging for easter eggs  
              setSubliminalLog(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${randomSubliminal}`]);
              
              setTimeout(() => {
                setShowSubliminal(false);
              }, debugMode ? 2000 : 13);
            }
            
            const progress = fixCount / 6;
            const fixedText = nextText.split('').map((char, i) => 
              Math.random() < progress ? char : generateCorruptedText(char).charAt(0)
            ).join('');
            
            setCorruptedText(fixedText);
            fixCount++;
            
            if (fixCount >= 6) {
              clearInterval(fixInterval);
              setCorruptedText('');
              setIsCorrupting(false);
            }
          }, 80);
        }
      }, 60);
      
    }, 4000); // Change every 4 seconds
    
    return () => clearInterval(hackInterval);
  }, [currentPhraseIndex, phrases, subliminalMessages]);
  
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
            I&apos;m a Blockchain <HackerText 
              data-glitch={corruptedText}
              style={{
                animation: isCorrupting 
                  ? 'terminal-flicker 0.1s infinite, data-corruption 0.6s linear, matrix-shift 0.6s linear'
                  : 'terminal-flicker 3s infinite',
                filter: isCorrupting ? 'brightness(1.3) contrast(1.2)' : 'none',
                position: 'relative'
              }}
            >
              {showSubliminal ? (
                  <SubliminalText
                    style={{
                      // Наследует цвет от HackerText, только время анимации меняется
                      animation: debugMode ? 'subliminal-pulse 2s ease-out' : 'subliminal-pulse 0.017s ease-out'
                    }}
                >
                  {subliminalText}
                </SubliminalText>
              ) : (
                isCorrupting && corruptedText ? corruptedText : phrases[currentPhraseIndex]
              )}
            </HackerText>
            <br />
            <div style={{ 
              display: 'block', 
              marginTop: '0.8rem', 
              fontWeight: 500, 
              color: 'white',
              textShadow: 'none',
              maxWidth: '100%',
              overflow: 'hidden'
            }}>
              <BulletPoint>
                <Bullet style={{ color: 'white', textShadow: 'none', filter: 'none' }}>•</Bullet>
                <BulletContent style={{ color: 'white', textShadow: 'none' }}>
                  Focused on blockchain security and reliable infrastructure
                </BulletContent>
              </BulletPoint>
              
              <BulletPoint>
                <Bullet style={{ color: 'white', textShadow: 'none', filter: 'none' }}>•</Bullet>
                <BulletContent style={{ color: 'white', textShadow: 'none' }}>
                  Leveraging 4 years in traditional finance and 5 years in DeFi
                </BulletContent>
              </BulletPoint>
              
              <BulletPoint>
                <Bullet style={{ color: 'white', textShadow: 'none', filter: 'none' }}>•</Bullet>
                <BulletContent 
                  style={{ 
                    color: 'white', 
                    textShadow: 'none',
                    maxWidth: '100%',
                    display: 'inline-flex',
                    flexWrap: 'wrap'
                  }}
                >
                  Technical reviewer for{' '}
                  <BookLink 
                    href="https://www.amazon.com/Developing-Blockchain-Solutions-Cloud-blockchain-powered-ebook/dp/B0CW59K1M4" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ marginLeft: '0.25rem' }}
                  >
                    Developing Blockchain Solutions in the Cloud
                  </BookLink>
                </BulletContent>
              </BulletPoint>
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
                Explore My Solutions
              </PrimaryButton>
            </Link>
            
            <Link href="#contact" passHref legacyBehavior>
              <SecondaryButton 
                as="a"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cyberpunk-button"
              >
                Initiate Connection
              </SecondaryButton>
            </Link>
          </ButtonContainer>
          
          <StatsContainer
            variants={animationVariants}
            className="cyberpunk-container"
          >
            <StatItem>
              <StatValue>3+</StatValue>
              <StatLabel>
                <span>YEARS BUILDING</span>
                <span>WEB3 SOLUTIONS</span>
              </StatLabel>
            </StatItem>
            
            <StatItem>
              <StatValue>9+</StatValue>
              <StatLabel>
                <span>YEARS IN</span>
                <span>FINANCE</span>
              </StatLabel>
            </StatItem>
            
            <StatItem>
              <StatValue>{githubContributions > 0 ? githubContributions : '2000+' }</StatValue>
              <StatLabel>
                <span>CONTRIBUTIONS IN</span>
                <span>THE LAST YEAR</span>
              </StatLabel>
            </StatItem>
            
            <StatItem>
              <StatValue>0x42</StatValue>
              <StatLabel>
                <span>REASONS TO TEST</span>
                <span>BEFORE MAINNET</span>
              </StatLabel>
            </StatItem>
          </StatsContainer>
        </motion.div>
      </ContentWrapper>
    </HeroContainer>
  );
} 