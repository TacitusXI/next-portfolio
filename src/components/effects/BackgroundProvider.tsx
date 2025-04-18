'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';

// Lazy load only the CryptoRain effect since we're not using DigitalRain anymore
const CryptoRain = dynamic(() => import('./CryptoRain'), {
  ssr: false,
  loading: () => <div style={{ display: 'none' }} />
});

// Background effect types
export type BackgroundType = 'digital' | 'crypto' | 'none';
export type IntensityLevel = 'light' | 'medium' | 'heavy';
export type ColorScheme = 'green' | 'blue' | 'purple' | 'cyber';

// Props for the background context
interface BackgroundContextProps {
  backgroundType: BackgroundType;
  setBackgroundType: (type: BackgroundType) => void;
  intensity: number;
  setIntensity: (level: number) => void;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
}

// Create the context with default values
const BackgroundContext = createContext<BackgroundContextProps>({
  backgroundType: 'crypto',
  setBackgroundType: () => {},
  intensity: 75,
  setIntensity: () => {},
  colorScheme: 'blue',
  setColorScheme: () => {}
});

// Hook to use the background context
export const useBackground = () => useContext(BackgroundContext);

// Styled components for the background container and readability overlay
const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -10;
  overflow: hidden;
`;

// ReadabilityOverlay with adjusted opacity and gradient
const ReadabilityOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -5;
  background: linear-gradient(
    to bottom,
    rgba(0, 5, 20, 0.5) 0%,
    rgba(0, 5, 20, 0.6) 50%,
    rgba(0, 5, 20, 0.7) 100%
  );
  pointer-events: none;
`;

// Provider props
interface BackgroundProviderProps {
  children: ReactNode;
}

export const BackgroundProvider: React.FC<BackgroundProviderProps> = ({ children }) => {
  // Fixed background settings - always crypto rain with 75% intensity and blue color scheme
  const [backgroundType] = useState<BackgroundType>('crypto');
  const [intensity] = useState<number>(75);
  const [colorScheme] = useState<ColorScheme>('blue');

  // These setter functions are now no-ops to prevent other components from changing the background
  const setBackgroundType = () => {};
  const setIntensity = () => {};
  const setColorScheme = () => {};

  // Render the background - always crypto rain
  const renderBackground = () => {
    return (
      <>
        <BackgroundContainer>
          <CryptoRain intensity={intensity} colorScheme={colorScheme} />
        </BackgroundContainer>
        <ReadabilityOverlay />
      </>
    );
  };

  return (
    <BackgroundContext.Provider
      value={{
        backgroundType,
        setBackgroundType,
        intensity,
        setIntensity,
        colorScheme,
        setColorScheme,
      }}
    >
      {renderBackground()}
      {children}
    </BackgroundContext.Provider>
  );
};

export default BackgroundProvider; 