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
  pointer-events: auto;
  opacity: 1;
  cursor: default;
`;

interface CryptoRainProps {
  intensity: number; // 10-100
  colorScheme: ColorScheme;
}

// Performance classification
enum DevicePerformance {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

// Modify the CRYPTO_SYMBOLS array to use hex symbols and make 0x a special symbol
const HEX_SYMBOLS = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'A', 'B', 'C', 'D', 'E', 'F', 
  '0x' // 0x as a special symbol
];

// Special symbols that will get special treatment
const SPECIAL_SYMBOLS = [
  '0xBTC',
  'ETH',
  'WEB3',
  'NFT',
  'DEFI',
  'CHAIN'
];

// Hex address fragments
const HEX_FRAGMENTS = [
  '0xA34D',
  '0xFE21',
  '0x7C9B',
  '0x0DA3',
  '0xB6F2',
  '0x8E51',
  '0x3C9F',
  '0xD740',
  '0x15E8',
  '0x2BBA',
  '0x9A1C'
];

// Block effect - crypto-styled click effect
class BlockEffect {
  x: number;
  y: number;
  size: number;
  maxSize: number;
  color: string;
  alpha: number;
  speed: number;
  hash: string;
  
  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.size = 120; // Start with visible size
    this.maxSize = 220;
    this.color = color;
    this.alpha = 1;
    this.speed = 3;
    // Generate random block hash
    this.hash = this.generateBlockHash();
  }
  
  // Generate a random block hash (64 characters hex without 0x prefix)
  generateBlockHash(): string {
    const hexChars = '0123456789abcdef';
    let hash = '';
    
    // Generate 64 random hex characters (typical block hash length)
    for (let i = 0; i < 64; i++) {
      hash += hexChars[Math.floor(Math.random() * hexChars.length)];
    }
    
    return hash;
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Save the context state
    ctx.save();
    
    // Draw block
    ctx.globalAlpha = this.alpha;
    ctx.strokeStyle = this.color;
    ctx.fillStyle = `${this.color}22`; // Very transparent fill
    ctx.lineWidth = 2;
    
    ctx.strokeRect(
      this.x - this.size / 2, 
      this.y - this.size / 2, 
      this.size, 
      this.size
    );
    
    ctx.fillRect(
      this.x - this.size / 2, 
      this.y - this.size / 2, 
      this.size, 
      this.size
    );
    
    // Draw hash in the block
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Split hash into multiple parts for better display
    const charsPerLine = 16;
    const lines = 4; // 64 characters / 16 chars per line = 4 lines
    
    for (let i = 0; i < lines; i++) {
      const start = i * charsPerLine;
      const end = start + charsPerLine;
      const line = this.hash.substring(start, end);
      const yPos = this.y - 15 + (i * 10); // Space lines 10px apart
      
      ctx.fillText(line, this.x, yPos);
    }
    
    // Restore the context state
    ctx.restore();
  }

  update() {
    // Expand block
    this.size += this.speed;
    this.alpha = Math.max(0, 1 - (this.size / this.maxSize));
    
    return this.size <= this.maxSize;
  }
}

// Matrix scan line effect - optimized
class ScanLine {
  x: number;
  width: number;
  speed: number;
  color: string;
  alpha: number;
  direction: 'horizontal' | 'vertical';

  constructor(width: number, height: number, color: string) {
    this.direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
    
    if (this.direction === 'horizontal') {
      this.x = 0;
      this.width = width;
    } else {
      this.x = 0;
      this.width = height;
    }
    
    this.speed = 10 + Math.random() * 20;
    this.color = color;
    this.alpha = 0.3 + Math.random() * 0.3;
  }

  draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    
    if (this.direction === 'horizontal') {
      // Horizontal scan line
      ctx.fillRect(0, this.x, width, 2);
    } else {
      // Vertical scan line
      ctx.fillRect(this.x, 0, 2, height);
    }
    
    ctx.globalAlpha = 1;
  }

  update(width: number, height: number) {
    this.x += this.speed;
    
    if (this.direction === 'horizontal') {
      return this.x < height;
    } else {
      return this.x < width;
    }
  }
}

// Enhanced RainDrop with optimized visual effects
class RainDrop {
  x: number;
  y: number;
  z: number; // 3D depth simulation (0-1)
  speed: number;
  originalSpeed: number;
  length: number;
  symbols: string[];
  spacing: number;
  color: string;
  originalColor: string;
  alpha: number;
  fadeStep: number;
  glowing: boolean = false;
  special: boolean = false; // Is this a special highlighted drop
  pulse: number = 0; // Pulse animation counter
  pulseSpeed: number = Math.random() * 0.1 + 0.05; // How fast the drop pulses
  size: number = 1; // Size multiplier
  inViewport: boolean = true; // Is this drop in the viewport area

  constructor(x: number, y: number, speed: number, length: number, color: string, specialChance = 0.1) {
    this.x = x;
    this.y = y;
    this.z = Math.random(); // Random depth
    this.speed = speed * (1 + this.z * 0.5); // Faster drops appear closer (reduced multiplier for better performance)
    this.originalSpeed = this.speed;
    this.length = length;
    
    // Adjust spacing based on device pixel ratio to prevent overlapping on high-DPR screens
    const dpr = window.devicePixelRatio || 1;
    // Use a base spacing value scaled inversely to DPR to prevent excessive spacing
    this.spacing = 20 * (1 / Math.max(1, Math.min(dpr, 1.5)));
    
    this.color = color;
    this.originalColor = color;
    this.alpha = 1.0;
    this.fadeStep = 0.05 / length;
    
    // Special drops (reduced chance based on performance mode)
    this.special = Math.random() < specialChance;
    
    // Size based on z position (depth) - reduce the sizing variation further
    this.size = 0.85 + (this.z * 0.3); // 0.85 to 1.15 size (reduced range)
    
    this.symbols = this.generateSymbols(length);
  }

  // Generate an array of hex symbols, with a chance for 0x or full fragments
  generateSymbols(length: number): string[] {
    const symbols: string[] = [];
    
    // If this is a special drop, add a special symbol at the top
    if (this.special && Math.random() > 0.5) {
      symbols.push(SPECIAL_SYMBOLS[Math.floor(Math.random() * SPECIAL_SYMBOLS.length)]);
      length -= 1; // Reduce regular symbols by 1
    }
    
    for (let i = 0; i < length; i++) {
      const random = Math.random();
      
      if (random > 0.85) {
        // Use a complete hex fragment (like 0xA34D)
        symbols.push(HEX_FRAGMENTS[Math.floor(Math.random() * HEX_FRAGMENTS.length)]);
      } else if (random > 0.65) {
        // Use 0x as a special symbol
        symbols.push('0x');
      } else {
        // Use single hex digit
        symbols.push(HEX_SYMBOLS[Math.floor(Math.random() * (HEX_SYMBOLS.length - 1))]);
      }
    }
    
    return symbols;
  }

  draw(ctx: CanvasRenderingContext2D, performanceMode: DevicePerformance) {
    // Skip rendering if not in viewport (performance optimization)
    if (!this.inViewport) return;
    
    // Update pulse animation (only for special drops to save CPU)
    if (this.special) {
      this.pulse += this.pulseSpeed;
      if (this.pulse > Math.PI * 2) this.pulse = 0;
    }
    
    // Pulse effect - simplified for better performance
    let pulseEffect = 1;
    let glowSize = 0;
    
    // Apply different effects based on performance mode
    switch (performanceMode) {
      case DevicePerformance.HIGH:
        // Full effects but reduced magnitude
        pulseEffect = this.special ? Math.sin(this.pulse) * 0.2 + 1 : 1; // Reduced from 0.3 to 0.2
        glowSize = this.special ? 4 : (this.glowing ? 8 : 2); // Reduced from 6/15/3 to 4/8/2
        break;
        
      case DevicePerformance.MEDIUM:
        // Reduced effects
        pulseEffect = this.special ? Math.sin(this.pulse) * 0.1 + 1 : 1; // Reduced from 0.2 to 0.1
        glowSize = this.special ? 3 : (this.glowing ? 5 : 0); // Reduced from 4/8/0 to 3/5/0
        break;
        
      case DevicePerformance.LOW:
        // Minimal effects - no glow, simple pulse
        pulseEffect = this.special ? Math.sin(this.pulse) * 0.05 + 1 : 1; // Reduced from 0.1 to 0.05
        glowSize = 0; // No glow on low performance
        break;
    }
    
    // Get current font size and limit it to prevent excessive sizing
    const fontSize = parseInt(ctx.font.split('px')[0], 10);
    const maxFontSize = 22; // Cap the maximum font size
    const limitedFontSize = Math.min(fontSize, maxFontSize);
    
    // Set font with limited size
    const fontFamily = ctx.font.split('px')[1] || 'monospace';
    ctx.font = `${limitedFontSize}px ${fontFamily}`;
    
    for (let i = 0; i < this.symbols.length; i++) {
      const alpha = this.alpha - (i * this.fadeStep);
      if (alpha <= 0) continue;
      
      ctx.globalAlpha = alpha;
      ctx.fillStyle = this.color;
      
      // Enhanced glow effect with pulses for special drops, but only on higher performance modes
      if (glowSize > 0) {
        ctx.shadowColor = this.color;
        ctx.shadowBlur = glowSize * pulseEffect;
      } else {
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
      }
      
      // Apply size scaling - only on medium/high performance
      if (performanceMode !== DevicePerformance.LOW) {
        // Use the limited font size for calculation
        const scaledSize = Math.round(limitedFontSize * this.size * pulseEffect);
        const cappedSize = Math.min(scaledSize, maxFontSize); // Double cap to be safe
        ctx.font = `${cappedSize}px ${fontFamily}`;
      }
      
      ctx.fillText(
        this.symbols[i],
        this.x,
        this.y - i * this.spacing
      );
      
      // Reset font size if we changed it
      if (performanceMode !== DevicePerformance.LOW) {
        ctx.font = `${limitedFontSize}px ${fontFamily}`;
      }
    }
    
    ctx.globalAlpha = 1;
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }

  // Check if the drop is in the viewport with some margin
  checkInViewport(width: number, height: number) {
    const margin = this.length * this.spacing; // Add some margin to avoid popping
    this.inViewport = (
      this.x >= -margin &&
      this.x <= width + margin &&
      this.y >= -margin &&
      this.y <= height + margin
    );
    return this.inViewport;
  }

  update() {
    // Skip updates if not in viewport (performance optimization)
    if (!this.inViewport) {
      // Simple position update without other calculations
      this.y += this.speed;
      return;
    }
    
    // Update position based on speed
    this.y += this.speed;
    
    // Randomly change a symbol occasionally (reduced probability for performance)
    if (Math.random() > 0.98) { // Changed from 0.95 to 0.98 to reduce updates
      if (this.symbols.length > 0) {
        const index = Math.floor(Math.random() * this.symbols.length);
        const random = Math.random();
        
        // Don't modify special symbols at top of special drops
        if (!(this.special && index === 0 && SPECIAL_SYMBOLS.includes(this.symbols[0]))) {
          if (random > 0.85) {
            // Use a complete hex fragment
            this.symbols[index] = HEX_FRAGMENTS[Math.floor(Math.random() * HEX_FRAGMENTS.length)];
          } else if (random > 0.65) {
            // Use 0x as a special symbol
            this.symbols[index] = '0x';
          } else {
            // Use single hex digit
            this.symbols[index] = HEX_SYMBOLS[Math.floor(Math.random() * (HEX_SYMBOLS.length - 1))];
          }
        }
      }
    }
  }

  // Enhance hover effect with performance considerations
  applyHoverEffect(distance: number, maxDistance: number, hoverColor: string, performanceMode: DevicePerformance) {
    if (distance < maxDistance) {
      // Calculate effect intensity based on distance (closer = stronger effect)
      const intensity = 1 - (distance / maxDistance);
      
      // Apply performance-appropriate hover effects
      switch (performanceMode) {
        case DevicePerformance.HIGH:
          // Full effect
          this.speed = this.originalSpeed * (1 + intensity * 3);
          this.glowing = true;
          this.color = hoverColor;
          break;
          
        case DevicePerformance.MEDIUM:
          // Medium effect - less speed increase, still color change
          this.speed = this.originalSpeed * (1 + intensity * 2);
          this.glowing = true;
          this.color = hoverColor;
          break;
          
        case DevicePerformance.LOW:
          // Low effect - just color change, no glow or speed change
          this.color = hoverColor;
          break;
      }
    } else {
      // Revert to original state when not under hover effect
      this.speed = this.originalSpeed;
      this.color = this.originalColor;
      this.glowing = false;
    }
  }
}

export default function CryptoRain({ intensity = 50, colorScheme = 'blue' }: CryptoRainProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { ref: inViewRef, inView } = useInView({
    threshold: 0,
    initialInView: true,
  });
  const animationRef = useRef<number | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const raindrops = useRef<RainDrop[]>([]);
  const blockEffects = useRef<BlockEffect[]>([]);
  const scanLines = useRef<ScanLine[]>([]);
  const lastFrameTime = useRef<number>(0);
  const mousePosition = useRef({ x: -1000, y: -1000 });
  const lastScanLineTime = useRef<number>(0);
  const frameCount = useRef<number>(0);
  
  // Performance detection state
  const [performanceMode, setPerformanceMode] = useState<DevicePerformance>(DevicePerformance.HIGH);
  const fpsCounter = useRef<number[]>([]);
  
  // Block effect/click limiting variables
  const lastClickTime = useRef<number>(0);
  const CLICK_COOLDOWN = 500; // Minimum milliseconds between click effects
  const MAX_BLOCK_EFFECTS = 5; // Maximum number of simultaneous block effects
  
  // Detect device performance level
  useEffect(() => {
    // Check if we're on a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      typeof navigator !== 'undefined' ? navigator.userAgent : ''
    );
    
    // Check for low-end devices based on pixel ratio and platform
    const isLowEndDevice = isMobile && (
      typeof window !== 'undefined' && window.devicePixelRatio < 2
    );
    
    // Set performance mode based on device detection
    if (isLowEndDevice) {
      setPerformanceMode(DevicePerformance.LOW);
    } else if (isMobile) {
      setPerformanceMode(DevicePerformance.MEDIUM);
    } else {
      // For desktop, we'll start with HIGH and monitor FPS
      setPerformanceMode(DevicePerformance.HIGH);
    }
  }, []);
  
  // Dynamic performance adjustment based on FPS monitoring
  const updatePerformanceMode = useCallback((fps: number) => {
    // Only downgrade performance if needed
    if (fps < 20 && performanceMode === DevicePerformance.HIGH) {
      setPerformanceMode(DevicePerformance.MEDIUM);
    } else if (fps < 15 && performanceMode === DevicePerformance.MEDIUM) {
      setPerformanceMode(DevicePerformance.LOW);
    }
  }, [performanceMode]);
  
  // Create a burst of particles at a specific location - optimized
  const createBurst = useCallback((x: number, y: number, color: string) => {
    const now = Date.now();
    
    // Check if we're still in cooldown period from last click
    if (now - lastClickTime.current < CLICK_COOLDOWN) {
      return; // Skip this click if too soon after the last one
    }
    
    // Check if we already have too many block effects
    if (blockEffects.current.length >= MAX_BLOCK_EFFECTS) {
      return; // Skip if too many effects are already active
    }
    
    // Update the last click time
    lastClickTime.current = now;
    
    // Create block effect
    blockEffects.current.push(new BlockEffect(x, y, color));
    
    // Skip particle burst on low performance devices
    if (performanceMode === DevicePerformance.LOW) {
      return;
    }
    
    // Create new raindrops bursting from click location
    if (canvasRef.current) {
      const settings = getSettings();
      // Reduce burst count based on performance mode
      const burstCount = performanceMode === DevicePerformance.HIGH 
        ? Math.min(10, 15 * (intensity / 100))
        : Math.min(5, 8 * (intensity / 100));
      
      for (let i = 0; i < burstCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 50 + 50;
        const burstX = x + Math.cos(angle) * distance;
        const burstY = y + Math.sin(angle) * distance;
        const speed = (1 + Math.random() * 3) * settings.speed * 1.5;
        const length = Math.floor(Math.random() * 3) + 3;
        
        const drop = new RainDrop(burstX, burstY, speed, length, color, 0.5); // Higher chance of special for burst drops
        drop.glowing = true;
        drop.special = true;
        
        raindrops.current.push(drop);
      }
    }
  }, [intensity, performanceMode]);
  
  // Track mouse position and handle clicks
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        mousePosition.current = {
          x: (event.clientX - rect.left) * (canvasRef.current.width / rect.width),
          y: (event.clientY - rect.top) * (canvasRef.current.height / rect.height)
        };
      }
    };
    
    const handleMouseLeave = () => {
      mousePosition.current = { x: -1000, y: -1000 };
    };
    
    const handleClick = (event: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const colors = getColors();
        const color = Math.random() > 0.5 ? colors.primary : colors.secondary;
        
        // Calculate coordinates relative to the canvas with proper scaling
        const x = (event.clientX - rect.left) * (canvasRef.current.width / rect.width);
        const y = (event.clientY - rect.top) * (canvasRef.current.height / rect.height);
        
        createBurst(x, y, color);
      }
    };
    
    // Touch event handlers for mobile
    const handleTouchMove = (event: TouchEvent) => {
      if (canvasRef.current && event.touches.length > 0) {
        const rect = canvasRef.current.getBoundingClientRect();
        const touch = event.touches[0];
        
        mousePosition.current = {
          x: (touch.clientX - rect.left) * (canvasRef.current.width / rect.width),
          y: (touch.clientY - rect.top) * (canvasRef.current.height / rect.height)
        };
      }
    };
    
    const handleTouchEnd = (event: TouchEvent) => {
      if (canvasRef.current && event.changedTouches.length > 0) {
        const rect = canvasRef.current.getBoundingClientRect();
        const touch = event.changedTouches[0];
        const colors = getColors();
        const color = Math.random() > 0.5 ? colors.primary : colors.secondary;
        
        // Calculate coordinates relative to the canvas with proper scaling
        const x = (touch.clientX - rect.left) * (canvasRef.current.width / rect.width);
        const y = (touch.clientY - rect.top) * (canvasRef.current.height / rect.height);
        
        createBurst(x, y, color);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [createBurst]);
  
  // Set refs
  const setRefs = useCallback(
    (node: HTMLCanvasElement | null) => {
      canvasRef.current = node;
      inViewRef(node);
    },
    [inViewRef]
  );
  
  // Performance settings based on intensity and performance mode
  const getSettings = useCallback(() => {
    // Scale density based on performance mode
    let densityMultiplier;
    
    // High DPR screens should have even fewer raindrops
    const dpr = window.devicePixelRatio || 1;
    const dprAdjustment = dpr > 1.5 ? 0.5 : (dpr > 1 ? 0.75 : 1);
    
    switch (performanceMode) {
      case DevicePerformance.LOW:
        densityMultiplier = 0.3 * dprAdjustment; // Reduce further for high DPR
        break;
      case DevicePerformance.MEDIUM:
        densityMultiplier = 0.6 * dprAdjustment; // Reduce further for high DPR
        break;
      case DevicePerformance.HIGH:
      default:
        densityMultiplier = 1.0 * dprAdjustment; // Reduce further for high DPR
        break;
    }
    
    const dropDensity = Math.max(0.3, intensity / 100) * densityMultiplier;
    // Base count scaled by performance
    const baseCount = performanceMode === DevicePerformance.LOW ? 10 : 
                     performanceMode === DevicePerformance.MEDIUM ? 15 : 20;
    
    const dropCount = Math.floor((intensity / 10) * dropDensity * baseCount);
    
    // Character length based on performance - reduce max length
    const maxLength = performanceMode === DevicePerformance.LOW ? 4 : 
                     performanceMode === DevicePerformance.MEDIUM ? 5 : 6; // Reduced from 8 to 6 for HIGH
    
    return {
      dropCount,
      speed: 1 + (intensity / 100),
      opacity: 0.7 + (intensity / 200),
      length: 3 + Math.floor((intensity / 20) * (maxLength / 8)),
      specialChance: performanceMode === DevicePerformance.LOW ? 0.05 : 
                    performanceMode === DevicePerformance.MEDIUM ? 0.08 : 0.1
    };
  }, [intensity, performanceMode]);
  
  // Get colors based on scheme - with performance considerations
  const getColors = useCallback(() => {
    // Make colors slightly less bright on low performance to reduce visual strain
    const colorIntensity = performanceMode === DevicePerformance.LOW ? 0.8 : 1.0;
    
    const colorSchemes = {
      green: {
        primary: `rgb(${Math.round(0 * colorIntensity)}, ${Math.round(255 * colorIntensity)}, ${Math.round(102 * colorIntensity)})`,
        secondary: `rgb(${Math.round(0 * colorIntensity)}, ${Math.round(255 * colorIntensity)}, ${Math.round(0 * colorIntensity)})`,
        background: performanceMode === DevicePerformance.LOW ? 'rgba(0, 10, 2, 0.2)' : 'rgba(0, 10, 2, 0.15)',
        accent: `rgb(${Math.round(204 * colorIntensity)}, ${Math.round(255 * colorIntensity)}, ${Math.round(0 * colorIntensity)})`
      },
      blue: {
        primary: `rgb(${Math.round(51 * colorIntensity)}, ${Math.round(255 * colorIntensity)}, ${Math.round(255 * colorIntensity)})`,
        secondary: `rgb(${Math.round(0 * colorIntensity)}, ${Math.round(170 * colorIntensity)}, ${Math.round(255 * colorIntensity)})`,
        background: performanceMode === DevicePerformance.LOW ? 'rgba(0, 5, 15, 0.2)' : 'rgba(0, 5, 15, 0.15)',
        accent: `rgb(${Math.round(0 * colorIntensity)}, ${Math.round(102 * colorIntensity)}, ${Math.round(255 * colorIntensity)})`
      },
      purple: {
        primary: `rgb(${Math.round(255 * colorIntensity)}, ${Math.round(102 * colorIntensity)}, ${Math.round(255 * colorIntensity)})`,
        secondary: `rgb(${Math.round(170 * colorIntensity)}, ${Math.round(0 * colorIntensity)}, ${Math.round(255 * colorIntensity)})`,
        background: performanceMode === DevicePerformance.LOW ? 'rgba(10, 0, 15, 0.2)' : 'rgba(10, 0, 15, 0.15)',
        accent: `rgb(${Math.round(255 * colorIntensity)}, ${Math.round(0 * colorIntensity)}, ${Math.round(204 * colorIntensity)})`
      },
      cyber: {
        primary: `rgb(${Math.round(255 * colorIntensity)}, ${Math.round(85 * colorIntensity)}, ${Math.round(255 * colorIntensity)})`,
        secondary: `rgb(${Math.round(85 * colorIntensity)}, ${Math.round(255 * colorIntensity)}, ${Math.round(255 * colorIntensity)})`,
        background: performanceMode === DevicePerformance.LOW ? 'rgba(5, 0, 15, 0.2)' : 'rgba(5, 0, 15, 0.15)',
        accent: `rgb(${Math.round(255 * colorIntensity)}, ${Math.round(255 * colorIntensity)}, ${Math.round(0 * colorIntensity)})`
      }
    };
    
    return colorSchemes[colorScheme] || colorSchemes.blue;
  }, [colorScheme, performanceMode]);
  
  // Create raindrops - optimized for performance
  const initRaindrops = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const settings = getSettings();
    const colors = getColors();
    const drops: RainDrop[] = [];
    
    // Create drops
    for (let i = 0; i < settings.dropCount; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height * 2 - canvas.height;
      const speed = (1 + Math.random() * 3) * settings.speed;
      const length = Math.floor(Math.random() * 3) + Math.min(settings.length, 8); // Cap max length
      
      // Alternate between primary and secondary colors
      const colorChoice = Math.random();
      let color;
      if (colorChoice > 0.9) {
        color = colors.accent; // Occasional accent color
      } else if (colorChoice > 0.45) {
        color = colors.primary;
      } else {
        color = colors.secondary;
      }
      
      drops.push(new RainDrop(
        x, y, speed, length, color, 
        settings.specialChance // Pass dynamic special chance
      ));
    }
    
    raindrops.current = drops;
  }, [getSettings, getColors]);
  
  // Initialize canvas and raindrops
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const { width, height } = canvas.getBoundingClientRect();
        
        // Much stricter pixel ratio caps to prevent scaling issues on high-DPR screens
        const dpr = window.devicePixelRatio || 1;
        // Use a flat 1.0 pixel ratio regardless of device to ensure consistent appearance
        const pixelRatio = performanceMode === DevicePerformance.LOW
          ? 1 // Fixed at 1 for low performance
          : performanceMode === DevicePerformance.MEDIUM
          ? Math.min(dpr, 1.25) // Cap at 1.25 for medium
          : Math.min(dpr, 1.5); // Cap at 1.5 for high (prevents excessive scaling)
        
        canvas.width = width * pixelRatio;
        canvas.height = height * pixelRatio;
        
        setDimensions({ width: canvas.width, height: canvas.height });
        
        initRaindrops();
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [initRaindrops, performanceMode]);
  
  // Animation loop - optimized
  useEffect(() => {
    if (!inView) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }
    
    const animate = (timestamp: number) => {
      if (!canvasRef.current) return;
      
      // Calculate FPS for performance monitoring
      const elapsed = timestamp - lastFrameTime.current;
      const fps = 1000 / elapsed;
      
      // Store recent FPS values
      fpsCounter.current.push(fps);
      if (fpsCounter.current.length > 30) {
        fpsCounter.current.shift();
        
        // Calculate average FPS every 30 frames and adjust performance if needed
        const avgFps = fpsCounter.current.reduce((a, b) => a + b, 0) / fpsCounter.current.length;
        updatePerformanceMode(avgFps);
      }
      
      // Limit frame rate for better performance
      if (elapsed < 1000 / 30) {
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
      
      // Calculate a size factor that normalizes rendering across different displays
      const displayScaleFactor = Math.min(window.devicePixelRatio || 1, 1.5) / (window.devicePixelRatio || 1);
      
      // Set font - slightly smaller on low performance and account for device scaling
      const fontSize = performanceMode === DevicePerformance.LOW
        ? 14 * displayScaleFactor * (window.devicePixelRatio || 1)
        : 18 * displayScaleFactor * (window.devicePixelRatio || 1);
      
      ctx.font = `${fontSize}px monospace`;
      
      // Get hover color based on performance mode
      const hoverColor = colorScheme === 'cyber' ? '#ff22ff' : 
                        colorScheme === 'green' ? '#22ff22' : 
                        colorScheme === 'purple' ? '#ff22ff' : 
                        '#22ffff';
      
      // Define hover effect radius - scaled by performance but capped to avoid excessive scaling
      const hoverRadius = (performanceMode === DevicePerformance.LOW ? 120 : 180) * displayScaleFactor * (window.devicePixelRatio || 1);
      
      // Occasionally add a scan line (only on medium/high performance)
      if (performanceMode !== DevicePerformance.LOW) {
        // Less frequent scan lines on medium performance
        const scanLineInterval = performanceMode === DevicePerformance.MEDIUM ? 4000 : 2000;
        
        if (timestamp - lastScanLineTime.current > scanLineInterval + Math.random() * 3000) {
          lastScanLineTime.current = timestamp;
          scanLines.current.push(new ScanLine(canvas.width, canvas.height, colors.accent));
        }
      }
      
      // Draw and update scan lines
      scanLines.current = scanLines.current.filter(line => {
        line.draw(ctx, canvas.width, canvas.height);
        return line.update(canvas.width, canvas.height);
      });
      
      // Draw and update block effects
      blockEffects.current = blockEffects.current.filter(effect => {
        effect.draw(ctx);
        return effect.update();
      });
      
      // Update the viewport status of drops for performance optimization
      // Only process drops that are in or near the viewport
      raindrops.current.forEach(drop => {
        drop.checkInViewport(canvas.width, canvas.height);
      });
      
      // Draw and update each raindrop
      raindrops.current.forEach((drop, index) => {
        // Skip processing drops far outside viewport
        if (!drop.inViewport) {
          // Simple position update
          drop.y += drop.speed;
          
          // Reset if far below screen
          if (drop.y > canvas.height + 500) {
            const x = Math.random() * canvas.width;
            raindrops.current[index] = new RainDrop(
              x, -10, 
              (1 + Math.random() * 3) * settings.speed, 
              Math.floor(Math.random() * 3) + Math.min(settings.length, 8),
              getRandomColor(colors),
              settings.specialChance
            );
          }
          return;
        }
        
        // Apply more intelligent font sizing for different DPRs
        const baseFontSize = performanceMode === DevicePerformance.LOW
          ? 12 // Smaller base size for low performance
          : 14; // Smaller base size for medium/high (reduced from 18)
        
        // This ensures the fonts scale properly across different devices
        const displayScaleFactor = Math.min(window.devicePixelRatio || 1, 1.5) / (window.devicePixelRatio || 1);
        const scaledFontSize = Math.round(baseFontSize * displayScaleFactor * (window.devicePixelRatio || 1));
        
        ctx.font = `${scaledFontSize}px monospace`;
        
        // Calculate distance to mouse for hover effect
        const dx = drop.x - mousePosition.current.x;
        const dy = drop.y - mousePosition.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Apply hover effect if mouse is close to the raindrop
        drop.applyHoverEffect(distance, hoverRadius, hoverColor, performanceMode);
        
        drop.draw(ctx, performanceMode);
        drop.update();
        
        // Reset if bottom of screen is reached
        if (drop.y - drop.length * drop.spacing > canvas.height) {
          const x = Math.random() * canvas.width;
          const speed = (1 + Math.random() * 3) * settings.speed;
          const length = Math.floor(Math.random() * 3) + Math.min(settings.length, 8);
          
          raindrops.current[index] = new RainDrop(
            x, -drop.length * drop.spacing, 
            speed, length, 
            getRandomColor(colors),
            settings.specialChance
          );
        }
      });
      
      // Increment frame counter
      frameCount.current++;
      
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
  }, [dimensions, inView, getColors, getSettings, colorScheme, performanceMode, updatePerformanceMode]);
  
  // Helper function to get random color based on probability
  const getRandomColor = (colors: { primary: string; secondary: string; accent: string }) => {
    const colorChoice = Math.random();
    if (colorChoice > 0.9) {
      return colors.accent; // Occasional accent color
    } else if (colorChoice > 0.45) {
      return colors.primary;
    } else {
      return colors.secondary;
    }
  };
  
  return (
    <RainCanvas ref={setRefs} />
  );
} 