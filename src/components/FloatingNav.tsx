
import React, { useState } from 'react';
import { Plus, Clock, History, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from '@/contexts/ThemeContext';

interface FloatingNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  disabled: {
    current: boolean;
    history: boolean;
  };
}

const FloatingNav: React.FC<FloatingNavProps> = ({ activeTab, onTabChange, disabled }) => {
  const [expanded, setExpanded] = useState(false);
  const { theme, setTheme } = useTheme();

  const navItems = [
    { id: 'new', icon: Plus, label: 'New Digest', disabled: false },
    { id: 'current', icon: Clock, label: 'Current', disabled: disabled.current },
    { id: 'history', icon: History, label: 'History', disabled: disabled.history },
  ];
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div 
      className={cn(
        "fixed top-20 left-6 bg-white dark:bg-gray-800 z-40 shadow-lg rounded-lg transition-all duration-300 overflow-hidden",
        expanded ? "w-48" : "w-12",
      )}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => !item.disabled && onTabChange(item.id)}
            disabled={item.disabled}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 text-left",
              activeTab === item.id ? "text-purple-600 dark:text-purple-400" : "text-gray-600 dark:text-gray-300",
              item.disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
              "focus:outline-none"
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className={cn(
              "whitespace-nowrap transition-opacity duration-300",
              expanded ? "opacity-100" : "opacity-0"
            )}>
              {item.label}
            </span>
          </button>
        ))}
        
        {/* Theme toggle button */}
        <button
          onClick={toggleTheme}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 text-left text-gray-600 dark:text-gray-300",
            "hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none"
          )}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 flex-shrink-0" />
          ) : (
            <Moon className="h-5 w-5 flex-shrink-0" />
          )}
          <span className={cn(
            "whitespace-nowrap transition-opacity duration-300",
            expanded ? "opacity-100" : "opacity-0"
          )}>
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default FloatingNav;
