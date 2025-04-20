'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
// Import the Chess component
import Chess from '@/components/hobbies/Chess';
import { reading } from '@/data/content';
import Image from 'next/image';

// Types
type HobbyTab = 'chess' | 'reading' | 'gym';

// Styled components with classic theme
const HobbiesContainer = styled.section`
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
`;

const SectionDescription = styled(motion.p)`
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 700px;
  margin: 0 auto 3rem;
`;

const TabsContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const Tab = styled.button<{ $isActive: boolean }>`
  padding: 0.75rem 1.5rem;
  background: ${props => props.$isActive ? 'rgba(153, 69, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.$isActive ? '#9945ff' : 'rgba(255, 255, 255, 0.7)'};
  border: 1px solid ${props => props.$isActive ? '#9945ff' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: rgba(153, 69, 255, 0.1);
    color: ${props => props.$isActive ? '#9945ff' : 'rgba(255, 255, 255, 0.9)'};
  }
  
  img {
    width: 16px;
    height: 16px;
    filter: ${props => props.$isActive ? 'brightness(0) saturate(100%) invert(37%) sepia(74%) saturate(7352%) hue-rotate(255deg) brightness(99%) contrast(108%)' : 'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(103%) contrast(103%)'};
    opacity: ${props => props.$isActive ? 1 : 0.7};
  }
`;

const HobbyContent = styled(motion.div)`
  background: rgba(25, 25, 25, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  min-height: 300px;
  overflow: hidden;
  
  /* Chess content specific styling */
  &[key="chess"] {
    padding: 1.5rem;
    
    @media (min-width: 768px) {
      padding: 2rem;
    }
    
    @media (min-width: 1200px) {
      padding: 2.5rem 3rem;
    }
  }
`;

const ReadingList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const Book = styled.div`
  background: rgba(15, 15, 35, 0.4);
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(115, 74, 253, 0.2);
  }
`;

const BookCover = styled.div`
  height: 200px;
  background-size: cover;
  background-position: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const BookInfo = styled.div`
  padding: 15px;
  
  h4 {
    margin: 0 0 5px;
    color: rgb(115, 74, 253);
    font-size: 1.1rem;
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
    opacity: 0.8;
  }
  
  .author {
    margin-bottom: 10px;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const Tag = styled.span`
  background: rgba(115, 74, 253, 0.1);
  color: rgb(115, 74, 253);
  padding: 4px 8px;
  font-size: 0.8rem;
  border-radius: 5px;
  margin-right: 5px;
  margin-bottom: 5px;
`;

const PlaceholderMessage = styled.div`
  text-align: center;
  padding: 4rem 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  
  p {
    margin-bottom: 1rem;
  }
`;

export default function HobbiesSection() {
  const [activeTab, setActiveTab] = useState<HobbyTab>('chess');
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  
  return (
    <HobbiesContainer id="hobbies" ref={ref}>
      <ContentWrapper>
        <SectionTitle
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="cyberpunk-section-title cyberpunk-title-md"
          data-text="Explore.Personal_Interests"
          data-mobile-text="Interests"
        >
          Explore.Personal_Interests
        </SectionTitle>
        
        <SectionDescription
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          When I&apos;m not coding, you&apos;ll find me enjoying these activities that help me recharge and grow
        </SectionDescription>
        
        <TabsContainer
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Tab
            $isActive={activeTab === 'chess'}
            onClick={() => setActiveTab('chess')}
          >
            <Image src="/images/hobby_icons/chess.png" alt="Chess" width={16} height={16} /> Chess
          </Tab>
          <Tab
            $isActive={activeTab === 'reading'}
            onClick={() => setActiveTab('reading')}
          >
            <Image src="/images/hobby_icons/books.png" alt="Reading" width={16} height={16} /> Reading
          </Tab>
          <Tab
            $isActive={activeTab === 'gym'}
            onClick={() => setActiveTab('gym')}
          >
            <Image src="/images/hobby_icons/weight.png" alt="Gym" width={16} height={16} /> Gym
          </Tab>
        </TabsContainer>
        
        <HobbyContent
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <AnimatePresence mode="wait">
            {activeTab === 'chess' && (
              <Chess />
            )}
            {activeTab === 'reading' && (
              <ReadingList>
                {reading.map((book, index) => (
                  <Book key={index}>
                    <BookCover style={{ 
                      backgroundImage: `url(./images/books/${book.title === 'The Dao of Capital' ? 'DAO_of_Capital.png' : 
                        book.title === 'Python for Finance' ? 'Python_in_Finance.png' :
                        book.title === 'High Performance Trading' ? 'High_Performance_trading.png' :
                        book.title === 'The 10X Rule' ? 'The_10x_rule.png' : ''}`
                    }} />
                    <BookInfo>
                      <h4>{book.title}</h4>
                      <p className="author">by {book.author}</p>
                      <p>{book.description}</p>
                      <TagsContainer>
                        <Tag>{book.category}</Tag>
                      </TagsContainer>
                    </BookInfo>
                  </Book>
                ))}
              </ReadingList>
            )}
            {activeTab === 'gym' && (
              <PlaceholderMessage>
                <p>Every day I make time for physical activity to feel good, stay active, and function at my best.</p>
                <p>Regular exercise helps me maintain focus, energy, and overall well-being.</p>
              </PlaceholderMessage>
            )}
          </AnimatePresence>
        </HobbyContent>
      </ContentWrapper>
    </HobbiesContainer>
  );
} 