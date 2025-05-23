// src/components/BottomTabBar.tsx
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BottomTabBarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  disabled: {
    current: boolean;
    history: boolean;
  };
}

const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onTabChange, disabled }) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="fixed bottom-0 left-0 right-0 z-50 grid w-full grid-cols-3 rounded-none bg-background p-4 shadow-md dark:bg-gray-800">
        <TabsTrigger
          value="new"
          className={`pb-2 text-sm font-medium ${
            activeTab === 'new' ? 'text-red-600 dark:text-red-400' : ''
          }`}
        >
          New
        </TabsTrigger>
        <TabsTrigger
          value="current"
          disabled={disabled.current}
          className={`pb-2 text-sm font-medium ${
            activeTab === 'current' ? 'text-red-600 dark:text-red-400' : ''
          } ${disabled.current ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          Current
        </TabsTrigger>
        <TabsTrigger
          value="history"
          disabled={disabled.history}
          className={`pb-2 text-sm font-medium ${
            activeTab === 'history' ? 'text-red-600 dark:text-red-400' : ''
          } ${disabled.history ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          History
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default BottomTabBar;
