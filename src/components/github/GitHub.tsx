'use client';

import React, { useState, useEffect, useId } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import GitHubGalaxy from './GitHubGalaxy';
import Image from 'next/image';

// Interfaces
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
}

// Styled components
const GitHubSection = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1.5rem;
  margin: 3rem 0;
`;

const ProfileCard = styled.div`
  display: flex;
  flex-direction: column;
  background: rgba(13, 17, 23, 0.7);
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    gap: 2rem;
  }
`;

const AvatarContainer = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
  margin-bottom: 1rem;
  
  @media (min-width: 768px) {
    margin-bottom: 0;
    width: 120px;
    height: 120px;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #fff;
`;

const ProfileUsername = styled.h4`
  font-size: 1rem;
  color: #8b949e;
  margin-bottom: 1rem;
`;

const ProfileBio = styled.p`
  font-size: 0.9rem;
  color: #c9d1d9;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 0.5rem;
`;

const StatCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem;
  background: rgba(22, 27, 34, 0.7);
  border-radius: 8px;
  min-width: 80px;
`;

const StatValue = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  color: #fff;
`;

const StatLabel = styled.span`
  font-size: 0.75rem;
  color: #8b949e;
  margin-top: 0.25rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  color: #fff;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const RepositoriesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const RepoCard = styled.a`
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  background: rgba(22, 27, 34, 0.7);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-decoration: none;
  height: 100%;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(33, 38, 45, 0.7);
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  }
`;

const RepoLanguage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: #8b949e;
`;

const LanguageColor = styled.span<{ language: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => {
    const colors: Record<string, string> = {
      JavaScript: '#f1e05a',
      TypeScript: '#3178c6',
      HTML: '#e34c26',
      CSS: '#563d7c',
      Python: '#3572A5',
      Java: '#b07219',
      Go: '#00ADD8',
      Rust: '#dea584',
      'C++': '#f34b7d',
      C: '#555555',
      Ruby: '#701516',
      PHP: '#4F5D95',
      Swift: '#ffac45',
      Kotlin: '#A97BFF',
      Dart: '#00B4AB',
      Shell: '#89e051',
    };
    return colors[props.language] || '#8b949e';
  }};
`;

const RepoName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #58a6ff;
  margin-bottom: 0.75rem;
`;

const RepoDescription = styled.p`
  font-size: 0.9rem;
  color: #c9d1d9;
  line-height: 1.5;
  margin-bottom: 1rem;
  flex: 1;
`;

const RepoFooter = styled.div`
  display: flex;
  align-items: center;
  margin-top: auto;
  gap: 1rem;
`;

const RepoStats = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
`;

const RepoStat = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: #8b949e;
`;

const ErrorMessage = styled.div`
  background: rgba(248, 81, 73, 0.1);
  color: #f85149;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(248, 81, 73, 0.3);
  text-align: center;
  font-size: 0.9rem;
`;

const GalaxySection = styled.div`
  margin: 2rem 0;
  width: 100%;
`;

// Main GitHub component
const GitHub: React.FC = () => {
  const [githubData, setGithubData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const stableId = useId(); // Use a stable ID to avoid hydration mismatches

  useEffect(() => {
    const fetchGithubData = async () => {
      try {
        // For demonstration purposes, using mock data with stable IDs
        // In real app, you would fetch this from your API endpoint
        const mockData: GitHubData = {
          profile: {
            login: 'developer',
            avatarUrl: '/placeholder-avatar.png', // Use a local image to avoid image domain issues
            name: 'John Developer',
            bio: 'Full-stack developer passionate about React, TypeScript and open source projects. Building tools that make the web a better place.',
            followers: 1234,
            following: 567,
            publicRepos: 89
          },
          contributions: Array.from({ length: 365 }, (_, i) => {
            // Use a stable algorithm for generating contribution data
            const dayOfYear = i;
            const isWeekend = dayOfYear % 7 >= 5;
            const isMidMonth = (dayOfYear % 30 >= 10 && dayOfYear % 30 <= 20);
            
            // Generate a stable count based on the day characteristics
            let count = 0;
            if (isWeekend) count += 1;
            if (isMidMonth) count += 2;
            if (dayOfYear % 14 === 0) count += 4;
            
            // Generate stable color based on count
            let color = '#161b22';
            if (count > 0) {
              if (count < 3) color = '#0e4429';
              else if (count < 5) color = '#006d32';
              else if (count < 8) color = '#26a641';
              else color = '#39d353';
            }
            
            // Create a stable date
            const baseDate = new Date(2023, 0, 1); // January 1, 2023
            baseDate.setDate(baseDate.getDate() + dayOfYear);
            
            return {
              date: baseDate.toISOString().split('T')[0],
              count,
              color
            };
          }),
          topRepositories: [
            {
              name: 'next-portfolio',
              description: 'Modern portfolio website built with Next.js, TypeScript, and Three.js',
              url: 'https://github.com/developer/next-portfolio',
              language: 'TypeScript',
              stars: 142,
              forks: 23
            },
            {
              name: 'react-data-viz',
              description: 'A collection of React components for data visualization with D3.js',
              url: 'https://github.com/developer/react-data-viz',
              language: 'JavaScript',
              stars: 234,
              forks: 45
            },
            {
              name: 'ai-image-generator',
              description: 'AI-powered image generation tool built with TensorFlow.js',
              url: 'https://github.com/developer/ai-image-generator',
              language: 'TypeScript',
              stars: 98,
              forks: 12
            },
            {
              name: 'rust-web-server',
              description: 'High-performance web server implemented in Rust',
              url: 'https://github.com/developer/rust-web-server',
              language: 'Rust',
              stars: 176,
              forks: 29
            },
            {
              name: 'go-microservices',
              description: 'A template for building scalable microservices in Go',
              url: 'https://github.com/developer/go-microservices',
              language: 'Go',
              stars: 321,
              forks: 67
            },
            {
              name: 'python-ml-toolkit',
              description: 'Tools and utilities for machine learning projects in Python',
              url: 'https://github.com/developer/python-ml-toolkit',
              language: 'Python',
              stars: 287,
              forks: 53
            }
          ]
        };
        
        setGithubData(mockData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching GitHub data:', err);
        setError('Failed to load GitHub data. Please try again later.');
        setLoading(false);
      }
    };

    fetchGithubData();
  }, [stableId]); // Include stableId as a dependency to satisfy ESLint

  // Loading state
  if (loading) {
    return (
      <GitHubSection>
        <SectionTitle>GitHub Activity</SectionTitle>
        <ProfileCard>
          <Skeleton className="h-24 w-24 rounded-full" />
          <ProfileInfo>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-5 w-32 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <StatsContainer>
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-16 w-20" />
              ))}
            </StatsContainer>
          </ProfileInfo>
        </ProfileCard>
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-10 w-48 mb-4" />
        <RepositoriesGrid>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </RepositoriesGrid>
      </GitHubSection>
    );
  }

  // Error state
  if (error) {
    return (
      <GitHubSection>
        <SectionTitle>GitHub Activity</SectionTitle>
        <ErrorMessage>{error}</ErrorMessage>
      </GitHubSection>
    );
  }

  // Data loaded state
  return (
    <GitHubSection>
      <SectionTitle>GitHub Activity</SectionTitle>
      
      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ProfileCard>
          <AvatarContainer>
            <Image 
              src={githubData?.profile.avatarUrl || '/placeholder-avatar.png'}
              alt={`${githubData?.profile.name}'s profile`} 
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100px, 120px"
              priority
              unoptimized
              onError={(e) => {
                // Fallback to a placeholder on error
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-avatar.png';
              }}
            />
          </AvatarContainer>
          
          <ProfileInfo>
            <ProfileName>{githubData?.profile.name}</ProfileName>
            <ProfileUsername>@{githubData?.profile.login}</ProfileUsername>
            <ProfileBio>{githubData?.profile.bio}</ProfileBio>
            
            <StatsContainer>
              <StatCard>
                <StatValue>{githubData?.profile.publicRepos}</StatValue>
                <StatLabel>Repos</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{githubData?.profile.followers}</StatValue>
                <StatLabel>Followers</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{githubData?.profile.following}</StatValue>
                <StatLabel>Following</StatLabel>
              </StatCard>
            </StatsContainer>
          </ProfileInfo>
        </ProfileCard>
      </motion.div>
      
      {/* GitHub Galaxy Visualization */}
      <GalaxySection>
        <GitHubGalaxy contributions={githubData?.contributions || []} />
      </GalaxySection>
      
      {/* Top repositories */}
      <SectionTitle>Top Repositories</SectionTitle>
      <RepositoriesGrid>
        {githubData?.topRepositories.map((repo, index) => (
          <motion.div
            key={repo.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
          >
            <RepoCard 
              href={repo.url} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <RepoName>{repo.name}</RepoName>
              <RepoDescription>{repo.description}</RepoDescription>
              <RepoFooter>
                <RepoLanguage>
                  <LanguageColor language={repo.language} />
                  {repo.language}
                </RepoLanguage>
                <RepoStats>
                  <RepoStat>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path fillRule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                    </svg>
                    {repo.stars}
                  </RepoStat>
                  <RepoStat>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path fillRule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                    </svg>
                    {repo.forks}
                  </RepoStat>
                </RepoStats>
              </RepoFooter>
            </RepoCard>
          </motion.div>
        ))}
      </RepositoriesGrid>
    </GitHubSection>
  );
};

export default GitHub; 