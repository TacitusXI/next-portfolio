'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { personalInfo, githubInfo } from '@/data/content';
import { motion } from 'framer-motion';

const FooterContainer = styled.footer`
  background: rgba(10, 10, 15, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding: 3rem 2rem 2rem;
  position: relative;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #3a86ff, #00c6ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Description = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const SocialContainer = styled.div`
  display: flex;
  gap: 0.8rem;
`;

const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(58, 134, 255, 0.2);
    color: #3a86ff;
    transform: translateY(-3px);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const SectionTitle = styled.h3`
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -0.5rem;
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, #3a86ff, transparent);
  }
`;

const LinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const FooterLink = styled.a`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #3a86ff;
    transform: translateX(3px);
  }
  
  svg {
    width: 14px;
    height: 14px;
    margin-right: 0.5rem;
    opacity: 0.5;
  }
`;

const NextLink = styled(Link)`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  text-decoration: none;
  
  &:hover {
    color: #3a86ff;
    transform: translateX(3px);
  }
  
  svg {
    width: 14px;
    height: 14px;
    margin-right: 0.5rem;
    opacity: 0.5;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  
  svg {
    width: 18px;
    height: 18px;
    margin-right: 0.8rem;
    color: rgba(58, 134, 255, 0.7);
  }
`;

const BottomBar = styled.div`
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
`;

const Copyright = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
`;

const BottomLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const BottomLink = styled.a`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
  transition: color 0.2s ease;
  
  &:hover {
    color: #3a86ff;
  }
`;

const BackToTop = styled.button`
  position: absolute;
  right: 2rem;
  bottom: 6rem;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: rgba(58, 134, 255, 0.15);
  border: 1px solid rgba(58, 134, 255, 0.3);
  color: #3a86ff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(58, 134, 255, 0.25);
    transform: translateY(-5px);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  @media (max-width: 768px) {
    right: 1rem;
    bottom: 5rem;
  }
`;

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
  width: 85%;
  max-width: 800px;
  max-height: 90vh;
  background: rgba(15, 15, 25, 0.95);
  border-radius: 12px;
  overflow: auto;
  position: relative;
  border: 1px solid rgba(58, 134, 255, 0.3);
  box-shadow: 0 0 30px rgba(58, 134, 255, 0.2);
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    width: 95%;
  }
`;

const PolicyTitle = styled.h2`
  font-size: 1.8rem;
  color: white;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(58, 134, 255, 0.3);
  padding-bottom: 0.75rem;
`;

const PolicyContent = styled.div`
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
  line-height: 1.7;
  
  h3 {
    font-size: 1.3rem;
    color: white;
    margin: 1.5rem 0 0.75rem;
  }
  
  p {
    margin-bottom: 1rem;
  }
  
  ul {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
  
  a {
    color: #3a86ff;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(15, 15, 25, 0.8);
  border: 1px solid rgba(58, 134, 255, 0.3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  
  &:hover {
    background: rgba(58, 134, 255, 0.2);
    transform: scale(1.1);
  }
`;

export default function Footer() {
  const [activePolicy, setActivePolicy] = useState<string | null>(null);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  const openPolicyModal = (policy: string) => {
    setActivePolicy(policy);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };
  
  const closePolicyModal = () => {
    setActivePolicy(null);
    document.body.style.overflow = 'unset';
  };
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <Logo>Ivan Leskov</Logo>
          <Description>
            {personalInfo.summary}
          </Description>
          <SocialContainer>
            <SocialLink href={githubInfo.profileUrl} target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </SocialLink>
            <SocialLink href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </SocialLink>
            <SocialLink href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </SocialLink>
          </SocialContainer>
        </FooterSection>
        
        <FooterSection>
          <SectionTitle>Quick Links</SectionTitle>
          <LinksContainer>
            <NextLink href="/">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Home
            </NextLink>
            <NextLink href="#projects">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Projects
            </NextLink>
            <NextLink href="#skills">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Skills
            </NextLink>
            <NextLink href="#publications">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Publications
            </NextLink>
            <NextLink href="#contact">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Contact
            </NextLink>
          </LinksContainer>
        </FooterSection>
        
        <FooterSection>
          <SectionTitle>Services</SectionTitle>
          <LinksContainer>
            <FooterLink href="#projects">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Blockchain Development
            </FooterLink>
            <FooterLink href="#projects">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Smart Contract Development
            </FooterLink>
            <FooterLink href="#projects">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              DeFi Protocol Development
            </FooterLink>
            <FooterLink href="#projects">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              NFT Marketplace Development
            </FooterLink>
            <FooterLink href="#projects">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Blockchain Consulting
            </FooterLink>
          </LinksContainer>
        </FooterSection>
        
        <FooterSection>
          <SectionTitle>Contact</SectionTitle>
          <ContactInfo>
            <ContactItem>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {personalInfo.email}
            </ContactItem>
            <ContactItem>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Available via Email
            </ContactItem>
            <ContactItem>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {personalInfo.location}
            </ContactItem>
          </ContactInfo>
        </FooterSection>
      </FooterContent>
      
      <BottomBar>
        <Copyright>© {new Date().getFullYear()} Ivan Leskov. All rights reserved.</Copyright>
        <BottomLinks>
          <BottomLink 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              openPolicyModal('privacy');
            }}
          >
            Privacy Policy
          </BottomLink>
          <BottomLink 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              openPolicyModal('terms');
            }}
          >
            Terms of Service
          </BottomLink>
          <BottomLink 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              openPolicyModal('cookie');
            }}
          >
            Cookie Policy
          </BottomLink>
        </BottomLinks>
      </BottomBar>
      
      <BackToTop onClick={scrollToTop}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </BackToTop>
      
      {/* Policy Modals */}
      {activePolicy === 'privacy' && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closePolicyModal}
        >
          <ModalContent
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <CloseButton onClick={closePolicyModal} aria-label="Close policy">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </CloseButton>
            <PolicyTitle>Privacy Policy</PolicyTitle>
            <PolicyContent>
              <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              
              <h3>Introduction</h3>
              <p>Welcome to Tacitvs's digital hub. I respect your privacy and am committed to protecting your personal data. This privacy policy explains how I collect, use, and safeguard your information when you visit my website.</p>
              
              <h3>Information I Collect</h3>
              <p>When you visit my website, I may collect the following information:</p>
              <ul>
                <li>Usage data including IP address, browser type, pages visited, time and date of visit</li>
                <li>Contact information you provide when using the contact form (name, email, message content)</li>
              </ul>
              
              <h3>How I Use Your Information</h3>
              <p>I use the information collected to:</p>
              <ul>
                <li>Respond to your inquiries and communication</li>
                <li>Improve and optimize my website</li>
                <li>Analyze usage patterns and trends</li>
              </ul>
              
              <h3>Data Security</h3>
              <p>I implement appropriate security measures to protect your personal information against unauthorized access or disclosure. However, no internet-based system can guarantee complete security.</p>
              
              <h3>Third-Party Links</h3>
              <p>My website may contain links to third-party websites. I am not responsible for the privacy practices or content of these websites.</p>
              
              <h3>Your Rights</h3>
              <p>Depending on your location, you may have rights regarding your personal data, including:</p>
              <ul>
                <li>Access to your personal data</li>
                <li>Correction of inaccurate data</li>
                <li>Deletion of your data</li>
                <li>Restriction of processing</li>
              </ul>
              
              <h3>Changes to This Policy</h3>
              <p>I may update this privacy policy from time to time. Any changes will be posted on this page.</p>
              
              <h3>Contact Information</h3>
              <p>If you have questions about this privacy policy, please contact me at {personalInfo.email}.</p>
            </PolicyContent>
          </ModalContent>
        </ModalOverlay>
      )}
      
      {activePolicy === 'terms' && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closePolicyModal}
        >
          <ModalContent
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <CloseButton onClick={closePolicyModal} aria-label="Close policy">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </CloseButton>
            <PolicyTitle>Terms of Service</PolicyTitle>
            <PolicyContent>
              <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              
              <h3>Introduction</h3>
              <p>Welcome to Tacitvs's digital hub. By accessing and using this website, you agree to be bound by these Terms of Service.</p>
              
              <h3>Intellectual Property</h3>
              <p>All content on this website, including text, graphics, logos, images, and software, is the property of Ivan Leskov and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without explicit permission.</p>
              
              <h3>User Conduct</h3>
              <p>When using this website, you agree not to:</p>
              <ul>
                <li>Use the website in any unlawful manner</li>
                <li>Attempt to gain unauthorized access to any part of the website</li>
                <li>Use automated tools or processes to access or scrape content</li>
                <li>Interfere with the proper functioning of the website</li>
              </ul>
              
              <h3>Disclaimer of Warranties</h3>
              <p>This website is provided "as is" without any warranties, expressed or implied. I do not guarantee that the website will be error-free or uninterrupted.</p>
              
              <h3>Limitation of Liability</h3>
              <p>I will not be liable for any damages arising from the use or inability to use this website, including direct, indirect, incidental, or consequential damages.</p>
              
              <h3>External Links</h3>
              <p>My website may contain links to external websites. I am not responsible for the content or practices of these websites.</p>
              
              <h3>Modifications</h3>
              <p>I reserve the right to modify these Terms of Service at any time. Continued use of the website after changes constitutes acceptance of the updated terms.</p>
              
              <h3>Governing Law</h3>
              <p>These Terms of Service shall be governed by and construed in accordance with the laws of Poland, without regard to its conflict of law principles.</p>
            </PolicyContent>
          </ModalContent>
        </ModalOverlay>
      )}
      
      {activePolicy === 'cookie' && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closePolicyModal}
        >
          <ModalContent
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <CloseButton onClick={closePolicyModal} aria-label="Close policy">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </CloseButton>
            <PolicyTitle>Cookie Policy</PolicyTitle>
            <PolicyContent>
              <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              
              <h3>What Are Cookies</h3>
              <p>Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.</p>
              
              <h3>How I Use Cookies</h3>
              <p>My website uses cookies for the following purposes:</p>
              <ul>
                <li>Essential cookies: Required for the basic functionality of the website</li>
                <li>Analytics cookies: Help me understand how visitors interact with the website</li>
                <li>Preference cookies: Allow the website to remember your preferences</li>
              </ul>
              
              <h3>Types of Cookies Used</h3>
              <h4>Essential Cookies</h4>
              <p>These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.</p>
              
              <h4>Analytics Cookies</h4>
              <p>I use analytics cookies, such as those provided by Google Analytics, to collect information about how visitors use my website. This helps me improve the website and user experience.</p>
              
              <h4>Third-Party Cookies</h4>
              <p>Some cookies may be set by third-party services used on my website, such as social media plugins or embedded content.</p>
              
              <h3>Managing Cookies</h3>
              <p>You can control and manage cookies in various ways. Most web browsers allow you to:</p>
              <ul>
                <li>View and delete cookies</li>
                <li>Block third-party cookies</li>
                <li>Block cookies from particular websites</li>
                <li>Block all cookies</li>
                <li>Delete all cookies when you close your browser</li>
              </ul>
              
              <p>Please note that blocking cookies may impact your experience on this and other websites, as certain features may not function properly.</p>
              
              <h3>Changes to This Cookie Policy</h3>
              <p>I may update this Cookie Policy from time to time. Any changes will be posted on this page.</p>
            </PolicyContent>
          </ModalContent>
        </ModalOverlay>
      )}
    </FooterContainer>
  );
} 