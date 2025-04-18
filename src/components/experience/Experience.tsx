'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { experiences } from '@/data/content';

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

const Experience: React.FC = () => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const toggleCard = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <ExperienceSection id="experience">
      <SectionTitle>Professional Experience</SectionTitle>
      <TimelineContainer>
        {/* Mobile View */}
        {experiences.map((exp, index) => (
          <MobileExperienceCard key={index}>
            <CardHeader 
              $isOpen={expandedCard === index}
              onClick={() => toggleCard(index)}
            >
              <HeaderContent>
                <CompanyTitle>{exp.company}</CompanyTitle>
                <Period>{exp.period}</Period>
              </HeaderContent>
              <ExpandButton
                initial={{ rotate: 0 }}
                animate={{ rotate: expandedCard === index ? 180 : 0 }}
              >
                {expandedCard === index ? <FaChevronUp /> : <FaChevronDown />}
              </ExpandButton>
            </CardHeader>
            
            <AnimatePresence>
              {expandedCard === index && (
                <CardContent
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <JobTitle>{exp.title}</JobTitle>
                  <Description>{exp.description}</Description>
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

        {/* Desktop View */}
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
              <Description>{exp.description}</Description>
              <h5 style={{ marginTop: '20px', color: '#3b82f6' }}>Key Achievements:</h5>
              <AchievementsList>
                {exp.achievements.map((achievement: string, i: number) => (
                  <li key={i}>{achievement}</li>
                ))}
              </AchievementsList>
            </TimelineContent>
          </TimelineItem>
        ))}
      </TimelineContainer>
    </ExperienceSection>
  );
};

export default Experience; 