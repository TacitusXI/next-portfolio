'use client';

import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

interface GitHubGalaxyLiteProps {
  contributions: Array<{
    date: string;
    count: number;
    color: string;
  }>;
}

const Container = styled.div`
  width: 100%;
  height: 300px;
  position: relative;
  background: rgba(0, 10, 30, 0.7);
  border-radius: 10px;
  overflow: hidden;
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
`;

const LoadingText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 1.2rem;
  z-index: 1;
`;

const GitHubGalaxyLite: React.FC<GitHubGalaxyLiteProps> = ({ contributions }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current || !contributions.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Make canvas size match its display size
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;

    // Create particles from contributions
    const particles = contributions.map((contrib) => {
      // Parse the color
      const color = contrib.color;
      
      // Calculate a random position within a circular area
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * Math.min(width, height) * 0.4;
      
      const x = width / 2 + Math.cos(angle) * distance;
      const y = height / 2 + Math.sin(angle) * distance;
      
      // Size based on contribution count (with a minimum size)
      const size = Math.max(2, Math.min(contrib.count * 0.4, 5));
      
      // Random velocity
      const vx = (Math.random() - 0.5) * 0.2;
      const vy = (Math.random() - 0.5) * 0.2;
      
      return { x, y, size, color, vx, vy };
    });

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw background with subtle gradient
      const gradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, width * 0.7
      );
      gradient.addColorStop(0, 'rgba(0, 20, 50, 0.8)');
      gradient.addColorStop(1, 'rgba(0, 5, 15, 0.9)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Update and draw particles
      particles.forEach(particle => {
        // Update position with subtle movement
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Boundary check with wrap-around
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // Add a subtle glow effect
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 1.5, 0, Math.PI * 2);
        const glow = ctx.createRadialGradient(
          particle.x, particle.y, particle.size * 0.5,
          particle.x, particle.y, particle.size * 2
        );
        glow.addColorStop(0, particle.color);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fill();
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup function
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [contributions]);

  return (
    <Container>
      {!contributions.length && <LoadingText>Loading contributions...</LoadingText>}
      <Canvas ref={canvasRef} />
    </Container>
  );
};

export default GitHubGalaxyLite; 