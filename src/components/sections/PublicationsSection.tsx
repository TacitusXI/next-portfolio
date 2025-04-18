'use client';

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaExternalLinkAlt, FaBook, FaFileAlt } from 'react-icons/fa';
import { publications } from '@/data/content';

const PublicationsContainer = styled.section`
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
  margin-bottom: 1.5rem;
  text-align: center;
  background: linear-gradient(135deg, rgb(115, 74, 253) 0%, rgb(49, 164, 253) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SectionDescription = styled(motion.p)`
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 700px;
  margin: 0 auto 3rem;
`;

const PublicationsGrid = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const PublicationCard = styled(motion.div)`
  background: rgba(25, 25, 25, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 2rem;
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(115, 74, 253, 0.3) 15%, 
      rgba(49, 164, 253, 0.5) 50%, 
      rgba(115, 74, 253, 0.3) 85%, 
      transparent 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
    border-color: rgba(115, 74, 253, 0.3);
    
    &::before {
      opacity: 1;
    }
  }
`;

const PublicationContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const IconWrapper = styled.div`
  min-width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(115, 74, 253, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 0.25rem;
  box-shadow: 0 0 15px rgba(115, 74, 253, 0.2);
  
  svg {
    color: rgb(115, 74, 253);
    font-size: 1.5rem;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const PublicationTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  color: white;
  line-height: 1.4;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const PublisherName = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
  font-weight: 500;
`;

const PublicationDescription = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex-grow: 1;
`;

const ReadMoreLink = styled.a`
  display: inline-flex;
  align-items: center;
  color: rgb(115, 74, 253);
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;
  margin-top: auto;
  padding: 0.5rem 0;
  
  svg {
    margin-left: 0.5rem;
    font-size: 0.8rem;
  }
  
  &:hover {
    color: rgb(49, 164, 253);
    transform: translateX(5px);
  }
`;

export default function PublicationsSection() {
  const controls = useAnimation();
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <PublicationsContainer id="publications" ref={ref}>
      <ContentWrapper>
        <SectionTitle
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="cyberpunk-section-title cyberpunk-title-md"
          data-text="Source.Technical_Publications"
          data-mobile-text="Publications"
        >
          Source.Technical_Publications
        </SectionTitle>
        
        <SectionDescription
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Technical articles and books I&apos;ve contributed to in the blockchain and software development space.
        </SectionDescription>
        
        <PublicationsGrid
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {publications.map((publication, index) => (
            <PublicationCard key={index} variants={itemVariants} className="cyberpunk-card">
              <IconWrapper>
                <FaBook />
              </IconWrapper>
              <PublicationContent>
                <PublicationTitle>{publication.title}</PublicationTitle>
                <PublisherName>{publication.publisher}</PublisherName>
                <PublicationDescription>
                  {publication.description}
                </PublicationDescription>
                {publication.link && (
                  <ReadMoreLink 
                    href={publication.link} 
                    target={publication.isInternal ? "_self" : "_blank"} 
                    rel={publication.isInternal ? "" : "noopener noreferrer"}
                  >
                    {publication.isInternal ? "Read Article" : "Read More"} {publication.isInternal ? <FaFileAlt /> : <FaExternalLinkAlt />}
                  </ReadMoreLink>
                )}
              </PublicationContent>
            </PublicationCard>
          ))}
        </PublicationsGrid>
      </ContentWrapper>
    </PublicationsContainer>
  );
} 