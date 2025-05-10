import { useState, useEffect, useRef } from 'react';

type ImageStatus = 'loading' | 'loaded' | 'error';

/**
 * Hook to preload images and track their loading status
 * @param imageSrcs Array of image URLs to preload
 * @returns Object with loaded images and status
 */
export const useImagePreloader = (imageSrcs: string[]) => {
  const [imagesStatus, setImagesStatus] = useState<Record<string, ImageStatus>>({});
  const prevImageSrcsRef = useRef<string[]>([]);

  useEffect(() => {
    // Check if imageSrcs array has changed
    const hasImageSrcsChanged = 
      prevImageSrcsRef.current.length !== imageSrcs.length || 
      imageSrcs.some((src, i) => prevImageSrcsRef.current[i] !== src);
    
    if (!hasImageSrcsChanged) return;
    
    // Update ref with current imageSrcs
    prevImageSrcsRef.current = [...imageSrcs];
    
    // Only preload images that haven't been loaded or aren't already loading
    const imagesToLoad = imageSrcs.filter(
      src => !imagesStatus[src] || imagesStatus[src] === 'error'
    );

    if (imagesToLoad.length === 0) return;

    // Mark images as loading using functional update
    setImagesStatus(prevStatus => {
      const newStatus = { ...prevStatus };
      imagesToLoad.forEach(src => {
        newStatus[src] = 'loading';
      });
      return newStatus;
    });

    // Create image objects to trigger loading
    const imagePromises = imagesToLoad.map(src => {
      return new Promise<{ src: string; status: ImageStatus }>((resolve) => {
        const img = new Image();
        
        img.onload = () => {
          resolve({ src, status: 'loaded' });
        };
        
        img.onerror = () => {
          resolve({ src, status: 'error' });
        };
        
        img.src = src;
      });
    });

    // Update status as images load
    Promise.all(imagePromises).then(results => {
      setImagesStatus(prevStatus => {
        const updatedStatus = { ...prevStatus };
        results.forEach(({ src, status }) => {
          updatedStatus[src] = status;
        });
        return updatedStatus;
      });
    });
  }, [imageSrcs]); // Remove imagesStatus from dependencies

  // Check if all images are loaded
  const allImagesLoaded = imageSrcs.every(
    src => imagesStatus[src] === 'loaded'
  );

  // Check if any images are loading
  const isLoading = imageSrcs.some(
    src => !imagesStatus[src] || imagesStatus[src] === 'loading'
  );

  return {
    imagesStatus,
    allImagesLoaded,
    isLoading,
    loadedSrcs: Object.entries(imagesStatus)
      .filter(([_, status]) => status === 'loaded')
      .map(([src]) => src),
  };
}; 