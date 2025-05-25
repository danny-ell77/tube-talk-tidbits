import React from 'react';
import { Check } from 'lucide-react';

const PreviewCardLoadingState: React.FC = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-700 rounded-lg p-4 my-4">
      <div className="flex items-start gap-4">
        <div className="mt-1 flex-shrink-0">
          <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="flex-1">
          {/* Title skeleton */}
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4 mb-2"></div>
          
          <div className="flex items-center gap-4 mt-2">
            {/* Thumbnail skeleton */}
            <div className="relative rounded-md overflow-hidden w-32 h-24 bg-gray-200 dark:bg-gray-700 flex-shrink-0 animate-pulse">
              <div className="absolute bottom-1 right-1 bg-gray-300 dark:bg-gray-600 text-transparent text-xs px-2 py-1 rounded animate-pulse">
                00:00
              </div>
            </div>
            
            <div className="flex-1">
              {/* Channel name skeleton */}
              <div className="flex items-center text-xs">
                <div className="inline-block w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full mr-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
              </div>
              
              {/* Stats skeleton */}
              <div className="flex flex-wrap gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <div className="w-3.5 h-3.5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-12"></div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3.5 h-3.5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-10"></div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3.5 h-3.5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewCardLoadingState;