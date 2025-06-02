import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { DigestResult, getVideoData } from '@/services/youtubeDigestService';
import { extractVideoId } from '@/utils/youtubeUtils';
import { Cookie, Clipboard } from "lucide-react";
import React, { useEffect, useState } from 'react';
import YouTubePreviewCard from './YouTubePreviewCard';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import SignupModal from './auth/SignupModal';
import PricingModal from './payments/PricingModal';
import { ErrorCodes } from "@/types/errorCodes";
import PersonalizedGreeting from './PersonalizedGreeting';
interface YoutubeInputProps {
  onSubmit: (url: string, type: string, customPrompt?: string, model?: string, outputFormat?: "html" | "markdown") => Promise<[DigestResult | null, Error | null]>;
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

const SUMMARY_OPTIONS = [
  { value: SummaryType.TLDR, label: "TLDR" },
  { value: SummaryType.KEY_INSIGHTS, label: "Key Points" },
  { value: SummaryType.COMPREHENSIVE, label: "Comprehensive" },
  { value: SummaryType.ARTICLE, label: "In-Depth Analysis" },
  { value: SummaryType.CUSTOM, label: "Custom Prompt" },
];

const YoutubeInput: React.FC<YoutubeInputProps> = ({ onSubmit, isLoading, isPremium = false }) => {
  const [url, setUrl] = useState('');
  const [summaryType, setSummaryType] = useState<SummaryType>(SummaryType.TLDR);
  const [summaryTypeIndex, setSummaryTypeIndex] = useState(0);
  const [customPrompt, setCustomPrompt] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [model, setModel] = useState('standard');
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [ showSignupModal, setShowSignupModal ] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [showPricingModal, setShowPricingModal] = useState(false);

  useEffect(() => {
    const id = extractVideoId(url);
    setIsValidUrl(!!id);
    setVideoId(id);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

    if (user && user.credits <= 0) { 
      setShowPricingModal(true);
      return;
    }

    const [result, error] = await onSubmit(url, summaryType, prompt, selectedModel);
    if (error.message === ErrorCodes.INSUFFICIENT_CREDITS) {
      if (user) { // Redundant check, but ensures we have a user context
        setShowPricingModal(true);
      } else {
        setShowSignupModal(true);
      }  
    }

    console.error("Error submitting YouTube digest request:", error);
  }

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setUrl(clipboardText);
    } catch (error) {
      console.error("Failed to read clipboard contents:", error);
      toast({
        title: "Clipboard Error",
        description: "Could not access clipboard. Please paste manually.",
        variant: "destructive"
      });
    }
  };

  const handleSummaryTypeChange = (value: number[]) => {
    const index = value[0];
    setSummaryTypeIndex(index);
    const selectedType = SUMMARY_OPTIONS[index].value;
    setSummaryType(selectedType);
    setShowCustomPrompt(selectedType === SummaryType.CUSTOM);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {user && <PersonalizedGreeting />}
      {!user && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Get 2 free summaries!
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center space-x-2'}`}>
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Paste a YouTube URL (e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pr-10 w-full"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={handlePaste}
              disabled={isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 dark:hover:text-gray-300 focus:outline-none disabled:opacity-50 transition-colors"
              title="Paste from clipboard"
            >
              <Clipboard className="h-4 w-4" />
            </button>
          </div>
          
        </div>
        {isValidUrl && videoId && <div className={'w-full space-y-3'}>
          <div className="text-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              How do you want to digest this video?
            </label>
          </div>
          <div className="relative">
            <Slider
              value={[summaryTypeIndex]}
              onValueChange={handleSummaryTypeChange}
              max={SUMMARY_OPTIONS.length - 1}
              min={0}
              step={1}
              disabled={isLoading}
              className="w-full"
            />
            {/* Visual tick marks */}
            <div className="absolute top-0 w-full h-full flex items-center pointer-events-none">
              {SUMMARY_OPTIONS.map((_, index) => {
                const percentage = (index / (SUMMARY_OPTIONS.length - 1)) * 100;
                return (
                  <div
                    key={index}
                    className={`absolute w-2 h-2 rounded-full border-2 ${
                      index === summaryTypeIndex 
                        ? 'opacity-0 pointer-events-none' 
                        : 'bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-500'
                    }`}
                    style={{
                      left: `${percentage}%`,
                      transform: 'translateX(-50%)'
                    }}
                  />
                );
              })}
            </div>
          </div>
          <div className="relative h-6 mt-2">
            {SUMMARY_OPTIONS.map((option, index) => {
              const percentage = (index / (SUMMARY_OPTIONS.length - 1)) * 100;
              return (
                <div 
                  key={option.value}
                  className="absolute text-center leading-tight whitespace-pre-line text-xs"
                  style={{ 
                    left: `${percentage}%`,
                    transform: 'translateX(-50%)',
                    top: 0
                  }}
                >
                  <span className={`${index === summaryTypeIndex ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                    {option.label.replace(' ', '\n')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>}
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

      {!isLoading && !videoId && <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
        <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">Tips for Better Results:</h3>
        <ul className="text-sm space-y-2 text-blue-700 dark:text-blue-300">
          <li className="flex items-center gap-2" style={{ fontSize: '0.875rem' }}>
            <span className="block w-1 h-1 rounded-full bg-blue-400" />
            For best results, try videos that have been on YouTube for a few hours or more.
          </li>
          <li className="flex items-center gap-2" style={{ fontSize: '0.875rem' }}>
            <span className="block w-1 h-1 rounded-full bg-blue-400" />
            Videos with clear audio quality help our AI capture every detail accurately.
          </li>
          <li className="flex items-center gap-2" style={{ fontSize: '0.875rem' }}>
            <span className="block w-1 h-1 rounded-full bg-blue-400" />
            Educational content and tutorials work great for generating detailed summaries and insights.
          </li>
        </ul>
      </div>}

      <SignupModal 
        isOpen={showSignupModal} 
        onClose={() => setShowSignupModal(false)} 
        onSignupSuccess={() => {
          setShowSignupModal(false);
        }}
      />

      <PricingModal 
        isOpen={showPricingModal} 
        onClose={() => setShowPricingModal(false)} 
      />
    </div>
  );
};

export default YoutubeInput;
