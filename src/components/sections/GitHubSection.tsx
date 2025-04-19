'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaCodeBranch } from 'react-icons/fa';

// Types for GitHub data
interface Repository {
  name: string;
  description: string;
  url: string;
  language: string;
  stars: number;
  forks: number;
}

interface GitHubContribution {
  date: string;
  count: number;
  color: string;
}

interface GitHubData {
  profile: {
    login: string;
    avatarUrl: string;
    name: string;
    bio: string;
    followers: number;
    following: number;
    publicRepos: number;
  };
  contributions: GitHubContribution[];
  topRepositories: Repository[];
  totalContributions: number;
}

// Styled components
const Section = styled.section`
  padding: 4rem 0;
  background-color: #090a1a;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0, 255, 163, 0.5), rgba(0, 224, 255, 0.8), rgba(0, 255, 163, 0.5), transparent);
    z-index: 1;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  font-weight: 800;
  text-transform: uppercase;
  color: white;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -0.5rem;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #00e0ff, #00ffa3);
  }
`;

const GitHubContent = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;
  
  @media (min-width: 768px) {
    grid-template-columns: 300px 1fr;
  }
`;

const ProfileCard = styled.div`
  background: rgba(15, 15, 35, 0.7);
  border: 1px solid rgba(0, 224, 255, 0.3);
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 0 15px rgba(0, 255, 163, 0.2);
  backdrop-filter: blur(10px);
  
  &:hover {
    box-shadow: 0 0 25px rgba(0, 224, 255, 0.4);
  }
`;

const Avatar = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 1rem;
  border: 2px solid rgba(0, 255, 163, 0.5);
  box-shadow: 0 0 15px rgba(0, 224, 255, 0.5);
`;

const Username = styled.h3`
  font-size: 1.4rem;
  color: white;
  margin-bottom: 0.5rem;
`;

const Bio = styled.p`
  font-size: 0.9rem;
  color: #ccd;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  text-align: center;
  border-top: 1px solid rgba(0, 224, 255, 0.3);
  padding-top: 1rem;
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatNumber = styled.span`
  font-size: 1.2rem;
  font-weight: 700;
  color: #00ffa3;
`;

const StatLabel = styled.span`
  font-size: 0.8rem;
  color: #aab;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ContributionCalendar = styled.div`
  background: rgba(15, 15, 35, 0.7);
  border: 1px solid rgba(0, 224, 255, 0.3);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 0 15px rgba(0, 255, 163, 0.2);
  backdrop-filter: blur(10px);
  
  @media (max-width: 767px) {
    display: none;
  }
`;

const CalendarTitle = styled.h3`
  font-size: 1.2rem;
  color: white;
  margin-bottom: 1rem;
  font-family: 'Courier New', monospace;
  position: relative;
  
  &::before {
    content: '>';
    color: #00e0ff;
    margin-right: 0.5rem;
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(52, 1fr);
  grid-auto-rows: 14px;
  gap: 2px;
  margin-top: 0;
`;

const CalendarDay = styled.div<{ color: string }>`
  width: 14px;
  height: 14px;
  border-radius: 2px;
  background-color: ${props => props.color};
  position: relative;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  
  &:hover {
    transform: scale(1.2);
    box-shadow: 0 0 5px rgba(0, 255, 163, 0.5);
    z-index: 10;
  }

  &::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    padding: 6px 10px;
    background: rgba(15, 15, 35, 0.95);
    color: white;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease;
    border: 1px solid rgba(0, 224, 255, 0.5);
    box-shadow: 0 0 10px rgba(0, 255, 163, 0.3);
    pointer-events: none;
    z-index: 100;
  }

  &:hover::after {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(-5px);
  }
`;

const MonthsLabels = styled.div`
  display: grid;
  grid-template-columns: repeat(52, 1fr);
  margin-bottom: 0;
  font-size: 9px;
  color: rgba(255, 255, 255, 0.6);
  margin-left: 24px;
`;

const MonthLabel = styled.span`
  grid-column: ${props => props.style?.gridColumn};
  text-align: center;
`;

const RepositoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  width: 100%;
  
  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
`;

const RepositoryCard = styled(motion.div)`
  background: rgba(15, 15, 35, 0.7);
  border: 1px solid rgba(0, 224, 255, 0.3);
  border-radius: 8px;
  padding: 1.5rem;
  flex: 0 0 350px;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 10px rgba(0, 255, 163, 0.1);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  /* Replace the left vertical line with a border gradient */
  border-left: 3px solid transparent;
  background-image: linear-gradient(rgba(15, 15, 35, 0.7), rgba(15, 15, 35, 0.7)), 
                    linear-gradient(to bottom, #00e0ff, #00ffa3);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 20px rgba(0, 224, 255, 0.3);
    border-color: rgba(0, 255, 163, 0.5);
    border-left: 3px solid transparent;
    
    /* Add subtle inner glow on hover */
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, 
        rgba(0, 224, 255, 0.05) 0%, 
        rgba(0, 255, 163, 0.08) 100%
      );
      pointer-events: none;
      opacity: 1;
    }
  }
  
  /* Add subtle inner glow effect for hover */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, 
      rgba(0, 224, 255, 0.02) 0%, 
      rgba(0, 255, 163, 0.04) 100%
    );
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
`;

const RepoName = styled.h4`
  font-size: 1.1rem;
  color: white;
  margin-bottom: 0.5rem;
  font-weight: 600;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #00e0ff, #00ffa3);
    transition: width 0.3s ease;
  }
  
  ${RepositoryCard}:hover & {
    color: #00ffa3;
    
    &::after {
      width: 100%;
    }
  }
`;

const RepoDescription = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
  flex-grow: 1;
  line-height: 1.5;
`;

const RepoFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const RepoLanguage = styled.span`
  font-size: 0.8rem;
  color: #aab;
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 5px;
    background-color: ${props => {
      switch (props.children) {
        case 'JavaScript':
          return '#f1e05a';
        case 'TypeScript':
          return '#3178c6';
        case 'Python':
          return '#3572A5';
        case 'HTML':
          return '#e34c26';
        case 'CSS':
          return '#563d7c';
        case 'Java':
          return '#b07219';
        default:
          return '#8257e5';
      }
    }};
  }
`;

const RepoStats = styled.div`
  display: flex;
  gap: 1rem;
`;

const RepoStat = styled.span`
  font-size: 0.8rem;
  color: #aab;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const LoadingOverlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 224, 255, 0.3);
  border-top: 4px solid #00ffa3;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #aab;
  font-size: 1rem;
`;

const ErrorMessage = styled.div`
  background: rgba(255, 50, 50, 0.1);
  border: 1px solid rgba(255, 50, 50, 0.3);
  border-radius: 8px;
  padding: 1.2rem;
  color: #f66;
  text-align: center;
  margin-top: 2rem;
`;

const ContributionStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const TotalContributions = styled.div`
  display: flex;
  align-items: center;
  background: rgba(0, 255, 163, 0.1);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  box-shadow: 0 0 10px rgba(0, 224, 255, 0.2);
`;

const ContributionCount = styled.span`
  font-size: 1.2rem;
  font-weight: 700;
  color: #00ffa3;
  margin-right: 0.5rem;
`;

const ContributionLabel = styled.span`
  font-size: 0.9rem;
  color: #aab;
`;

// Improve the day labels styling
const DayLabels = styled.div`
  display: grid;
  grid-template-rows: repeat(7, 14px);
  gap: 2px;
  margin-right: 8px;
  align-items: center;
  padding-top: 0; // Remove padding at the top
`;

const DayLabel = styled.span`
  font-size: 9px;
  color: rgba(255, 255, 255, 0.6);
  text-align: right;
  height: 14px;
  line-height: 14px;
  vertical-align: middle;
`;

// Update the calendar container to include day labels in a flex layout
const CalendarContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 0;
  width: 100%;
`;

// Update the repository section title
const RepositoriesTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ViewAllLink = styled.a`
  font-size: 0.9rem;
  color: #00ffa3;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s ease;
  font-family: 'Courier New', monospace;
  
  &:hover {
    text-shadow: 0 0 8px rgba(0, 255, 163, 0.7);
  }
`;

// Update RepositoriesContainer to include pagination
const RepositoriesContainer = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

// Create pagination controls
const PaginationControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const PageButton = styled.button<{ active?: boolean }>`
  background: ${props => props.active ? 'rgba(0, 224, 255, 0.3)' : 'rgba(15, 15, 35, 0.5)'};
  color: white;
  border: 1px solid ${props => props.active ? 'rgba(0, 255, 163, 0.8)' : 'rgba(0, 224, 255, 0.3)'};
  border-radius: 5px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: rgba(0, 224, 255, 0.2);
    box-shadow: 0 0 10px rgba(0, 255, 163, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Add new styled components for the section header
const SectionHeader = styled.div`
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
`;

const SectionPrefix = styled.span`
  font-size: 1rem;
  color: #00e0ff;
  font-family: 'Courier New', monospace;
  margin-bottom: 0.5rem;
`;

// Add a new component for mobile display of contributions
const MobileContributionSummary = styled.div`
  display: flex;
  flex-direction: column;
  background: rgba(15, 15, 35, 0.7);
  border: 1px solid rgba(0, 224, 255, 0.3);
  border-radius: 8px;
  padding: 1.5rem;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 0 15px rgba(0, 255, 163, 0.2);
  backdrop-filter: blur(10px);
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const LastFiveContributions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ContributionItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  border-radius: 4px;
  background: rgba(15, 15, 35, 0.5);
  
  &:nth-child(odd) {
    background: rgba(0, 224, 255, 0.1);
  }
`;

const ContributionDate = styled.span`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
`;

const ContributionValue = styled.span`
  font-size: 0.8rem;
  color: #00ffa3;
  font-weight: 600;
`;

const GitHubSection: React.FC = () => {
  const [githubData, setGithubData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);
  const reposPerPage = 6;
  
  useEffect(() => {
    const fetchGithubData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/github');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch GitHub data');
        }
        
        const data = await response.json();
        setGithubData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching GitHub data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGithubData();
  }, []);

  // Track window resize for responsive pagination
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Card animation for repositories
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut'
      }
    })
  };

  if (loading) {
    return (
      <Section id="github">
        <Container>
          <SectionHeader>
            <SectionPrefix>Connect.GitHub_Protocol</SectionPrefix>
            <SectionTitle>CODE REPOSITORY</SectionTitle>
          </SectionHeader>
          <LoadingOverlay>
            <Spinner />
            <LoadingText>Loading GitHub data...</LoadingText>
          </LoadingOverlay>
        </Container>
      </Section>
    );
  }

  if (error || !githubData) {
    return (
      <Section id="github">
        <Container>
          <SectionHeader>
            <SectionPrefix>Connect.GitHub_Protocol</SectionPrefix>
            <SectionTitle>CODE REPOSITORY</SectionTitle>
          </SectionHeader>
          <ErrorMessage>
            {error || 'Failed to load GitHub data'}
          </ErrorMessage>
        </Container>
      </Section>
    );
  }

  const { profile, topRepositories } = githubData;

  // Sort repositories by description length (most detailed first)
  const sortedRepositories = [...topRepositories].sort((a, b) => {
    const descA = a.description || '';
    const descB = b.description || '';
    return descB.length - descA.length;
  });

  // Calculate pagination values
  const paginatedRepositories = sortedRepositories.slice(
    currentPage * reposPerPage, 
    currentPage * reposPerPage + reposPerPage
  );
  
  const pageCount = Math.ceil(sortedRepositories.length / reposPerPage);

  // Navigation functions
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < pageCount - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Function to format date for tooltip
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      weekday: 'short'
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Get month markers for calendar labels
  const getMonthLabels = (contributions: GitHubContribution[]) => {
    const months: {name: string, column: number}[] = [];
    let lastMonth = -1;
    
    contributions.forEach((day, index) => {
      const date = new Date(day.date);
      const month = date.getMonth();
      const weekIndex = Math.floor(index / 7);
      
      if (month !== lastMonth) {
        months.push({
          name: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date),
          column: weekIndex + 1
        });
        lastMonth = month;
      }
    });
    
    return months;
  };

  return (
    <Section id="github">
      <Container>
        <SectionHeader>
          <SectionPrefix>Connect.GitHub_Protocol</SectionPrefix>
          <SectionTitle>CODE REPOSITORY</SectionTitle>
        </SectionHeader>
        
        <GitHubContent>
          <ProfileCard>
            <Avatar>
              <Image
                src={profile.avatarUrl}
                alt={profile.login}
                fill
                style={{ objectFit: 'cover' }}
              />
            </Avatar>
            <Username>{profile.name}</Username>
            <Bio>{profile.bio}</Bio>
            
            <Stats>
              <Stat>
                <StatNumber>{profile.followers}</StatNumber>
                <StatLabel>Followers</StatLabel>
              </Stat>
              <Stat>
                <StatNumber>{profile.following}</StatNumber>
                <StatLabel>Following</StatLabel>
              </Stat>
              <Stat>
                <StatNumber>{profile.publicRepos}</StatNumber>
                <StatLabel>Repos</StatLabel>
              </Stat>
            </Stats>
          </ProfileCard>
          
          {/* Mobile only contribution summary */}
          <MobileContributionSummary>
            <CalendarTitle>Contribution_Activity</CalendarTitle>
            <TotalContributions>
              <ContributionCount>{githubData.totalContributions}</ContributionCount>
              <ContributionLabel>contributions in the last year</ContributionLabel>
            </TotalContributions>
            
            <LastFiveContributions>
              <h4 style={{ color: 'white', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Recent Activity:</h4>
              {githubData.contributions.slice(-5).reverse().map((day, idx) => (
                <ContributionItem key={idx}>
                  <ContributionDate>{formatDate(day.date)}</ContributionDate>
                  <ContributionValue>{day.count} contribution{day.count !== 1 ? 's' : ''}</ContributionValue>
                </ContributionItem>
              ))}
            </LastFiveContributions>
          </MobileContributionSummary>
          
          <RightSection>
            <ContributionCalendar>
              <CalendarTitle>Contribution_Activity</CalendarTitle>
              <ContributionStats>
                <TotalContributions>
                  <ContributionCount>{githubData.totalContributions}</ContributionCount>
                  <ContributionLabel>contributions in the last year</ContributionLabel>
                </TotalContributions>
              </ContributionStats>
              
              {/* Month labels */}
              <MonthsLabels>
                {getMonthLabels(githubData.contributions).map((month, idx) => (
                  <MonthLabel key={`${month.name}-${idx}`} style={{ gridColumn: month.column }}>
                    {month.name}
                  </MonthLabel>
                ))}
              </MonthsLabels>
              
              {/* Calendar with day labels */}
              <CalendarContainer>
                <DayLabels>
                  <DayLabel style={{ gridRow: 3 }}>Mon</DayLabel>
                  <DayLabel style={{ gridRow: 5 }}>Wed</DayLabel>
                  <DayLabel style={{ gridRow: 7 }}>Fri</DayLabel>
                </DayLabels>
                
                <CalendarGrid>
                  {githubData.contributions.map((day, index) => (
                    <CalendarDay 
                      key={`${day.date}-${index}`} 
                      color={day.color} 
                      data-tooltip={`${formatDate(day.date)}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`}
                      style={{
                        gridColumn: Math.floor(index / 7) + 1,
                        gridRow: (index % 7) + 1
                      }}
                    />
                  ))}
                </CalendarGrid>
              </CalendarContainer>
            </ContributionCalendar>
            
            <div>
              <RepositoriesTitle>
                <CalendarTitle>Top_Repositories</CalendarTitle>
                <ViewAllLink href={`https://github.com/${profile.login}?tab=repositories`} target="_blank" rel="noopener noreferrer">
                  View all <span>→</span>
                </ViewAllLink>
              </RepositoriesTitle>
              
              <RepositoriesContainer>
                <RepositoriesGrid>
                  {paginatedRepositories.map((repo, index) => (
                    <RepositoryCard
                      key={repo.name}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      variants={cardVariants}
                    >
                      <Link href={repo.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <RepoName>{repo.name}</RepoName>
                      </Link>
                      <RepoDescription>
                        {repo.description || 'No description available'}
                      </RepoDescription>
                      <RepoFooter>
                        <RepoLanguage>{repo.language}</RepoLanguage>
                        <RepoStats>
                          <RepoStat>
                            <FaStar />
                            {repo.stars}
                          </RepoStat>
                          <RepoStat>
                            <FaCodeBranch />
                            {repo.forks}
                          </RepoStat>
                        </RepoStats>
                      </RepoFooter>
                    </RepositoryCard>
                  ))}
                </RepositoriesGrid>
                
                {pageCount > 1 && (
                  <PaginationControls>
                    <PageButton 
                      onClick={handlePrev} 
                      disabled={currentPage === 0}
                    >
                      ← Prev
                    </PageButton>
                    
                    {Array.from({ length: pageCount })
                      .map((_, index) => {
                        // For mobile, only show current page
                        // For desktop, show a few pages around current
                        const shouldShow = windowWidth >= 768 || index === currentPage;
                        return shouldShow ? (
                          <PageButton
                            key={index}
                            active={currentPage === index}
                            onClick={() => goToPage(index)}
                          >
                            {index + 1}
                          </PageButton>
                        ) : null;
                      })
                      .filter(Boolean)
                      .slice(0, windowWidth < 768 ? 1 : 5)}
                    
                    <PageButton 
                      onClick={handleNext} 
                      disabled={currentPage >= pageCount - 1}
                    >
                      Next →
                    </PageButton>
                  </PaginationControls>
                )}
              </RepositoriesContainer>
            </div>
          </RightSection>
        </GitHubContent>
      </Container>
    </Section>
  );
};

export default GitHubSection; 