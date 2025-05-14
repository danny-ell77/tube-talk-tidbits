
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import YoutubeInput from '@/components/YoutubeInput';
import SummaryCard from '@/components/SummaryCard';
import LoadingState from '@/components/LoadingState';
import Footer from '@/components/Footer';
import { generateDigest, DigestResult } from '@/services/youtubeDigestService';
import { Youtube, ListVideo, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<DigestResult | null>(null);
  const [history, setHistory] = useState<DigestResult[]>([]);
  const [activeTab, setActiveTab] = useState<string>("new");
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('youtubeDigestHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to parse history from localStorage:', error);
      }
    }
    
    // In a real app, you would check if the user is premium from your authentication system
    // This is just a mock implementation for demonstration
    const premiumStatus = localStorage.getItem('isPremiumUser');
    setIsPremiumUser(premiumStatus === 'true');
  }, []);

  // Save history to localStorage whenever it changes
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
      
      // Add to history (avoiding duplicates by URL+type+customPrompt)
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

  // Mock function to toggle premium status (for demo purposes)
  const togglePremiumStatus = () => {
    const newStatus = !isPremiumUser;
    setIsPremiumUser(newStatus);
    localStorage.setItem('isPremiumUser', String(newStatus));
    toast.success(newStatus ? "Premium features activated!" : "Premium features deactivated");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Youtube className="h-8 w-8 text-youtube" />
              <h1 className="text-3xl font-bold text-digest-blue">YouTube Digest</h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Transform lengthy YouTube videos into concise summaries, key insights, or comprehensive notes.
            </p>
            
            {/* Premium status toggle (for demo purposes) */}
            <div className="mt-4">
              <button 
                onClick={togglePremiumStatus}
                className={`text-sm px-4 py-1 rounded-full ${
                  isPremiumUser 
                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {isPremiumUser ? '✨ Premium Active' : 'Activate Premium'}
              </button>
            </div>
          </header>

          <Tabs defaultValue="new" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="new" className="flex items-center gap-2">
                <Youtube className="h-4 w-4" />
                <span>New Digest</span>
              </TabsTrigger>
              <TabsTrigger value="current" disabled={!currentResult} className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Current</span>
              </TabsTrigger>
              <TabsTrigger value="history" disabled={history.length === 0} className="flex items-center gap-2">
                <ListVideo className="h-4 w-4" />
                <span>History</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="new" className="space-y-6">
              <YoutubeInput 
                onSubmit={handleSubmit} 
                isLoading={isLoading} 
                isPremium={isPremiumUser}
              />
              {isLoading && <LoadingState />}
            </TabsContent>
            
            <TabsContent value="current">
              {currentResult && <SummaryCard {...currentResult} />}
            </TabsContent>
            
            <TabsContent value="history">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Previous Digests</h2>
                  {history.length > 0 && (
                    <button 
                      onClick={handleClearHistory}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Clear History
                    </button>
                  )}
                </div>
                
                {history.map((item, index) => (
                  <SummaryCard key={index} {...item} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
