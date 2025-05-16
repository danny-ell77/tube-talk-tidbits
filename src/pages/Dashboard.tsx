
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import YoutubeInput from '@/components/YoutubeInput';
import SummaryCard from '@/components/SummaryCard';
import LoadingState from '@/components/LoadingState';
import FloatingNav from '@/components/FloatingNav';
import { generateDigest, DigestResult } from '@/services/youtubeDigestService';
import { toast } from 'sonner';
import Header from '@/components/Header';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<DigestResult | null>(null);
  const [history, setHistory] = useState<DigestResult[]>([]);
  const [activeTab, setActiveTab] = useState<string>("new");
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setIsPremiumUser(parsedUser.isPremium);
    
    const savedHistory = localStorage.getItem('youtubeDigestHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to parse history from localStorage:', error);
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('youtubeDigestHistory', JSON.stringify(history));
    }
  }, [history]);

  const handleSubmit = async (url: string, type: string, customPrompt?: string, model: string = "standard") => {
    setIsLoading(true);
    try {
      const result = await generateDigest(url, type, customPrompt, model);
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
      
      setActiveTab("current");
      toast.success("Digest generated successfully!");
      
      // Update user credits
      if (user) {
        const updatedUser = { ...user, credits: Math.max(0, user.credits - 1) };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
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

  const renderContent = () => {
    switch (activeTab) {
      case "new":
        return (
          <div className="space-y-6">
            <YoutubeInput 
              onSubmit={handleSubmit} 
              isLoading={isLoading} 
              isPremium={isPremiumUser}
            />
            {isLoading && <LoadingState />}
          </div>
        );
      case "current":
        return currentResult ? <SummaryCard {...currentResult} /> : null;
      case "history":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Previous Digests</h2>
              {history.length > 0 && (
                <button 
                  onClick={handleClearHistory}
                  className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Clear History
                </button>
              )}
            </div>
            
            {history.map((item, index) => (
              <SummaryCard key={index} {...item} />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header user={user} />
      
      <div className="py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Transform lengthy YouTube videos into concise summaries, key insights, or comprehensive notes.
            </p>
            
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
          </div>

          {/* Floating Navigation */}
          <FloatingNav 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            disabled={{
              current: !currentResult,
              history: history.length === 0
            }}
          />
          
          <div className="mt-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
