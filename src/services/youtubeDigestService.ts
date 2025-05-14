
// This is a mock service; in a real app, this would connect to a backend API

export interface DigestResult {
  title: string;
  type: string;
  content: string;
  videoUrl: string;
  timestamp: string;
}

// In a real implementation, we would call an actual API endpoint
// For this demo, we're simulating the API call with mock data
export const generateDigest = async (
  youtubeUrl: string,
  type: string
): Promise<DigestResult> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Mock video title extraction from URL
  let title = "YouTube Video Summary";
  if (youtubeUrl.includes("v=")) {
    const videoId = youtubeUrl.split("v=")[1].split("&")[0];
    title = `Video ${videoId} Summary`;
  }

  // Generate different content based on the requested summary type
  let content = "";
  switch (type) {
    case "tldr":
      content = "This video discusses the importance of time management and productivity. The main takeaway is that breaking tasks into smaller chunks and using the Pomodoro technique can significantly improve focus and output. The speaker recommends using digital tools to track progress but emphasizes that the most important factor is consistency.";
      break;
    case "key_insights":
      content = "The Pomodoro technique (25 minutes of focused work followed by a 5-minute break) can increase productivity by 30%.\n\nMultitasking reduces efficiency by up to 40% according to recent studies mentioned in the video.\n\nThe speaker suggests using the 2-minute rule: if a task takes less than 2 minutes, do it immediately.\n\nTime blocking is recommended as the most effective way to manage a busy schedule.\n\nThe 80/20 principle applies to time management: 20% of your activities generate 80% of your results.";
      break;
    case "comprehensive":
      content = "<h2>Introduction</h2><p>In this 45-minute podcast, the host interviews Dr. Sarah Johnson, a productivity researcher and bestselling author. They discuss modern approaches to time management in an age of constant distractions.</p><h2>Key Concepts</h2><p>The discussion begins with an overview of traditional time management techniques and why they often fail in today's digital environment. Dr. Johnson introduces her research on 'attention residue' - how switching tasks leaves your attention partially stuck on the previous activity.</p><p>The podcast then explores the Pomodoro technique in depth, with Dr. Johnson presenting studies showing a 30% productivity increase when consistently applied. She recommends modifications to the standard approach, suggesting that some people may benefit from 50-minute focused sessions instead of the traditional 25.</p><h2>Practical Applications</h2><p>The middle section covers practical applications across different professions. For creative professionals, Dr. Johnson recommends larger blocks of uninterrupted time. For managers with fragmented schedules, she suggests 'micro-productivity' techniques.</p><h2>Tools and Systems</h2><p>The conversation then shifts to digital tools and analog systems. While Dr. Johnson acknowledges the benefits of productivity apps, she emphasizes that simple paper-based systems often work better for people who feel overwhelmed by technology.</p><h2>Conclusion</h2><p>The podcast concludes with Dr. Johnson's 'Three R's Framework': Review priorities daily, Resist distractions systematically, and Reflect weekly on productivity patterns. She stresses that consistent application of even simple techniques yields better results than sporadically using complex systems.</p>";
      break;
    default:
      content = "This video provides information about productivity techniques and time management strategies. Various methods are discussed along with their benefits and practical applications.";
  }

  return {
    title,
    type,
    content,
    videoUrl: youtubeUrl,
    timestamp: new Date().toLocaleString(),
  };
};
