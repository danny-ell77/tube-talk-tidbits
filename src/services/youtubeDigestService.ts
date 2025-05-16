// Service for connecting to YouTube video digest backend API

export interface DigestResult {
  title: string;
  type: string;
  content: string;
  videoUrl: string;
  timestamp: string;
  model?: string;
  customPrompt?: string;
}

// Extract YouTube video ID from URL
const extractVideoId = (url: string): string => {
  // Match YouTube URL patterns
  const patterns = [
    /(?:v=|\/)([0-9A-Za-z_-]{11}).*/,
    /(?:embed\/)([0-9A-Za-z_-]{11})/,
    /(?:shorts\/)([0-9A-Za-z_-]{11})/,
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

// Real implementation calling the backend API
export const generateDigest = async (
  youtubeUrl: string,
  type: string,
  customPrompt?: string,
  model: string = "standard"
): Promise<DigestResult> => {
  try {
    // Extract video ID from URL
    const videoId = extractVideoId(youtubeUrl);

    // Create request payload
    const payload = {
      video_id: videoId,
      mode: type,
    };

    // If custom prompt is provided, add it to payload
    if (customPrompt) {
      payload["prompt_template"] = customPrompt;
    }

    // Make API request to backend
    const response = await fetch("http://localhost:8000/process/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to process video");
    }

    const data = await response.json();

    // Extract title from YouTube URL or use default
    let title = "YouTube Video Summary";
    if (youtubeUrl.includes("v=")) {
      const videoIdFromUrl = youtubeUrl.split("v=")[1].split("&")[0];
      title = `Video ${videoIdFromUrl} Summary`;
    }

    // Return formatted digest result
    return {
      title,
      type,
      content: data.response, // Parse response from backend
      videoUrl: youtubeUrl,
      timestamp: new Date().toLocaleString(),
      model,
      customPrompt,
    };
  } catch (error) {
    console.error("Error generating digest:", error);
    throw error;
  }
};
