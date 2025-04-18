'use client';

import React from 'react';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { BackgroundProvider } from '@/components/effects/BackgroundProvider';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <BackgroundProvider>
        {children}
      </BackgroundProvider>
    </ThemeProvider>
  );
} 