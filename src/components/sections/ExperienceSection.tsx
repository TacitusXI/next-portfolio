'use client';

import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useBackground } from '../effects/BackgroundProvider';
import { experiences, additionalExperiences } from '@/data/content';
import { FaFilePdf, FaExternalLinkAlt, FaTimes, FaSearch, FaShieldAlt, FaFileAlt } from 'react-icons/fa';
import { parseTextWithBookLinks } from '@/components/utils/textParser';
import { useImagePreloader } from '@/hooks/useImagePreloader';

const ExperienceContainer = styled.section`
  padding: 8rem 2rem;
  position: relative;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  margin-bottom: 4rem;
  text-align: center;
  background: linear-gradient(135deg, rgb(115, 74, 253) 0%, rgb(49, 164, 253) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const TabsContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 3rem;
  gap: 1rem;
  padding: 0 1rem;
  
  @media (max-width: 768px) {
    gap: 0.25rem;
    padding: 0 0.5rem;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  
  @media (max-width: 480px) {
    gap: 0.125rem;
    padding: 0 0.25rem;
    margin-bottom: 2rem;
  }
`;

const Tab = styled.button<{ $isActive: boolean }>`
  padding: 0.8rem 1.5rem;
  background: ${props => props.$isActive ? 'rgba(49, 164, 253, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.$isActive ? 'rgb(49, 164, 253)' : 'rgba(255, 255, 255, 0.7)'};
  border: 1px solid ${props => props.$isActive ? 'rgb(49, 164, 253)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  min-width: fit-content;
  position: relative;
  backdrop-filter: blur(10px);
  
  /* Hide short name by default */
  .short-name {
    display: none;
  }
  
  .full-name {
    display: inline;
  }
  
  &:hover {
    background: rgba(115, 74, 253, 0.1);
    color: ${props => props.$isActive ? 'rgb(115, 74, 253)' : 'rgba(255, 255, 255, 0.9)'};
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(115, 74, 253, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    padding: 1rem 1.2rem;
    font-size: 1rem;
    border-radius: 8px;
    flex: 1;
    min-height: 48px;
    font-weight: 600;
    
    /* Show short name on tablet and mobile */
    .short-name {
      display: inline;
    }
    
    .full-name {
      display: none;
    }
  }
  
  @media (max-width: 480px) {
    padding: 1.1rem 1rem;
    font-size: 1.05rem;
    border-radius: 10px;
    min-height: 52px;
    font-weight: 600;
    flex: 1;
    box-shadow: ${props => props.$isActive ? '0 6px 20px rgba(49, 164, 253, 0.3)' : '0 4px 15px rgba(0, 0, 0, 0.1)'};
  }
  
  @media (max-width: 360px) {
    padding: 1rem 0.8rem;
    font-size: 1rem;
    min-height: 50px;
    font-weight: 600;
  }
`;

const TimelinesContainer = styled.div`
  position: relative;
`;

const Timeline = styled(motion.div).withConfig({
  shouldForwardProp: (prop) => prop !== 'isVisible'
})<{ isVisible: boolean }>`
  display: ${props => props.isVisible ? 'block' : 'none'};
`;

const TimelineItem = styled(motion.div)`
  display: flex;
  margin-bottom: 4rem;
  position: relative;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 210px;
    top: 0;
    bottom: -4rem;
    width: 2px;
    background: linear-gradient(to bottom, rgb(115, 74, 253), rgb(49, 164, 253));
    
    @media (max-width: 768px) {
      left: 24px;
    }
  }
  
  &:last-child::before {
    bottom: 0;
  }
`;

const TimelineDate = styled.div`
  width: 180px;
  padding-right: 30px;
  text-align: right;
  font-size: 0.9rem;
  font-weight: 600;
  color: rgb(49, 164, 253);
  padding-top: 4px;
  
  @media (max-width: 768px) {
    width: auto;
    text-align: left;
    padding-left: 50px;
    margin-bottom: 0.5rem;
  }
`;

const TimelineDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgb(115, 74, 253);
  margin-right: 30px;
  margin-top: 1px;
  position: relative;
  z-index: 1;
  box-shadow: 0 0 0 4px rgba(115, 74, 253, 0.2);
  flex-shrink: 0;
  
  /* Centering the dot on the timeline */
  position: relative;
  left: -5px; /* Half the width of the dot */
  
  @media (max-width: 768px) {
    display: none; /* Hide the dot on mobile */
  }
`;

const TimelineContent = styled.div`
  flex: 1;
  padding: 1.5rem;
  background: rgba(10, 10, 20, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    margin-left: 50px; /* Ensure consistent spacing from timeline on mobile */
  }
  
  &:hover {
    background: rgba(10, 10, 20, 0.8);
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }
`;

const CertificateContent = styled(TimelineContent)`
  display: flex;
  flex-direction: column;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    gap: 1.5rem;
  }
  
  @media (max-width: 768px) {
    margin-left: 50px; /* Ensure consistent spacing from timeline on mobile */
  }
`;

const CertificateImageContainer = styled.div`
  width: 100%;
  height: 180px;
  position: relative;
  margin-bottom: 1.5rem;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid rgba(115, 74, 253, 0.3);
  background: rgba(15, 15, 25, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(115, 74, 253, 0.3);
  }
  
  @media (min-width: 768px) {
    width: 220px;
    min-width: 220px;
    height: 150px;
    margin-bottom: 0;
  }
`;

const CertificateImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const CertificatePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(15, 15, 25, 0.8);
`;

const PdfIcon = styled(FaFilePdf)`
  font-size: 2.5rem;
  color: rgba(115, 74, 253, 0.8);
  margin-bottom: 0.5rem;
`;

const ViewButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(115, 74, 253, 0.2);
  border: 1px solid rgba(115, 74, 253, 0.3);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  
  &:hover {
    background: rgba(115, 74, 253, 0.3);
    color: white;
  }
`;

const CertificateDetails = styled.div`
  flex: 1;
`;

const CertificateId = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 0.5rem;
  font-family: monospace;
`;

const TimelineTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: white;
  text-shadow: 0 0 5px rgba(115, 74, 253, 0.5);
`;

const TimelineSubtitle = styled.h4`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  margin-bottom: 1rem;
  
  span {
    color: rgb(49, 164, 253);
  }
`;

const TimelineDescription = styled.p`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
`;

const AchievementsList = styled.ul`
  margin-top: 1.5rem;
  padding-left: 0;
  list-style-type: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AchievementItem = styled.li`
  margin-bottom: 0.75rem;
  padding-left: 1.5rem;
  position: relative;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  
  &::before {
    content: '→';
    position: absolute;
    left: 0;
    color: rgb(115, 74, 253);
  }
  
  &:hover {
    color: white;
    text-shadow: 0 0 8px rgba(49, 164, 253, 0.5);
  }
`;

const SkillsList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
  list-style-type: none;
  padding: 0;
`;

const SkillItem = styled.li`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(49, 164, 253, 0.1);
  border: 1px solid rgba(49, 164, 253, 0.2);
  padding: 0.2rem 0.8rem;
  border-radius: 30px;
`;

// Modal overlay for PDF preview
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled(motion.div)`
  width: 100%;
  max-width: min(1000px, 90vw);
  max-height: 90vh;
  background: rgba(15, 15, 25, 0.9);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(115, 74, 253, 0.3);
  box-shadow: 0 0 30px rgba(115, 74, 253, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const CertificateImageView = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
`;

const ZoomableImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
  
  /* For certificates with white backgrounds */
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(15, 15, 25, 0.9);
  border: 1px solid rgba(115, 74, 253, 0.4);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 20;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
  
  &:hover {
    background: rgba(115, 74, 253, 0.3);
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    top: 0.75rem;
    right: 0.75rem;
    width: 36px;
    height: 36px;
    background: rgba(15, 15, 25, 0.95);
    border: 2px solid rgba(115, 74, 253, 0.5);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
  }
`;

const LoadingIndicator = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  background: rgba(15, 15, 25, 0.9);
  
  svg {
    font-size: 2.5rem;
    color: rgba(115, 74, 253, 0.8);
    margin-bottom: 1rem;
    animation: pulse 1.5s infinite;
  }
  
  @keyframes pulse {
    0% { opacity: 0.6; transform: scale(0.95); }
    50% { opacity: 1; transform: scale(1.05); }
    100% { opacity: 0.6; transform: scale(0.95); }
  }
`;

// Add verification button
const VerifyButton = styled(ViewButton)`
  margin-top: 0.5rem;
  background: rgba(49, 164, 253, 0.2);
  border: 1px solid rgba(49, 164, 253, 0.3);
  
  &:hover {
    background: rgba(49, 164, 253, 0.3);
  }
`;

const ProofButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(115, 74, 253, 0.1);
  border: 1px solid rgba(115, 74, 253, 0.2);
  color: rgb(115, 74, 253);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
  min-width: fit-content;
  backdrop-filter: blur(5px);
  
  &:hover {
    background: rgba(115, 74, 253, 0.2);
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(115, 74, 253, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    padding: 0.9rem 1.5rem;
    font-size: 1rem;
    width: 100%;
    justify-content: center;
    min-height: 48px;
    font-weight: 600;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(115, 74, 253, 0.15);
  }
  
  @media (max-width: 480px) {
    padding: 1rem 1.5rem;
    font-size: 1.05rem;
    min-height: 52px;
    border-radius: 10px;
    gap: 0.6rem;
    font-weight: 600;
    box-shadow: 0 6px 20px rgba(115, 74, 253, 0.2);
  }
  
  @media (max-width: 360px) {
    padding: 0.9rem 1.2rem;
    font-size: 1rem;
    min-height: 50px;
  }
`;

const ProofModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  backdrop-filter: blur(5px);
`;

const ProofContent = styled(motion.div)`
  width: 90%;
  max-width: 950px;
  height: 85vh;
  background: rgba(15, 15, 25, 0.95);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(115, 74, 253, 0.3);
  box-shadow: 0 0 30px rgba(115, 74, 253, 0.2);
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(10px);
  
  @media (max-width: 768px) {
    width: 95%;
    height: 88vh;
  }
`;

const ProofTitle = styled.h3`
  font-size: 1.6rem;
  color: white;
  margin-bottom: 1.25rem;
  text-align: center;
  text-shadow: 0 0 10px rgba(115, 74, 253, 0.5);
  font-weight: 600;
  line-height: 1.3;
  word-wrap: break-word;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    text-align: left;
    line-height: 1.4;
    padding-right: 0.5rem;
  }
`;

const ProofDescription = styled.p`
  margin-bottom: 1.5rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.95);
  font-size: 0.95rem;
  padding: 1.25rem;
  background: rgba(10, 10, 20, 0.5);
  border-radius: 10px;
  border: 1px solid rgba(115, 74, 253, 0.3);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  
  &.desktop-only {
    @media (max-width: 768px) {
      display: none;
    }
  }
  
  @media (max-width: 768px) {
    margin-bottom: 1rem;
    flex-shrink: 0;
    font-size: 0.9rem;
    padding: 1rem;
    line-height: 1.6;
  }
`;

const MobileDescriptionContainer = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    margin-bottom: 1rem;
    flex-shrink: 0;
  }
`;

const MobileDescriptionText = styled.div`
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.95);
  font-size: 0.9rem;
  padding: 1rem;
  background: rgba(10, 10, 20, 0.5);
  border-radius: 10px;
  border: 1px solid rgba(115, 74, 253, 0.3);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 0.875rem;
    line-height: 1.5;
  }
`;

const ProofImageGrid = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 0 auto 1.5rem auto;
  width: fit-content;
  max-width: 100%;
  padding: 0.5rem;
  
  &.desktop-only {
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const MobileImageContainer = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    width: 100%;
    flex: 1;
    min-height: 0;
    max-height: 60vh;
    align-items: center;
  }
`;

const MobileImageDisplay = styled.div`
  width: calc(100% - 1rem);
  flex: 1;
  min-height: 180px;
  max-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  border: 1px solid rgba(115, 74, 253, 0.3);
  overflow: hidden;
  margin: 0 auto 0.75rem auto;
  box-shadow: 0 4px 15px rgba(115, 74, 253, 0.1);
`;

const MobileProofImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const ImageNavigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 0 auto;
  flex-shrink: 0;
  padding: 0.75rem 1rem;
  background: rgba(10, 10, 20, 0.4);
  border-radius: 8px;
  border: 1px solid rgba(115, 74, 253, 0.2);
  width: fit-content;
  max-width: calc(100% - 2rem);
  
  @media (max-width: 768px) {
    gap: 0.75rem;
    padding: 0.6rem 0.8rem;
    max-width: calc(100% - 1rem);
    width: fit-content;
  }
`;

const ImageNavButton = styled.button`
  padding: 0.6rem 1rem;
  background: rgba(115, 74, 253, 0.15);
  border: 1px solid rgba(115, 74, 253, 0.3);
  color: rgb(115, 74, 253);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  min-height: 40px;
  min-width: 70px;
  backdrop-filter: blur(5px);
  flex-shrink: 0;
  
  &:hover {
    background: rgba(115, 74, 253, 0.25);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 0.8rem;
    font-size: 0.85rem;
    min-width: 60px;
  }
`;

const ImageCounter = styled.span`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 600;
  min-width: 50px;
  text-align: center;
  flex-shrink: 0;
  padding: 0 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
    min-width: 45px;
    padding: 0 0.25rem;
  }
`;

const ProofImage = styled.img`
  max-height: 100%;
  max-width: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  transition: opacity 0.3s ease, filter 0.5s ease, transform 0.3s ease;
  
  /* Add fade-in effect for images */
  opacity: 0;
  filter: blur(10px);
  &.loaded {
    opacity: 1;
    filter: blur(0);
  }
  
  &:hover {
    transform: scale(1.02);
  }
`;

// Create an image wrapper component for loading state
const ProofImageWrapper = styled.div`
  position: relative;
  height: 350px;
  width: auto;
  min-width: 220px;
  max-width: 400px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  border: 1px solid rgba(115, 74, 253, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
  margin: 0 auto;
`;

const ImageLoadingIndicator = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
  color: rgba(255, 255, 255, 0.8);
  
  svg {
    font-size: 1.5rem;
    animation: pulse 1.5s infinite;
  }
  
  @keyframes pulse {
    0% { opacity: 0.6; transform: scale(0.95); }
    50% { opacity: 1; transform: scale(1.05); }
    100% { opacity: 0.6; transform: scale(0.95); }
  }
`;

const ProofHeader = styled.div`
  padding: 1.5rem 4rem 0 1.5rem;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    padding: 1rem 3.5rem 0 1rem;
  }
`;

const ProofMainContent = styled.div`
  flex: 1;
  padding: 0 1.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const ProofFooter = styled.div`
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  flex-shrink: 0;
  border-top: 1px solid rgba(115, 74, 253, 0.2);
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ProofLinks = styled.div`
  display: flex;
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const ProofLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(49, 164, 253, 0.15);
  border: 1px solid rgba(49, 164, 253, 0.3);
  color: rgb(49, 164, 253);
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;
  backdrop-filter: blur(5px);
  font-size: 0.9rem;
  flex: 1;
  justify-content: center;
  
  &:hover {
    background: rgba(49, 164, 253, 0.25);
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(49, 164, 253, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 1rem 1rem;
    font-size: 1rem;
    min-height: 48px;
    font-weight: 600;
  }
`;

// Add this new styled component
const ButtonsContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
    flex-direction: column;
  }
  
  @media (max-width: 480px) {
    gap: 0.4rem;
  }
`;

const SideProjectsButton = styled(ProofButton)`
  background: rgba(49, 164, 253, 0.1);
  border: 1px solid rgba(49, 164, 253, 0.2);
  color: rgb(49, 164, 253);
  
  &:hover {
    background: rgba(49, 164, 253, 0.2);
  }
`;

// Update interface to make certificateId optional
interface Certificate {
  id: number;
  date: string;
  title: string;
  institution: string;
  certificateId?: string;
  verifyUrl?: string;
  description: string;
  skills: string[];
  imagePath: string | null;
}

export default function ExperienceSection() {
  const { setBackgroundType, setIntensity, setColorScheme } = useBackground();
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const [activeTab, setActiveTab] = useState('work');
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageZoom, setImageZoom] = useState(1);
  const [imageRatio, setImageRatio] = useState({ width: 3, height: 2 }); // Default ratio
  const [selectedProof, setSelectedProof] = useState<any | null>(null);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Extract all proof images for preloading
  const allProofImages = experiences.concat(additionalExperiences)
    .flatMap(exp => exp.proof ? exp.proof.images || [] : [])
    .map(img => img.startsWith('/images/') ? `.${img}` : img);
  
  // Track previous length of loadedSrcs to avoid unnecessary updates
  const prevLoadedSrcsLengthRef = useRef(0);
  
  // Use our preloader hook
  const { imagesStatus, loadedSrcs } = useImagePreloader(allProofImages);
  
  // Update preloadedImages set when images load through the hook
  useEffect(() => {
    // Only update if we have more loaded sources than before
    if (loadedSrcs.length > prevLoadedSrcsLengthRef.current) {
      prevLoadedSrcsLengthRef.current = loadedSrcs.length;
      
      // Find only the newly loaded sources
      const currentPreloadedArray = Array.from(preloadedImages);
      const newSrcs = loadedSrcs.filter(src => !currentPreloadedArray.includes(src));
      
      if (newSrcs.length > 0) {
        setPreloadedImages(prev => new Set([...prev, ...newSrcs]));
      }
    }
  }, [loadedSrcs]); // Safe to depend on loadedSrcs with our ref check

  useEffect(() => {
    if (inView) {
      controls.start('visible');
      
      // Change background when scrolling to Experience section
      setBackgroundType('digital');
      setIntensity(65);
      setColorScheme('blue');
    }
  }, [inView, controls, setBackgroundType, setIntensity, setColorScheme]);
  
  // Function to preload specific proof images when hovering over proof button
  const handleProofButtonHover = (proof: any) => {
    if (proof && proof.images && proof.images.length > 0) {
      proof.images.forEach((image: string) => {
        const formattedUrl = image.startsWith('/images/') ? `.${image}` : image;
        if (!preloadedImages.has(formattedUrl)) {
          const img = new Image();
          img.src = formattedUrl;
          img.onload = () => {
            setPreloadedImages(prev => new Set([...prev, formattedUrl]));
          };
        }
      });
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };
  
  const tabs = [
    { id: 'work', name: 'Work Experience', shortName: 'Work' },
    { id: 'side', name: 'Side Projects', shortName: 'Projects' },
    { id: 'education', name: 'Certifications', shortName: 'Certs' }
  ];
  
  const certifications: Certificate[] = [
    {
      id: 1,
      date: '2023',
      title: 'CS50x',
      institution: 'Harvard University',
      certificateId: 'b33fa552-f15f-4ad2-951e-476acffff2e6',
      verifyUrl: 'https://certificates.cs50.io/b33fa552-f15f-4ad2-951e-476acffff2e6.pdf?size=letter',
      description: 'Completed ten problem sets, nine labs, and one final project covering computer science fundamentals, data structures, algorithms, and web development.',
      skills: ['Computer Science', 'C', 'Python', 'SQL', 'Web Development'],
      imagePath: './images/certificates/CS50x.webp'
    },
    {
      id: 2,
      date: 'April 10, 2023',
      title: 'Algorithmic Trading & Technical Analysis',
      institution: 'Moralis Academy',
      description: 'Comprehensive training on trading analysis, strategy development, Pinescript, risk management, JavaScript trading, automation, and exchange API setup.',
      skills: ['Trading Analysis', 'Pinescript', 'JavaScript Trading', 'Risk Management', 'Exchange APIs'],
      imagePath: './images/certificates/leskov-Algorithmic-Trading-amp-Technical-Analysis-Algorithmic-Trading-Technical-Analysis-v3-Moralis-Academy.webp'
    },
    {
      id: 3,
      date: 'May 17, 2022',
      title: 'Ethereum Smart Contract Security',
      institution: 'Moralis Academy',
      description: 'Advanced course covering DAO and Parity hack replication, security mindset, Solidity best practices, contract design, and secure contract patterns including upgradable, proxy, and pausable contracts.',
      skills: ['Smart Contract Security', 'Solidity', 'Hack Prevention', 'Upgradable Contracts'],
      imagePath: './images/certificates/Ivan-Lieskov-Ethereum-Smart-Contract-Security-Ethereum-Smart-Contract-Security-Moralis-Moralis-Academy.webp'
    },
    {
      id: 4,
      date: 'May 15, 2022',
      title: 'Ethereum Smart Contract Programming 201',
      institution: 'Moralis Academy',
      description: 'Advanced smart contract development with Truffle, unit testing, ERC standards, migrations, OpenZeppelin contracts, and testnet deployment.',
      skills: ['Truffle', 'Unit Testing', 'ERC Standards', 'OpenZeppelin', 'Testnet Development'],
      imagePath: './images/certificates/Ivan-Lieskov-Ethereum-Smart-Contract-Programming-201-Ethereum-Smart-Contract-Programming-201-Moralis-Moralis-Academy.webp'
    },
    {
      id: 5,
      date: 'May 6, 2022',
      title: 'Chainlink Programming',
      institution: 'Moralis Academy',
      description: 'Specialized training on oracles, smart contract integration with Chainlink, node operation, oracle testing, verifiable randomness, and building Chainlink projects.',
      skills: ['Oracles', 'Chainlink', 'Smart Contracts', 'Verifiable Randomness'],
      imagePath: './images/certificates/Ivan-Lieskov-Chainlink-Programming-101-Chainlink-101-Moralis-Moralis-Academy.webp'
    },
    {
      id: 6,
      date: 'April 23, 2022',
      title: 'Ethereum Smart Contract Programming 101',
      institution: 'Moralis Academy',
      description: 'Foundational course on Solidity basics including arrays, structs, mappings, data location, error handling, inheritance, visibility, events, and external calls.',
      skills: ['Solidity', 'Smart Contracts', 'Error Handling', 'Events'],
      imagePath: './images/certificates/Ivan-Lieskov-Ethereum-Smart-Contract-Programming-101-Ethereum-Smart-Contract-Programming-101-Moralis-Moralis-Academy.webp'
    },
    {
      id: 7,
      date: 'April 22, 2022',
      title: 'Ethereum DAPP Programming',
      institution: 'Moralis Academy',
      description: 'Comprehensive training on Ethereum DApp development using Truffle, Ganache, NFT marketplace development, token creation, frontend development, Metamask integration, and Web3.js.',
      skills: ['Truffle', 'Ganache', 'NFT Marketplace', 'Web3.js', 'MetaMask'],
      imagePath: './images/certificates/Ivan-Lieskov-Build-an-NFT-Marketplace-Ethereum-Dapp-Programming-Moralis-Moralis-Academy.webp'
    },
    {
      id: 8,
      date: 'January - April 2022',
      title: 'Blockchain Developer Bootcamp',
      institution: 'Dapp University',
      certificateId: 'cert_fsjxv9bl',
      description: 'Intensive 3-month bootcamp started at the beginning of 2022, covering blockchain fundamentals, smart contract development, decentralized application architecture, and deployment.',
      skills: ['Blockchain', 'Smart Contracts', 'DApp Development', 'Solidity'],
      imagePath: './images/certificates/certificate-of-completion-for-blockchain-developer-bootcamp.webp'
    },
    {
      id: 9,
      date: 'April 11, 2022',
      title: 'Ethereum 101',
      institution: 'Moralis Academy',
      description: 'Introduction to Ethereum Virtual Machine (EVM), Ethereum basics, token standards, account model, decentralized applications, and smart contract fundamentals.',
      skills: ['Ethereum', 'EVM', 'Token Standards', 'Smart Contracts'],
      imagePath: './images/certificates/Ivan-Lieskov-Ethereum-101-Ethereum-101-Moralis-Moralis-Academy.webp'
    },
  ];
  
  // Add function to handle certificate click
  const handleCertificateClick = (imagePath: string | null) => {
    if (imagePath) {
      setSelectedCertificate(imagePath);
      setIsLoading(true);
      // Disable scrolling on body when modal is open
      document.body.style.overflow = 'hidden';
    }
  };
  
  // Add function to close modal
  const handleCloseModal = () => {
    setSelectedCertificate(null);
    setImageZoom(1); // Reset zoom when closing
    // Re-enable scrolling
    document.body.style.overflow = 'auto';
  };
  
  // Handle image load with proper sizing
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    const { naturalWidth, naturalHeight } = target;
    
    // Calculate and set aspect ratio based on natural dimensions
    setImageRatio({ 
      width: naturalWidth, 
      height: naturalHeight 
    });
    
    setIsLoading(false);
  };
  
  // Toggle zoom on image click
  const handleImageClick = () => {
    setImageZoom(imageZoom === 1 ? 1.5 : 1);
  };
  
  const openProofModal = (proof: any) => {
    setSelectedProof(proof);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };
  
  const closeProofModal = () => {
    setSelectedProof(null);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };
  
  const nextImage = () => {
    if (selectedProof && selectedProof.images) {
      setCurrentImageIndex((prev) => 
        prev < selectedProof.images.length - 1 ? prev + 1 : 0
      );
    }
  };
  
  const prevImage = () => {
    if (selectedProof && selectedProof.images) {
      setCurrentImageIndex((prev) => 
        prev > 0 ? prev - 1 : selectedProof.images.length - 1
      );
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  return (
    <>
      <ExperienceContainer id="experience" ref={ref}>
        <ContentWrapper className="content-section-enhanced">
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            variants={{
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.8 }}
            className="cyberpunk-section-title cyberpunk-title-md"
            data-text="Execute.Career_Protocols"
            data-mobile-text="Career"
          >
            Execute.Career_Protocols
          </SectionTitle>
          
          <TabsContainer
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            variants={{
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {tabs.map(tab => (
              <Tab
                key={tab.id}
                $isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="neotech-button"
              >
                <span className="full-name">{tab.name}</span>
                <span className="short-name">{tab.shortName}</span>
              </Tab>
            ))}
          </TabsContainer>
          
          <TimelinesContainer>
            <Timeline 
              isVisible={activeTab === 'work'}
              variants={containerVariants}
              initial="hidden"
              animate={activeTab === 'work' ? 'visible' : 'hidden'}
            >
              {experiences.map((experience, index) => (
                <TimelineItem key={index} variants={itemVariants}>
                  <TimelineDate>{experience.period}</TimelineDate>
                  <TimelineDot />
                  <TimelineContent className="neotech-border">
                    <TimelineTitle>{experience.title}</TimelineTitle>
                    <TimelineSubtitle>
                      <span>{experience.company}</span>
                    </TimelineSubtitle>
                    <TimelineDescription>{parseTextWithBookLinks(experience.description)}</TimelineDescription>
                    
                    <AchievementsList>
                      {experience.achievements.map((achievement: string) => (
                        <AchievementItem key={achievement}>
                          {achievement}
                        </AchievementItem>
                      ))}
                    </AchievementsList>
                    
                    {experience.proof && (
                      <ButtonsContainer>
                        <ProofButton 
                          whileHover={{ scale: 1.03 }} 
                          whileTap={{ scale: 0.98 }}
                          onClick={() => openProofModal(experience.proof)}
                          onMouseEnter={() => handleProofButtonHover(experience.proof)}
                        >
                          <FaFileAlt /> View Proof
                        </ProofButton>
                        
                        {experience.company === "Various Projects" && (
                          <SideProjectsButton
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveTab('side')}
                          >
                            Side Projects
                          </SideProjectsButton>
                        )}
                      </ButtonsContainer>
                    )}
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
            
            <Timeline 
              isVisible={activeTab === 'side'}
              variants={containerVariants}
              initial="hidden"
              animate={activeTab === 'side' ? 'visible' : 'hidden'}
            >
              {additionalExperiences.map((experience, index) => (
                <TimelineItem key={index} variants={itemVariants}>
                  <TimelineDate>{experience.period}</TimelineDate>
                  <TimelineDot />
                  <TimelineContent className="neotech-border">
                    <TimelineTitle>{experience.title}</TimelineTitle>
                    <TimelineSubtitle>
                      <span>{experience.company}</span>
                    </TimelineSubtitle>
                    <TimelineDescription>{parseTextWithBookLinks(experience.description)}</TimelineDescription>
                    
                    <AchievementsList>
                      {experience.achievements.map((achievement: string) => (
                        <AchievementItem key={achievement}>
                          {achievement}
                        </AchievementItem>
                      ))}
                    </AchievementsList>
                    
                    {experience.proof && (
                      <ButtonsContainer>
                        <ProofButton 
                          whileHover={{ scale: 1.03 }} 
                          whileTap={{ scale: 0.98 }}
                          onClick={() => openProofModal(experience.proof)}
                          onMouseEnter={() => handleProofButtonHover(experience.proof)}
                        >
                          <FaFileAlt /> View Proof
                        </ProofButton>
                        
                        {experience.company === "Various Projects" && (
                          <SideProjectsButton
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveTab('side')}
                          >
                            Side Projects
                          </SideProjectsButton>
                        )}
                      </ButtonsContainer>
                    )}
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
            
            <Timeline 
              isVisible={activeTab === 'education'}
              variants={containerVariants}
              initial="hidden"
              animate={activeTab === 'education' ? 'visible' : 'hidden'}
            >
              {certifications.map((certificate) => (
                <TimelineItem key={certificate.id} variants={itemVariants}>
                  <TimelineDate>{certificate.date}</TimelineDate>
                  <TimelineDot />
                  <CertificateContent className="neotech-border">
                    <CertificateImageContainer 
                      onClick={() => handleCertificateClick(certificate.imagePath)}
                    >
                      {certificate.imagePath ? (
                        <CertificateImage 
                          style={{ backgroundImage: `url(${certificate.imagePath})` }} 
                        />
                      ) : (
                        <CertificatePlaceholder>
                          <PdfIcon style={{ opacity: 0.5 }} />
                          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>No certificate</span>
                        </CertificatePlaceholder>
                      )}
                    </CertificateImageContainer>
                    
                    <CertificateDetails>
                      <TimelineTitle>{certificate.title}</TimelineTitle>
                      <TimelineSubtitle>
                        <span>{certificate.institution}</span>
                      </TimelineSubtitle>
                      {certificate.certificateId && (
                        <CertificateId>ID: {certificate.certificateId}</CertificateId>
                      )}
                      <TimelineDescription>{parseTextWithBookLinks(certificate.description)}</TimelineDescription>
                      
                      <SkillsList>
                        {certificate.skills.map((skill, i) => (
                          <SkillItem key={i} className="neotech-text">{skill}</SkillItem>
                        ))}
                      </SkillsList>
                      
                      {certificate.verifyUrl && (
                        <VerifyButton 
                          as="a" 
                          href={certificate.verifyUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Verify Certificate <FaExternalLinkAlt size={12} />
                        </VerifyButton>
                      )}
                    </CertificateDetails>
                  </CertificateContent>
                </TimelineItem>
              ))}
            </Timeline>
          </TimelinesContainer>
        </ContentWrapper>
      </ExperienceContainer>
      
      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedCertificate && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                aspectRatio: `${imageRatio.width}/${imageRatio.height}`,
                height: 'auto' // Let height be determined by aspect ratio
              }}
            >
              <CloseButton onClick={handleCloseModal} aria-label="Close certificate preview">
                <FaTimes />
              </CloseButton>
              
              <CertificateImageView>
                {!isLoading && (
                  <FaSearch 
                    style={{ 
                      position: 'absolute', 
                      bottom: '1rem', 
                      right: '1rem', 
                      color: 'white', 
                      background: 'rgba(0,0,0,0.5)', 
                      padding: '8px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      zIndex: 5
                    }} 
                    onClick={handleImageClick}
                  />
                )}
                
                <ZoomableImage 
                  src={selectedCertificate}
                  alt="Certificate"
                  style={{ transform: `scale(${imageZoom})` }}
                  onClick={handleImageClick}
                  onLoad={handleImageLoad}
                />
              </CertificateImageView>
              
              {isLoading && (
                <LoadingIndicator>
                  <PdfIcon />
                  <p>Loading certificate...</p>
                </LoadingIndicator>
              )}
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
      
      {/* Proof Modal */}
      <AnimatePresence>
        {selectedProof && (
          <ProofModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeProofModal}
          >
            <ProofContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <CloseButton onClick={closeProofModal} aria-label="Close proof">
                <FaTimes />
              </CloseButton>
              
              {/* Header Section */}
              <ProofHeader>
                {selectedProof.title && (
                  <ProofTitle>{selectedProof.title}</ProofTitle>
                )}
              </ProofHeader>
              
              {/* Main Content Section */}
              <ProofMainContent>
              
              {selectedProof.description && (
                <>
                  {/* Desktop description */}
                  <ProofDescription className="desktop-only">
                    {selectedProof.description}
                  </ProofDescription>
                  
                  {/* Mobile scrollable description */}
                  <MobileDescriptionContainer>
                    <MobileDescriptionText>
                      {selectedProof.description}
                    </MobileDescriptionText>
                  </MobileDescriptionContainer>
                </>
              )}
              
              {selectedProof.images && selectedProof.images.length > 0 && (
                <>
                  {/* Desktop image grid */}
                  <ProofImageGrid className="desktop-only">
                    {selectedProof.images.map((image: string, index: number) => {
                      const formattedSrc = image.startsWith('/images/') ? `.${image}` : image;
                      const isPreloaded = preloadedImages.has(formattedSrc) || 
                                         (imagesStatus[formattedSrc] === 'loaded');
                      
                      return (
                        <ProofImageWrapper key={index}>
                          {!isPreloaded && (
                            <ImageLoadingIndicator>
                              <FaSearch />
                            </ImageLoadingIndicator>
                          )}
                          <ProofImage 
                            src={formattedSrc} 
                            alt={`Proof ${index + 1}`} 
                            loading="eager"
                            decoding="async"
                            className={isPreloaded ? 'loaded' : ''}
                            onLoad={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.classList.add('loaded');
                              if (!preloadedImages.has(formattedSrc)) {
                                setPreloadedImages(prev => new Set([...prev, formattedSrc]));
                              }
                            }}
                          />
                        </ProofImageWrapper>
                      );
                    })}
                  </ProofImageGrid>
                  
                  {/* Mobile single image with navigation */}
                  <MobileImageContainer>
                    <MobileImageDisplay>
                      <MobileProofImage 
                        src={selectedProof.images[currentImageIndex]?.startsWith('/images/') 
                          ? `.${selectedProof.images[currentImageIndex]}` 
                          : selectedProof.images[currentImageIndex]
                        }
                        alt={`Proof ${currentImageIndex + 1}`}
                      />
                    </MobileImageDisplay>
                    
                    {selectedProof.images.length > 1 && (
                      <ImageNavigation>
                        <ImageNavButton 
                          onClick={prevImage}
                          disabled={selectedProof.images.length <= 1}
                        >
                          ← Prev
                        </ImageNavButton>
                        
                        <ImageCounter>
                          {currentImageIndex + 1} / {selectedProof.images.length}
                        </ImageCounter>
                        
                        <ImageNavButton 
                          onClick={nextImage}
                          disabled={selectedProof.images.length <= 1}
                        >
                          Next →
                        </ImageNavButton>
                      </ImageNavigation>
                    )}
                  </MobileImageContainer>
                </>
              )}
              </ProofMainContent>
              
              {/* Footer Section */}
              {selectedProof.links && selectedProof.links.length > 0 && (
                <ProofFooter>
                  <ProofLinks>
                    {selectedProof.links.map((link: any, index: number) => (
                      <ProofLink 
                        key={index} 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {link.title} <FaExternalLinkAlt size={12} />
                      </ProofLink>
                    ))}
                  </ProofLinks>
                </ProofFooter>
              )}
            </ProofContent>
          </ProofModal>
        )}
      </AnimatePresence>
    </>
  );
} 