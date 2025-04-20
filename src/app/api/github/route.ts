import { NextResponse } from 'next/server';

// GitHub GraphQL API endpoint
const GITHUB_API = 'https://api.github.com/graphql';

// GitHub REST API endpoint for repositories
const GITHUB_REST_API = 'https://api.github.com/users';

// Define GitHub API response types
interface ContributionDay {
  date: string;
  count: number;
  color: string;
}

interface Week {
  contributionDays: {
    contributionCount: number;
    date: string;
    color: string;
  }[];
}

interface GitHubRepository {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
}

export async function GET() {
  try {
    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'TacitusXI';

    if (!token) {
      return NextResponse.json(
        { error: 'GitHub token not found in environment variables' },
        { status: 500 }
      );
    }

    // Fetch user profile and contribution data using GraphQL
    const contributionsQuery = `
      query {
        user(login: "${username}") {
          name
          login
          avatarUrl
          bio
          followers {
            totalCount
          }
          following {
            totalCount
          }
          repositories {
            totalCount
          }
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                  color
                }
              }
            }
          }
        }
      }
    `;

    const graphQLResponse = await fetch(GITHUB_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: contributionsQuery }),
    });

    const graphQLData = await graphQLResponse.json();
    
    if (graphQLData.errors) {
      console.error('GraphQL Error:', graphQLData.errors);
      return NextResponse.json(
        { error: 'Error fetching GitHub GraphQL data' },
        { status: 500 }
      );
    }

    // Fetch repositories using REST API
    const reposResponse = await fetch(`${GITHUB_REST_API}/${username}/repos?sort=stars&direction=desc`, {
      headers: {
        'Authorization': `token ${token}`,
      },
    });

    const reposData = await reposResponse.json() as GitHubRepository[];

    if (!Array.isArray(reposData)) {
      return NextResponse.json(
        { error: 'Error fetching repositories data' },
        { status: 500 }
      );
    }

    // Extract user data from GraphQL response
    const userData = graphQLData.data.user;
    
    // Ensure the user data is valid
    if (!userData || !userData.contributionsCollection || !userData.contributionsCollection.contributionCalendar) {
      console.error('Invalid or missing user contribution data from GitHub');
      return NextResponse.json(
        { error: 'Invalid GitHub user data format' },
        { status: 500 }
      );
    }

    // Extract contribution calendar data
    const contributionDays: ContributionDay[] = [];
    userData.contributionsCollection.contributionCalendar.weeks.forEach((week: Week) => {
      week.contributionDays.forEach((day) => {
        contributionDays.push({
          date: day.date,
          count: day.contributionCount,
          color: day.color
        });
      });
    });

    // Format repositories data
    const topRepositories = reposData
      .filter(repo => !repo.fork) // Filter out forked repositories
      .slice(0, 6) // Take top 6 repositories
      .map(repo => ({
        name: repo.name,
        description: repo.description || '',
        url: repo.html_url,
        language: repo.language || 'Other',
        stars: repo.stargazers_count,
        forks: repo.forks_count
      }));

    // Ensure totalContributions is a number
    const totalContributions = 
      userData.contributionsCollection.contributionCalendar.totalContributions || 0;

    // Prepare the response data
    const responseData = {
      profile: {
        login: userData.login,
        avatarUrl: userData.avatarUrl,
        name: userData.name || userData.login,
        bio: userData.bio || '',
        followers: userData.followers.totalCount,
        following: userData.following.totalCount,
        publicRepos: userData.repositories.totalCount
      },
      contributions: contributionDays,
      topRepositories,
      totalContributions: totalContributions
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error in GitHub API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 