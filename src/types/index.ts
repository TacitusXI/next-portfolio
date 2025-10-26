export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  achievements: string[];
  proof?: {
    title?: string;
    description?: string;
    images?: string[];
    links?: Array<{
      title: string;
      url: string;
    }>;
  };
}

export interface Project {
  title: string;
  period: string;
  description: string;
  technologies?: string[];
  features?: string[];
  links: {
    github: string;
    live?: string;
    githubV1?: string; // For projects with multiple versions (e.g., Hardhat v1 and Foundry v2)
  };
  githubInfo?: {
    stars: number;
    forks: number;
    languages: Array<{ name: string; percentage: number }>;
    topics: string[];
    createdAt?: string; // ISO date string (YYYY-MM-DD)
    updatedAt?: string; // ISO date string (YYYY-MM-DD)
  };
}

export interface Publication {
  title: string;
  publisher: string;
  link?: string;
  description?: string;
  isInternal?: boolean;
}

export interface Certificate {
  name: string;
  issuer: string;
  date: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  location: string;
  phone?: string;
  linkedin: string;
  summary: string;
  bio?: string[];
  socials?: Array<{
    name: string;
    url: string;
    icon: React.ReactNode;
  }>;
}

export interface Skill {
  category: string;
  items: string[];
}

export interface Language {
  language: string;
  level: string;
}

export interface Recommendation {
  id: number;
  name: string;
  position: string;
  image: string;
  fallbackImage?: string;
  text: string;
  date: string;
  connection: string;
}

// GitHub related types
export interface GitHubContribution {
  date: string;
  count: number;
  color: string;
}

export interface GitHubRepository {
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  languages: string[];
}

export interface GitHubStats {
  totalContributions: number;
  averageContributions: number;
  mostActiveDay: {
    date: string;
    count: number;
  };
  longestStreak: number;
  currentStreak: number;
} 