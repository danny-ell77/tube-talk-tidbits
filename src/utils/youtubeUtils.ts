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
export const getYoutubeThumbnailUrl = (
  videoId: string,
  quality:
    | "default"
    | "mqdefault"
    | "hqdefault"
    | "sddefault"
    | "maxresdefault" = "mqdefault"
): string => {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};

/**
 * Generate YouTube URL with timestamp
 */
export const generateYoutubeTimestampUrl = (
  videoId: string,
  timeInSeconds: number
): string => {
  return `https://www.youtube.com/watch?v=${videoId}&t=${Math.floor(
    timeInSeconds
  )}s`;
};

/**
 * Format seconds to human-readable time format (e.g., 1m23s or 1h23m45s)
 */
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h${minutes.toString().padStart(2, "0")}m${secs
      .toString()
      .padStart(2, "0")}s`;
  } else if (minutes > 0) {
    return `${minutes}m${secs.toString().padStart(2, "0")}s`;
  } else {
    return `${secs}s`;
  }
};

/**
 * Parse timestamp from text (e.g., "1m23s" or "1h23m45s")
 */
export const parseTimestamp = (timeStr: string): number | null => {
  const hourMatch = timeStr.match(/(\d+)h/);
  const minuteMatch = timeStr.match(/(\d+)m/);
  const secondMatch = timeStr.match(/(\d+)s/);

  const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
  const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;
  const seconds = secondMatch ? parseInt(secondMatch[1]) : 0;

  if (hours === 0 && minutes === 0 && seconds === 0) {
    return null;
  }

  return hours * 3600 + minutes * 60 + seconds;
};

/**
 * Check if text contains YouTube timestamp links
 */
export const hasTimestampLinks = (text: string): boolean => {
  const timestampLinkRegex =
    /\[\d+(?:h\d+m)?\d*m?\d+s\]\(https:\/\/www\.youtube\.com\/watch\?v=[^)]+\)/g;
  return timestampLinkRegex.test(text);
};

/**
 * Extract all timestamp links from text
 */
export const extractTimestampLinks = (
  text: string
): Array<{ timestamp: string; url: string; time: number }> => {
  const timestampLinkRegex =
    /\[(\d+(?:h\d+m)?\d*m?\d+s)\]\((https:\/\/www\.youtube\.com\/watch\?v=[^)]+)\)/g;
  const links = [];
  let match;

  while ((match = timestampLinkRegex.exec(text)) !== null) {
    const timestamp = match[1];
    const url = match[2];
    const time = parseTimestamp(timestamp);

    if (time !== null) {
      links.push({ timestamp, url, time });
    }
  }

  return links;
};
