
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import YoutubeInput from '@/components/YoutubeInput';
import LoadingState from '@/components/LoadingState';
import { generateDigest, DigestResult } from '@/services/youtubeDigestService';
import { toast } from 'sonner';
import { isValidYoutubeUrl } from '@/utils/youtubeUtils';

const DemoSection = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  // Premium features temporarily disabled
  // const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);
  
  // Premium toggle disabled
  // const togglePremiumStatus = () => {
  //   const newStatus = !isPremiumUser;
  //   setIsPremiumUser(newStatus);
  //   toast.success(newStatus ? "Premium features activated!" : "Premium features deactivated");
  // };
  
  // Handle the submission of YouTube URL for digest
  const handleSubmit = async (url: string, type: string, customPrompt?: string, model: string = "standard") => {
    // Validate URL before processing
    if (!isValidYoutubeUrl(url)) {
      toast.error("Invalid YouTube URL. Please enter a valid URL.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateDigest(url, type, customPrompt, model);
      
      // Navigate to digest page with the result
      navigate('/digest', { state: { result } });
      
      toast.success("Digest generated successfully!");
    } catch (error) {
      console.error('Error generating digest:', error);
      toast.error("Failed to generate digest. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-900" id="demo-section">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center">See It In Action</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto text-center">
          Try the Digestly tool with your own video or use one of our examples.
        </p>
        
        {/* Premium status toggle (temporarily disabled) */}
        {/* <div className="flex justify-center mb-6">
          <button 
            onClick={togglePremiumStatus}
            className={`text-sm px-4 py-1 rounded-full ${
              isPremiumUser 
                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-200 dark:hover:bg-amber-800' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {isPremiumUser ? '✨ Premium Active' : 'Activate Premium Features'}
          </button>
        </div> */}
        
        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-lg">
          <div className="space-y-4">
            <YoutubeInput 
              onSubmit={handleSubmit} 
              isLoading={isLoading} 
              // isPremium={isPremiumUser} // Premium feature disabled
            />
            {isLoading && <LoadingState />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
