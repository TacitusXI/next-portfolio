'use client';

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { personalInfo, githubInfo } from '@/data/content';

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

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
          <BottomLink href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</BottomLink>
          <BottomLink href="#" onClick={(e) => e.preventDefault()}>Terms of Service</BottomLink>
          <BottomLink href="#" onClick={(e) => e.preventDefault()}>Cookie Policy</BottomLink>
        </BottomLinks>
      </BottomBar>
      
      <BackToTop onClick={scrollToTop}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </BackToTop>
    </FooterContainer>
  );
} 