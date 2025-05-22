
import React, { useEffect, useState } from 'react';
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
  
  useEffect(() => {
    if (location.state && location.state.result) {
      setCurrentResult(location.state.result);
      setActiveTab("current");
      location.state.result = null; // Clear state to prevent re-render
    }
    
    const savedHistory = localStorage.getItem('youtubeDigestHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to parse history from localStorage:', error);
      }
    }
    
    if (user) {
      setIsPremiumUser(user.isPremium);
    }
  }, [location.state, user]);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('youtubeDigestHistory', JSON.stringify(history));
    }
  }, [history]);

  const handleSubmit = async (
    url: string, 
    type: string, 
    customPrompt?: string, 
    model: string = "standard",
  ) => {
    if (!isValidYoutubeUrl(url)) {
      toast.error("Invalid YouTube URL. Please enter a valid URL.");
      return;
    }

    setIsLoading(true);
    
    const initialResult = {
      title: "Generating digest...",
      type,
      content: "",
      videoUrl: url,
      timestamp: new Date().toLocaleString(),
      model,
      customPrompt,
    };
    setCurrentResult(initialResult);
    
    try {
      // Stream updates using the callback
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
      
      setCurrentResult(result);
      
      setHistory(prev => {
        const exists = prev.some(
          item => item.videoUrl === url && 
                 item.type === type && 
                 item.customPrompt === customPrompt
        );
        if (!exists) {
          return [result, ...prev].slice(0, 10); // Keep only latest 10 items
        }
        return prev;
      });
      
      toast.success("Digest generated successfully!");
      
      if (user) {
        const updatedUser = { ...user, credits: Math.max(0, user.credits - 1) };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error generating digest:', error);
      toast.error("Failed to generate digest. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('youtubeDigestHistory');
    toast.success("History cleared");
  };

  const toggleDisplayMode = (mode: DisplayMode) => {
    // Only toggle display mode if viewing a current summary
    if (activeTab === "current" && currentResult) {
      setDisplayMode(mode);
      
      if (mode === "zen") {
        toast.success("Focus mode activated. Enjoy focused reading.");
      } else if (mode === "article") {
        toast.success("Article mode activated. Content displayed as an article.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 mt-16">
      <Header user={user} />
      
      <div className="py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            {user && (
              <div className="mt-4">
                <div className="text-sm px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md inline-flex items-center gap-2">
                  <span className="font-medium">Credits:</span> {user.credits}
                  {user.isPremium && (
                    <span className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 text-xs px-2 py-0.5 rounded-full">
                      Premium
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

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
              onClearHistory={handleClearHistory}
              onSubmit={handleSubmit}
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
