'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';

// Types
interface Recommendation {
  id: number;
  name: string;
  position: string;
  image: string;
  fallbackImage?: string;
  text: string;
  date: string;
  connection: string;
}

// Sample recommendation data
const recommendations: Recommendation[] = [
  {
    id: 1,
    name: "Reigner Ouano",
    position: "Acumatica ERP Specialist | Expertise in C#, Blazor, and Blockchain",
    image: "/images/recommendations/reigner.jpeg",
    fallbackImage: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "I had the privilege of working with Ivan Leskov at BlockTrust, where he demonstrated exceptional skills as a blockchain developer. Ivan's proficiency in blockchain technology, including his work with Solidity, is truly impressive. He has a deep understanding of both front-end and back-end development, which he combines with a genuine enthusiasm for learning and growing in the field.\n\nIvan's technical expertise is complemented by his eagerness to tackle new challenges. Whether developing complex blockchain solutions or collaborating on diverse projects, his ability to adapt and contribute effectively was evident. His commitment to continuous learning and improvement makes him a valuable asset to any team.\n\nIvan's contributions to our projects were invaluable, and his positive attitude and collaborative spirit made working with him a pleasure. I have no doubt that he will continue to excel and bring significant value to future endeavors. I highly recommend Ivan for any role that demands expertise in blockchain development and a passion for innovation.",
    date: "September 15, 2024",
    connection: "Reigner worked with Ivan on the same team"
  },
  {
    id: 2,
    name: "Stefano Tempesta",
    position: "Web3 Architect | AI & Blockchain for Good Ambassador | Scout Leader",
    image: "/images/recommendations/stefano.jpeg",
    fallbackImage: "https://randomuser.me/api/portraits/men/67.jpg",
    text: "Had the pleasure of working with Ivan at BlockTrust. We built web3 technology that lasts, running 24/7 without interruption of service. Diligent, precise, reliable, and extremely experienced on all smart contract matters, Ivan is a highly skilled software engineer, versatile across multiple technologies. Pointless to say, I'd hire him over again, no questions asked!",
    date: "September 14, 2024",
    connection: "Stefano managed Ivan directly"
  }
];

// Styled components with classic theme matching other sections
const RecommendationsContainer = styled.section`
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

const SliderContainer = styled.div`
  position: relative;
  max-width: 900px;
  margin: 0 auto;
`;

const RecommendationCard = styled(motion.div)`
  background: rgba(25, 25, 25, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const QuoteIcon = styled.div`
  position: absolute;
  top: 30px;
  left: 30px;
  font-size: 4rem;
  opacity: 0.1;
  color: rgb(115, 74, 253);
`;

const RecommendationText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 30px;
  font-style: italic;
  position: relative;
  z-index: 1;
  text-align: left;
  
  /* Handle line breaks in the text */
  white-space: pre-line;
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    flex-wrap: nowrap; /* Prevent wrapping on small screens */
    gap: 12px;
  }
`;

const ProfileImageContainer = styled.div`
  position: relative;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgb(115, 74, 253);
  box-shadow: 0 0 15px rgba(115, 74, 253, 0.5);
  flex-shrink: 0; /* Prevent image from shrinking */
  
  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    min-width: 60px; /* Ensure fixed width on mobile */
    min-height: 60px; /* Ensure fixed height on mobile */
  }
`;

const ProfileDetails = styled.div`
  text-align: left;
  margin-left: 15px;
`;

const Name = styled.h4`
  margin: 0;
  font-size: 1.2rem;
  color: white;
`;

const Position = styled.p`
  margin: 5px 0 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
`;

const Connection = styled.p`
  margin: 5px 0 0;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
`;

const LinkedInBadge = styled.div`
  display: flex;
  align-items: center;
  margin-top: 25px;
  
  svg {
    color: #0077b5;
    font-size: 1.5rem;
    margin-right: 10px;
  }
  
  span {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
  }
`;

const NavigationButton = styled.button<{ direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${props => props.direction === 'left' ? 'left: -60px;' : 'right: -60px;'}
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 5;
  
  &:hover {
    background: rgba(115, 74, 253, 0.1);
    color: rgb(115, 74, 253);
    border-color: rgba(115, 74, 253, 0.3);
  }
  
  &:focus {
    outline: none;
  }
  
  @media (max-width: 992px) {
    display: none; /* Hide arrows on mobile */
  }
`;

const ProgressDots = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  
  @media (max-width: 992px) {
    margin-top: 20px;
  }
`;

const Dot = styled.div<{ $active: boolean }>`
  width: ${props => props.$active ? '14px' : '10px'};
  height: ${props => props.$active ? '14px' : '10px'};
  border-radius: 50%;
  background: ${props => props.$active ? 'rgb(115, 74, 253)' : 'rgba(255, 255, 255, 0.1)'};
  margin: 0 6px;
  transition: all 0.3s ease;
  cursor: pointer;
  
  @media (max-width: 992px) {
    width: ${props => props.$active ? '18px' : '14px'};
    height: ${props => props.$active ? '18px' : '14px'};
    margin: 0 10px;
  }
  
  &:hover {
    background: ${props => props.$active ? 'rgb(115, 74, 253)' : 'rgba(115, 74, 253, 0.3)'};
  }
`;

export default function RecommendationsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? recommendations.length - 1 : prevIndex - 1
    );
  };
  
  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === recommendations.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };
  
  // Update the image error handler
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    const fallbackImage = recommendations[currentIndex].fallbackImage;
    
    if (fallbackImage) {
      target.src = fallbackImage;
    } else {
      // Use a random placeholder as last resort
      target.src = `https://randomuser.me/api/portraits/men/${(currentIndex + 30)}.jpg`;
    }
  };
  
  return (
    <RecommendationsContainer id="recommendations" ref={ref}>
      <ContentWrapper>
        <SectionTitle
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="cyberpunk-section-title cyberpunk-title-md"
          data-text="Validate.Professional_Endorsements"
          data-mobile-text="Endorsements"
        >
          Validate.Professional_Endorsements
        </SectionTitle>
        
        <SectionDescription
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          What colleagues and clients say about my work and collaboration
        </SectionDescription>
        
        <SliderContainer>
          <NavigationButton 
            direction="left" 
            onClick={handlePrev}
            aria-label="Previous recommendation"
          >
            <FaQuoteLeft />
          </NavigationButton>
          
          <AnimatePresence mode="wait">
            <RecommendationCard
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <QuoteIcon>
                <FaQuoteLeft />
              </QuoteIcon>
              
              <RecommendationText>
                {recommendations[currentIndex].text}
              </RecommendationText>
              
              <ProfileInfo>
                <ProfileImageContainer>
                  <Image
                    src={recommendations[currentIndex].image}
                    alt={recommendations[currentIndex].name}
                    fill
                    sizes="(max-width: 768px) 60px, 70px"
                    style={{ 
                      objectFit: 'cover',
                      borderRadius: '50%' /* Ensure the image itself is also circular */
                    }}
                    onError={handleImageError}
                  />
                </ProfileImageContainer>
                <ProfileDetails>
                  <Name>{recommendations[currentIndex].name}</Name>
                  <Position>{recommendations[currentIndex].position}</Position>
                  <Connection>{recommendations[currentIndex].connection}</Connection>
                </ProfileDetails>
              </ProfileInfo>
              
              <LinkedInBadge>
                <FaQuoteRight />
                <span>LinkedIn Recommendation · {recommendations[currentIndex].date}</span>
              </LinkedInBadge>
            </RecommendationCard>
          </AnimatePresence>
          
          <NavigationButton 
            direction="right" 
            onClick={handleNext}
            aria-label="Next recommendation"
          >
            <FaQuoteRight />
          </NavigationButton>
          
          <ProgressDots>
            {recommendations.map((_, index) => (
              <Dot 
                key={index} 
                $active={index === currentIndex} 
                onClick={() => handleDotClick(index)}
              />
            ))}
          </ProgressDots>
        </SliderContainer>
      </ContentWrapper>
    </RecommendationsContainer>
  );
} 