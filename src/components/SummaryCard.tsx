import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, Copy } from "lucide-react";
import { toast } from "sonner";
import ExportButton from './ExportButton';
import { formatType, formatContent } from '@/utils/formatUtils';
import { marked } from "marked";

interface SummaryCardProps {
  title: string;
  type: string;
  content: string;
  videoUrl: string;
  timestamp: string;
  model?: string;
  customPrompt?: string;
  outputFormat?: "html" | "markdown";
  creator?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ 
  title, 
  type, 
  content, 
  videoUrl, 
  timestamp,
  model,
  customPrompt,
  outputFormat = "markdown",
  creator
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    toast.success("Summary copied to clipboard!");
  };

  const getModelBadgeClass = () => {
    switch (model) {
      case 'premium':
        return 'bg-amber-100 text-amber-800';
      case 'advanced':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    // Improved scroll behavior to always keep at the bottom as content streams in
    if (scrollRef.current && contentRef.current) {
      const contentDiv = contentRef.current;
      const isAtBottom = true; // Always scroll to bottom for better streaming experience
      
      if (isAtBottom) {
        setTimeout(() => {
          scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 10);
      }
    }
  }, [content]); // This effect runs whenever content changes (streams in)

  const formattedContent = formatContent(content, type, outputFormat);
  // Debug the content type
  console.log("Formatted Content:", formattedContent);
  console.log("Markdown type:", formattedContent.markdown ? typeof formattedContent.markdown : 'no markdown');

  // Extract video title from URL if not provided
  const displayTitle = title || videoUrl.split('v=')[1]?.split('&')[0] || 'YouTube Video';

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader className="bg-digest-blue text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">{displayTitle}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm opacity-80">{formatType(type)}</span>
              {creator && (
                <span className="text-sm opacity-80">by {creator}</span>
              )}
              {model && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${getModelBadgeClass()}`}>
                  {model.charAt(0).toUpperCase() + model.slice(1)} Model
                </span>
              )}
            </div>
          </div>
          <FileText className="h-6 w-6" />
        </div>
      </CardHeader>
      <CardContent className="pt-6 pb-4 summary-container">
        {customPrompt && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Custom Prompt:</p>
            <p className="text-sm italic text-gray-700">{customPrompt}</p>
          </div>
        )}
        
        <div 
          ref={contentRef}
          className="max-h-[500px] overflow-y-auto pr-2"
        >
          {formattedContent.markdown ? (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {/* Convert to string to prevent React element objects from being passed directly */}
              {typeof formattedContent.markdown === 'object' ? (
                <p>{content}</p>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: marked.parse(String(formattedContent.markdown)) }} />
              )}
            </div>
          ) : formattedContent.__html ? (
            <div dangerouslySetInnerHTML={{ __html: formattedContent.__html }} />
          ) : (
            <p>{content}</p>
          )}
        </div>
        <div ref={scrollRef} className="h-0" />
        <Separator className="my-4" />
        <div className="text-sm text-muted-foreground">
          <p>Source: <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{videoUrl}</a></p>
          <p>Generated: {timestamp}</p>
          {outputFormat && <p>Format: {outputFormat.toUpperCase()}</p>}
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 rounded-b-lg flex justify-end gap-2">
        <ExportButton content={content} title={displayTitle} />
        <Button variant="outline" onClick={copyToClipboard} className="flex items-center gap-2">
          <Copy className="h-4 w-4" />
          Copy
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SummaryCard;
