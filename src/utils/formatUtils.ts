import { hasTimestampLinks } from "./youtubeUtils";

/**
 * Format the summary type into a display-friendly string
 */
export const formatType = (type: string): string => {
  switch (type) {
    case "tldr":
      return "TLDR";
    case "key_insights":
      return "Key Insights";
    case "comprehensive":
      return "Comprehensive Summary";
    case "article":
      return "Article Format";
    case "custom":
      return "Custom Summary";
    default:
      return type;
  }
};

/**
 * Format content based on format type and summary type
 */
export const formatContent = (
  content: string,
  type: string,
  format: "html" | "markdown" = "html"
) => {
  if (format === "markdown") {
    return {
      markdown: typeof content === "string" ? content : String(content),
      __html: null,
    };
  }

  if (
    format === "html" &&
    (content.includes("<h") ||
      content.includes("<p") ||
      content.includes("<ul"))
  ) {
    return { __html: content, markdown: null };
  }

  if (type === "key_insights") {
    const points = content.split("\n").filter((line) => line.trim());
    return {
      __html: `<ul class="list-disc pl-5 space-y-2">
        ${points.map((point) => `<li>${point}</li>`).join("")}
      </ul>`,
      markdown: null,
    };
  }

  if (type === "article") {
    return {
      __html: `<article class="prose prose-lg dark:prose-invert max-w-none">
        ${content}
      </article>`,
      markdown: null,
    };
  }

  return {
    __html: content
      .split("\n\n")
      .map((paragraph) => `<p class="mb-4">${paragraph}</p>`)
      .join(""),
    markdown: null,
  };
};

export const isContentEmpty = (content: string): boolean => {
  return !content || content.trim() === "";
};

export const applyStyles = (videoId: string | null, html: string): string => {
  console.log("Applying styles to HTML content...", html);

  if (!videoId) {
    console.error("No video ID provided for styling timestamps.");
  } else {
    html = html.replace(
      /\[\[(\d+(?:\.\d+)?)\]\]/gi,
      `<button onclick="window.open('https://youtu.be/${videoId}?t=$1s', '_blank')" ` +
        `class="inline-flex items-center gap-1 px-2 py-1 mx-1 bg-red-50 hover:bg-red-100 ` +
        `text-red-700 hover:text-red-800 rounded-md text-sm font-medium transition-all ` +
        `duration-200 border border-red-200 hover:border-red-300 cursor-pointer hover:shadow-sm" ` +
        `title="Jump to $1s in video"><span class="text-red-500">🔗</span></button>`
    );
  }

  return html
    .replace(/<h1>/g, '<h1 class="text-2xl font-bold mb-4">')
    .replace(/<h2>/g, '<h2 class="text-xl font-semibold mb-3">')
    .replace(/<h3>/g, '<h3 class="text-lg font-medium mb-2">')
    .replace(/<p>/g, '<p class="mb-4">')
    .replace(/<ul>/g, '<ul class="list-disc pl-5 space-y-2">')
    .replace(/<ol>/g, '<ol class="list-decimal pl-5 space-y-2">')
    .replace(
      /<pre>/g,
      '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto my-4 text-sm">'
    )
    .replace(
      /<table>/g,
      '<table class="min-w-full border-collapse border border-gray-300 dark:border-gray-700">'
    )
    .replace(
      /<th>/g,
      '<th class="border border-gray-300 dark:border-gray-700 px-4 py-2 bg-gray-100 dark:bg-gray-800">'
    )
    .replace(
      /<td>/g,
      '<td class="border border-gray-300 dark:border-gray-700 px-4 py-2">'
    );
};

/**
 * Check if content contains timestamp links
 */
export const contentHasTimestamps = (content: string): boolean => {
  return hasTimestampLinks(content);
};
