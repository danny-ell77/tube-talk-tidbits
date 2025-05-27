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
          className={`relative pb-3 text-sm font-medium transition-all duration-200 ease-in-out hover:text-red-500 ${
            activeTab === 'new'
              ? 'text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-red-600 after:content-[""] dark:text-red-400 dark:after:bg-red-400'
              : 'text-gray-600 dark:text-gray-300'
          }`}
        >
          New
        </TabsTrigger>
        <TabsTrigger
          value="current"
          disabled={disabled.current}
          className={`relative pb-3 text-sm font-medium transition-all duration-200 ease-in-out hover:text-red-500 ${
            activeTab === 'current'
              ? 'text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-red-600 after:content-[""] dark:text-red-400 dark:after:bg-red-400'
              : 'text-gray-600 dark:text-gray-300'
          } ${disabled.current ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          Current
        </TabsTrigger>
        <TabsTrigger
          value="history"
          disabled={disabled.history}
          className={`relative pb-3 text-sm font-medium transition-all duration-200 ease-in-out hover:text-red-500 ${
            activeTab === 'history'
              ? 'text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-red-600 after:content-[""] dark:text-red-400 dark:after:bg-red-400'
              : 'text-gray-600 dark:text-gray-300'
          } ${disabled.history ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          History
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default BottomTabBar;
