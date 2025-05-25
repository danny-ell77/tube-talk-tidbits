import React, { useEffect, useRef } from 'react';
import { DigestResult } from '@/services/youtubeDigestService';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { formatType, formatContent, applyHTMLStyles } from '@/utils/formatUtils';
import { marked } from 'marked';

interface ArticleModeProps {
  result: DigestResult;
}

const ArticleMode: React.FC<ArticleModeProps> = ({ result }) => {
  const { title, type, content, videoUrl, timestamp, model, outputFormat = "markdown", thumbnailUrl, creator } = result;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    toast.success("Content copied to clipboard!");
  };

  const formattedContent = formatContent(content, type, "markdown");

  // Use provided title or extract from URL
  const displayTitle = title || `Video: ${videoUrl.split('v=')[1]?.split('&')[0]}`;

  const renderContent = () => {
    if (outputFormat === "markdown" && formattedContent.markdown) {
      return (
        <div className="prose dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: applyHTMLStyles(marked.parse(formattedContent.markdown) as string) }} />
        </div>
      );
    } else if (formattedContent.__html) {
      return (
        <>
          <div 
            className="prose dark:prose-invert max-w-none" 
            dangerouslySetInnerHTML={formattedContent} 
          />
        </>
      );
    } else {
      return (
        <div className="prose dark:prose-invert max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-base">
            {content}
          </pre>
        </div>
      );
    }
  };

  return (
    <article className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      {/* Featured Image */}
      <div className="relative w-full h-64 md:h-80 overflow-hidden">
        <img 
          src={thumbnailUrl || `https://img.youtube.com/vi/${videoUrl.split('v=')[1]?.split('&')[0]}/maxresdefault.jpg`}
          alt={displayTitle} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
          <div className="flex items-center space-x-2 text-white">
            <span className="px-2 py-1 bg-red-600 rounded text-xs uppercase">{formatType(type)}</span>
            {model && (
              <span className="px-2 py-1 bg-blue-600 rounded text-xs uppercase">
                {model} model
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">{displayTitle}</h1>
        
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
          <div className="flex items-center gap-2">
            <a 
              href={videoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Source: YouTube
            </a>
            {creator && (
              <>
                <span>•</span>
                <span>by {creator}</span>
              </>
            )}
          </div>
          <span>{timestamp}</span>
        </div>
        
        <Separator className="mb-6" />
        
        <div className="article-content max-h-[600px] overflow-y-auto pr-2">
          {renderContent()}
          <div className="mt-6 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md">
            <p className="text-sm text-amber-700 dark:text-amber-400 italic">
              Disclaimer: AI-generated content may contain inaccuracies. Always verify important information with the original source.
            </p>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <Button 
            variant="outline" 
            onClick={copyToClipboard} 
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy
          </Button>
        </div>
      </div>
    </article>
  );
};

export default ArticleMode;
