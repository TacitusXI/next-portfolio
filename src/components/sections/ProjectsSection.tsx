'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useBackground } from '../effects/BackgroundProvider';
import { projects } from '@/data/content';
import type { Project } from '@/types/index';
import { trackEvent, setTag } from '@/utils/analytics';

const ProjectsContainer = styled.section`
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

const FilterContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const FilterButton = styled.button<{ $isActive: boolean }>`
  padding: 0.5rem 1.5rem;
  background: ${props => props.$isActive ? 'rgba(153, 69, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.$isActive ? '#9945ff' : 'rgba(255, 255, 255, 0.7)'};
  border: 1px solid ${props => props.$isActive ? '#9945ff' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(153, 69, 255, 0.1);
    color: ${props => props.$isActive ? '#9945ff' : 'rgba(255, 255, 255, 0.9)'};
  }
`;

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProjectCard = styled(motion.div)`
  background: rgba(25, 25, 25, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  }
`;

const ProjectImage = styled.div`
  height: 220px;
  background-size: cover;
  background-position: center;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  position: relative;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7));
    z-index: 1;
    transition: opacity 0.4s ease;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(72, 191, 255, 0.2), rgba(115, 74, 253, 0.3));
    opacity: 0;
    z-index: 2;
    transition: opacity 0.4s ease;
  }
  
  ${ProjectCard}:hover & {
    transform: scale(1.05);
    
    &::before {
      opacity: 0.6;
    }
    
    &::after {
      opacity: 1;
    }
  }
`;

const ProjectContent = styled.div`
  padding: 1.5rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 0.75rem;
  color: white;
`;

const ProjectDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TechStackContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const TechTag = styled.span`
  background: rgba(153, 69, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8rem;
  border: 1px solid rgba(153, 69, 255, 0.3);
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const ProjectLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(153, 69, 255, 0.1);
    color: #9945ff;
    border-color: rgba(153, 69, 255, 0.3);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const GithubStats = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

export default function ProjectsSection() {
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const { setBackgroundType, setIntensity, setColorScheme } = useBackground();
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  // Extract unique project categories from GitHub topics
  const getCategories = () => {
    const allTopics = projects.flatMap(project => project.githubInfo?.topics || []);
    const uniqueTopics = ['All', ...new Set(allTopics)];
    return uniqueTopics.slice(0, 6); // Limit to 6 categories including 'All'
  };
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
      
      // Change background when scrolling to Projects section
      setBackgroundType('crypto');
      setIntensity(95);
      setColorScheme('cyber');
    }
  }, [inView, controls, setBackgroundType, setIntensity, setColorScheme]);
  
  useEffect(() => {
    // Filter projects based on selected category
    if (selectedCategory === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter(project => 
          project.githubInfo?.topics.includes(selectedCategory.toLowerCase())
        )
      );
    }
  }, [selectedCategory]);
  
  const getProjectImage = (project: Project) => {
    // Map project titles to existing image files
    const imageMap: {[key: string]: string} = {
      "Dark Forest": "./images/darkforest.webp",
      "TechnoirClub Marketplace": "./images/technoir-club.webp",
      "LeskoDEX": "./images/lesko-dex.webp",
      "LIQUID-DEX": "./images/liquid-dex.webp",
      "Tacitus Swap": "./images/tacitus-swap.webp",
      "DeFi IL Hedge Bot": "./images/defi-hedge-bot.webp",
      "Ledger Signer": "./images/ledger-project.webp"
    };
    
    // Return the mapped image or fall back to a placeholder
    return imageMap[project.title] || 
      `./images/projects/${project.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
  };
  
  return (
    <ProjectsContainer id="projects" ref={ref}>
      <ContentWrapper className="content-section-enhanced">
        <SectionTitle
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.8 }}
          className="cyberpunk-section-title cyberpunk-title-md"
          data-text="Neural.Network_Projects"
          data-mobile-text="Projects"
        >
          Neural.Network_Projects
        </SectionTitle>
        
        <SectionDescription
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="enhanced-text"
        >
          A collection of my blockchain and web3 projects, highlighting my technical skills 
          and innovative solutions in decentralized applications.
        </SectionDescription>
        
        <FilterContainer
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {getCategories().map(category => (
            <FilterButton
              key={category}
              $isActive={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
              className="cyberpunk-button"
            >
              {category}
            </FilterButton>
          ))}
        </FilterContainer>
        
        <ProjectsGrid
          initial={{ opacity: 0 }}
          animate={controls}
          variants={{
            visible: { opacity: 1 }
          }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="cyberpunk-card"
                onClick={() => {
                  if (project.links.github) {
                    // Track the project click with Clarity
                    trackEvent('project_click');
                    setTag('project_name', project.title);
                    setTag('project_tech', project.githubInfo?.languages.map(lang => lang.name) || []);
                    
                    window.open(project.links.github, '_blank', 'noopener noreferrer');
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <ProjectImage style={{ backgroundImage: `url(${getProjectImage(project)})` }} />
                <ProjectContent>
                  <ProjectTitle>{project.title}</ProjectTitle>
                  <ProjectDescription>{project.description}</ProjectDescription>
                  
                  <TechStackContainer>
                    {project.githubInfo?.languages.slice(0, 4).map(lang => (
                      <TechTag key={lang.name}>{lang.name}</TechTag>
                    ))}
                  </TechStackContainer>
                  
                  <ProjectLinks>
                    {project.links.github && (
                      <ProjectLink 
                        href={project.links.github} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        Code
                      </ProjectLink>
                    )}
                    
                    {project.links.live && (
                      <ProjectLink 
                        href={project.links.live} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="2" y1="12" x2="22" y2="12"></line>
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                        Live Demo
                      </ProjectLink>
                    )}
                  </ProjectLinks>
                  
                  {project.githubInfo && (
                    <GithubStats>
                      <StatItem>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                        </svg>
                        {project.githubInfo.stars} stars
                      </StatItem>
                      <StatItem>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M21 3c0-1.657-1.343-3-3-3s-3 1.343-3 3c0 1.323.861 2.433 2.05 2.832.168 4.295-2.021 4.764-4.998 5.391-1.709.36-3.642.775-5.052 2.085v-7.492c1.163-.413 2-1.511 2-2.816 0-1.657-1.343-3-3-3s-3 1.343-3 3c0 1.305.837 2.403 2 2.816v12.367c-1.163.414-2 1.512-2 2.817 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.295-.824-2.388-1.973-2.808.27-3.922 2.57-4.408 5.437-5.012 3.038-.64 6.774-1.442 6.579-7.377 1.141-.425 1.957-1.514 1.957-2.803zm-18 0c0-.552.448-1 1-1s1 .448 1 1-.448 1-1 1-1-.448-1-1zm3 18c0 .552-.448 1-1 1s-1-.448-1-1 .448-1 1-1 1 .448 1 1zm13-18c0 .552-.448 1-1 1s-1-.448-1-1 .448-1 1-1 1 .448 1 1z"/>
                        </svg>
                        {project.githubInfo.forks} forks
                      </StatItem>
                    </GithubStats>
                  )}
                </ProjectContent>
              </ProjectCard>
            ))}
          </AnimatePresence>
        </ProjectsGrid>
      </ContentWrapper>
    </ProjectsContainer>
  );
} 