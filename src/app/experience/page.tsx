import React from 'react';
import Experience from '@/components/experience/Experience';

export const metadata = {
  title: 'Professional Experience | Portfolio',
  description: 'View my professional experience in blockchain development, smart contract implementation, and software engineering.',
};

export default function ExperiencePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 max-w-[1400px] mx-auto">
      <Experience />
    </main>
  );
} 