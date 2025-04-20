import React from 'react';
import styled from 'styled-components';

interface ChessEngineInfoProps {
  engineName: string;
  engineRating: number;
  isThinking: boolean;
}

const EngineInfoContainer = styled.div`
  padding: 0.75rem;
  margin-top: 1rem;
  background-color: rgba(30, 30, 40, 0.6);
  border-radius: 8px;
  border: 1px solid rgba(153, 69, 255, 0.2);
`;

const EngineTitle = styled.div`
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: rgba(153, 69, 255, 0.9);
`;

const EngineStatus = styled.div`
  font-size: 0.85rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ThinkingIndicator = styled.div<{ $isThinking: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.$isThinking ? '#00e676' : 'transparent'};
  box-shadow: ${props => props.$isThinking ? '0 0 8px #00e676' : 'none'};
  margin-left: 8px;
  opacity: ${props => props.$isThinking ? 1 : 0};
  transition: opacity 0.3s ease-in-out;
`;

const ChessEngineInfo: React.FC<ChessEngineInfoProps> = ({ 
  engineName, 
  engineRating, 
  isThinking 
}) => {
  return (
    <EngineInfoContainer>
      <EngineTitle>Chess Engine</EngineTitle>
      <EngineStatus>
        <span>{engineName} (Elo {engineRating})</span>
        <ThinkingIndicator $isThinking={isThinking} />
      </EngineStatus>
    </EngineInfoContainer>
  );
};

export default ChessEngineInfo; 