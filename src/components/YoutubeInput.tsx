
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Youtube } from "lucide-react";
import { toast } from "sonner";

interface YoutubeInputProps {
  onSubmit: (url: string, type: string) => void;
  isLoading: boolean;
}

const YoutubeInput: React.FC<YoutubeInputProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  const [summaryType, setSummaryType] = useState('tldr');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation for YouTube URL
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      toast.error('Please enter a valid YouTube URL');
      return;
    }
    
    onSubmit(url, summaryType);
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
          
          <select
            value={summaryType}
            onChange={(e) => setSummaryType(e.target.value)}
            className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="tldr">TLDR</option>
            <option value="key_insights">Key Insights</option>
            <option value="comprehensive">Comprehensive</option>
          </select>
        </div>
        
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
