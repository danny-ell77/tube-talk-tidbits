
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import YoutubeInput from '@/components/YoutubeInput';
import SummaryCard from '@/components/SummaryCard';
import LoadingState from '@/components/LoadingState';
import { generateDigest, DigestResult } from '@/services/youtubeDigestService';
import { toast } from 'sonner';

const DemoSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<DigestResult | null>(null);
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);
  
  // Toggle premium status (for demo purposes)
  const togglePremiumStatus = () => {
    const newStatus = !isPremiumUser;
    setIsPremiumUser(newStatus);
    toast.success(newStatus ? "Premium features activated!" : "Premium features deactivated");
  };
  
  // Handle the submission of YouTube URL for digest
  const handleSubmit = async (url: string, type: string, customPrompt?: string, model: string = "standard") => {
    setIsLoading(true);
    try {
      const result = await generateDigest(url, type, customPrompt, model);
      setCurrentResult(result);
      
      // Switch to the result tab
      document.querySelector('[data-state="inactive"][value="result"]')?.click();
      
      toast.success("Digest generated successfully!");
    } catch (error) {
      console.error('Error generating digest:', error);
      toast.error("Failed to generate digest. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <section className="py-20 px-4 bg-white" id="demo-section">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center">See It In Action</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-center">
          Try the YouTube Digest tool with your own video or use one of our examples.
        </p>
        
        {/* Premium status toggle (for demo purposes) */}
        <div className="flex justify-center mb-6">
          <button 
            onClick={togglePremiumStatus}
            className={`text-sm px-4 py-1 rounded-full ${
              isPremiumUser 
                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isPremiumUser ? '✨ Premium Active' : 'Activate Premium Features'}
          </button>
        </div>
        
        <div className="bg-gray-50 p-8 rounded-xl shadow-lg">
          <Tabs defaultValue="input" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger 
                value="input"
                disabled={isLoading}
              >
                Create New Digest
              </TabsTrigger>
              <TabsTrigger 
                value="result"
                disabled={!currentResult}
              >
                View Digest
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="input" className="space-y-4">
              <YoutubeInput 
                onSubmit={handleSubmit} 
                isLoading={isLoading} 
                isPremium={isPremiumUser}
              />
              {isLoading && <LoadingState />}
            </TabsContent>
            
            <TabsContent value="result">
              {currentResult ? (
                <SummaryCard {...currentResult} />
              ) : (
                <div className="text-center text-gray-500 p-12">
                  No digest generated yet. Create one to see results here.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
