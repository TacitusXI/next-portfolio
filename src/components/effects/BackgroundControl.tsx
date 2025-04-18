'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { useBackground, ColorScheme } from './BackgroundProvider';
import { motion } from 'framer-motion';

const ControlContainer = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 100;
  
  @media (max-width: 768px) {
    bottom: 10px;
    right: 10px;
  }
`;

const ControlButton = styled.button<{ $isActive?: boolean }>`
  padding: 0.5rem 1rem;
  background: ${props => props.$isActive ? 'rgba(58, 134, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.$isActive ? '#3a86ff' : 'rgba(255, 255, 255, 0.7)'};
  border: 1px solid ${props => props.$isActive ? '#3a86ff' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(58, 134, 255, 0.1);
    color: ${props => props.$isActive ? '#3a86ff' : 'rgba(255, 255, 255, 0.9)'};
  }
`;

const ControlPanel = styled(motion.div)`
  background: rgba(15, 15, 15, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SliderLabel = styled.label`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
`;

const ColorSchemeButton = styled.button<{ isSelected: boolean; color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid ${props => props.isSelected ? '#fff' : 'transparent'};
  background: ${props => props.color};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;

const ToggleButton = styled.button`
  background: rgba(10, 10, 10, 0.7);
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(5px);
  
  &:hover {
    background: rgba(40, 40, 40, 0.9);
    color: white;
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

export default function BackgroundControl() {
  const [showPanel, setShowPanel] = useState(false);
  const { 
    backgroundType, 
    setBackgroundType, 
    intensity, 
    setIntensity,
    colorScheme,
    setColorScheme
  } = useBackground();
  
  const colorSchemes = {
    green: 'linear-gradient(135deg, #00ff00, #003300)',
    blue: 'linear-gradient(135deg, #00aaff, #000066)',
    purple: 'linear-gradient(135deg, #aa00ff, #330033)',
    cyber: 'linear-gradient(135deg, #ff00ff, #00ffff)',
  };
  
  return (
    <ControlContainer>
      {showPanel && (
        <ControlPanel
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
        >
          <ButtonRow>
            <ControlButton 
              $isActive={backgroundType === 'digital'} 
              onClick={() => setBackgroundType('digital')}
            >
              Digital Rain
            </ControlButton>
            <ControlButton 
              $isActive={backgroundType === 'crypto'} 
              onClick={() => setBackgroundType('crypto')}
            >
              Crypto Rain
            </ControlButton>
            <ControlButton 
              $isActive={backgroundType === 'none'} 
              onClick={() => setBackgroundType('none')}
            >
              None
            </ControlButton>
          </ButtonRow>
          
          <SliderContainer>
            <SliderLabel>Intensity: {intensity}%</SliderLabel>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={intensity} 
              onChange={(e) => setIntensity(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </SliderContainer>
          
          <SliderContainer>
            <SliderLabel>Color Scheme</SliderLabel>
            <ButtonRow>
              {(Object.keys(colorSchemes) as ColorScheme[]).map((scheme) => (
                <ColorSchemeButton
                  key={scheme}
                  color={colorSchemes[scheme]}
                  isSelected={colorScheme === scheme}
                  onClick={() => setColorScheme(scheme)}
                  aria-label={`Set ${scheme} color scheme`}
                />
              ))}
            </ButtonRow>
          </SliderContainer>
        </ControlPanel>
      )}
      
      <ToggleButton
        onClick={() => setShowPanel(!showPanel)}
      >
        {showPanel ? 'Hide Effects' : 'Background Effects'}
      </ToggleButton>
    </ControlContainer>
  );
} 