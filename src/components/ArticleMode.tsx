import React, { useEffect, useRef } from 'react';
import { DigestResult } from '@/services/youtubeDigestService';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { formatType, formatContent, applyStyles } from '@/utils/formatUtils';
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
          <div dangerouslySetInnerHTML={{ __html: applyStyles(marked.parse(formattedContent.markdown) as string) }} />
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
            <span className="px-2 py-1 bg-youtube rounded text-xs uppercase">{formatType(type)}</span>
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
        <div className="article-content max-h-[600px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full">
          <div className="pr-6">
            {renderContent()}
            <div className="mt-4 p-2 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900 rounded-md">
              <p className="text-xs text-amber-600 dark:text-amber-400 italic">
                AI-generated content may contain inaccuracies. Verify with original source.
              </p>
            </div>
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
        <div className="flex items-center gap-3 mb-2">
          {creator && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
              Created by <span className="font-medium text-blue-700 dark:text-blue-300 ml-1">{creator}</span>
            </span>
          )}
          {model && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6M6 20V10M18 20v-4" /></svg>
              Digested by <span className="font-medium text-gray-700 dark:text-gray-200 ml-1">{model}</span>
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default ArticleMode;
