import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, Copy } from "lucide-react";
import { toast } from "sonner";
import ExportButton from './ExportButton';
import ExportPDF from './ExportPDF';
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

  const formattedContent = formatContent(content, type, outputFormat);
  const displayTitle = title || videoUrl.split('v=')[1]?.split('&')[0] || 'YouTube Video';

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader className="bg-gray-800 dark:bg-gray-800 text-white rounded-t-lg p-4 sm:p-6">
        <div className="flex items-start sm:items-center justify-between gap-4">
          <div className="space-y-1 sm:space-y-2">
            <CardTitle className="text-lg sm:text-xl text-white line-clamp-2 font-semibold">{displayTitle}</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
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
          <FileText className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        {customPrompt && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Custom Prompt:</p>
            <p className="text-sm italic text-gray-700 dark:text-gray-300">{customPrompt}</p>
          </div>
        )}
        
        <div 
          ref={contentRef}
          className="max-h-[500px] overflow-y-auto pr-2 prose-sm sm:prose dark:prose-invert max-w-none"
        >
          {formattedContent.markdown ? (
            <div>
              {typeof formattedContent.markdown === 'object' ? (
                <p className="text-sm sm:text-base">{content}</p>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: marked.parse(String(formattedContent.markdown)) }} />
              )}
            </div>
          ) : formattedContent.__html ? (
            <div dangerouslySetInnerHTML={{ __html: formattedContent.__html }} />
          ) : (
            <p className="text-sm sm:text-base">{content}</p>
          )}
        </div>
        <div ref={scrollRef} className="h-0" />
        <Separator className="my-4" />
        <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
          <p>Source: <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-words">{videoUrl}</a></p>
          <p>Digested: {timestamp}</p>
          {outputFormat && <p>Format: {outputFormat.toUpperCase()}</p>}
          <p className="italic mt-2 text-amber-600 dark:text-amber-400">Disclaimer: AI-generated content may contain inaccuracies. Always verify important information with the original source.</p>
        </div>
      </CardContent>
      
      <CardFooter className="rounded-b-lg flex flex-col sm:flex-row justify-end gap-2 p-4 sm:p-6">
        <ExportPDF 
          content={content} 
          title={displayTitle} 
          videoUrl={videoUrl}
          timestamp={timestamp}
        />
        <ExportButton content={content} title={displayTitle} videoUrl={videoUrl}
          timestamp={timestamp}
        />
        <Button 
          variant="outline" 
          onClick={copyToClipboard} 
          className="flex items-center justify-center gap-2 w-full sm:w-auto min-h-[44px] sm:min-h-0"
        >
          <Copy className="h-4 w-4" />
          Copy
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SummaryCard;
