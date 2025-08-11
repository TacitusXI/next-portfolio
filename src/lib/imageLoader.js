// Custom image loader for IPFS compatibility
export default function imageLoader({ src, width, quality }) {
  // For IPFS, we don't want to add any query parameters or transformations
  // Just return the source as-is
  return src;
}