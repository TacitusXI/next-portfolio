import React from 'react';
import Image, { ImageProps } from 'next/image';

// Helper function to convert paths to IPFS-friendly format
const getRelativePath = (src: string): string => {
  if (typeof src !== 'string') return src;
  
  // If it's already a relative path with ./ prefix, or an external URL, keep it
  if (src.startsWith('./') || src.startsWith('http')) {
    return src;
  }
  
  // Convert absolute paths to relative
  if (src.startsWith('/')) {
    return `.${src}`;
  }
  
  return src;
};

// IPFSImage component that wraps Next.js Image with IPFS compatibility
export default function IPFSImage({ src, ...props }: ImageProps) {
  const ipfsFriendlySrc = getRelativePath(src as string);
  
  return (
    <Image
      src={ipfsFriendlySrc}
      {...props}
    />
  );
} 