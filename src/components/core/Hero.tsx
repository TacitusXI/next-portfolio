'use client';

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { personalInfo } from '@/data/content';

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    padding-top: 100px;
    align-items: flex-start;
  }
`;

const GridBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(61, 90, 128, 0.2) 1px, transparent 1px),
    linear-gradient(90deg, rgba(61, 90, 128, 0.2) 1px, transparent 1px);
  background-size: 30px 30px;
  opacity: 0.1;
`;

const Content = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  z-index: 1;

  @media (max-width: 768px) {
    margin-top: 40px;
  }
`;

const NameHeading = styled(motion.h1)`
  font-size: 4rem;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #3b82f6, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-top: 20px;
  }
`;

const TitleHeading = styled(motion.h2)`
  font-size: 2rem;
  color: #3b82f6;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ContactInfo = styled(motion.div)`
  display: flex;
  gap: 20px;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  
  a {
    color: #3b82f6;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 5px;
    
    &:hover {
      text-shadow: 0 0 10px #3b82f6;
    }
  }

  @media (max-width: 768px) {
    gap: 15px;
    font-size: 0.9rem;
  }
`;

const SummaryText = styled(motion.p)`
  font-size: 1.2rem;
  line-height: 1.6;
  max-width: 600px;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.5;
  }
`;

const HeroCard = styled(motion.div)`
  background: rgba(10, 11, 14, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.1);

  @media (max-width: 768px) {
    padding: 20px;
    margin-top: 20px;
  }
`;

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
`;

const Hero: React.FC = () => {
  return (
    <HeroSection>
      <GridBackground />
      <Content
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <HeroCard
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <NameHeading>{personalInfo.name}</NameHeading>
          <TitleHeading>{personalInfo.title}</TitleHeading>
          <ContactInfo>
            <motion.div whileHover={{ scale: 1.05 }}>
              <a 
                href={`mailto:${personalInfo.email}`}
              >
                {personalInfo.email}
              </a>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <a 
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </motion.div>
          </ContactInfo>
          <SummaryText
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {personalInfo.summary}
          </SummaryText>
          <LocationInfo>
            <span>{personalInfo.location}</span>
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
          </LocationInfo>
        </HeroCard>
      </Content>
    </HeroSection>
  );
};

export default Hero; 