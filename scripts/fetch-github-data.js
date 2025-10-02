#!/usr/bin/env node

/**
 * Fetch GitHub repository metadata and update content.ts
 * 
 * This script fetches real data from GitHub API including:
 * - Repository creation date
 * - Last update date
 * - Stars, forks, watchers
 * - Languages breakdown
 * - Topics/tags
 * 
 * Usage: node scripts/fetch-github-data.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// GitHub API configuration
const GITHUB_API = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Optional: for higher rate limits

// Extract owner and repo from GitHub URL
function parseGithubUrl(url) {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

// Fetch data from GitHub API
function fetchGithubData(owner, repo) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${owner}/${repo}`,
      method: 'GET',
      headers: {
        'User-Agent': 'Node.js',
        'Accept': 'application/vnd.github.v3+json',
      }
    };

    if (GITHUB_TOKEN) {
      options.headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`GitHub API error: ${res.statusCode} - ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Fetch languages breakdown
function fetchGithubLanguages(owner, repo) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${owner}/${repo}/languages`,
      method: 'GET',
      headers: {
        'User-Agent': 'Node.js',
        'Accept': 'application/vnd.github.v3+json',
      }
    };

    if (GITHUB_TOKEN) {
      options.headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`GitHub API error: ${res.statusCode} - ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Convert languages object to percentage array
function languagesToPercentages(languages) {
  const total = Object.values(languages).reduce((sum, val) => sum + val, 0);
  return Object.entries(languages)
    .map(([name, bytes]) => ({
      name,
      percentage: parseFloat(((bytes / total) * 100).toFixed(1))
    }))
    .sort((a, b) => b.percentage - a.percentage);
}

// Format date for "period" field
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.getFullYear();
}

// Read content.ts and extract GitHub URLs
function extractProjectsFromContent() {
  const contentPath = path.join(__dirname, '../src/data/content.ts');
  const content = fs.readFileSync(contentPath, 'utf-8');
  
  const projects = [];
  const projectRegex = /{\s*title:\s*"([^"]+)"[\s\S]*?github:\s*"(https:\/\/github\.com\/[^"]+)"/g;
  
  let match;
  while ((match = projectRegex.exec(content)) !== null) {
    projects.push({
      title: match[1],
      githubUrl: match[2]
    });
  }
  
  return projects;
}

// Main function
async function main() {
  console.log('🚀 Fetching GitHub data for portfolio projects...\n');
  
  const projects = extractProjectsFromContent();
  console.log(`Found ${projects.length} projects with GitHub links\n`);
  
  const results = [];
  
  for (const project of projects) {
    const parsed = parseGithubUrl(project.githubUrl);
    if (!parsed) {
      console.log(`❌ ${project.title}: Invalid GitHub URL`);
      continue;
    }
    
    try {
      console.log(`📦 Fetching data for ${project.title} (${parsed.owner}/${parsed.repo})...`);
      
      const [repoData, languages] = await Promise.all([
        fetchGithubData(parsed.owner, parsed.repo),
        fetchGithubLanguages(parsed.owner, parsed.repo)
      ]);
      
      const languagePercentages = languagesToPercentages(languages);
      
      results.push({
        title: project.title,
        githubUrl: project.githubUrl,
        data: {
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
          watchers: repoData.watchers_count,
          createdAt: repoData.created_at,
          updatedAt: repoData.updated_at,
          pushedAt: repoData.pushed_at,
          createdYear: formatDate(repoData.created_at),
          languages: languagePercentages,
          topics: repoData.topics || [],
          description: repoData.description,
          homepage: repoData.homepage
        }
      });
      
      console.log(`✅ ${project.title}: ${repoData.stargazers_count} ⭐, ${repoData.forks_count} 🍴, created ${formatDate(repoData.created_at)}`);
      
      // Rate limiting: wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`❌ ${project.title}: ${error.message}`);
    }
  }
  
  // Save results to JSON file
  const outputPath = path.join(__dirname, '../scripts/github-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  
  console.log(`\n✅ Data saved to ${outputPath}`);
  console.log(`\n📊 Summary:`);
  console.log(`   Total projects: ${results.length}`);
  console.log(`   Total stars: ${results.reduce((sum, r) => sum + r.data.stars, 0)}`);
  console.log(`   Total forks: ${results.reduce((sum, r) => sum + r.data.forks, 0)}`);
  
  console.log(`\n💡 Next steps:`);
  console.log(`   1. Review the data in github-data.json`);
  console.log(`   2. Manually update src/data/content.ts with the fetched data`);
  console.log(`   3. Update "period" fields with createdYear from the data`);
}

main().catch(console.error);
