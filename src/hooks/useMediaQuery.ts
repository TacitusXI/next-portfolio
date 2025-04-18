'use client';

import { useState, useEffect } from 'react';

/**
 * Hook that returns true if the screen matches the specified media query
 * @param query The media query to check
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    // Create a MediaQueryList object
    const media = window.matchMedia(query);
    
    // Initial check
    setMatches(media.matches);
    
    // Define a callback function
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Add the callback function as a listener for changes to the media query
    media.addEventListener('change', listener);
    
    // Clean up function
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);
  
  return matches;
}

// Common breakpoints
export const breakpoints = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
}; 