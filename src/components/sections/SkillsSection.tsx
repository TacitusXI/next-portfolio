'use client';

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useBackground } from '../effects/BackgroundProvider';
import { skills } from '@/data/content';

const SkillsContainer = styled.section`
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
  background: linear-gradient(135deg, #ffffff 0%, #bbbbbb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const SkillCategory = styled(motion.div)`
  background: rgba(25, 25, 25, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

interface CategoryTitleProps {
  color?: string;
}

const CategoryTitle = styled.h3<CategoryTitleProps>`
  font-size: 1.6rem;
  margin-bottom: 2rem;
  color: white;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -0.5rem;
    width: 100%;
    height: 3px;
    background: ${props => props.color || 'linear-gradient(90deg, #3a86ff, transparent)'};
    border-radius: 3px;
  }
`;

const SkillItem = styled(motion.div)`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SkillHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.7rem;
`;

const SkillName = styled.span`
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
`;

const SkillLevel = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  min-width: 80px;
  text-align: right;
  white-space: nowrap;
`;

const ProgressBarContainer = styled.div`
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
`;

interface ProgressBarFillProps {
  color?: string;
}

const ProgressBarFill = styled(motion.div)<ProgressBarFillProps>`
  height: 100%;
  background: ${props => props.color || 'linear-gradient(90deg, #3a86ff, #00c6ff)'};
  border-radius: 4px;
  transform-origin: left;
`;

const SkillsDescription = styled(motion.p)`
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 700px;
  margin: 0 auto 4rem;
`;

interface SkillItem {
  name: string;
  level: string;
  percentage: number;
}

export default function SkillsSection() {
  const { setBackgroundType, setIntensity, setColorScheme } = useBackground();
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
      
      // Change background when scrolling to Skills section
      setBackgroundType('digital');
      setIntensity(30);
      setColorScheme('blue');
    }
  }, [inView, controls, setBackgroundType, setIntensity, setColorScheme]);
  
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
  
  // Use Ivan's real skills from the content file
  const skillCategories = [
    {
      name: skills[0].category, // Blockchain
      color: "linear-gradient(90deg, rgb(115, 74, 253), rgb(49, 164, 253))",
      skills: skills[0].items.map((item: string) => ({
        name: item,
        level: "Advanced",
        percentage: 85
      }))
    },
    {
      name: skills[1].category, // Frontend
      color: "linear-gradient(90deg, rgb(255, 0, 128), rgb(255, 128, 0))",
      skills: skills[1].items.map((item: string) => ({
        name: item,
        level: "Intermediate",
        percentage: 75
      }))
    },
    {
      name: skills[2].category, // Backend
      color: "linear-gradient(90deg, rgb(0, 255, 128), rgb(0, 128, 255))",
      skills: skills[2].items.map((item: string) => ({
        name: item,
        level: "Intermediate",
        percentage: 75
      }))
    },
    {
      name: skills[3].category, // DevOps
      color: "linear-gradient(90deg, rgb(255, 0, 0), rgb(255, 128, 0))",
      skills: skills[3].items.map((item: string) => ({
        name: item,
        level: "Advanced",
        percentage: 80
      }))
    },
    {
      name: skills[4].category, // Tools
      color: "linear-gradient(90deg, rgb(128, 0, 255), rgb(255, 0, 128))",
      skills: skills[4].items.map((item: string) => ({
        name: item,
        level: "Advanced",
        percentage: 85
      }))
    }
  ];
  
  return (
    <SkillsContainer id="skills" ref={ref}>
      <ContentWrapper className="content-section-enhanced">
        <SectionTitle
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.8 }}
          className="cyberpunk-section-title cyberpunk-title-md"
          data-text="Neuro.Matrix_Skills"
          data-mobile-text="Skills"
        >
          Neuro.Matrix_Skills
        </SectionTitle>
        
        <SkillsDescription
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="enhanced-text"
        >
          I specialize in blockchain development, smart contract implementation, and decentralized applications.
          With a focus on security and efficiency, I strive to create robust blockchain solutions.
        </SkillsDescription>
        
        <SkillsGrid>
          {skillCategories.map((category, categoryIndex) => (
            <SkillCategory
              key={category.name}
              variants={containerVariants}
              initial="hidden"
              animate={controls}
              custom={categoryIndex}
              className="neotech-border"
            >
              <CategoryTitle color={category.color} className="neotech-text">{category.name}</CategoryTitle>
              
              {category.skills.map((skill: SkillItem, skillIndex: number) => (
                <SkillItem
                  key={skill.name}
                  variants={itemVariants}
                  custom={skillIndex}
                >
                  <SkillHeader>
                    <SkillName className="enhanced-text">{skill.name}</SkillName>
                    <SkillLevel>{skill.level}</SkillLevel>
                  </SkillHeader>
                  
                  <ProgressBarContainer>
                    <ProgressBarFill
                      initial={{ scaleX: 0 }}
                      animate={controls}
                      variants={{
                        visible: { scaleX: skill.percentage / 100 }
                      }}
                      transition={{ duration: 1, delay: 0.5 + skillIndex * 0.1 }}
                      color={category.color}
                    />
                  </ProgressBarContainer>
                </SkillItem>
              ))}
            </SkillCategory>
          ))}
        </SkillsGrid>
      </ContentWrapper>
    </SkillsContainer>
  );
} 