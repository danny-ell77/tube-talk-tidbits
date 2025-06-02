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
  duration?: string;
}

const BASE_URL_LOCAL = "http://localhost:5000"; // Base URL for the backend API

const RENDER_BASE_URL_STAGING = "https://digestly-be.onrender.com";

const RAILWAY_BASE_URL_STAGING =
  "https://digestly-be-production.up.railway.app";

const BASE_URL_PROXY = "https://18c1-102-89-83-49.ngrok-free.app"; // Proxy URL for the backend API

const BASE_URL_STAGING = RAILWAY_BASE_URL_STAGING; // Use the staging URL for production

export const BASE_URL = BASE_URL_LOCAL;

import { toast } from "sonner";

const handle401Error = () => {
  localStorage.removeItem("user");
  toast.error("Session expired. Please log in again.");
  window.location.href = "/login";
};

const parseISODuration = (isoDuration: string): string => {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const [, hours = 0, minutes = 0, seconds = 0] = isoDuration
    .match(regex)
    .map(Number);
  console.log(hours, minutes, seconds);
  const pad = (n) => String(n).padStart(2, "0");
  let value = "";
  for (const a of [hours, minutes, seconds]) {
    if (!Number.isNaN(a)) {
      value += `${pad(a)}:`;
    }
  }
  return value.slice(0, -1);
};

export const extractVideoId = (url: string): string => {
  const youtubeStandardVideoPatterns = [
    /(?:v=|\/)([0-9A-Za-z_-]{11}).*/,
    /(?:embed\/)([0-9A-Za-z_-]{11})/,
    /(?:shorts\/)([0-9A-Za-z_-]{11})/,
    /(?:youtu\.be\/)([0-9A-Za-z_-]{11})/,
    /^([0-9A-Za-z_-]{11})$/,
  ];

  for (const pattern of youtubeStandardVideoPatterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return url;
};

const isStreamingEnabled = (durationInSeconds: number) => {
  return (
    import.meta.env.VITE_APP_ENABLE_STREAMING === "true" &&
    durationInSeconds >= 2400
  );
};

export const getYoutubeThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

export const generateDigest = async (
  youtubeUrl: string,
  type: string,
  customPrompt?: string,
  model: string = "standard",
  onUpdate?: (partialResult: DigestResult) => void
): Promise<DigestResult> => {
  const videoId = extractVideoId(youtubeUrl);
  const thumbnailUrl = getYoutubeThumbnail(videoId);

  const payload = {
    video_id: videoId,
    mode: type,
    tags: [],
    duration: 0,
  };

  if (customPrompt) {
    payload["prompt_template"] = customPrompt;
  }

  try {
    const videoData = await getVideoData(youtubeUrl);
    const { title: videoTitle, tags, duration, creator } = videoData;
    const durationInSeconds = duration
      ? duration
          .split(":")
          .map((x) => parseInt(x || "0"))
          .reverse()
          .reduce((acc, curr, i) => {
            const multiplier = [1, 60, 3600][i] || 0;
            return acc + curr * multiplier;
          }, 0)
      : 0;
    console.log("durationInSeconds", durationInSeconds);
    const titleFromUrl = youtubeUrl.split("v=")[1]?.split("&")[0];
    const titleFromUrlFallback = `Video ${titleFromUrl} Summary`;
    const title = videoTitle || titleFromUrlFallback;

    payload.tags = tags || [];
    payload.duration = durationInSeconds;

    let content = "";
    if (isStreamingEnabled(durationInSeconds)) {
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

      if (response.status === 403) {
        const errorData = await response.json();
        toast.error(errorData.detail || "Insufficient credits");
        throw new Error(errorData.detail || "Insufficient credits");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to process video");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get response reader");
      }

      const result: DigestResult = {
        title,
        type,
        duration,
        content: "",
        creator, // Include the creator (channel_title) for attribution
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
      console.log("Using regular response");

      // Import here to avoid circular dependencies
      const { authenticatedFetch } = await import("@/services/authService");

      console.log("payload", payload, durationInSeconds);

      const response = await authenticatedFetch(`${BASE_URL}/process/`, {
        method: "POST",
        body: JSON.stringify({ ...payload, duration: durationInSeconds }),
      });

      if (response.status === 401) {
        handle401Error();
        throw new Error("Unauthorized");
      }

      if (response.status === 403) {
        const errorData = await response.json();
        toast.error(errorData.detail || "Insufficient credits");
        throw new Error(errorData.detail || "Insufficient credits");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to process video");
      }

      const data = await response.json();
      content = data.response;
    }

    return {
      title,
      type,
      content,
      duration,
      creator,
      videoUrl: youtubeUrl,
      timestamp: new Date().toLocaleString(),
      model,
      customPrompt,
      thumbnailUrl,
    };
  } catch (error) {
    console.error("Error generating digest:", JSON.stringify(error));
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
      duration: parseISODuration(data.duration),
      tags: data.tags,
      channelName: data.channel_title,
      creator: data.channel_title, // Map channel_title to creator for attribution
      views: data.view_count,
      likes: data.like_count,
      date: data.published_at,
    };
  } catch (error) {
    console.error("Error fetching video data:", error);
    throw error;
  }
};
