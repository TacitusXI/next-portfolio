'use client';

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface SkillNode {
  id: string;
  label: string;
  category: string;
  value: number; // 0-100
}

interface SkillLink {
  source: string;
  target: string;
  strength: number; // 0-1
}

interface SkillsGraphProps {
  nodes: SkillNode[];
  links: SkillLink[];
  title?: string;
}

const GraphContainer = styled.div`
  width: 100%;
  position: relative;
  background: rgba(0, 10, 30, 0.7);
  border-radius: 10px;
  overflow: hidden;
  padding: 1.5rem;
  min-height: 400px;

  @media (max-width: 768px) {
    min-height: 300px;
  }
`;

const GraphTitle = styled.h3`
  font-size: 1.5rem;
  color: white;
  margin-bottom: 1rem;
  font-weight: 600;
  text-align: center;
`;

const CanvasContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 300px;
`;

const LoadingText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 1rem;
`;

const CategoryLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LegendColor = styled.div<{ color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const LegendText = styled.span`
  font-size: 0.8rem;
  color: #e0e0e0;
`;

// Helper function to get category color
const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'Frontend': '#3b82f6', // blue
    'Backend': '#10b981', // green
    'DevOps': '#f59e0b', // amber
    'Mobile': '#8b5cf6', // purple
    'Data': '#ec4899', // pink
    'Design': '#06b6d4', // cyan
    'Tools': '#6366f1', // indigo
    'Languages': '#ef4444', // red
  };
  
  return colors[category] || '#9ca3af'; // gray as default
};

// Force-directed graph simulation class
class ForceGraph {
  nodes: SkillNode[];
  links: SkillLink[];
  nodePositions: Map<string, { x: number; y: number; vx: number; vy: number }>;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  isRunning: boolean;
  
  constructor(nodes: SkillNode[], links: SkillLink[], width: number, height: number) {
    this.nodes = nodes;
    this.links = links;
    this.width = width;
    this.height = height;
    this.centerX = width / 2;
    this.centerY = height / 2;
    this.isRunning = false;
    
    // Initialize node positions randomly
    this.nodePositions = new Map();
    nodes.forEach(node => {
      this.nodePositions.set(node.id, {
        x: this.centerX + (Math.random() - 0.5) * width * 0.8,
        y: this.centerY + (Math.random() - 0.5) * height * 0.8,
        vx: 0,
        vy: 0
      });
    });
  }
  
  // Calculate forces and update positions
  tick() {
    // Reset forces
    this.nodePositions.forEach((pos) => {
      pos.vx = 0;
      pos.vy = 0;
    });
    
    // Apply link forces (attraction)
    this.links.forEach(link => {
      const sourcePos = this.nodePositions.get(link.source);
      const targetPos = this.nodePositions.get(link.target);
      
      if (!sourcePos || !targetPos) return;
      
      const dx = targetPos.x - sourcePos.x;
      const dy = targetPos.y - sourcePos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance === 0) return;
      
      // Target distance based on node values and link strength
      const sourceNode = this.nodes.find(n => n.id === link.source);
      const targetNode = this.nodes.find(n => n.id === link.target);
      
      if (!sourceNode || !targetNode) return;
      
      const idealDistance = 100 + ((sourceNode.value + targetNode.value) / 2) * 0.5;
      const strength = link.strength * 0.01;
      
      // Force is proportional to distance difference and strength
      const force = (distance - idealDistance) * strength;
      const forceX = (dx / distance) * force;
      const forceY = (dy / distance) * force;
      
      sourcePos.vx += forceX;
      sourcePos.vy += forceY;
      targetPos.vx -= forceX;
      targetPos.vy -= forceY;
    });
    
    // Apply node repulsion forces
    for (let i = 0; i < this.nodes.length; i++) {
      const nodeA = this.nodes[i];
      const posA = this.nodePositions.get(nodeA.id);
      
      if (!posA) continue;
      
      for (let j = i + 1; j < this.nodes.length; j++) {
        const nodeB = this.nodes[j];
        const posB = this.nodePositions.get(nodeB.id);
        
        if (!posB) continue;
        
        const dx = posB.x - posA.x;
        const dy = posB.y - posA.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance === 0) continue;
        
        // Repulsion force is inversely proportional to distance
        const repulsion = 500 / (distance * distance);
        const repulsionX = (dx / distance) * repulsion;
        const repulsionY = (dy / distance) * repulsion;
        
        posA.vx -= repulsionX;
        posA.vy -= repulsionY;
        posB.vx += repulsionX;
        posB.vy += repulsionY;
      }
    }
    
    // Apply center gravity
    this.nodePositions.forEach((pos) => {
      const dx = this.centerX - pos.x;
      const dy = this.centerY - pos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 0) {
        const gravity = 0.01;
        pos.vx += dx * gravity;
        pos.vy += dy * gravity;
      }
    });
    
    // Apply boundary forces to keep nodes in view
    this.nodePositions.forEach((pos) => {
      const margin = 50;
      
      if (pos.x < margin) pos.vx += 1;
      if (pos.x > this.width - margin) pos.vx -= 1;
      if (pos.y < margin) pos.vy += 1;
      if (pos.y > this.height - margin) pos.vy -= 1;
    });
    
    // Update positions with velocity
    this.nodePositions.forEach((pos) => {
      // Apply damping to prevent excessive oscillation
      const damping = 0.5;
      pos.x += pos.vx * damping;
      pos.y += pos.vy * damping;
    });
  }
  
  // Draw the graph on canvas
  draw(ctx: CanvasRenderingContext2D) {
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, this.width, this.height);
    
    // Draw links first (so they're behind nodes)
    ctx.lineWidth = 1;
    this.links.forEach(link => {
      const sourcePos = this.nodePositions.get(link.source);
      const targetPos = this.nodePositions.get(link.target);
      
      if (!sourcePos || !targetPos) return;
      
      ctx.beginPath();
      ctx.moveTo(sourcePos.x, sourcePos.y);
      ctx.lineTo(targetPos.x, targetPos.y);
      
      // Adjust opacity based on link strength
      const opacity = 0.1 + link.strength * 0.5;
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.stroke();
    });
    
    // Draw nodes
    this.nodes.forEach(node => {
      const pos = this.nodePositions.get(node.id);
      if (!pos) return;
      
      const nodeRadius = 5 + (node.value / 20); // Size based on value
      
      // Draw node background with glow
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, nodeRadius + 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, 0.1)`;
      ctx.fill();
      
      // Draw main node
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = getCategoryColor(node.category);
      ctx.fill();
      
      // Draw node border
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.stroke();
      
      // Draw text
      ctx.font = '12px sans-serif';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, pos.x, pos.y + nodeRadius + 12);
    });
  }
}

const SkillsGraph: React.FC<SkillsGraphProps> = ({
  nodes,
  links,
  title = 'Skills Network'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [simulationRunning, setSimulationRunning] = useState(false);
  const simulationRef = useRef<ForceGraph | null>(null);
  const frameIdRef = useRef<number>(0);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Extract unique categories
  useEffect(() => {
    const uniqueCategories = Array.from(new Set(nodes.map(node => node.category)));
    setCategories(uniqueCategories);
  }, [nodes]);
  
  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = 500; // Fixed height or use containerRef.current.clientHeight
      
      setCanvasSize({
        width: containerWidth,
        height: containerHeight
      });
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Initialize and run simulation
  useEffect(() => {
    if (!canvasRef.current || !canvasSize.width || !canvasSize.height) return;
    
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
    
    // Initialize simulation
    simulationRef.current = new ForceGraph(
      nodes,
      links,
      canvasSize.width,
      canvasSize.height
    );
    
    // Animation loop
    const animate = () => {
      if (simulationRef.current) {
        simulationRef.current.tick();
        simulationRef.current.draw(ctx);
      }
      
      frameIdRef.current = requestAnimationFrame(animate);
    };
    
    // Run simulation for a fixed number of iterations to stabilize
    const stabilize = () => {
      if (simulationRef.current) {
        for (let i = 0; i < 100; i++) {
          simulationRef.current.tick();
        }
        simulationRef.current.draw(ctx);
      }
      
      setSimulationRunning(true);
      frameIdRef.current = requestAnimationFrame(animate);
    };
    
    // Start with stabilization
    stabilize();
    
    return () => {
      cancelAnimationFrame(frameIdRef.current);
    };
  }, [canvasSize, nodes, links]);
  
  return (
    <GraphContainer>
      <GraphTitle>{title}</GraphTitle>
      <CanvasContainer ref={containerRef}>
        <canvas
          ref={canvasRef}
          style={{
            width: `${canvasSize.width}px`,
            height: `${canvasSize.height}px`,
          }}
        />
        {!simulationRunning && <LoadingText>Initializing...</LoadingText>}
      </CanvasContainer>
      <CategoryLegend>
        {categories.map(category => (
          <LegendItem key={category}>
            <LegendColor color={getCategoryColor(category)} />
            <LegendText>{category}</LegendText>
          </LegendItem>
        ))}
      </CategoryLegend>
    </GraphContainer>
  );
};

export default SkillsGraph; 