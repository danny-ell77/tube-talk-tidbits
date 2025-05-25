
import React from 'react';
import { DigestResult } from '@/services/youtubeDigestService';
import FloatingNav from '@/components/FloatingNav';
import BottomTabBar from '@/components/BottomTabBar'; // Import new component
import { useIsMobile } from '@/hooks/use-mobile'; // Import useIsMobile

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
  const isMobile = useIsMobile();

  const commonNavProps = {
    activeTab: activeTab,
    onTabChange: setActiveTab,
    disabled: {
      current: !currentResult,
      history: historyLength === 0
    }
  };

  // if (isMobile) {
  //   return <BottomTabBar {...commonNavProps} />;
  // } else {
  //   return (
  //     <FloatingNav
  //       {...commonNavProps}
  //       onZenModeToggle={onZenModeToggle}
  //       isZenMode={isZenMode}
  //     />
  //   );
  // }
  
  return (
    <FloatingNav 
      {...commonNavProps}
      onZenModeToggle={onZenModeToggle}
      isZenMode={isZenMode}
    />
  );
};

export default DirectoryTabs;
