import { useState, useEffect } from 'react';

type ImageStatus = 'loading' | 'loaded' | 'error';

/**
 * Hook to preload images and track their loading status
 * @param imageSrcs Array of image URLs to preload
 * @returns Object with loaded images and status
 */
export const useImagePreloader = (imageSrcs: string[]) => {
  const [imagesStatus, setImagesStatus] = useState<Record<string, ImageStatus>>({});

  useEffect(() => {
    // Only preload images that haven't been loaded or aren't already loading
    const imagesToLoad = imageSrcs.filter(
      src => !imagesStatus[src] || imagesStatus[src] === 'error'
    );

    if (imagesToLoad.length === 0) return;

    // Mark images as loading
    const newStatus: Record<string, ImageStatus> = { ...imagesStatus };
    imagesToLoad.forEach(src => {
      newStatus[src] = 'loading';
    });
    setImagesStatus(newStatus);

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
      const updatedStatus = { ...newStatus };
      results.forEach(({ src, status }) => {
        updatedStatus[src] = status;
      });
      setImagesStatus(updatedStatus);
    });
  }, [imageSrcs, imagesStatus]);

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