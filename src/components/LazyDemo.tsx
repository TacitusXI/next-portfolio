'use client';

import React, { useState } from 'react';
import styled from 'styled-components';

const DemoContainer = styled.div`
  width: 100%;
  padding: 20px;
  background: rgba(10, 11, 14, 0.8);
  border-radius: 10px;
  margin-top: 40px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(0, 243, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(0, 243, 255, 0.5);
    box-shadow: 0 0 20px rgba(0, 243, 255, 0.2);
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--neon-blue);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
`;

const GridItem = styled.div<{ $isActive: boolean }>`
  aspect-ratio: 1;
  background: ${props => props.$isActive ? 'rgba(0, 243, 255, 0.2)' : 'rgba(0, 0, 0, 0.3)'};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: 1px solid ${props => props.$isActive ? 'rgba(0, 243, 255, 0.5)' : 'transparent'};
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(0, 243, 255, 0.15);
  }
`;

const LazyDemo = () => {
  const [activeItem, setActiveItem] = useState<number>(-1);
  
  const handleItemClick = (index: number) => {
    setActiveItem(index === activeItem ? -1 : index);
  };
  
  return (
    <DemoContainer>
      <Title>Lazy Loaded Component Demo</Title>
      <p className="mb-4">This component was loaded dynamically to improve initial load performance.</p>
      
      <Grid>
        {Array.from({ length: 8 }).map((_, index) => (
          <GridItem 
            key={index} 
            $isActive={index === activeItem}
            onClick={() => handleItemClick(index)}
          >
            {index + 1}
          </GridItem>
        ))}
      </Grid>
    </DemoContainer>
  );
};

export default LazyDemo; 