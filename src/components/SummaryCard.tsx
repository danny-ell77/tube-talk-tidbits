import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, Copy } from "lucide-react";
import { toast } from "sonner";

interface SummaryCardProps {
  title: string;
  type: string;
  content: string;
  videoUrl: string;
  timestamp: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, type, content, videoUrl, timestamp }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    toast.success("Summary copied to clipboard!");
  };

  const formatType = (type: string) => {
    switch (type) {
      case 'tldr':
        return 'TLDR';
      case 'key_insights':
        return 'Key Insights';
      case 'comprehensive':
        return 'Comprehensive Summary';
      default:
        return type;
    }
  };

  const formatContent = (content: string) => {
    // If the content already contains HTML-like structures, just return it
    if (content.includes('<h') || content.includes('<p') || content.includes('<ul')) {
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }

    // Otherwise, format the content based on the summary type
    if (type === 'key_insights') {
      const points = content.split('\n').filter(line => line.trim());
      return (
        <ul className="list-disc pl-5 space-y-2">
          {points.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      );
    }
    
    // Format both TLDR and comprehensive summary with paragraphs
    return content.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-4">{paragraph}</p>
    ));
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader className="bg-digest-blue text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <p className="text-sm opacity-80">{formatType(type)}</p>
          </div>
          <FileText className="h-6 w-6" />
        </div>
      </CardHeader>
      <CardContent className="pt-6 pb-4 summary-container">
        {formatContent(content)}
        <Separator className="my-4" />
        <div className="text-sm text-muted-foreground">
          <p>Source: <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{videoUrl}</a></p>
          <p>Generated: {timestamp}</p>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 rounded-b-lg flex justify-end">
        <Button variant="outline" onClick={copyToClipboard} className="flex items-center gap-2">
          <Copy className="h-4 w-4" />
          Copy
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SummaryCard;
