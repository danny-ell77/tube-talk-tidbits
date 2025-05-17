
/**
 * Format the summary type into a display-friendly string
 */
export const formatType = (type: string): string => {
  switch (type) {
    case 'tldr':
      return 'TLDR';
    case 'key_insights':
      return 'Key Insights';
    case 'comprehensive':
      return 'Comprehensive Summary';
    case 'article':
      return 'Article Format';
    case 'custom':
      return 'Custom Summary';
    default:
      return type;
  }
};

/**
 * Format content based on format type and summary type
 */
export const formatContent = (content: string, type: string, format: "html" | "markdown" = "html") => {
  // If the content already contains HTML-like structures or it's explicitly HTML format, just return it
  if (format === "html" && (content.includes('<h') || content.includes('<p') || content.includes('<ul'))) {
    return { __html: content };
  }
  
  // For markdown format, wrap in pre tag but return as string
  if (format === "markdown") {
    return { __html: `<pre class="whitespace-pre-wrap font-sans">${content}</pre>` };
  }

  // Otherwise, format the content based on the summary type
  if (type === 'key_insights') {
    const points = content.split('\n').filter(line => line.trim());
    return { 
      __html: `<ul class="list-disc pl-5 space-y-2">
        ${points.map(point => `<li>${point}</li>`).join('')}
      </ul>` 
    };
  }
  
  // Article format with enhanced styling
  if (type === 'article') {
    return {
      __html: `<article class="prose prose-lg dark:prose-invert max-w-none">
        ${content}
      </article>`
    };
  }
  
  // Format both TLDR and comprehensive summary with paragraphs
  return { 
    __html: content.split('\n\n')
      .map(paragraph => `<p class="mb-4">${paragraph}</p>`)
      .join('') 
  };
};
