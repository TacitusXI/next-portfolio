'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';

interface SkillCategory {
  name: string;
  value: number;
  color: string;
}

interface SkillRadarProps {
  categories: SkillCategory[];
  title?: string;
  width?: number;
  height?: number;
}

const RadarContainer = styled.div`
  width: 100%;
  position: relative;
  background: rgba(0, 10, 30, 0.7);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  overflow: hidden;
`;

const RadarTitle = styled.h3`
  font-size: 1.5rem;
  color: white;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const CanvasContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 500px;
  max-height: 500px;
  
  @media (max-width: 768px) {
    max-width: 300px;
    max-height: 300px;
  }
`;

const SkillLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
  max-width: 500px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LegendColor = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const LegendText = styled.span`
  font-size: 0.9rem;
  color: #e0e0e0;
`;

const SkillRadar: React.FC<SkillRadarProps> = ({
  categories,
  title = 'Skills Overview',
  width = 500,
  height = 500
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width, height });
  
  // Function to draw the radar chart - wrapped in useCallback
  const drawRadarChart = useCallback((ctx: CanvasRenderingContext2D, size: { width: number; height: number }) => {
    if (!ctx) return;
    
    const { width, height } = size;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Number of sides based on categories
    const sides = categories.length;
    const angleStep = (Math.PI * 2) / sides;
    
    // Draw background grid
    drawGrid(ctx, centerX, centerY, radius, sides, angleStep);
    
    // Draw data polygon
    drawDataPolygon(ctx, centerX, centerY, radius, sides, angleStep);
    
    // Draw labels
    drawLabels(ctx, centerX, centerY, radius, sides, angleStep);
  }, [categories]);
  
  // Draw the background grid with multiple levels
  const drawGrid = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    sides: number,
    angleStep: number
  ) => {
    // Draw multiple level rings
    const levels = 5;
    
    for (let level = 1; level <= levels; level++) {
      const levelRadius = radius * (level / levels);
      
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      
      // Draw the polygon for this level
      for (let i = 0; i < sides; i++) {
        const angle = i * angleStep - Math.PI / 2; // Start from top
        const x = centerX + levelRadius * Math.cos(angle);
        const y = centerY + levelRadius * Math.sin(angle);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.closePath();
      ctx.stroke();
    }
    
    // Draw spokes from center to each corner
    for (let i = 0; i < sides; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.stroke();
    }
  };
  
  // Draw the data polygon based on skill values
  const drawDataPolygon = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    sides: number,
    angleStep: number
  ) => {
    ctx.beginPath();
    
    // Draw filled polygon for data
    for (let i = 0; i < sides; i++) {
      const value = categories[i].value / 100; // Normalize to 0-1
      const angle = i * angleStep - Math.PI / 2; // Start from top
      const x = centerX + radius * value * Math.cos(angle);
      const y = centerY + radius * value * Math.sin(angle);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.closePath();
    
    // Fill with gradient
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, radius
    );
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.3)');
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Stroke with a subtle glow
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw data points at each vertex
    for (let i = 0; i < sides; i++) {
      const value = categories[i].value / 100;
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + radius * value * Math.cos(angle);
      const y = centerY + radius * value * Math.sin(angle);
      
      // Draw point
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = categories[i].color;
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  };
  
  // Draw category labels
  const drawLabels = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    sides: number,
    angleStep: number
  ) => {
    ctx.font = '14px sans-serif';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i < sides; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const labelRadius = radius + 30; // Position labels outside the chart
      const x = centerX + labelRadius * Math.cos(angle);
      const y = centerY + labelRadius * Math.sin(angle);
      
      // Adjust text alignment based on position
      if (angle < -Math.PI / 4 && angle > -3 * Math.PI / 4) {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
      } else if (angle >= -Math.PI / 4 && angle < Math.PI / 4) {
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
      } else if (angle >= Math.PI / 4 && angle < 3 * Math.PI / 4) {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
      } else {
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
      }
      
      ctx.fillText(categories[i].name, x, y);
    }
  };
  
  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      
      const container = canvasRef.current.parentElement;
      if (!container) return;
      
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      
      // Set the canvas size to match the container
      const size = Math.min(
        Math.min(containerWidth, 500),
        Math.min(containerHeight, 500)
      );
      
      setCanvasSize({
        width: size,
        height: size
      });
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Draw chart when canvas or data changes
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    // Set actual canvas size for HiDPI displays
    const pixelRatio = window.devicePixelRatio || 1;
    canvasRef.current.width = canvasSize.width * pixelRatio;
    canvasRef.current.height = canvasSize.height * pixelRatio;
    
    // Scale canvas for HiDPI displays
    ctx.scale(pixelRatio, pixelRatio);
    
    // Set canvas style size
    canvasRef.current.style.width = `${canvasSize.width}px`;
    canvasRef.current.style.height = `${canvasSize.height}px`;
    
    drawRadarChart(ctx, canvasSize);
  }, [canvasSize, categories, drawRadarChart]);
  
  return (
    <RadarContainer>
      <RadarTitle>{title}</RadarTitle>
      <CanvasContainer>
        <canvas
          ref={canvasRef}
          style={{
            width: `${canvasSize.width}px`,
            height: `${canvasSize.height}px`,
          }}
        />
      </CanvasContainer>
      <SkillLegend>
        {categories.map((category) => (
          <LegendItem key={category.name}>
            <LegendColor color={category.color} />
            <LegendText>{category.name}</LegendText>
          </LegendItem>
        ))}
      </SkillLegend>
    </RadarContainer>
  );
};

export default SkillRadar; 