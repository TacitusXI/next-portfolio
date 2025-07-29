'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Clarity from '@microsoft/clarity';
import { usePathname, useSearchParams } from 'next/navigation';

// Inner component that uses searchParams
function ClarityTrackerInner({ isClarityReady }: { isClarityReady: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views when the pathname or search params change
  useEffect(() => {
    if (pathname && isClarityReady) {
      try {
        // Generate custom page ID by combining pathname and search params
        const query = searchParams?.toString();
        const pageUrl = query ? `${pathname}?${query}` : pathname;
        
        // Check if Clarity is actually available before using it
        if (typeof window !== 'undefined' && window.clarity) {
          // Track the page view with Clarity
          Clarity.identify(`user-${Date.now()}`, undefined, pathname);
          Clarity.setTag('page', pathname);
          Clarity.event('page_view');
        } else {
          console.warn('Clarity is not available on window object');
        }
      } catch (error) {
        console.error('Error tracking with Clarity:', error);
      }
    }
  }, [pathname, searchParams, isClarityReady]);

  return null;
}

export default function ClarityTracker() {
  const [isClarityReady, setIsClarityReady] = useState(false);

  useEffect(() => {
    // Initialize Clarity just once when the component mounts
    const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
    
    if (projectId) {
      try {
        Clarity.init(projectId);
        
        // Wait a bit for Clarity to initialize, then check if it's ready
        const checkClarityReady = () => {
          if (typeof window !== 'undefined' && window.clarity) {
            setIsClarityReady(true);
          } else {
            // Retry after a short delay
            setTimeout(checkClarityReady, 100);
          }
        };
        
        checkClarityReady();
      } catch (error) {
        console.error('Error initializing Clarity:', error);
      }
    } else {
      console.warn('Clarity project ID not found in environment variables. Set NEXT_PUBLIC_CLARITY_PROJECT_ID in your .env.local file.');
    }
  }, []);

  // This component doesn't render anything visible
  return (
    <Suspense fallback={null}>
      <ClarityTrackerInner isClarityReady={isClarityReady} />
    </Suspense>
  );
} 