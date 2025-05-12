'use client';

import React from 'react';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { BackgroundProvider } from '@/components/effects/BackgroundProvider';
import ClarityTracker from '@/components/analytics/ClarityTracker';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <BackgroundProvider>
        <ClarityTracker />
        {children}
      </BackgroundProvider>
    </ThemeProvider>
  );
} 