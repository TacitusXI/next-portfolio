'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronUp, FaExternalLinkAlt, FaTimes, FaShieldAlt } from 'react-icons/fa';
import { experiences, additionalExperiences } from '@/data/content';
import { parseTextWithBookLinks } from '@/components/utils/textParser';

const ExperienceSection = styled.section`
  padding: 100px 0;
  position: relative;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: white;
  margin-bottom: 1rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 50px;
`;

const SubSectionTitle = styled.h3`
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 20px;
  font-size: 1.2rem;
  text-align: center;
  
  &.desktop-only {
    display: none;
    margin-bottom: 30px;
    font-size: 1.4rem;
    
    @media (min-width: 769px) {
      display: block;
    }
  }
  
  &.with-top-margin {
    margin-top: 40px;
  }
`;

const TimelineContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;

  @media (min-width: 769px) {
    &::after {
      content: '';
      position: absolute;
      width: 6px;
      background: linear-gradient(180deg, #3b82f6, #a855f7);
      top: 0;
      bottom: 0;
      left: 50%;
      margin-left: -3px;
      border-radius: 3px;
      box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
    }
  }
`;

const MobileExperienceCard = styled(motion.div)`
  background: rgba(10, 11, 14, 0.8);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 15px;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.1);

  @media (min-width: 769px) {
    display: none;
  }
`;

const CardHeader = styled.div<{ $isOpen: boolean }>`
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border-bottom: ${props => props.$isOpen ? '1px solid rgba(59, 130, 246, 0.2)' : 'none'};
  transition: all 0.3s ease;

  &:hover {
    background: rgba(59, 130, 246, 0.1);
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const CompanyTitle = styled.h3`
  color: #3b82f6;
  margin-bottom: 5px;
  font-size: 1.2rem;
`;

const Period = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  display: block;
`;

const ExpandButton = styled(motion.button)`
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  padding: 10px;
`;

const CardContent = styled(motion.div)`
  padding: 20px;
`;

const Achievement = styled(motion.li)`
  margin-bottom: 15px;
  padding-left: 20px;
  position: relative;
  line-height: 1.5;

  &::before {
    content: '→';
    color: #3b82f6;
    position: absolute;
    left: 0;
  }
`;

const TimelineItem = styled(motion.div)`
  padding: 10px 40px;
  position: relative;
  width: 50%;
  background: transparent;

  &:nth-child(odd) {
    left: 0;
    padding-right: 50px;
    text-align: right;

    .content {
      border-radius: 20px 0 20px 20px;
    }
  }

  &:nth-child(even) {
    left: 50%;
    padding-left: 50px;

    .content {
      border-radius: 0 20px 20px 20px;
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const TimelineContent = styled.div`
  padding: 30px;
  background: rgba(10, 11, 14, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
  }
`;

const TimelineDot = styled.div`
  width: 25px;
  height: 25px;
  background: #121212;
  border: 4px solid #3b82f6;
  position: absolute;
  border-radius: 50%;
  top: 20px;
  right: -12.5px;
  z-index: 1;
  box-shadow: 0 0 10px #3b82f6;

  ${TimelineItem}:nth-child(even) & {
    left: -12.5px;
  }

  @media (max-width: 768px) {
    left: 20px !important;
  }
`;

const JobTitle = styled.h4`
  color: #fff;
  margin-bottom: 10px;
  font-size: 1.2rem;
`;

const Description = styled.p`
  margin: 15px 0;
  line-height: 1.6;
`;

const AchievementsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 15px 0;

  li {
    margin-bottom: 10px;
    padding-left: 20px;
    position: relative;
    line-height: 1.5;

    &::before {
      content: '→';
      color: #3b82f6;
      position: absolute;
      left: 0;
    }
  }
`;

const ProofButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(59, 130, 246, 0.2);
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const SideProjectsButton = styled(ProofButton)`
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  
  &:hover {
    background: rgba(59, 130, 246, 0.2);
  }
`;

const ProofModal = styled(motion.div)`
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

const ProofContent = styled(motion.div)`
  width: 85%;
  max-width: 900px;
  max-height: 90vh;
  background: rgba(15, 15, 25, 0.95);
  border-radius: 12px;
  overflow: auto;
  position: relative;
  border: 1px solid rgba(59, 130, 246, 0.3);
  box-shadow: 0 0 30px rgba(59, 130, 246, 0.2);
  padding: 1.75rem;
  
  @media (max-width: 768px) {
    padding: 1.25rem;
    width: 95%;
  }
`;

const ProofTitle = styled.h3`
  font-size: 1.5rem;
  color: white;
  margin-bottom: 1rem;
  text-align: center;
`;

const ProofDescription = styled.p`
  margin-bottom: 1.5rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
`;

const ProofImageGrid = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  width: 100%;
  overflow-x: auto;
`;

const ProofImage = styled.img`
  height: 375px;
  width: auto;
  max-width: none;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid rgba(59, 130, 246, 0.3);
  background-color: rgba(0, 0, 0, 0.2);
`;

const ProofLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ProofLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #3b82f6;
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(59, 130, 246, 0.2);
  }
`;

const CloseProofButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(15, 15, 25, 0.8);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(59, 130, 246, 0.2);
    transform: scale(1.1);
  }
`;

const Experience: React.FC = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [selectedProof, setSelectedProof] = useState<any | null>(null);

  const toggleCard = (index: string) => {
    setExpandedCard(expandedCard === index ? null : index);
  };
  
  const openProofModal = (proof: any) => {
    setSelectedProof(proof);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };
  
  const closeProofModal = () => {
    setSelectedProof(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };
  
  const scrollToSideProjects = () => {
    const sideProjectsTitle = document.querySelector('.with-top-margin');
    if (sideProjectsTitle) {
      sideProjectsTitle.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Clean up on unmount
  React.useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <>
      <ExperienceSection id="experience">
        <SectionTitle>Professional Experience</SectionTitle>
        <TimelineContainer>
          {/* Mobile View - Main Experiences */}
          <SubSectionTitle>Main Experience</SubSectionTitle>
          {experiences.map((exp, index) => (
            <MobileExperienceCard key={`main-${index}`}>
              <CardHeader 
                $isOpen={expandedCard === `main-${index}`}
                onClick={() => toggleCard(`main-${index}`)}
              >
                <HeaderContent>
                  <CompanyTitle>{exp.company}</CompanyTitle>
                  <Period>{exp.period}</Period>
                </HeaderContent>
                <ExpandButton
                  initial={{ rotate: 0 }}
                  animate={{ rotate: expandedCard === `main-${index}` ? 180 : 0 }}
                >
                  {expandedCard === `main-${index}` ? <FaChevronUp /> : <FaChevronDown />}
                </ExpandButton>
              </CardHeader>
              
              <AnimatePresence>
                {expandedCard === `main-${index}` && (
                  <CardContent
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <JobTitle>{exp.title}</JobTitle>
                    <Description>{parseTextWithBookLinks(exp.description)}</Description>
                    <h5 style={{ marginTop: '20px', color: '#3b82f6' }}>Key Achievements:</h5>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {exp.achievements.map((achievement: string, i: number) => (
                        <Achievement 
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          {achievement}
                        </Achievement>
                      ))}
                    </ul>
                    
                    {exp.proof && (
                      <ButtonsContainer>
                        <ProofButton 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openProofModal(exp.proof)}
                        >
                          <FaShieldAlt /> View Proof
                        </ProofButton>
                        
                        {exp.company === "Various Projects" && (
                          <SideProjectsButton
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={scrollToSideProjects}
                          >
                            Side Projects
                          </SideProjectsButton>
                        )}
                      </ButtonsContainer>
                    )}
                  </CardContent>
                )}
              </AnimatePresence>
            </MobileExperienceCard>
          ))}
          
          {/* Mobile View - Additional Experiences */}
          <SubSectionTitle className="with-top-margin">Side Projects</SubSectionTitle>
          {additionalExperiences.map((exp, index) => (
            <MobileExperienceCard key={`side-${index}`}>
              <CardHeader 
                $isOpen={expandedCard === `side-${index}`}
                onClick={() => toggleCard(`side-${index}`)}
              >
                <HeaderContent>
                  <CompanyTitle>{exp.company}</CompanyTitle>
                  <Period>{exp.period}</Period>
                </HeaderContent>
                <ExpandButton
                  initial={{ rotate: 0 }}
                  animate={{ rotate: expandedCard === `side-${index}` ? 180 : 0 }}
                >
                  {expandedCard === `side-${index}` ? <FaChevronUp /> : <FaChevronDown />}
                </ExpandButton>
              </CardHeader>
              
              <AnimatePresence>
                {expandedCard === `side-${index}` && (
                  <CardContent
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <JobTitle>{exp.title}</JobTitle>
                    <Description>{parseTextWithBookLinks(exp.description)}</Description>
                    <h5 style={{ marginTop: '20px', color: '#3b82f6' }}>Key Achievements:</h5>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {exp.achievements.map((achievement: string, i: number) => (
                        <Achievement 
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          {achievement}
                        </Achievement>
                      ))}
                    </ul>
                  </CardContent>
                )}
              </AnimatePresence>
            </MobileExperienceCard>
          ))}

          {/* Desktop View - Main Experiences */}
          <SubSectionTitle className="desktop-only">Main Experience</SubSectionTitle>
          {experiences.map((exp, index) => (
            <TimelineItem
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <TimelineDot />
              <TimelineContent className="content">
                <CompanyTitle>{exp.company}</CompanyTitle>
                <Period>{exp.period}</Period>
                <JobTitle>{exp.title}</JobTitle>
                <Description>{parseTextWithBookLinks(exp.description)}</Description>
                <h5 style={{ marginTop: '20px', color: '#3b82f6' }}>Key Achievements:</h5>
                <AchievementsList>
                  {exp.achievements.map((achievement: string, i: number) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </AchievementsList>
                
                {exp.proof && (
                  <ButtonsContainer>
                    <ProofButton 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openProofModal(exp.proof)}
                    >
                      <FaShieldAlt /> View Proof
                    </ProofButton>
                    
                    {exp.company === "Various Projects" && (
                      <SideProjectsButton
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={scrollToSideProjects}
                      >
                        Side Projects
                      </SideProjectsButton>
                    )}
                  </ButtonsContainer>
                )}
              </TimelineContent>
            </TimelineItem>
          ))}

          {/* Desktop View - Additional Experiences */}
          <SubSectionTitle className="desktop-only with-top-margin">Side Projects</SubSectionTitle>
          {additionalExperiences.map((exp, index) => (
            <TimelineItem
              key={`side-${index}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <TimelineDot />
              <TimelineContent className="content">
                <CompanyTitle>{exp.company}</CompanyTitle>
                <Period>{exp.period}</Period>
                <JobTitle>{exp.title}</JobTitle>
                <Description>{parseTextWithBookLinks(exp.description)}</Description>
                <h5 style={{ marginTop: '20px', color: '#3b82f6' }}>Key Achievements:</h5>
                <AchievementsList>
                  {exp.achievements.map((achievement: string, i: number) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </AchievementsList>
                
                {exp.proof && (
                  <ButtonsContainer>
                    <ProofButton 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openProofModal(exp.proof)}
                    >
                      <FaShieldAlt /> View Proof
                    </ProofButton>
                    
                    {exp.company === "Various Projects" && (
                      <SideProjectsButton
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={scrollToSideProjects}
                      >
                        Side Projects
                      </SideProjectsButton>
                    )}
                  </ButtonsContainer>
                )}
              </TimelineContent>
            </TimelineItem>
          ))}
        </TimelineContainer>
      </ExperienceSection>
      
      {/* Proof Modal */}
      <AnimatePresence>
        {selectedProof && (
          <ProofModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeProofModal}
          >
            <ProofContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <CloseProofButton onClick={closeProofModal} aria-label="Close proof">
                <FaTimes />
              </CloseProofButton>
              
              {selectedProof.title && (
                <ProofTitle>{selectedProof.title}</ProofTitle>
              )}
              
              {selectedProof.description && (
                <ProofDescription>{selectedProof.description}</ProofDescription>
              )}
              
              {selectedProof.images && selectedProof.images.length > 0 && (
                <ProofImageGrid>
                  {selectedProof.images.map((image: string, index: number) => (
                    <ProofImage 
                      key={index} 
                      src={image.startsWith('/images/') ? `.${image}` : image} 
                      alt={`Proof ${index + 1}`} 
                    />
                  ))}
                </ProofImageGrid>
              )}
              
              {selectedProof.links && selectedProof.links.length > 0 && (
                <ProofLinks>
                  {selectedProof.links.map((link: any, index: number) => (
                    <ProofLink 
                      key={index} 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {link.title} <FaExternalLinkAlt size={12} />
                    </ProofLink>
                  ))}
                </ProofLinks>
              )}
            </ProofContent>
          </ProofModal>
        )}
      </AnimatePresence>
    </>
  );
};

export default Experience; 