
import React from 'react';
import { DigestResult } from '@/services/youtubeDigestService';
import YoutubeInput from '@/components/YoutubeInput';
import SummaryCard from '@/components/SummaryCard';
import LoadingState from '@/components/LoadingState';
import ArticleMode from '@/components/ArticleMode';
import { DisplayMode } from './DisplayModeSelector';
import HistoryView from './HistoryView';

interface DigestContentProps {
  activeTab: string;
  isLoading: boolean;
  currentResult: DigestResult | null;
  history: DigestResult[];
  displayMode: DisplayMode;
  isPremiumUser: boolean;
  onClearHistory: () => void;
  onSubmit: (url: string, type: string, customPrompt?: string, model?: string) => Promise<void>;
}

const DigestContent: React.FC<DigestContentProps> = ({
  activeTab,
  isLoading,
  currentResult,
  history,
  displayMode,
  isPremiumUser,
  onClearHistory,
  onSubmit
}) => {
  switch (activeTab) {
    case "new":
      return (
        <div className="space-y-6">
          <YoutubeInput 
            onSubmit={onSubmit} 
            isLoading={isLoading} 
            isPremium={isPremiumUser}
          />
          {isLoading && <LoadingState />}
        </div>
      );
    case "current":
      if (currentResult) {
        // Choose the display mode
        if (displayMode === "article") {
          return <ArticleMode result={currentResult} />;
        } else {
          // Standard mode (zen mode is handled at parent level)
          return <SummaryCard {...currentResult} />;
        }
      }
      return null;
    case "history":
      return <HistoryView history={history} onClearHistory={onClearHistory} />;
    default:
      return null;
  }
};

export default DigestContent;
