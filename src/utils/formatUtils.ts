// We don't need to import ReactMarkdown here
// import ReactMarkdown from 'react-markdown';

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
  // If format is markdown and we want to keep it as markdown for the react-markdown component
  if (format === "markdown") {
    // Ensure content is a string for ReactMarkdown component
    return {
      markdown: typeof content === "string" ? content : String(content),
      __html: null,
    };
  }

  // If the content already contains HTML-like structures and it's explicitly HTML format, return it
  if (
    format === "html" &&
    (content.includes("<h") ||
      content.includes("<p") ||
      content.includes("<ul"))
  ) {
    return { __html: content, markdown: null };
  }

  // Otherwise, format the content based on the summary type
  if (type === "key_insights") {
    const points = content.split("\n").filter((line) => line.trim());
    return {
      __html: `<ul class="list-disc pl-5 space-y-2">
        ${points.map((point) => `<li>${point}</li>`).join("")}
      </ul>`,
      markdown: null,
    };
  }

  // Article format with enhanced styling
  if (type === "article") {
    return {
      __html: `<article class="prose prose-lg dark:prose-invert max-w-none">
        ${content}
      </article>`,
      markdown: null,
    };
  }

  // Format both TLDR and comprehensive summary with paragraphs
  return {
    __html: content
      .split("\n\n")
      .map((paragraph) => `<p class="mb-4">${paragraph}</p>`)
      .join(""),
    markdown: null,
  };
};

// Utility function to check if content is empty
export const isContentEmpty = (content: string): boolean => {
  return !content || content.trim() === "";
};
