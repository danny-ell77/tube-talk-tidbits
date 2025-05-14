
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Youtube } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface YoutubeInputProps {
  onSubmit: (url: string, type: string, customPrompt?: string, model?: string) => void;
  isLoading: boolean;
  isPremium?: boolean;
}

const YoutubeInput: React.FC<YoutubeInputProps> = ({ onSubmit, isLoading, isPremium = false }) => {
  const [url, setUrl] = useState('');
  const [summaryType, setSummaryType] = useState('tldr');
  const [customPrompt, setCustomPrompt] = useState('');
  const [model, setModel] = useState('standard');
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation for YouTube URL
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube URL",
        variant: "destructive"
      });
      return;
    }
    
    // Pass the custom prompt only if it's shown and not empty
    const prompt = showCustomPrompt && customPrompt.trim() ? customPrompt : undefined;
    const selectedModel = isPremium ? model : 'standard';
    
    onSubmit(url, summaryType, prompt, selectedModel);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2">
          <Youtube className="h-6 w-6 text-youtube" />
          <h2 className="text-xl font-semibold">Enter YouTube URL</h2>
        </div>
        
        <div className="flex items-center space-x-2">
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
            onValueChange={(value) => {
              setSummaryType(value);
              // Show custom prompt option when "custom" is selected
              setShowCustomPrompt(value === "custom");
            }}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Summary Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tldr">TLDR</SelectItem>
              <SelectItem value="key_insights">Key Insights</SelectItem>
              <SelectItem value="comprehensive">Comprehensive</SelectItem>
              <SelectItem value="custom">Custom Prompt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {showCustomPrompt && (
          <Textarea
            placeholder="Enter your custom prompt instructions here..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="min-h-[100px]"
            disabled={isLoading}
          />
        )}
        
        {isPremium && (
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
        )}
        
        <Button 
          type="submit" 
          className="w-full bg-digest-blue hover:bg-digest-blue-light transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Generating Digest...' : 'Generate Digest'}
        </Button>
      </form>
    </div>
  );
};

export default YoutubeInput;
