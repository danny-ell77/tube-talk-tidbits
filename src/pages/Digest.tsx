import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/Header';
import ZenMode from '@/components/ZenMode';
import { generateDigest, DigestResult } from '@/services/youtubeDigestService';
import { useAuth } from '@/contexts/AuthContext';
import { isValidYoutubeUrl } from '@/utils/youtubeUtils';
import '@/styles/zen-mode.css';
import DirectoryTabs from '@/components/digest/DirectoryTabs';
import DisplayModeSelector, { DisplayMode } from '@/components/digest/DisplayModeSelector';
import DigestContent from '@/components/digest/DigestContent';
import { Metadata } from '@/components/ui/metadata';

interface DigestPageProps {
  showSaved?: boolean;
}

const Digest = ({ showSaved = false }: DigestPageProps) => {
  const location = useLocation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<DigestResult | null>(null);
  const [history, setHistory] = useState<DigestResult[]>([]);
  const [activeTab, setActiveTab] = useState<string>(showSaved ? "history" : "new");
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(user?.isPremium || false);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("standard");
  
  const initialResult = useMemo(() => ({
    title: "Generating digest...",
    type: "",
    content: "",
    videoUrl: "",
    timestamp: new Date().toLocaleString(),
    model: "standard",
    customPrompt: "",
  }), []);

  useEffect(() => {
    if (location.state && location.state.result) {
      setCurrentResult(location.state.result);
      setActiveTab("current");
      location.state.result = null;
    }
    
    const savedHistory = localStorage.getItem('youtubeDigestHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to parse history from localStorage:', error);
      }
    }
    
    if (user?.id) {
      setIsPremiumUser(user.isPremium);
    }
  }, [location.state, user]);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('youtubeDigestHistory', JSON.stringify(history));
    }
  }, [history]);

  const handleSubmit = useCallback(async (
    url: string, 
    type: string, 
    customPrompt?: string, 
    model: string = "standard",
  ): Promise<[DigestResult | null, Error | null]> => {
    if (!isValidYoutubeUrl(url)) {
      toast.error("Invalid YouTube URL. Please enter a valid URL.");
      return [null, new Error("Invalid YouTube URL")];
    }

    setIsLoading(true);
    
    const result = {
      ...initialResult,
      type,
      videoUrl: url,
      model,
      customPrompt,
    };
    setCurrentResult(result);
    
    try {
      const result = await generateDigest(
        url, 
        type, 
        customPrompt, 
        model, 
        (updatedResult) => {
          setActiveTab("current");
          if (type === "article") {
            setDisplayMode("article");
          } else {
            setDisplayMode("standard");
          }
          setCurrentResult(prev => ({
            ...(prev || initialResult),
            ...updatedResult
          }));
        }
      );
      
      setActiveTab("current");
      if (type === "article") {
        setDisplayMode("article");
      } else {
        setDisplayMode("standard");
      }
      setCurrentResult(result);
      
      setHistory(prev => {
        const exists = prev.some(
          item => item.videoUrl === url && 
                 item.type === type && 
                 item.customPrompt === customPrompt
        );
        if (!exists) {
          return [result, ...prev].slice(0, 10);
        }
        return prev;
      });
      
      toast.success("Digest generated successfully!");
      
      if (user?.id) {
        const updatedUser = { ...user, credits: Math.max(0, user.credits - 1) };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      return [result, null];
    } catch (error) {
      console.error('Error generating digest:', error);
      toast.error("Failed to generate digest. Please try again.");
      return [null, error];
    } finally {
      setIsLoading(false);
    }
  }, [initialResult, user?.id]);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('youtubeDigestHistory');
    toast.success("History cleared");
  }, [setHistory]);

  const toggleDisplayMode = useCallback((mode: DisplayMode) => {
    if (activeTab === "current" && currentResult) {
      setDisplayMode(mode);
      
      if (mode === "zen") {
        toast.success("Focus mode activated. Enjoy focused reading.");
      } else if (mode === "article") {
        toast.success("Article mode activated. Content displayed as an article.");
      }
    }
  }, [activeTab, currentResult]);


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 mt-16">
      <Header user={user} />

      <Metadata
          title="Digestly - Your YouTube Digest Companion" 
          description="Generate concise summaries and insights from YouTube videos effortlessly. Perfect for busy learners and content enthusiasts."
      />
      
      <div className="py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <DirectoryTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            currentResult={currentResult}
            historyLength={history.length}
            onZenModeToggle={() => toggleDisplayMode("zen")}
            isZenMode={displayMode === "zen"}
          />
          
          <DisplayModeSelector 
            activeTab={activeTab}
            currentResult={currentResult}
            displayMode={displayMode}
            onDisplayModeChange={toggleDisplayMode}
          />
          
          <div className="mt-4">
            <DigestContent
              activeTab={activeTab}
              isLoading={isLoading}
              currentResult={currentResult}
              history={history}
              displayMode={displayMode}
              isPremiumUser={isPremiumUser}
              onSubmit={handleSubmit}
              onClearHistory={handleClearHistory}
            />
          </div>
        </div>
      </div>
      
      <ZenMode 
        isActive={displayMode === "zen"} 
        onClose={() => setDisplayMode("standard")}
        currentResult={currentResult}
      />
    </div>
  );
};

export default Digest;
