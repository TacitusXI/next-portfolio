'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import GitHubGalaxyLite from './GitHubGalaxyLite';

// Dynamically import the 3D component to reduce initial bundle size
const GitHubGalaxy3D = dynamic(() => import('./GitHubGalaxy3D'), {
  ssr: false,
  loading: () => <LoadingContainer>Loading visualization...</LoadingContainer>
});

interface GitHubGalaxyProps {
  contributions: Array<{
    date: string;
    count: number;
    color: string;
  }>;
}

const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: rgba(0, 10, 30, 0.7);
  border-radius: 10px;
`;

const FallbackContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgba(0, 10, 30, 0.7);
  border-radius: 10px;
`;

const ContributionDot = styled.div<{ color: string }>`
  width: 10px;
  height: 10px;
  margin: 3px;
  border-radius: 50%;
  background-color: ${props => props.color};
  opacity: 0.8;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.5);
    opacity: 1;
  }
`;

// Main adaptive component that decides which version to render
const GitHubGalaxy: React.FC<GitHubGalaxyProps> = ({ contributions }) => {
  const [isWebGLAvailable, setIsWebGLAvailable] = useState<boolean | null>(null);
  const [hasPowerfulGPU, setHasPowerfulGPU] = useState<boolean | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Check for WebGL availability and GPU power on component mount
  useEffect(() => {
    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      setIsWebGLAvailable(false);
      return;
    }
    
    setIsWebGLAvailable(true);
    
    // Basic GPU capability check
    try {
      const webGLContext = gl as WebGLRenderingContext;
      const debugInfo = webGLContext.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = webGLContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        
        // Simple heuristic to detect lower-end GPUs
        const lowerEndGPUs = [
          'intel', 'hd graphics', 'uhd graphics', 'mesa', 'llvmpipe',
          'swiftshader', 'angle', 'apple gpu', 'apple base', 'webgl'
        ];
        
        const isLowerEnd = lowerEndGPUs.some(gpu => 
          renderer.toLowerCase().includes(gpu)
        );
        
        setHasPowerfulGPU(!isLowerEnd);
      } else {
        // If we can't detect, assume it's not powerful
        setHasPowerfulGPU(false);
      }
    } catch (error) {
      console.error('Error detecting GPU capabilities', error);
      setHasPowerfulGPU(false);
    }
  }, []);
  
  // Render appropriate visualization based on device capabilities
  if (isWebGLAvailable === null || hasPowerfulGPU === null) {
    return <LoadingContainer>Detecting device capabilities...</LoadingContainer>;
  }
  
  // If WebGL is not available, show a fallback visualization
  if (!isWebGLAvailable) {
    return (
      <FallbackContainer>
        {contributions.slice(0, 100).map((contribution, index) => (
          <ContributionDot 
            key={index} 
            color={contribution.color} 
            title={`${contribution.date}: ${contribution.count} contributions`}
          />
        ))}
      </FallbackContainer>
    );
  }
  
  // On mobile or lower-end devices, use the lite version
  if (isMobile || !hasPowerfulGPU) {
    return <GitHubGalaxyLite contributions={contributions} />;
  }
  
  // For desktop with good GPU, use the full 3D version
  return <GitHubGalaxy3D contributions={contributions} />;
};

export default GitHubGalaxy; 