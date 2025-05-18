
import React from 'react';
import { DigestResult } from '@/services/youtubeDigestService';
import FloatingNav from '@/components/FloatingNav';

interface DirectoryTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentResult: DigestResult | null;
  historyLength: number;
  onZenModeToggle: () => void;
  isZenMode: boolean;
}

const DirectoryTabs: React.FC<DirectoryTabsProps> = ({
  activeTab,
  setActiveTab,
  currentResult,
  historyLength,
  onZenModeToggle,
  isZenMode
}) => {
  return (
    <FloatingNav 
      activeTab={activeTab} 
      onTabChange={setActiveTab} 
      disabled={{
        current: !currentResult,
        history: historyLength === 0
      }}
      onZenModeToggle={onZenModeToggle}
      isZenMode={isZenMode}
    />
  );
};

export default DirectoryTabs;
