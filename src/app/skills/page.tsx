import React from 'react';
import Skills from '@/components/skills/Skills';

export const metadata = {
  title: 'Skills & Expertise | Portfolio',
  description: 'Explore my technical skills and expertise across various domains including frontend, backend, mobile development, and more.',
};

export default function SkillsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 max-w-[1400px] mx-auto">
      <Skills />
    </main>
  );
} 