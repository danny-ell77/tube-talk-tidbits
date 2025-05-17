
// Service for connecting to YouTube video digest backend API

export interface DigestResult {
  title: string;
  type: string;
  content: string;
  videoUrl: string;
  timestamp: string;
  model?: string;
  customPrompt?: string;
  outputFormat?: "html" | "markdown";
  thumbnailUrl?: string;
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

// Check if streaming is enabled via environment variable
const isStreamingEnabled = () => {
  return import.meta.env.VITE_ENABLE_STREAMING === "true";
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
  outputFormat: "html" | "markdown" = "html"
): Promise<DigestResult> => {
  try {
    // Extract video ID from URL
    const videoId = extractVideoId(youtubeUrl);
    const thumbnailUrl = getYoutubeThumbnail(videoId);

    // Create request payload
    const payload = {
      video_id: videoId,
      mode: type,
      output_format: outputFormat
    };

    // If custom prompt is provided, add it to payload
    if (customPrompt) {
      payload["prompt_template"] = customPrompt;
    }

    // Extract title from YouTube URL or use default
    let title = "YouTube Video Summary";
    if (youtubeUrl.includes("v=")) {
      const videoIdFromUrl = youtubeUrl.split("v=")[1].split("&")[0];
      title = `Video ${videoIdFromUrl} Summary`;
    }

    // Initialize content variable
    let content = "";

    if (isStreamingEnabled()) {
      // Streaming implementation
      console.log("Using streaming response");
      const response = await fetch("http://localhost:8000/process/stream", {
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

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get response reader");
      }

      // Create a result object that will be updated during streaming
      const result: DigestResult = {
        title,
        type,
        content: "",
        videoUrl: youtubeUrl,
        timestamp: new Date().toLocaleString(),
        model,
        customPrompt,
        outputFormat,
        thumbnailUrl
      };

      // Return a Promise that resolves with the result when streaming is complete
      return new Promise((resolve, reject) => {
        const readChunk = async () => {
          try {
            const { done, value } = await reader.read();
            
            if (done) {
              // Streaming is complete, resolve the promise with the final result
              console.log("Streaming complete");
              resolve(result);
              return;
            }
            
            // Decode the chunk and append to content
            const chunk = new TextDecoder().decode(value);
            result.content += chunk;
            content += chunk;
            
            // Continue reading chunks
            readChunk();
          } catch (error) {
            console.error("Error reading chunk:", error);
            reject(error);
          }
        };
        
        // Start reading chunks
        readChunk();
      });
    } else {
      // Non-streaming implementation (original code)
      console.log("Using regular response");
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
      outputFormat,
      thumbnailUrl
    };
  } catch (error) {
    console.error("Error generating digest:", error);
    throw error;
  }
};
