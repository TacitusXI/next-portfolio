'use client';

import React from 'react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ContactSection from '@/components/sections/ContactSection';
import GitHubSection from '@/components/sections/GitHubSection';
import RecommendationsSection from '@/components/sections/RecommendationsSection';
import HobbiesSection from '@/components/sections/HobbiesSection';
import PublicationsSection from '@/components/sections/PublicationsSection';

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <GitHubSection />
      <PublicationsSection />
      <HobbiesSection />
      <RecommendationsSection />
      <ContactSection />
    </Layout>
  );
}
