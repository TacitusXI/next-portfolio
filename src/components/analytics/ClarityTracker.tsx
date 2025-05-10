'use client';

import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';
import { usePathname, useSearchParams } from 'next/navigation';

export default function ClarityTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize Clarity just once when the component mounts
    const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
    
    if (projectId) {
      Clarity.init(projectId);
      console.log('Clarity initialized with project ID:', projectId);
    } else {
      console.warn('Clarity project ID not found in environment variables');
    }
  }, []);

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
      
      console.log('Clarity tracking page view:', pageUrl);
    }
  }, [pathname, searchParams]);

  // This component doesn't render anything visible
  return null;
} 