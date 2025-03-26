/**
 * Normalizes image URLs to handle both relative and absolute paths
 * @param url The image URL to normalize
 * @returns A normalized URL
 */
export const normalizeImageUrl = (url: string): string => {
  if (!url) return '/placeholder.svg';
  
  // Check if URL is already absolute
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Check if URL is already relative to public
  if (url.startsWith('/')) {
    return url;
  }
  
  // Otherwise, assume it's relative to the assets folder
  return `/jf-assets/${url}`;
};
