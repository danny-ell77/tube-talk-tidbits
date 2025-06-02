
/**
 * Extract YouTube video ID from various URL formats
 */
export const extractVideoId = (url: string): string | null => {
  if (!url) return null;
  
  // Match common YouTube URL patterns
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/watch\?.*v=)([^&?\/\s]{11})/,
    /(?:youtube\.com\/shorts\/)([^&?\/\s]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
};

/**
 * Check if a URL is a valid YouTube video URL
 */
export const isValidYoutubeUrl = (url: string): boolean => {
  return !!extractVideoId(url);
};

/**
 * Generate YouTube video thumbnail URL
 */
export const getYoutubeThumbnailUrl = (videoId: string, quality: 'default' | 'mqdefault' | 'hqdefault' | 'sddefault' | 'maxresdefault' = 'mqdefault'): string => {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};
