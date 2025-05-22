// Service for connecting to YouTube video digest backend API

export interface DigestResult {
  title: string;
  type: string;
  content: string;
  videoUrl: string;
  timestamp: string;
  creator?: string;
  model?: string;
  customPrompt?: string;
  outputFormat?: "html" | "markdown";
  thumbnailUrl?: string;
}

const BASE_URL_LOCAL = "http://localhost:8000"; // Base URL for the backend API

const RENDER_BASE_URL_STAGING = "https://digestly-be.onrender.com";

const SEVALLA_BASE_URL_STAGING = "https://digestly-be-dp95u.kinsta.app";

const BASE_URL_PROXY = "https://18c1-102-89-83-49.ngrok-free.app"; // Proxy URL for the backend API

const BASE_URL_STAGING = SEVALLA_BASE_URL_STAGING; // Use the staging URL for production

const BASE_URL = BASE_URL_STAGING;

// Import toast here since we'll use it for error notifications
import { toast } from "sonner";

// Handle unauthorized errors and redirect
const handle401Error = () => {
  // Remove user data to trigger re-auth
  localStorage.removeItem("user");

  // Show toast notification
  toast.error("Session expired. Please log in again.");

  // Redirect to login - using window.location since we can't use useNavigate in a non-component
  window.location.href = "/login";
};

// Extract YouTube video ID from URL
const extractVideoId = (url: string): string => {
  // Match YouTube URL patterns
  // Handle YouTube's shorthand .be patterns and standard video patterns
  const patterns = [
    /(?:v=|\/)([0-9A-Za-z_-]{11}).*/,
    /(?:embed\/)([0-9A-Za-z_-]{11})/,
    /(?:shorts\/)([0-9A-Za-z_-]{11})/,
    /(?:youtu\.be\/)([0-9A-Za-z_-]{11})/,
    /^([0-9A-Za-z_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  // If no patterns match, just return the URL as-is
  return url;
};

// Check if streaming is enabled via environment variable
const isStreamingEnabled = () => {
  return import.meta.env.VITE_APP_ENABLE_STREAMING === "true";
  // return true; // For testing purposes, always return true
};

// Function to get video thumbnail
export const getYoutubeThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

// Real implementation with support for streaming or regular requests
export const generateDigest = async (
  youtubeUrl: string,
  type: string,
  customPrompt?: string,
  model: string = "standard",
  onUpdate?: (partialResult: DigestResult) => void
): Promise<DigestResult> => {
  const videoId = extractVideoId(youtubeUrl);
  const thumbnailUrl = getYoutubeThumbnail(videoId);

  // Create request payload
  const payload = {
    video_id: videoId,
    mode: type,
    tags: [],
  };

  // If custom prompt is provided, add it to payload
  if (customPrompt) {
    payload["prompt_template"] = customPrompt;
  }

  try {
    const videoData = await getVideoData(youtubeUrl);
    const { title: videoTitle, tags } = videoData;
    const titleFromUrl = youtubeUrl.split("v=")[1]?.split("&")[0];
    const titleFromUrlFallback = `Video ${titleFromUrl} Summary`;
    const title = videoTitle || titleFromUrlFallback;
    payload.tags = tags || [];

    let content = "";

    if (isStreamingEnabled()) {
      // Streaming implementation with authentication and error handling
      console.log("Using streaming response");

      const { authenticatedFetch } = await import("@/services/authService");

      const response = await authenticatedFetch(`${BASE_URL}/process/stream/`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        handle401Error();
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to process video");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get response reader");
      }

      // Create a result object that will be updated during streaming
      const result: DigestResult = {
        title,
        type,
        content: "",
        creator: "",
        videoUrl: youtubeUrl,
        timestamp: new Date().toLocaleString(),
        model,
        customPrompt,
        thumbnailUrl,
      };

      return new Promise((resolve, reject) => {
        const readChunk = async () => {
          try {
            const { done, value } = await reader.read();

            if (done) {
              console.log("Streaming complete");
              resolve(result);
              return;
            }

            const chunk = new TextDecoder().decode(value);
            result.content += chunk;
            content += chunk;

            if (onUpdate) {
              setTimeout(() => onUpdate({ ...result }), 1000);
            }

            readChunk();
          } catch (error) {
            console.error("Error reading chunk:", error);
            reject(error);
          }
        };

        readChunk();
      });
    } else {
      // Non-streaming implementation with authentication
      console.log("Using regular response");

      // Import here to avoid circular dependencies
      const { authenticatedFetch } = await import("@/services/authService");

      const response = await authenticatedFetch(`${BASE_URL}/process/`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        handle401Error();
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to process video");
      }

      const data = await response.json();
      content = data.response;
    }

    // Return formatted digest result
    return {
      title,
      type,
      content,
      videoUrl: youtubeUrl,
      timestamp: new Date().toLocaleString(),
      model,
      customPrompt,
      thumbnailUrl,
    };
  } catch (error) {
    console.error("Error generating digest:", error);
    throw error;
  }
};

export const getVideoData = async (youtubeUrl: string) => {
  const videoId = extractVideoId(youtubeUrl);

  // Import here to avoid circular dependencies
  // const { authenticatedFetch } = await import("@/services/authService");

  try {
    const response = await fetch(
      `${BASE_URL}/video-data/?video_id=${videoId}`,
      {
        method: "GET",
      }
    );

    if (response.status === 401) {
      handle401Error();
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      throw new Error("Failed to fetch video data");
    }

    const data = await response.json();

    return {
      title: data.title,
      tags: data.tags,
      channelName: data.channel_title,
      views: data.view_count,
      likes: data.like_count,
      date: data.published_at,
    };
  } catch (error) {
    console.error("Error fetching video data:", error);
    throw error;
  }
};
