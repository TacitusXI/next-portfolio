'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';

interface GitHubGalaxy3DProps {
  contributions: Array<{
    date: string;
    count: number;
    color: string;
  }>;
}

const GalaxyContainer = styled.div`
  width: 100%;
  height: 400px;
  position: relative;
  background: rgba(0, 10, 30, 0.7);
  border-radius: 10px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: 300px;
  }
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

const GitHubGalaxy3D: React.FC<GitHubGalaxy3DProps> = ({ contributions }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const starsRef = useRef<THREE.Points | null>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current || !contributions.length) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup with optimizations
    const renderer = new THREE.WebGLRenderer({ 
      antialias: false, // Disable antialiasing for performance
      alpha: true,
      powerPreference: 'low-power', // Use low power mode for mobile
      precision: 'mediump', // Use medium precision for better performance
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    // Set pixel ratio with a max of 2 for performance
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Calculate the number of points to use based on device capabilities
    // For mobile, use fewer points
    const isMobile = window.innerWidth <= 768;
    const pointCount = isMobile 
      ? Math.min(150, contributions.length) 
      : Math.min(300, contributions.length);
    
    // Create galaxy with optimized geometry
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];

    // Use a subset of contributions for performance
    const step = Math.ceil(contributions.length / pointCount);
    for (let i = 0; i < contributions.length; i += step) {
      const contribution = contributions[i];
      
      // Create spiral pattern
      const radius = Math.random() * 2;
      const spinAngle = radius * 5;
      const randomAngle = Math.random() * Math.PI * 2;

      const x = Math.cos(spinAngle + randomAngle) * radius;
      const y = (Math.random() - 0.5) * 2;
      const z = Math.sin(spinAngle + randomAngle) * radius;

      positions.push(x, y, z);

      // Set color based on contribution count
      const color = new THREE.Color(contribution.color);
      colors.push(color.r, color.g, color.b);

      // Set size based on contribution count
      const size = Math.min(contribution.count * 0.5, 2);
      sizes.push(size);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    // Simplified shader material for better performance
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          gl_FragColor = vec4(vColor, 1.0);
        }
      `,
      blending: THREE.AdditiveBlending,
      depthTest: false, // Disable depth testing for performance
      transparent: true
    });

    // Create points
    const points = new THREE.Points(geometry, material);
    scene.add(points);
    starsRef.current = points;

    // Set loading state
    setIsLoading(false);

    // Setup input handling
    let touchStartX = 0;
    let touchStartY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      mousePosition.current = {
        x: ((event.clientX - rect.left) / containerRef.current.clientWidth) * 2 - 1,
        y: -((event.clientY - rect.top) / containerRef.current.clientHeight) * 2 + 1
      };
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!containerRef.current || event.touches.length === 0) return;
      
      const touchX = event.touches[0].clientX;
      const touchY = event.touches[0].clientY;
      
      const deltaX = (touchX - touchStartX) / containerRef.current.clientWidth;
      const deltaY = (touchY - touchStartY) / containerRef.current.clientHeight;
      
      targetRotation.current.y += deltaX * 2;
      targetRotation.current.x += deltaY * 2;
      
      touchStartX = touchX;
      touchStartY = touchY;
    };

    // Add event listeners
    if (isMobile) {
      containerRef.current.addEventListener('touchstart', handleTouchStart);
      containerRef.current.addEventListener('touchmove', handleTouchMove);
    } else {
      containerRef.current.addEventListener('mousemove', handleMouseMove);
    }

    // Throttled animation frame for better performance
    let lastFrameTime = 0;
    const frameInterval = 1000 / 30; // Target 30 FPS for power efficiency

    // Animation function
    const animate = (timestamp: number) => {
      if (!starsRef.current || !cameraRef.current || !rendererRef.current) return;
      
      animationFrameId.current = requestAnimationFrame(animate);

      // Throttle rendering for better performance
      if (timestamp - lastFrameTime < frameInterval) return;
      lastFrameTime = timestamp;

      // Smooth rotation
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.05;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.05;

      starsRef.current.rotation.x = currentRotation.current.x;
      starsRef.current.rotation.y = currentRotation.current.y;

      // Auto-rotation for visual appeal
      starsRef.current.rotation.y += 0.001;

      // Render scene
      renderer.render(scene, camera);
    };

    // Start animation
    animationFrameId.current = requestAnimationFrame(animate);

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      // Update camera
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();

      // Update renderer
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Store ref values in variables to prevent issues with cleanup function
    const currentContainer = containerRef.current;

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationFrameId.current);
      
      if (currentContainer) {
        if (isMobile) {
          currentContainer.removeEventListener('touchstart', handleTouchStart);
          currentContainer.removeEventListener('touchmove', handleTouchMove);
        } else {
          currentContainer.removeEventListener('mousemove', handleMouseMove);
        }
        
        if (rendererRef.current) {
          currentContainer.removeChild(rendererRef.current.domElement);
          rendererRef.current.dispose();
        }
      }
      
      window.removeEventListener('resize', handleResize);
      
      // Dispose THREE.js resources
      if (geometry) geometry.dispose();
      if (material) material.dispose();
    };
  }, [contributions]);

  return (
    <GalaxyContainer ref={containerRef}>
      {isLoading && <LoadingText>Loading 3D visualization...</LoadingText>}
    </GalaxyContainer>
  );
};

export default GitHubGalaxy3D; 