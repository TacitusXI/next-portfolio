'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';
import { ColorScheme } from './BackgroundProvider';

const RainCanvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
  opacity: 0.7;
`;

interface DigitalRainProps {
  intensity: number; // 10-100
  colorScheme: ColorScheme;
}

interface RainDrop {
  x: number;
  y: number;
  length: number;
  speed: number;
  characters: string[];
  currentChar: number;
  updateInterval: number;
  lastUpdate: number;
}

export default function DigitalRain({ intensity = 50, colorScheme = 'green' }: DigitalRainProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { ref: inViewRef, inView } = useInView({
    threshold: 0,
    initialInView: true,
  });
  const animationRef = useRef<number | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const raindrops = useRef<RainDrop[]>([]);
  const lastFrameTime = useRef<number>(0);
  
  // Create a ref callback to handle both our local ref and the inView ref
  const setRefs = useCallback(
    (node: HTMLCanvasElement | null) => {
      // Save a reference to the node
      canvasRef.current = node;
      // Call the inViewRef function
      inViewRef(node);
    },
    [inViewRef]
  );
  
  // Performance settings based on intensity
  const getSettings = useCallback(() => {
    const baseDropCount = Math.floor(intensity / 10); // 1-10 base drops per column
    const dropDensity = Math.max(0.2, intensity / 100); // 0.2-1.0 density
    
    return {
      dropCount: baseDropCount,
      density: dropDensity,
      speed: 1 + (intensity / 100), // 1.1-2.0 speed multiplier
      opacity: 0.5 + (intensity / 200), // 0.55-1.0 opacity
    };
  }, [intensity]);
  
  // Get color based on scheme
  const getColors = useCallback(() => {
    switch (colorScheme) {
      case 'green':
        return {
          primary: '#00ff00',
          secondary: '#008800',
          background: 'rgba(0, 15, 2, 0.1)'
        };
      case 'blue':
        return {
          primary: '#00aaff',
          secondary: '#0044aa',
          background: 'rgba(0, 5, 15, 0.1)'
        };
      case 'purple':
        return {
          primary: '#aa00ff',
          secondary: '#440088',
          background: 'rgba(10, 0, 15, 0.1)'
        };
      case 'cyber':
        return {
          primary: '#ff00ff',
          secondary: '#00ffff',
          background: 'rgba(5, 0, 15, 0.1)'
        };
      default:
        return {
          primary: '#00ff00',
          secondary: '#008800',
          background: 'rgba(0, 15, 2, 0.1)'
        };
    }
  }, [colorScheme]);
  
  // Create raindrops
  const initRaindrops = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const settings = getSettings();
    const columnWidth = 20 * window.devicePixelRatio; // Width of each column
    const columns = Math.ceil(canvas.width / columnWidth);
    const drops: RainDrop[] = [];
    
    // Japanese-like characters and symbols
    const charSet = [
      '0', '1', 'ｱ', 'ｲ', 'ｳ', 'ｴ', 'ｵ', 'ｶ', 'ｷ', 'ｸ', 'ｹ', 'ｺ', 'ｻ', 'ｼ', 'ｽ', 'ｾ', 'ｿ',
      'ﾀ', 'ﾁ', 'ﾂ', 'ﾃ', 'ﾄ', 'ﾅ', 'ﾆ', 'ﾇ', 'ﾈ', 'ﾉ', 'ﾊ', 'ﾋ', 'ﾌ', 'ﾍ', 'ﾎ', 'ﾏ', 'ﾐ',
      'ﾑ', 'ﾒ', 'ﾓ', 'ﾔ', 'ﾕ', 'ﾖ', 'ﾗ', 'ﾘ', 'ﾙ', 'ﾚ', 'ﾛ', 'ﾜ', 'ﾝ', '2', '3', '4', '5',
      '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', '+', '-', '*', '/', '=', '$', '%'
    ];
    
    // Create a drop for each column, with random properties
    for (let i = 0; i < columns; i++) {
      // Only create drops based on density
      if (Math.random() > settings.density) continue;
      
      for (let j = 0; j < settings.dropCount; j++) {
        const length = Math.floor(Math.random() * 15) + 5; // 5-20 characters
        const characters = Array.from({ length }, () => 
          charSet[Math.floor(Math.random() * charSet.length)]
        );
        
        drops.push({
          x: i * columnWidth,
          y: Math.random() * canvas.height * 2 - canvas.height, // Start some above viewport
          length,
          speed: (Math.random() * 2 + 1) * settings.speed,
          characters,
          currentChar: 0,
          updateInterval: Math.floor(Math.random() * 15) + 5, // 5-20 frames per character update
          lastUpdate: 0
        });
      }
    }
    
    raindrops.current = drops;
  }, [intensity, getSettings]);
  
  // Initialize canvas and raindrops
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const { width, height } = canvas.getBoundingClientRect();
        
        // Set canvas dimensions to match display size
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        
        setDimensions({ width: canvas.width, height: canvas.height });
        
        // Reset raindrops when resizing
        initRaindrops();
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [initRaindrops]);
  
  // Animation loop
  useEffect(() => {
    if (!inView) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }
    
    const animate = (timestamp: number) => {
      if (!canvasRef.current) return;
      
      // Limit frame rate for better performance
      const elapsed = timestamp - lastFrameTime.current;
      if (elapsed < 1000 / 30) { // 30 FPS max
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      lastFrameTime.current = timestamp;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const colors = getColors();
      const settings = getSettings();
      
      // Apply background with fade effect
      ctx.fillStyle = colors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw each raindrop
      ctx.font = `${14 * window.devicePixelRatio}px monospace`;
      
      raindrops.current.forEach((drop, index) => {
        // Update character occasionally
        if (timestamp - drop.lastUpdate > drop.updateInterval * 16) {
          drop.currentChar = (drop.currentChar + 1) % drop.characters.length;
          drop.lastUpdate = timestamp;
        }
        
        // Draw the trail of characters
        for (let i = 0; i < drop.length; i++) {
          const charIndex = (drop.currentChar + i) % drop.characters.length;
          const y = drop.y - i * 20 * window.devicePixelRatio;
          
          // Skip if out of view
          if (y < -30 || y > canvas.height + 30) continue;
          
          // Set color based on position in drop
          const alpha = i === 0 ? 1 : 1 - (i / drop.length);
          
          if (i === 0) {
            // Head of the drop is brightest
            ctx.fillStyle = colors.primary;
          } else if (i < 3) {
            // First few characters are brighter
            ctx.fillStyle = colors.secondary;
            ctx.globalAlpha = alpha * settings.opacity;
          } else {
            // Tail fades out
            ctx.fillStyle = colors.secondary;
            ctx.globalAlpha = alpha * 0.8 * settings.opacity;
          }
          
          ctx.fillText(drop.characters[charIndex], drop.x, y);
        }
        
        // Reset globalAlpha
        ctx.globalAlpha = 1;
        
        // Move drop down
        drop.y += drop.speed;
        
        // Reset if bottom of screen is reached
        if (drop.y - drop.length * 20 * window.devicePixelRatio > canvas.height) {
          raindrops.current[index] = {
            ...drop,
            y: -drop.length * 20 * window.devicePixelRatio, // Start above screen
            speed: (Math.random() * 2 + 1) * settings.speed
          };
        }
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    if (dimensions.width > 0 && dimensions.height > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, inView, intensity, colorScheme, getColors, getSettings]);
  
  return (
    <RainCanvas ref={setRefs} />
  );
} 