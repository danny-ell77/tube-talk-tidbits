
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { getVideoData } from '@/services/youtubeDigestService';
import { extractVideoId } from '@/utils/youtubeUtils';
import { Cookie } from "lucide-react";
import React, { useEffect, useState } from 'react';
import YouTubePreviewCard from './YouTubePreviewCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface YoutubeInputProps {
  onSubmit: (url: string, type: string, customPrompt?: string, model?: string, outputFormat?: "html" | "markdown") => void;
  isLoading: boolean;
  isPremium?: boolean;
}

enum SummaryType {
  TLDR = "tldr",
  KEY_INSIGHTS = "key_insights",
  COMPREHENSIVE = "comprehensive",
  ARTICLE = "article",
  CUSTOM = "custom",
}

const YoutubeInput: React.FC<YoutubeInputProps> = ({ onSubmit, isLoading, isPremium = false }) => {
  const [url, setUrl] = useState('');
  const [summaryType, setSummaryType] = useState<SummaryType>(SummaryType.TLDR);
  const [customPrompt, setCustomPrompt] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [model, setModel] = useState('standard');
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Validate URL and extract video ID whenever URL changes
    const id = extractVideoId(url);
    setIsValidUrl(!!id);
    setVideoId(id);

    // Reset video info when URL changes
    setVideoInfo(null);

    if (id) {
      console.log("Fetching video data for:", url);
      getVideoData(url)
        .then((data) => {
          if (data) {
            setVideoInfo(data);
          }
        })
        .catch(err => {
          console.error("Error fetching video data:", err);
          toast({
            title: "Error fetching video info",
            description: "Could not load video information. You can still generate a digest.",
            variant: "destructive"
          });
        });
    }
    
  }, [url, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation for YouTube URL
    if (!isValidUrl) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube URL",
        variant: "destructive"
      });
      return;
    }
    
    // Pass the custom prompt only if it's shown and not empty
    const prompt = showCustomPrompt && customPrompt.trim() ? customPrompt : undefined;
    // Premium features disabled, always use standard model
    // const selectedModel = isPremium ? model : 'standard';
    const selectedModel = 'standard';
    
    onSubmit(url, summaryType, prompt, selectedModel);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2">
          <Cookie className="h-6 w-6 text-red-600" />
          <h2 className="text-xl font-semibold">Enter YouTube URL</h2>
        </div>
        
        <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center space-x-2'}`}>
          <Input
            type="text"
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
            disabled={isLoading}
          />
          
          <Select
            value={summaryType}
            onValueChange={(value: SummaryType) => {
              setSummaryType(value);
              // Show custom prompt option when "custom" is selected
              setShowCustomPrompt(value === SummaryType.CUSTOM);
            }}
            disabled={isLoading}
          >
            <SelectTrigger className={isMobile ? "w-full" : "w-[180px]"}>
              <SelectValue placeholder="Summary Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tldr">TLDR</SelectItem>
              <SelectItem value="key_insights">Key Insights</SelectItem>
              <SelectItem value="comprehensive">Comprehensive</SelectItem>
              <SelectItem value="article">Article Format</SelectItem>
              <SelectItem value="custom">Custom Prompt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* YouTube Preview Card */}
        {isValidUrl && videoId && (
          <YouTubePreviewCard videoId={videoId} videoInfo={videoInfo} />
        )}

        {showCustomPrompt && (
          <Textarea
            placeholder="Enter your custom prompt instructions here..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="min-h-[100px]"
            disabled={isLoading}
          />
        )}
        
        {/* Premium options temporarily disabled */}
        {/* {isPremium && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <h3 className="font-medium text-amber-800 mb-2">Premium Options</h3>
            <Select
              value={model}
              onValueChange={setModel}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="premium">Premium (GPT-4)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )} */}
        
        <Button 
          type="submit" 
          className="w-full bg-digest-blue hover:bg-digest-blue-light transition-colors"
          disabled={isLoading || !isValidUrl}
        >
          {isLoading && <Cookie className="cookie-btn-icon" />}
          {isLoading ? 'Generating Digest...' : 'Generate Digest'}
        </Button>
      </form>

      {!isLoading && <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
        <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">Tips for Better Results:</h3>
        <ul className="text-sm space-y-2 text-blue-700 dark:text-blue-300">
          <li className="flex items-center gap-2" style={{ fontSize: '0.875rem' }}>
            <span className="block w-1 h-1 rounded-full bg-blue-400" />
            Choose videos under 30 minutes for optimal performance.
          </li>
          <li className="flex items-center gap-2" style={{ fontSize: '0.875rem' }}>
            <span className="block w-1 h-1 rounded-full bg-blue-400" />
            Select videos that have been on YouTube for at least a few hours.
          </li>
          <li className="flex items-center gap-2" style={{ fontSize: '0.875rem' }}>
            <span className="block w-1 h-1 rounded-full bg-blue-400" />
            Prefer videos with clear audio quality for better accuracy.
          </li>
          <li className="flex items-center gap-2" style={{ fontSize: '0.875rem' }}>
            <span className="block w-1 h-1 rounded-full bg-blue-400" />
            Educational content and tutorials typically yield the most meaningful summaries.
          </li>
        </ul>
      </div>}
    </div>
  );
};

export default YoutubeInput;
