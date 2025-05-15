
import React, { useState } from 'react';
import { Plus, Clock, History } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const navItems = [
    { id: 'new', icon: Plus, label: 'New Digest', disabled: false },
    { id: 'current', icon: Clock, label: 'Current', disabled: disabled.current },
    { id: 'history', icon: History, label: 'History', disabled: disabled.history },
  ];

  return (
    <div 
      className={cn(
        "fixed top-20 left-6 bg-white z-40 shadow-lg rounded-lg transition-all duration-300 overflow-hidden",
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
              activeTab === item.id ? "text-purple-600" : "text-gray-600",
              item.disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100 transition-colors",
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
      </div>
    </div>
  );
};

export default FloatingNav;
