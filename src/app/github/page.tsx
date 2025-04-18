import React from 'react';
import GitHub from '@/components/github/GitHub';

export const metadata = {
  title: 'GitHub Activity | Portfolio',
  description: 'Explore my GitHub contributions and repositories with interactive visualizations',
};

export default function GitHubPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 max-w-[1400px] mx-auto">
      <GitHub />
    </main>
  );
} 