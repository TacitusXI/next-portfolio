'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCode, FaBriefcase, FaFlask, FaBook, FaGamepad, FaEnvelope, FaUser, FaGithub, FaStickyNote } from 'react-icons/fa';
import Image from 'next/image';

// Neon glitch animation for logo
const glitchAnimation = `
  @keyframes glitch {
    0% {
      text-shadow: 0.05em 0 0 rgba(255, 0, 128, 0.75),
                  -0.05em -0.025em 0 rgba(102, 236, 255, 0.75),
                  -0.025em 0.05em 0 rgba(49, 164, 253, 0.75);
    }
    14% {
      text-shadow: 0.05em 0 0 rgba(255, 0, 128, 0.75),
                  -0.05em -0.025em 0 rgba(102, 236, 255, 0.75),
                  -0.025em 0.05em 0 rgba(49, 164, 253, 0.75);
    }
    15% {
      text-shadow: -0.05em -0.025em 0 rgba(255, 0, 128, 0.75),
                  0.025em 0.025em 0 rgba(102, 236, 255, 0.75),
                  -0.05em -0.05em 0 rgba(49, 164, 253, 0.75);
    }
    49% {
      text-shadow: -0.05em -0.025em 0 rgba(255, 0, 128, 0.75),
                  0.025em 0.025em 0 rgba(102, 236, 255, 0.75),
                  -0.05em -0.05em 0 rgba(49, 164, 253, 0.75);
    }
    50% {
      text-shadow: 0.025em 0.05em 0 rgba(255, 0, 128, 0.75),
                  0.05em 0 0 rgba(102, 236, 255, 0.75),
                  0 -0.05em 0 rgba(49, 164, 253, 0.75);
    }
    99% {
      text-shadow: 0.025em 0.05em 0 rgba(255, 0, 128, 0.75),
                  0.05em 0 0 rgba(102, 236, 255, 0.75),
                  0 -0.05em 0 rgba(49, 164, 253, 0.75);
    }
    100% {
      text-shadow: -0.025em 0 0 rgba(255, 0, 128, 0.75),
                  -0.025em -0.025em 0 rgba(102, 236, 255, 0.75),
                  -0.025em -0.05em 0 rgba(49, 164, 253, 0.75);
    }
  }
`;

// Advanced perspective container with glass morphism
const NavbarContainer = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  z-index: 1000;
  backdrop-filter: blur(10px);
  background: rgba(10, 11, 14, 0.75);
  display: flex;
  justify-content: center;
  border-bottom: 1px solid rgba(115, 74, 253, 0.15);
  transform-style: preserve-3d;
  perspective: 1000px;
  box-shadow: 
    0 4px 30px rgba(0, 0, 0, 0.1),
    0 1px 0 rgba(115, 74, 253, 0.1) inset,
    0 -10px 30px rgba(115, 74, 253, 0.025) inset;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(115, 74, 253, 0.3) 20%, 
      rgba(49, 164, 253, 0.5) 50%, 
      rgba(115, 74, 253, 0.3) 80%, 
      transparent 100%);
    filter: drop-shadow(0 0 5px rgba(49, 164, 253, 0.5));
  }
  
  ${glitchAnimation}
`;

// Modified NavContent component with iPad-specific styling
const NavContent = styled.div`
  max-width: 1400px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  margin: 0 auto;
  
  @media (min-width: 768px) and (max-width: 1024px) {
    padding: 0 0.5rem;
  }
  
  @media (max-width: 767px) {
    margin-left: 0;
  }
`;

const LogoContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  margin-right: auto;
  margin-left: 0.5rem;
  background: rgba(10, 11, 20, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(115, 74, 253, 0.15);
  transform: perspective(500px) rotateY(-2deg);
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
  @media (min-width: 768px) and (max-width: 1024px) {
    padding: 0.4rem 0.8rem;
    margin-left: 0.3rem;
    transform: perspective(500px) rotateY(-1deg);
  }
  
  &:hover {
    transform: perspective(500px) rotateY(0deg);
    border-color: rgba(115, 74, 253, 0.3);
    box-shadow: 0 5px 20px rgba(49, 164, 253, 0.2);
    background: rgba(10, 11, 20, 0.5);
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(115, 74, 253, 0.05), rgba(49, 164, 253, 0.05));
    border-radius: 12px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

const LogoImage = styled.div`
  width: 38px;
  height: 38px;
  position: relative;
  margin-right: 0.5rem;
  filter: drop-shadow(0 0 5px rgba(115, 74, 253, 0.5));
  transition: all 0.3s ease;
  
  @media (min-width: 768px) and (max-width: 1024px) {
    width: 34px;
    height: 34px;
    margin-right: 0.4rem;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const LogoText = styled.div`
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: 1px;
  background: linear-gradient(135deg, rgb(115, 74, 253) 0%, rgb(49, 164, 253) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  
  @media (min-width: 768px) and (max-width: 1024px) {
    font-size: 1.4rem;
  }
  
  &.tacitvs {
    font-size: 1.5rem;
    font-family: 'Orbitron', sans-serif;
    letter-spacing: 2px;
    margin-left: 0.25rem;
    position: relative;
    
    @media (min-width: 768px) and (max-width: 1024px) {
      font-size: 1.3rem;
      letter-spacing: 1.5px;
    }
    
    &::after {
      content: 'Digital Hub';
      position: absolute;
      bottom: -10px;
      left: 0;
      font-size: 0.65rem;
      letter-spacing: 1px;
      opacity: 0.8;
      font-weight: 400;
      color: rgb(49, 164, 253);
      -webkit-text-fill-color: rgb(49, 164, 253);
      
      @media (min-width: 768px) and (max-width: 1024px) {
        font-size: 0.6rem;
        bottom: -8px;
      }
    }
  }
  
  &.highlight {
    position: relative;
    margin-left: 0.75rem;
    font-size: 1.2rem;
    
    @media (min-width: 768px) and (max-width: 1024px) {
      font-size: 1.1rem;
      margin-left: 0.5rem;
    }
    
    &::before {
      content: '';
      position: absolute;
      left: -0.5rem;
      top: 50%;
      transform: translateY(-50%);
      width: 1px;
      height: 70%;
      background: rgba(115, 74, 253, 0.5);
      
      @media (min-width: 768px) and (max-width: 1024px) {
        left: -0.35rem;
    }
  }
`;

// Modified DesktopNav to handle iPad screens better
const DesktopNav = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  justify-content: center;
  flex: 1;
  max-width: 800px;
  margin: 0 auto;
  
  @media (min-width: 768px) and (max-width: 1024px) {
    gap: 0.8rem;
    display: none;
  }
  
  @media (max-width: 767px) {
    display: none;
  }
`;

// Mobile menu panel
const MobileMenu = styled(motion.div)<{ isOpen?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 11, 14, 0.95);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  z-index: 1050;
  border-left: 1px solid rgba(115, 74, 253, 0.2);
  overflow: hidden;
  
  @media (min-width: 768px) and (max-width: 1024px) {
    width: 60%;
    left: auto;
    align-items: flex-start;
    padding: 2rem 1.5rem;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at center,
      transparent 60%,
      rgba(49, 164, 253, 0.1) 100%
    );
    pointer-events: none;
  }
`;

const MobileNav = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (min-width: 768px) and (max-width: 1024px) {
    margin-top: 1.5rem;
    gap: 0.8rem;
  }
`;

// Mobile menu toggle button
const MobileMenuToggle = styled(motion.button)`
  background: transparent;
  border: none;
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  margin-left: 1rem;
  padding: 0.5rem;
  z-index: 1100;
  color: white;
  font-size: 1.8rem;
  position: relative;
  width: 32px;
  height: 32px;
  flex-direction: column;
  gap: 6px;
  
  @media (min-width: 768px) and (max-width: 1024px) {
    display: flex;
  }
  
  @media (max-width: 767px) {
    display: flex;
  }
  
  span {
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, rgb(115, 74, 253), rgb(49, 164, 253));
    border-radius: 2px;
    display: block;
    transition: all 0.3s ease;
    transform-origin: center;
    box-shadow: 0 0 5px rgba(49, 164, 253, 0.5);
  }
`;

const MobileLogoContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  cursor: pointer;
  background: rgba(10, 11, 20, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(115, 74, 253, 0.15);
  align-self: center;
  
  &:hover {
    border-color: rgba(115, 74, 253, 0.3);
  }
`;

const MobileMenuList = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 100%;
  max-width: 320px;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }
`;

// NavItem with iPad-specific styling
const NavItem = styled(motion.a)<{ $isActive: boolean; $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: ${props => props.$isMobile ? '0.8rem 1rem' : '0.5rem 0.6rem'};
  color: ${props => props.$isActive ? 'rgb(72, 191, 255)' : 'rgba(255, 255, 255, 0.75)'};
  text-decoration: none;
  font-size: ${props => props.$isMobile ? '1rem' : '0.85rem'};
  font-weight: ${props => props.$isActive ? '600' : '500'};
  letter-spacing: 0.3px;
  position: relative;
  transition: all 0.3s ease;
  border-radius: ${props => props.$isMobile ? '8px' : '4px'};
  white-space: nowrap;
  background: ${props => props.$isMobile ? 'rgba(255, 255, 255, 0.03)' : 'transparent'};
  border: ${props => props.$isMobile ? '1px solid rgba(255, 255, 255, 0.08)' : 'none'};
  justify-content: ${props => props.$isMobile ? 'flex-start' : 'center'};
  
  @media (min-width: 768px) and (max-width: 1024px) {
    padding: ${props => props.$isMobile ? '0.7rem 0.8rem' : '0.4rem 0.5rem'};
    font-size: ${props => props.$isMobile ? '0.95rem' : '0.8rem'};
  }
  
  @media (max-width: 480px) {
    padding: ${props => props.$isMobile ? '1rem' : '0.5rem 0.6rem'};
    font-size: ${props => props.$isMobile ? '1.1rem' : '0.85rem'};
    justify-content: ${props => props.$isMobile ? 'center' : 'center'};
  }
  
  &:hover {
    color: rgb(72, 191, 255);
    background: ${props => props.$isMobile ? 'rgba(115, 74, 253, 0.1)' : 'rgba(115, 74, 253, 0.1)'};
    border-color: ${props => props.$isMobile ? 'rgba(115, 74, 253, 0.3)' : 'transparent'};
    transform: ${props => props.$isMobile ? 'translateY(-2px)' : 'none'};
  }
  
  ${props => props.$isActive && `
    &::after {
      content: '';
      position: absolute;
      bottom: ${props.$isMobile ? '-5px' : '0'};
      left: ${props.$isMobile ? '0' : '0.8rem'};
      width: ${props.$isMobile ? '100%' : 'calc(100% - 1.6rem)'};
      height: 2px;
      background: linear-gradient(90deg, rgb(115, 74, 253), rgb(49, 164, 253));
      border-radius: 4px;
      box-shadow: 0 0 8px rgba(49, 164, 253, 0.8);
    }
  `}
  
  svg {
    font-size: ${props => props.$isMobile ? '1.3rem' : '1rem'};
    filter: ${props => props.$isActive ? 'drop-shadow(0 0 3px rgba(72, 191, 255, 0.6))' : 'none'};
  }
`;

// Container for navitem with hover effect
const NavItemContainer = styled.div`
  position: relative;
`;

// Animation variants
const mobileMenuVariants = {
  closed: {
    opacity: 0,
    x: '100%',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  open: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.07,
      delayChildren: 0.1
    }
  }
};

const navItemVariants = {
  closed: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.2 }
  },
  open: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4 }
  }
};

interface NavRoute {
  path: string;
  label: string;
  icon: JSX.Element;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  
  // Listen for scroll events
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);
  
  // Navigation routes
  const routes: NavRoute[] = [
    { path: './#about', label: 'About', icon: <FaUser /> },
    { path: './#notes', label: 'Notes', icon: <FaStickyNote /> },
    { path: './#skills', label: 'Skills', icon: <FaFlask /> },
    { path: './#experience', label: 'Experience', icon: <FaBriefcase /> },
    { path: './#projects', label: 'Projects', icon: <FaCode /> },
    { path: './#github', label: 'GitHub', icon: <FaGithub /> },
    { path: './#publications', label: 'Publications', icon: <FaBook /> },
    { path: './#hobbies', label: 'Hobbies', icon: <FaGamepad /> },
    { path: './#contact', label: 'Contact', icon: <FaEnvelope /> },
  ];
  
  // Check if a link is active
  const isActive = (path: string) => {
    const sectionId = path.substring(path.indexOf('#') + 1); // Handle paths like ./#section
    if (pathname === '/' && sectionId) {
      // Only access document on the client side
      if (typeof document !== 'undefined') {
        const section = document.getElementById(sectionId);
        if (!section) return false;
        // Check if section is in view for hash links
        const rect = section.getBoundingClientRect();
        return rect.top <= 150 && rect.bottom >= 150;
      }
      return false;
    }
    return pathname === path;
  };

  // Handler for section links
  const handleSectionClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    // Only access document on the client side
    if (typeof document !== 'undefined') {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Mobile menu content component
  const MobileMenuContent = ({ onClose }: { onClose: () => void }) => {
    const handleSectionClick = (e: React.MouseEvent, sectionId: string) => {
      e.preventDefault();
      onClose();
      
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    };

    return (
      <>
        <MobileLogoContainer
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Image 
            src="./images/tacitus_no_bg.webp" 
            alt="Tacitus Logo" 
            width={40} 
            height={40} 
            style={{ marginRight: '8px' }}
          />
          <LogoText>TACITVS</LogoText>
        </MobileLogoContainer>
        <MobileMenuList>
          {routes.map((route, index) => (
            <motion.div key={route.path} variants={navItemVariants} style={{
              gridColumn: route.label === 'Contact' ? '1 / -1' : 'auto'
            }}>
              <NavItem
                $isActive={isActive(route.path)}
                $isMobile={true}
                onClick={(e) => {
                  const sectionId = route.path.substring(route.path.indexOf('#') + 1);
                  handleSectionClick(e, sectionId);
                }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: route.label === 'Contact' 
                    ? 'linear-gradient(135deg, rgba(115, 74, 253, 0.15), rgba(49, 164, 253, 0.1))' 
                    : undefined,
                  borderColor: route.label === 'Contact' 
                    ? 'rgba(115, 74, 253, 0.3)' 
                    : undefined
                }}
              >
                {route.icon}
                <span>{route.label}</span>
              </NavItem>
            </motion.div>
          ))}
        </MobileMenuList>
      </>
    );
  };

  return (
    <>
      <NavbarContainer
        initial={{ y: -100 }}
        animate={{ 
          y: 0,
          backdropFilter: scrolled ? 'blur(15px)' : 'blur(10px)',
          backgroundColor: scrolled ? 'rgba(10, 11, 14, 0.85)' : 'rgba(10, 11, 14, 0.75)',
          boxShadow: scrolled 
            ? '0 10px 30px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(115, 74, 253, 0.15) inset' 
            : '0 4px 30px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(115, 74, 253, 0.1) inset'
        }}
        transition={{ duration: 0.4 }}
      >
        <NavContent>
          <Link href="./" passHref legacyBehavior>
            <LogoContainer
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogoImage>
                <img src="./images/tacitus_no_bg.webp" alt="Tacitus" />
              </LogoImage>
              <LogoText className="tacitvs">TACITVS</LogoText>
              <LogoText className="highlight">I.Leskov</LogoText>
            </LogoContainer>
          </Link>
          
          <DesktopNav>
            {routes.map((route) => (
              <NavItemContainer key={route.path}>
                {route.path.includes('#') ? (
                  <NavItem
                    href={route.path}
                    onClick={(e) => {
                      const sectionId = route.path.substring(route.path.indexOf('#') + 1);
                      handleSectionClick(e, sectionId);
                    }}
                    $isActive={isActive(route.path)}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {route.icon}
                    <span className="hide-on-mobile">{route.label}</span>
                  </NavItem>
                ) : (
                  <Link href={route.path} passHref legacyBehavior>
                    <NavItem
                      $isActive={isActive(route.path)}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {route.icon}
                      <span className="hide-on-mobile">{route.label}</span>
                    </NavItem>
                  </Link>
                )}
              </NavItemContainer>
            ))}
          </DesktopNav>
          
          {/* Mobile menu button */}
          <MobileMenuToggle
            onClick={() => setIsOpen(!isOpen)}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            aria-label="Toggle menu"
          >
            <motion.span
              variants={{
                closed: { rotate: 0 },
                open: { rotate: 45, y: 8, width: '100%' }
              }}
            />
            <motion.span
              variants={{
                closed: { opacity: 1 },
                open: { opacity: 0 }
              }}
            />
            <motion.span
              variants={{
                closed: { rotate: 0 },
                open: { rotate: -45, y: -8, width: '100%' }
              }}
            />
          </MobileMenuToggle>
        </NavContent>
      </NavbarContainer>
      
      {/* Mobile navigation overlay */}
      <AnimatePresence>
        {isOpen && (
          <MobileMenu
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            isOpen={isOpen}
          >
            <MobileMenuContent onClose={() => setIsOpen(false)} />
          </MobileMenu>
        )}
      </AnimatePresence>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-on-mobile {
          @media (max-width: 860px) {
            display: none;
          }
        }
      `}} />
    </>
  );
} 