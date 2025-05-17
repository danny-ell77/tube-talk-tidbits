
// Mock service for generating YouTube video digests
import { isValidYoutubeUrl, extractVideoId } from '@/utils/youtubeUtils';

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
  creator?: string;  // Added this property to fix TypeScript error
}

// Function to generate a digest from a YouTube video
export const generateDigest = async (
  url: string,
  type: string,
  customPrompt?: string,
  model: string = "standard",
  outputFormat: "html" | "markdown" = "html"
): Promise<DigestResult> => {
  // Validate URL
  if (!isValidYoutubeUrl(url)) {
    throw new Error("Invalid YouTube URL");
  }
  
  // In a real app, this would call a backend API to process the video
  // For demo purposes, we're returning mock data after a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const videoId = extractVideoId(url) || 'unknown';
      const timestamp = new Date().toLocaleString();
      
      // Mock content generation based on summary type
      let content;
      let title;
      
      switch (type) {
        case 'tldr':
          title = "How to Build a Modern React App";
          content = "This video demonstrates how to build a modern React application with TypeScript, Vite, and Tailwind CSS. The key takeaway is that using these tools together can significantly improve development speed and code quality. The presenter recommends this stack for both beginners and experienced developers.";
          break;
        case 'key_insights':
          title = "The Future of JavaScript Frameworks";
          content = "• React continues to dominate the frontend ecosystem but frameworks like Svelte and Solid are gaining traction\n• Server Components represent a paradigm shift in how we build React applications\n• TypeScript adoption has reached over 80% among professional JavaScript developers\n• Build tools like Vite and Turbopack are replacing webpack due to superior performance\n• AI-assisted coding tools will become standard in frontend development workflows by 2026";
          break;
        case 'comprehensive':
          title = "Advanced State Management Techniques";
          content = "<h2>Introduction to State Management</h2><p>The video begins with an overview of why state management is crucial in modern web applications. The speaker highlights common pain points such as prop drilling and state synchronization across components.</p><h2>React's Built-in Solutions</h2><p>Before diving into third-party libraries, the video covers React's native solutions including useState, useReducer, and Context API. The presenter demonstrates practical examples of when each approach is most appropriate.</p><h2>External State Management Libraries</h2><p>The video then compares Redux, Zustand, Jotai, and Recoil with code examples for each. There's a particular focus on the trade-offs between boilerplate code and flexibility.</p><h2>Server State vs. UI State</h2><p>An important distinction is made between server-derived state and UI-only state. The presenter recommends React Query or SWR for the former and simpler solutions for the latter.</p><h2>Performance Considerations</h2><p>The final section addresses performance optimization, including memoization techniques, selective rendering, and state normalization patterns.</p>";
          break;
        case 'article':
          title = "Building Scalable Web Applications";
          content = "<h2>Introduction</h2><p>In this comprehensive tutorial, we explore the architecture of scalable web applications. Starting with the fundamentals, this video walks through each layer of modern application development.</p><h2>Frontend Architecture</h2><p>The presentation begins with component design principles, emphasizing composition over inheritance. We see practical examples of how to structure React components for maximum reusability.</p><h2>State Management</h2><p>Next, the video explores various state management approaches, from Context API to external libraries. The speaker provides clear guidance on when to use each solution based on application complexity.</p><h2>Backend Integration</h2><p>The tutorial then moves to API design, covering REST vs GraphQL, with code examples demonstrating best practices for each approach. There's particular emphasis on type safety across the full stack.</p><h2>Deployment and Infrastructure</h2><p>Finally, the video covers modern deployment strategies, including containerization, serverless architectures, and edge computing. The presenter demonstrates a complete CI/CD pipeline using GitHub Actions.</p>";
          break;
        case 'custom':
          title = "Custom Analysis Based On Your Prompt";
          content = customPrompt 
            ? `Analysis based on prompt: "${customPrompt}"\n\nThe video addresses several points related to your interests. First, it covers the fundamental concepts you asked about, providing clear examples. Second, the presenter offers practical advice that aligns with your specific questions. Finally, there are several code demonstrations that directly apply to the use cases you mentioned.`
            : "This is a custom analysis of the video content based on your specific requirements.";
          break;
        default:
          title = "YouTube Video Summary";
          content = "This is a summary of the YouTube video content.";
      }
      
      resolve({
        title,
        type,
        content,
        videoUrl: url,
        timestamp,
        model,
        customPrompt,
        outputFormat,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        creator: "ThePrimeTime" // Adding a mock creator name
      });
    }, 2000); // 2 second delay to simulate processing time
  });
};
