
import React from 'react';
import { DigestResult } from '@/services/youtubeDigestService';

export type DisplayMode = "standard" | "zen" | "article";

interface DisplayModeSelectorProps {
  activeTab: string;
  currentResult: DigestResult | null;
  displayMode: DisplayMode;
  onDisplayModeChange: (mode: DisplayMode) => void;
}

const DisplayModeSelector: React.FC<DisplayModeSelectorProps> = ({ 
  activeTab, 
  currentResult, 
  displayMode, 
  onDisplayModeChange 
}) => {
  if (activeTab !== "current" || !currentResult) return null;
  
  const displayModeOptions = [
    { id: "standard", label: "Standard" },
    { id: "zen", label: "Focus Mode" },
    { id: "article", label: "Article Mode" }
  ];
  
  return (
    <div className="mb-4">
      <div className="inline-flex bg-gray-100 dark:bg-gray-800 p-1 rounded-md">
        {displayModeOptions.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onDisplayModeChange(mode.id as DisplayMode)}
            className={`px-3 py-1 text-sm rounded-md ${
              displayMode === mode.id 
                ? "bg-white dark:bg-gray-700 shadow-sm" 
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DisplayModeSelector;
