'use client';

import React, { useEffect, Suspense } from 'react';
import Clarity from '@microsoft/clarity';
import { usePathname, useSearchParams } from 'next/navigation';

// Inner component that uses searchParams
function ClarityTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views when the pathname or search params change
  useEffect(() => {
    if (pathname) {
      // Generate custom page ID by combining pathname and search params
      const query = searchParams?.toString();
      const pageUrl = query ? `${pathname}?${query}` : pathname;
      
      // Track the page view with Clarity
      Clarity.identify(`user-${Date.now()}`, undefined, pathname);
      Clarity.setTag('page', pathname);
      Clarity.event('page_view');
    }
  }, [pathname, searchParams]);

  return null;
}

export default function ClarityTracker() {
  useEffect(() => {
    // Initialize Clarity just once when the component mounts
    const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
    
    if (projectId) {
      Clarity.init(projectId);
    } else {
      console.warn('Clarity project ID not found in environment variables');
    }
  }, []);

  // This component doesn't render anything visible
  return (
    <Suspense fallback={null}>
      <ClarityTrackerInner />
    </Suspense>
  );
} 