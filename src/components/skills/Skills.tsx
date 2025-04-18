'use client';

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import SkillRadar from './SkillRadar';
import SkillsGraph from './SkillsGraph';

const SkillsContainer = styled.section`
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

const SectionDescription = styled.p`
  font-size: 1.1rem;
  color: #e0e0e0;
  margin-bottom: 2rem;
  line-height: 1.6;
  max-width: 800px;
`;

const VisualizationsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const SkillCategoriesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const SkillCategory = styled(motion.div)`
  background: rgba(0, 10, 30, 0.7);
  border-radius: 10px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const CategoryTitle = styled.h3`
  font-size: 1.25rem;
  color: white;
  margin-bottom: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CategoryIcon = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background-color: ${props => props.color};
`;

const SkillsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SkillItem = styled.li`
  margin-bottom: 1rem;
`;

const SkillName = styled.div`
  font-size: 1rem;
  color: white;
  margin-bottom: 0.25rem;
  display: flex;
  justify-content: space-between;
`;

const SkillLevel = styled.div`
  font-size: 0.85rem;
  color: #a0a0a0;
`;

const SkillBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 0.25rem;
`;

const SkillProgress = styled.div<{ width: number; color: string }>`
  height: 100%;
  width: ${props => props.width}%;
  background-color: ${props => props.color};
  border-radius: 3px;
`;

// Sample data
const skillCategories = [
  {
    name: 'Frontend',
    color: '#3b82f6',
    skills: [
      { name: 'React', level: 'Expert', value: 95 },
      { name: 'TypeScript', level: 'Expert', value: 90 },
      { name: 'Next.js', level: 'Advanced', value: 85 },
      { name: 'CSS/SCSS', level: 'Expert', value: 90 },
    ],
  },
  {
    name: 'Backend',
    color: '#10b981',
    skills: [
      { name: 'Node.js', level: 'Advanced', value: 85 },
      { name: 'Express', level: 'Advanced', value: 80 },
      { name: 'GraphQL', level: 'Intermediate', value: 75 },
      { name: 'MongoDB', level: 'Advanced', value: 80 },
    ],
  },
  {
    name: 'DevOps',
    color: '#f59e0b',
    skills: [
      { name: 'Docker', level: 'Intermediate', value: 70 },
      { name: 'CI/CD', level: 'Intermediate', value: 75 },
      { name: 'AWS', level: 'Intermediate', value: 65 },
      { name: 'Kubernetes', level: 'Beginner', value: 50 },
    ],
  },
  {
    name: 'Mobile',
    color: '#8b5cf6',
    skills: [
      { name: 'React Native', level: 'Advanced', value: 80 },
      { name: 'Flutter', level: 'Beginner', value: 40 },
      { name: 'iOS', level: 'Intermediate', value: 60 },
      { name: 'Android', level: 'Intermediate', value: 60 },
    ],
  },
  {
    name: 'Data',
    color: '#ec4899',
    skills: [
      { name: 'SQL', level: 'Advanced', value: 85 },
      { name: 'Data Visualization', level: 'Advanced', value: 80 },
      { name: 'Python', level: 'Intermediate', value: 70 },
      { name: 'Machine Learning', level: 'Beginner', value: 45 },
    ],
  },
  {
    name: 'Design',
    color: '#06b6d4',
    skills: [
      { name: 'UI/UX', level: 'Advanced', value: 85 },
      { name: 'Figma', level: 'Advanced', value: 80 },
      { name: 'Responsive Design', level: 'Expert', value: 90 },
      { name: 'Animation', level: 'Intermediate', value: 75 },
    ],
  },
];

// Radar chart data
const radarCategories = skillCategories.map(category => {
  // Calculate average value for each category
  const avgValue = category.skills.reduce((sum, skill) => sum + skill.value, 0) / category.skills.length;
  
  return {
    name: category.name,
    value: avgValue,
    color: category.color,
  };
});

// Graph data
const createGraphData = () => {
  const nodes: Array<{
    id: string;
    label: string;
    category: string;
    value: number;
  }> = [];
  
  const links: Array<{
    source: string;
    target: string;
    strength: number;
  }> = [];
  
  // Add all skills as nodes
  skillCategories.forEach(category => {
    category.skills.forEach(skill => {
      const id = `${category.name}-${skill.name}`;
      nodes.push({
        id,
        label: skill.name,
        category: category.name,
        value: skill.value,
      });
    });
  });
  
  // Create links between related skills
  const relationshipMap: Record<string, string[]> = {
    'React': ['TypeScript', 'Next.js', 'CSS/SCSS', 'React Native'],
    'TypeScript': ['React', 'Node.js', 'Express', 'Next.js'],
    'Next.js': ['React', 'TypeScript', 'CSS/SCSS'],
    'CSS/SCSS': ['React', 'Next.js', 'UI/UX', 'Responsive Design'],
    'Node.js': ['Express', 'TypeScript', 'GraphQL', 'MongoDB'],
    'Express': ['Node.js', 'MongoDB', 'GraphQL'],
    'GraphQL': ['Node.js', 'Express', 'MongoDB', 'React'],
    'MongoDB': ['Node.js', 'Express'],
    'Docker': ['CI/CD', 'AWS', 'Kubernetes'],
    'CI/CD': ['Docker', 'AWS', 'Kubernetes'],
    'AWS': ['Docker', 'CI/CD', 'Kubernetes'],
    'Kubernetes': ['Docker', 'CI/CD', 'AWS'],
    'React Native': ['React', 'TypeScript', 'iOS', 'Android'],
    'Flutter': ['iOS', 'Android', 'UI/UX'],
    'iOS': ['React Native', 'Flutter', 'Android'],
    'Android': ['React Native', 'Flutter', 'iOS'],
    'SQL': ['MongoDB', 'Data Visualization', 'Python'],
    'Data Visualization': ['SQL', 'Python', 'UI/UX'],
    'Python': ['SQL', 'Data Visualization', 'Machine Learning'],
    'Machine Learning': ['Python', 'Data Visualization'],
    'UI/UX': ['Figma', 'Responsive Design', 'CSS/SCSS', 'Animation'],
    'Figma': ['UI/UX', 'Responsive Design', 'Animation'],
    'Responsive Design': ['UI/UX', 'CSS/SCSS', 'Figma'],
    'Animation': ['UI/UX', 'CSS/SCSS', 'Figma'],
  };
  
  // Generate links based on relationships
  nodes.forEach(source => {
    const relationships = relationshipMap[source.label] || [];
    
    relationships.forEach(targetLabel => {
      const targetNodes = nodes.filter(n => n.label === targetLabel);
      
      targetNodes.forEach(target => {
        // Skip self links and duplicates
        if (source.id === target.id) return;
        
        // Check if this link already exists in reverse
        const reverseExists = links.some(
          link => link.source === target.id && link.target === source.id
        );
        
        if (!reverseExists) {
          // Strength based on combined value
          const strength = Math.min(((source.value + target.value) / 200) * 0.8, 0.9);
          
          links.push({
            source: source.id,
            target: target.id,
            strength,
          });
        }
      });
    });
  });
  
  return { nodes, links };
};

const graphData = createGraphData();

const Skills: React.FC = () => {
  return (
    <SkillsContainer>
      <SectionTitle>Skills & Expertise</SectionTitle>
      <SectionDescription>
        With over 8 years of experience in web and mobile development, I&apos;ve built a diverse skill set
        across the full stack. Below you&apos;ll find my areas of expertise visualized in different ways to
        highlight both my technical proficiency and the interconnections between my skills.
      </SectionDescription>
      
      <VisualizationsContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SkillRadar categories={radarCategories} title="Skill Categories" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SkillsGraph nodes={graphData.nodes} links={graphData.links} title="Skills Network" />
        </motion.div>
      </VisualizationsContainer>
      
      <SectionTitle>Detailed Skills</SectionTitle>
      
      <SkillCategoriesContainer>
        {skillCategories.map((category, categoryIndex) => (
          <SkillCategory
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * categoryIndex }}
          >
            <CategoryTitle>
              <CategoryIcon color={category.color} />
              {category.name}
            </CategoryTitle>
            
            <SkillsList>
              {category.skills.map(skill => (
                <SkillItem key={skill.name}>
                  <SkillName>
                    {skill.name}
                    <SkillLevel>{skill.level}</SkillLevel>
                  </SkillName>
                  <SkillBar>
                    <SkillProgress width={skill.value} color={category.color} />
                  </SkillBar>
                </SkillItem>
              ))}
            </SkillsList>
          </SkillCategory>
        ))}
      </SkillCategoriesContainer>
    </SkillsContainer>
  );
};

export default Skills; 