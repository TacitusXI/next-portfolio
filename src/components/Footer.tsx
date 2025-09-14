'use client';

import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import Link from 'next/link';
import { personalInfo, githubInfo } from '@/data/content';
import { motion, AnimatePresence } from 'framer-motion';

// Golden ratio constant
const PHI = 1.618;

// Keyframe animations
const glowPulse = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px rgba(58, 134, 255, 0.3),
                0 0 40px rgba(58, 134, 255, 0.1),
                inset 0 0 20px rgba(58, 134, 255, 0.05);
  }
  50% { 
    box-shadow: 0 0 30px rgba(58, 134, 255, 0.5),
                0 0 60px rgba(58, 134, 255, 0.2),
                inset 0 0 30px rgba(58, 134, 255, 0.1);
  }
`;

const dataStream = keyframes`
  0% { transform: translateY(100vh) scaleY(0); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-100vh) scaleY(1); opacity: 0; }
`;

const holographicShimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const neuralPulse = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
`;

const quantumFlicker = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

// Styled components with golden ratio proportions
const FooterContainer = styled.footer`
  background: linear-gradient(135deg, 
    rgba(5, 5, 15, 0.98) 0%,
    rgba(10, 10, 25, 0.95) 50%,
    rgba(15, 15, 35, 0.98) 100%
  );
  border-top: 2px solid transparent;
  background-clip: padding-box;
  position: relative;
  padding: ${4 * PHI}rem 2rem ${2.5 * PHI}rem;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent 0%,
      rgba(58, 134, 255, 0.5) 25%,
      rgba(0, 198, 255, 0.8) 50%,
      rgba(58, 134, 255, 0.5) 75%,
      transparent 100%
    );
    animation: ${holographicShimmer} 3s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 80%, rgba(58, 134, 255, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(0, 198, 255, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(255, 0, 150, 0.02) 0%, transparent 50%);
    pointer-events: none;
    z-index: 1;
  }
`;

const DataStreamOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
`;

const DataLine = styled.div<{ delay: number; left: number }>`
  position: absolute;
  left: ${props => props.left}%;
  width: 1px;
  height: 100px;
  background: linear-gradient(to bottom, 
    transparent 0%,
    rgba(58, 134, 255, 0.6) 50%,
    transparent 100%
  );
  animation: ${dataStream} ${8 + Math.random() * 4}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
`;

const FooterContent = styled.div`
  max-width: ${77 * PHI}rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: ${PHI}fr 1fr 1fr;
  gap: ${2.5 * PHI}rem;
  position: relative;
  z-index: 3;
  
  /* iPad Pro and large tablets - 3 columns in one beautiful row */
  @media (max-width: 1024px) and (min-width: 769px) {
    grid-template-columns: 1.4fr 1fr 1fr;
    gap: ${1.8 * PHI}rem;
    max-width: 95%;
  }
  
  /* Standard tablets - 3 compact columns in one row */
  @media (max-width: 768px) and (min-width: 481px) {
    grid-template-columns: 1.2fr 1fr 1fr;
    gap: ${1.5 * PHI}rem;
    max-width: 98%;
  }
  
  /* Mobile phones */
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: ${1.5 * PHI}rem;
    max-width: 100%;
  }
`;

const PrimarySection = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${1.5 * PHI}rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: ${PHI * 0.5}rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  backdrop-filter: blur(10px);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, 
      rgba(58, 134, 255, 0.05) 0%,
      transparent 50%,
      rgba(0, 198, 255, 0.05) 100%
    );
    border-radius: ${PHI * 0.5}rem;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  /* Tablet optimizations - compact for one row */
  @media (max-width: 1024px) and (min-width: 481px) {
    padding: ${PHI * 0.8}rem;
    text-align: center;
  }
`;

const Logo = styled.div`
  font-size: ${PHI * 1.2}rem;
  font-weight: 700;
  margin-bottom: ${PHI}rem;
  color: white;
  position: relative;
  letter-spacing: 0.5px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, 
      #3a86ff 0%,
      #00c6ff 100%
    );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
    background-clip: text;
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      #3a86ff 0%,
      #00c6ff 100%
    );
    border-radius: 1px;
    transition: width 0.6s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const Description = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: ${PHI * 0.6}rem;
  line-height: ${PHI};
  margin-bottom: ${PHI}rem;
  font-weight: 300;
  letter-spacing: 0.5px;
`;

const SecurityBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 255, 127, 0.1);
  border: 1px solid rgba(0, 255, 127, 0.3);
  border-radius: ${PHI * 0.3}rem;
  color: #00ff7f;
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: ${PHI}rem;
  animation: ${glowPulse} 3s ease-in-out infinite;
  
  &::before {
    content: '🔒';
    font-size: 1rem;
  }
`;

const SocialContainer = styled.div`
  display: flex;
  gap: ${PHI * 0.5}rem;
  margin-top: auto;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${PHI * 2.2}rem;
  height: ${PHI * 2.2}rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent 0%,
      rgba(58, 134, 255, 0.4) 50%,
      transparent 100%
    );
    transition: left 0.5s ease;
  }
  
  &:hover {
    background: rgba(58, 134, 255, 0.2);
    color: #3a86ff;
    transform: translateY(-5px) scale(1.1);
    box-shadow: 0 10px 30px rgba(58, 134, 255, 0.3);
    
    &::before {
      left: 100%;
    }
  }
  
  svg {
    width: ${PHI}rem;
    height: ${PHI}rem;
    z-index: 1;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  
  /* Tablet optimizations - compact for one row */
  @media (max-width: 1024px) and (min-width: 481px) {
    padding: ${PHI * 0.8}rem;
    background: rgba(255, 255, 255, 0.02);
    border-radius: ${PHI * 0.3}rem;
    border: 1px solid rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
  }
`;


const SectionTitle = styled.h3`
  color: white;
  font-size: ${PHI * 0.7}rem;
  font-weight: 600;
  margin-bottom: ${PHI}rem;
  position: relative;
  padding-left: 1rem;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: ${PHI}rem;
    background: linear-gradient(to bottom, #3a86ff, #00c6ff);
    border-radius: 2px;
    animation: ${neuralPulse} 2s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -0.5rem;
    width: 60px;
    height: 1px;
    background: linear-gradient(90deg, #3a86ff, transparent);
    animation: ${holographicShimmer} 2s ease-in-out infinite;
  }
  
  /* Tablet optimizations - compact for one row */
  @media (max-width: 1024px) and (min-width: 481px) {
    font-size: ${PHI * 0.75}rem;
    text-align: center;
    padding-left: 0;
    margin-bottom: ${PHI * 0.8}rem;
    
    &::before {
      display: none;
    }
    
    &::after {
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
    }
  }
`;

const LinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${PHI * 0.5}rem;
  
  /* Tablet optimizations - perfectly aligned */
  @media (max-width: 1024px) and (min-width: 481px) {
    gap: ${PHI * 0.3}rem;
    align-items: stretch;
    width: 100%;
  }
`;

const FooterLink = styled.a`
  color: rgba(255, 255, 255, 0.7);
  font-size: ${PHI * 0.55}rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  position: relative;
  text-decoration: none;
  
  &::before {
    content: '▸';
    margin-right: 0.5rem;
    color: rgba(58, 134, 255, 0.5);
    transition: all 0.3s ease;
    font-size: 0.8rem;
  }
  
  &:hover {
    color: #3a86ff;
    transform: translateX(8px);
    
    &::before {
      color: #3a86ff;
      transform: scale(1.2);
    }
  }
  
  /* Tablet optimizations - perfectly aligned */
  @media (max-width: 1024px) and (min-width: 481px) {
    padding: ${PHI * 0.35}rem ${PHI * 0.5}rem;
    font-size: ${PHI * 0.6}rem;
    min-height: 40px;
    justify-content: center;
    text-align: center;
    border-radius: ${PHI * 0.2}rem;
    background: rgba(255, 255, 255, 0.01);
    
    &:hover {
      transform: translateY(-2px);
      background: rgba(58, 134, 255, 0.05);
    }
    
    &::before {
      display: none;
    }
  }
`;

const NextLink = styled(Link)`
  color: rgba(255, 255, 255, 0.7);
  font-size: ${PHI * 0.55}rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  position: relative;
  text-decoration: none;
  
  &::before {
    content: '▸';
    margin-right: 0.5rem;
    color: rgba(58, 134, 255, 0.5);
    transition: all 0.3s ease;
    font-size: 0.8rem;
  }
  
  &:hover {
    color: #3a86ff;
    transform: translateX(8px);
    
    &::before {
      color: #3a86ff;
      transform: scale(1.2);
    }
  }
  
  /* Tablet optimizations - perfectly aligned */
  @media (max-width: 1024px) and (min-width: 481px) {
    padding: ${PHI * 0.35}rem ${PHI * 0.5}rem;
    font-size: ${PHI * 0.6}rem;
    min-height: 40px;
    justify-content: center;
    text-align: center;
    border-radius: ${PHI * 0.2}rem;
    background: rgba(255, 255, 255, 0.01);
    
    &:hover {
      transform: translateY(-2px);
      background: rgba(58, 134, 255, 0.05);
    }
    
    &::before {
      display: none;
    }
  }
`;


const BottomBar = styled.div`
  margin-top: ${PHI * 2}rem;
  padding-top: ${PHI}rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 3;
  
  /* Tablet optimizations */
  @media (max-width: 1024px) and (min-width: 769px) {
    flex-direction: column;
    gap: ${PHI}rem;
    align-items: center;
    text-align: center;
    padding-top: ${1.5 * PHI}rem;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
`;

const Copyright = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: ${PHI * 0.5}rem;
  font-weight: 300;
  line-height: 1.4;
  
  /* Tablet optimizations - better readability */
  @media (max-width: 1024px) and (min-width: 481px) {
    font-size: ${PHI * 0.55}rem;
    line-height: 1.5;
    text-align: center;
    max-width: 80%;
    margin: 0 auto;
  }
`;

const BottomLinks = styled.div`
  display: flex;
  gap: ${PHI}rem;
  
  /* Tablet optimizations */
  @media (max-width: 1024px) and (min-width: 481px) {
    gap: ${1.5 * PHI}rem;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const BottomLink = styled.a`
  color: rgba(255, 255, 255, 0.5);
  font-size: ${PHI * 0.5}rem;
  transition: all 0.3s ease;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background: #3a86ff;
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: #3a86ff;
    
    &::after {
      width: 100%;
    }
  }
  
  /* Tablet optimizations */
  @media (max-width: 1024px) and (min-width: 481px) {
    font-size: ${PHI * 0.55}rem;
    padding: 0.5rem 0.8rem;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${PHI * 0.2}rem;
    
    &:hover {
      background: rgba(58, 134, 255, 0.1);
      transform: translateY(-2px);
    }
  }
`;


const PolicyModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(15px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 0;
  overflow: hidden;
  
  /* Mobile optimizations - full screen approach */
  @media (max-width: 768px) {
    align-items: flex-start;
    justify-content: center;
    padding: 1rem 0.5rem;
    box-sizing: border-box;
  }
  
  /* Tablet optimizations - ensure centering */
  @media (min-width: 769px) and (max-width: 1024px) {
    align-items: center;
    justify-content: center;
    padding: 2rem;
    box-sizing: border-box;
  }
`;

const PolicyContent = styled(motion.div)`
  background: linear-gradient(135deg, 
    rgba(8, 8, 20, 0.98) 0%,
    rgba(15, 15, 30, 0.98) 100%
  );
  border-radius: ${PHI * 0.6}rem;
  border: 2px solid rgba(58, 134, 255, 0.4);
  padding: ${PHI * 1.5}rem;
  overflow-y: auto;
  position: relative;
  box-shadow: 
    0 25px 80px rgba(58, 134, 255, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  margin: 0 auto;
  
  /* Desktop */
  @media (min-width: 1025px) {
    width: 700px;
    max-width: 700px;
    max-height: 80vh;
    padding: ${PHI * 2}rem;
  }
  
  /* Tablet - perfectly centered */
  @media (min-width: 769px) and (max-width: 1024px) {
    width: 90%;
    max-width: 600px;
    max-height: 85vh;
    padding: ${PHI * 1.8}rem;
    margin: 0 auto;
  }
  
  /* Mobile - full safe area */
  @media (max-width: 768px) {
    width: calc(100vw - 1rem);
    max-width: calc(100vw - 1rem);
    max-height: calc(100vh - 2rem);
    padding: ${PHI}rem;
    margin: 0;
    border-radius: ${PHI * 0.4}rem;
    
    /* Handle iPhone safe areas */
    padding-top: max(${PHI}rem, env(safe-area-inset-top, 1rem));
    padding-bottom: max(${PHI}rem, env(safe-area-inset-bottom, 1rem));
    padding-left: max(${PHI}rem, env(safe-area-inset-left, 1rem));
    padding-right: max(${PHI}rem, env(safe-area-inset-right, 1rem));
  }
  
  h2 {
    font-size: ${PHI * 1.2}rem;
    font-weight: 700;
    margin-bottom: ${PHI * 1.3}rem;
    text-align: center;
    position: relative;
    letter-spacing: 0.5px;
    
    /* Clean bright text */
    color: #ffffff;
    
    /* Simple elegant underline */
    &::after {
      content: '';
      position: absolute;
      bottom: -0.8rem;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 2px;
      background: linear-gradient(90deg, 
        transparent 0%, 
        #3a86ff 50%, 
        transparent 100%
      );
      border-radius: 1px;
    }
    
    @media (max-width: 768px) {
      font-size: ${PHI * 1}rem;
      margin-bottom: ${PHI}rem;
      
      &::after {
        width: 60px;
        bottom: -0.6rem;
      }
    }
  }
  
  h3 {
    color: rgba(255, 255, 255, 0.95);
    font-size: ${PHI * 0.8}rem;
    font-weight: 600;
    margin: ${PHI * 1.2}rem 0 ${PHI * 0.8}rem;
    position: relative;
    padding-left: 1rem;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 1rem;
      background: linear-gradient(to bottom, #3a86ff, #00c6ff);
      border-radius: 2px;
    }
    
    @media (max-width: 768px) {
      font-size: ${PHI * 0.7}rem;
      margin: ${PHI}rem 0 ${PHI * 0.6}rem;
    }
  }
  
  p, li {
    color: rgba(255, 255, 255, 0.85);
    line-height: ${PHI * 1.1};
    margin-bottom: ${PHI * 0.8}rem;
    font-size: ${PHI * 0.6}rem;
    
    @media (max-width: 768px) {
      font-size: ${PHI * 0.55}rem;
      line-height: ${PHI};
      margin-bottom: ${PHI * 0.6}rem;
    }
  }
  
  ul {
    padding-left: 1.5rem;
    margin-bottom: ${PHI}rem;
    
    @media (max-width: 768px) {
      padding-left: 1rem;
      margin-bottom: ${PHI * 0.8}rem;
    }
  }
  
  li {
    margin-bottom: ${PHI * 0.5}rem;
    position: relative;
    
    &::marker {
      color: rgba(58, 134, 255, 0.7);
    }
  }
  
  a {
    color: #3a86ff;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;
    
    &:hover {
      color: #00c6ff;
      text-decoration: underline;
    }
  }
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(58, 134, 255, 0.3);
    border-radius: 3px;
    
    &:hover {
      background: rgba(58, 134, 255, 0.5);
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: ${PHI * 2.2}rem;
  height: ${PHI * 2.2}rem;
  border-radius: 50%;
  background: rgba(58, 134, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(58, 134, 255, 0.4);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 10;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  
  &:hover {
    background: rgba(255, 69, 69, 0.2);
    border-color: rgba(255, 69, 69, 0.5);
    color: #ff4545;
    transform: scale(1.1) rotate(90deg);
    box-shadow: 0 6px 25px rgba(255, 69, 69, 0.3);
  }
  
  &:active {
    transform: scale(0.95) rotate(90deg);
  }
  
  svg {
    width: ${PHI * 0.8}rem;
    height: ${PHI * 0.8}rem;
    stroke-width: 2.5;
  }
  
  @media (max-width: 768px) {
    top: max(0.5rem, env(safe-area-inset-top, 0.5rem));
    right: max(0.5rem, env(safe-area-inset-right, 0.5rem));
    width: ${PHI * 2.4}rem;
    height: ${PHI * 2.4}rem;
    border-width: 3px;
    
    svg {
      width: ${PHI * 0.8}rem;
      height: ${PHI * 0.8}rem;
      stroke-width: 3;
    }
  }
`;

export default function Footer() {
  const [activePolicy, setActivePolicy] = useState<string | null>(null);
  const dataLinesRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Create animated data streams
    if (dataLinesRef.current) {
      const lines = Array.from({ length: 12 }, (_, i) => (
        <DataLine
          key={i}
          delay={i * 0.5}
          left={Math.random() * 100}
        />
      ));
      
      dataLinesRef.current.innerHTML = '';
      lines.forEach(line => {
        const div = document.createElement('div');
        div.style.cssText = `
          position: absolute;
          left: ${Math.random() * 100}%;
          width: 1px;
          height: 100px;
          background: linear-gradient(to bottom, transparent 0%, rgba(58, 134, 255, 0.6) 50%, transparent 100%);
          animation: dataStream ${8 + Math.random() * 4}s ease-in-out infinite;
          animation-delay: ${Math.random() * 2}s;
        `;
        dataLinesRef.current?.appendChild(div);
      });
    }
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  const openPolicyModal = (policy: string) => {
    setActivePolicy(policy);
    document.body.style.overflow = 'hidden';
  };
  
  const closePolicyModal = () => {
    setActivePolicy(null);
    document.body.style.overflow = 'unset';
  };
  
  return (
    <>
    <FooterContainer>
        <DataStreamOverlay ref={dataLinesRef} />
        
      <FooterContent>
          <PrimarySection>
            <Logo>TacitusXI</Logo>
            <SecurityBadge>Security Researcher</SecurityBadge>
          <Description>
            {personalInfo.summary}
          </Description>
          <SocialContainer>
            <SocialLink href={githubInfo.profileUrl} target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </SocialLink>
            <SocialLink href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </SocialLink>
            <SocialLink href="https://x.com/TacitusXI" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
              </svg>
            </SocialLink>
            <SocialLink href="https://medium.com/@ivanlieskov" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M0 0v24h24V0H0zm19.938 5.686L18.651 6.92a.376.376 0 0 0-.143.362v9.067a.376.376 0 0 0 .143.361l1.257 1.234v.271h-6.322v-.27l1.302-1.265c.128-.128.128-.165.128-.36V8.99l-3.62 9.195h-.49L6.69 8.99v6.163a.85.85 0 0 0 .233.707l1.694 2.054v.271H3.815v-.27L5.51 15.86a.82.82 0 0 0 .218-.707V8.027a.624.624 0 0 0-.203-.527L4.019 5.686v-.270h4.674l3.613 7.923 3.176-7.924h4.456v.271z"/>
              </svg>
            </SocialLink>
          </SocialContainer>
          </PrimarySection>
        
        <FooterSection>
          <SectionTitle>Navigation</SectionTitle>
          <LinksContainer>
            <FooterLink href="#home">Home</FooterLink>
            <FooterLink href="#projects">Projects</FooterLink>
            <FooterLink href="#experience">Experience</FooterLink>
            <FooterLink href="#skills">Skills</FooterLink>
            <NextLink href="/audit">Security Audits</NextLink>
            <FooterLink href="#github">Research</FooterLink>
          </LinksContainer>
        </FooterSection>
        
        <FooterSection>
          <SectionTitle>Resources</SectionTitle>
          <LinksContainer>
            <FooterLink href="https://github.com/TacitusXI" target="_blank" rel="noopener noreferrer">
              GitHub Repository
            </FooterLink>
            <FooterLink href="/Ivan_Leskov_Web3_Solidity_Engineer.pdf" target="_blank">
              Security Research CV
            </FooterLink>
            <FooterLink href="#" onClick={() => openPolicyModal('privacy')}>
              Privacy Policy
            </FooterLink>
            <FooterLink href="#" onClick={() => openPolicyModal('terms')}>
              Terms of Service
            </FooterLink>
          </LinksContainer>
        </FooterSection>
      </FooterContent>
      
        <BottomBar>
          <Copyright>
            © 2024 TacitusXI. All rights reserved. Security researcher & blockchain security expert.
          </Copyright>
        <BottomLinks>
            <BottomLink href="#" onClick={() => openPolicyModal('privacy')}>
              Privacy
          </BottomLink>
            <BottomLink href="#" onClick={() => openPolicyModal('terms')}>
              Terms
          </BottomLink>
            <BottomLink href="mailto:ivan.leskov@protonmail.com">
              Contact
          </BottomLink>
            <BottomLink href="#" onClick={scrollToTop}>
              ↑ Top
          </BottomLink>
        </BottomLinks>
      </BottomBar>
      </FooterContainer>
      
      
        <AnimatePresence>
        {activePolicy && (
          <PolicyModal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closePolicyModal}
        >
            <PolicyContent
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
              <CloseButton onClick={closePolicyModal}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </CloseButton>
              
              {activePolicy === 'privacy' && (
                <div>
                  <h2>Privacy Policy</h2>
                  <p>Last updated: {new Date().toLocaleDateString()}</p>
                  
                  <h3>Information We Collect</h3>
                  <p>This website collects minimal information to provide you with the best experience:</p>
                  <ul>
                    <li>Analytics data through Microsoft Clarity for improving user experience</li>
                    <li>Basic browser information for compatibility purposes</li>
                    <li>No personal information is stored or tracked without consent</li>
              </ul>
              
                  <h3>How We Use Information</h3>
                  <p>Any collected information is used solely for:</p>
                  <ul>
                    <li>Improving website performance and user experience</li>
                    <li>Understanding visitor patterns to enhance content</li>
                    <li>Ensuring security and preventing abuse</li>
              </ul>
              
              <h3>Data Security</h3>
                  <p>As a security researcher, I take data protection seriously. All data handling follows industry best practices and security standards.</p>
                  
                  <h3>Contact</h3>
                  <p>For privacy-related questions, contact: <a href="mailto:ivan.leskov@protonmail.com">ivan.leskov@protonmail.com</a></p>
                </div>
              )}
      
      {activePolicy === 'terms' && (
                <div>
                  <h2>Terms of Service</h2>
                  <p>Last updated: {new Date().toLocaleDateString()}</p>
                  
                  <h3>Acceptance of Terms</h3>
                  <p>By accessing this website, you agree to these terms of service and privacy policy.</p>
                  
                  <h3>Use License</h3>
                  <p>Permission is granted to temporarily access this website for personal, non-commercial use. This license does not include:</p>
                  <ul>
                    <li>Modifying or copying the materials</li>
                    <li>Using materials for commercial purposes</li>
                    <li>Attempting to reverse engineer any software</li>
                    <li>Removing copyright or proprietary notations</li>
              </ul>
              
                  <h3>Security Research</h3>
                  <p>Information about security research and audits is provided for educational purposes. Always conduct security research responsibly and with proper authorization.</p>
              
              <h3>Limitation of Liability</h3>
                  <p>The information on this website is provided as-is. Ivan Leskov makes no warranties and shall not be liable for any damages arising from the use of this website.</p>
                </div>
              )}
            </PolicyContent>
          </PolicyModal>
      )}
      </AnimatePresence>
    </>
  );
} 