import React from 'react';
import Projects from '@/components/projects/Projects';

export const metadata = {
  title: 'Projects | Digital Hub',
  description: 'Explore my featured projects in blockchain development, decentralized applications, and smart contract implementation.',
};

export default function ProjectsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 max-w-[1400px] mx-auto">
      <Projects />
    </main>
  );
} 