import React, { useEffect, useRef } from 'react';
import { DigestResult } from '@/services/youtubeDigestService';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { formatType, formatContent } from '@/utils/formatUtils';
import ReactMarkdown from 'react-markdown';

interface ArticleModeProps {
  result: DigestResult;
}

const ArticleMode: React.FC<ArticleModeProps> = ({ result }) => {
  const { title, type, content, videoUrl, timestamp, model, outputFormat, thumbnailUrl, creator } = result;
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => { 
    // Improved scroll behavior to always keep at the bottom as content streams in
    if (scrollRef.current && contentRef.current) {
      const isAtBottom = true; // Always scroll to bottom for better streaming experience
      
      if (isAtBottom) {
        setTimeout(() => {
          scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 10);
      }
    }
  }, [content]); // This effect runs whenever content changes (streams in)
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    toast.success("Content copied to clipboard!");
  };

  const formattedContent = formatContent(content, type, outputFormat);

  // Use provided title or extract from URL
  const displayTitle = title || `Video: ${videoUrl.split('v=')[1]?.split('&')[0]}`;

  const renderContent = () => {
    if (outputFormat === "markdown" && formattedContent.markdown) {
      return (
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown>{formattedContent.markdown}</ReactMarkdown>
          <div ref={scrollRef} className="h-0" />
        </div>
      );
    } else if (formattedContent.__html) {
      return (
        <>
          <div 
            className="prose dark:prose-invert max-w-none" 
            dangerouslySetInnerHTML={formattedContent.__html} 
          />
          <div ref={scrollRef} className="h-0" />
        </>
      );
    } else {
      return (
        <div className="prose dark:prose-invert max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-base">
            {content}
            <div ref={scrollRef} className="h-0" />
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
        
        {/* Content Area */}
        <div ref={contentRef} className="article-content max-h-[600px] overflow-y-auto pr-2">
          {renderContent()}
        </div>
        
        <div className="mt-8 flex justify-end">
          <Button 
            variant="outline" 
            onClick={copyToClipboard} 
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy Content
          </Button>
        </div>
      </div>
    </article>
  );
};

export default ArticleMode;
